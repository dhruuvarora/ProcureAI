import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import cloudinary from "../utils/cloudinary";
import { ProposalService } from "../modules/proposals/proposal.service";
import { db } from "../db";

export async function pollInbox() {
  const IMAP_USER = process.env.IMAP_USER;
  const IMAP_PASS = process.env.IMAP_PASS;

  if (!IMAP_USER || !IMAP_PASS) {
    throw new Error("IMAP_USER or IMAP_PASS missing in environment variables.");
  }

  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: {
      user: IMAP_USER,
      pass: IMAP_PASS,
    },
  });

  console.log("Connecting to IMAP server...");

  await client.connect();
  await client.mailboxOpen("INBOX");

  console.log("Searching for unseen emails...");

  const unreadMessages = await client.search({ seen: false });

  if (!unreadMessages || unreadMessages.length === 0) {
    console.log("No unread emails.");
    return;
  }

  for (const uid of unreadMessages) {
    console.log(`Processing email UID: ${uid}`);
    const msg = await client.fetchOne(uid, { source: true });

    if (!msg || !msg.source) {
      console.log("Could not fetch email source. Skipping...");
      continue;
    }

    const parsed = await simpleParser(msg.source);

    const fromEmail = parsed.from?.value[0]?.address ?? null;
    const subject = parsed.subject ?? "";
    const body = parsed.text ?? "";

    console.log(`Email from: ${fromEmail}, Subject: ${subject}`);

    let rfp_id: number | null = null;

    const subjectMatch = subject.match(/RFP\s*#?(\d+)/i);
    const bodyMatch = body.match(/RFP\s*ID\s*[:\- ]+(\d+)/i);

    if (subjectMatch) rfp_id = Number(subjectMatch[1]);
    else if (bodyMatch) rfp_id = Number(bodyMatch[1]);

    if (!rfp_id) {
      console.log("No RFP ID detected. Marking email as read.");
      await client.messageFlagsAdd(uid, ["\\Seen"]);
      continue;
    }

    const vendor = await db
      .selectFrom("vendors")
      .select(["vendor_id", "vendor_email"])
      .where("vendor_email", "=", fromEmail)
      .executeTakeFirst();

    if (!vendor) {
      console.log("Vendor not registered:", fromEmail);
      await client.messageFlagsAdd(uid, ["\\Seen"]);
      continue;
    }

    const costMatch = body.match(/total\s*cost[: ]+([\d,]+)/i);

    const parsedJson = {
      total_cost: costMatch ? Number(costMatch[1].replace(/,/g, "")) : null,
    };

    let attachmentUrl: string | null = null;

    if (parsed.attachments?.length > 0) {
      const file = parsed.attachments[0];

      console.log("Uploading attachment to Cloudinary...");

      attachmentUrl = await new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          {
            folder: "proposals",
            resource_type: "raw",
            public_id: `proposal_rfp${rfp_id}_vendor${
              vendor.vendor_id
            }_${Date.now()}`,
          },
          (err, res) => {
            if (err) {
              console.log("Cloudinary upload failed:", err);
              reject(err);
            } else {
              console.log("Cloudinary Upload Success:", res?.secure_url);
              resolve(res?.secure_url || null);
            }
          }
        );

        upload.write(file.content);
        upload.end();
      });
    } else {
      console.log("No attachment found.");
    }

    const already = await db
      .selectFrom("vendor_proposals")
      .select("proposal_id")
      .where("rfp_id", "=", rfp_id.toString())
      .where("vendor_id", "=", vendor.vendor_id.toString())
      .executeTakeFirst();

    if (already) {
      console.log("Vendor already submitted proposal. Skipping.");
      await client.messageFlagsAdd(uid, ["\\Seen"]);
      continue;
    }

    await ProposalService.createProposal({
      rfp_id: rfp_id.toString(),
      vendor_id: vendor.vendor_id.toString(),
      raw_email_text: body,
      attachment_document_path: attachmentUrl,
      total_cost: parsedJson.total_cost,
    });

    console.log("Proposal saved successfully.");

    // Mark email as read
    await client.messageFlagsAdd(uid, ["\\Seen"]);
    console.log("Marked email as read.\n");
  }

  console.log("Logging out from IMAP...");
  await client.logout();
  console.log("IMAP polling session complete.");
}
