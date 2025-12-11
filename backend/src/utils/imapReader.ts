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

    const match = subject.match(/RFP\s*#(\d+)/i);
    const rfp_id = match ? Number(match[1]) : null;

    if (!rfp_id) {
      console.log("No RFP ID detected. Marking email as read.");
      await client.messageFlagsAdd(uid, ["\\Seen"]);
      continue;
    }

    const vendor = await db
      .selectFrom("vendors")
      .select("vendor_id")
      .where("vendor_email", "=", fromEmail)
      .executeTakeFirst();

    if (!vendor) {
      console.log("Vendor not registered:", fromEmail);
      await client.messageFlagsAdd(uid, ["\\Seen"]);
      continue;
    }

    let attachmentUrl: string | null = null;

    if (parsed.attachments && parsed.attachments.length > 0) {
      const pdf = parsed.attachments[0];

      console.log("Uploading attachment to Cloudinary...");
      attachmentUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            folder: "proposals",
            public_id: `proposal_rfp${rfp_id}_vendor${
              vendor.vendor_id
            }_${Date.now()}`,
          },
          (err, result) => {
            if (err) {
              console.error("Cloudinary Upload Error:", err);
              reject(err);
            } else {
              console.log("Cloudinary Upload Success:", result?.secure_url);
              resolve(result?.secure_url || null);
            }
          }
        );

        uploadStream.write(pdf.content);
        uploadStream.end();
      });
    } else {
      console.log("No attachment found in email.");
    }

    await ProposalService.createProposal({
      rfp_id: rfp_id.toString(),
      vendor_id: vendor.vendor_id,
      raw_email_text: body,
      attachment_document_path: attachmentUrl,
      total_cost: null,
    });

    console.log("Proposal saved successfully.");

    // Mark email as read
    await client.messageFlagsAdd(uid, ["\\Seen"]);
    console.log("Marked email as read.");
  }

  console.log("Logging out from IMAP...");
  await client.logout();
  console.log("IMAP polling session complete.");
}
