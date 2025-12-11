import { db } from "../../db";

interface ProposalInput {
  rfp_id: string;
  vendor_id: string;
  raw_email_text: string;
  attachment_document_path?: string | null;
  total_cost?: number | null;
}

export class ProposalService {
  static async createProposal(input: ProposalInput) {
    const { rfp_id, vendor_id } = input;

    const rfp = await db
      .selectFrom("rfps")
      .select("rfp_id")
      .where("rfp_id", "=", rfp_id)
      .executeTakeFirst();

    if (!rfp) {
      throw new Error("RFP does not exist");
    }

    const vendor = await db
      .selectFrom("vendors")
      .select("vendor_id")
      .where("vendor_id", "=", vendor_id)
      .executeTakeFirst();

    if (!vendor) {
      throw new Error("Vendor does not exist");
    }

    const mapping = await db
      .selectFrom("rfps_vendors")
      .select("id")
      .where("rfp_id", "=", rfp_id)
      .where("vendor_id", "=", vendor_id)
      .executeTakeFirst();

    if (!mapping) {
      throw new Error("Vendor is not mapped to this RFP");
    }

    const inserted = await db
      .insertInto("vendor_proposals")
      .values({
        rfp_id,
        vendor_id,
        raw_email_text: input.raw_email_text,
        parsed_json: null,
        attachment_document_path: input.attachment_document_path,
        total_cost: input.total_cost,
        received_at: new Date(),
      })
      .returningAll()
      .executeTakeFirst();

    return inserted;
  }
}
