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

    // Validate Vendor
    const vendor = await db
      .selectFrom("vendors")
      .select("vendor_id")
      .where("vendor_id", "=", vendor_id)
      .executeTakeFirst();

    if (!vendor) {
      throw new Error("Vendor does not exist");
    }

    // Validate mapping
    const mapping = await db
      .selectFrom("rfps_vendors")
      .select("id")
      .where("rfp_id", "=", rfp_id)
      .where("vendor_id", "=", vendor_id)
      .executeTakeFirst();

    if (!mapping) {
      throw new Error("Vendor is not mapped to this RFP");
    }

    // Insert new proposal
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

  static async getAllProposals() {
    return db
      .selectFrom("vendor_proposals")
      .innerJoin("vendors", "vendors.vendor_id", "vendor_proposals.vendor_id")
      .innerJoin("rfps", "rfps.rfp_id", "vendor_proposals.rfp_id")
      .select([
        "vendor_proposals.proposal_id",
        "vendor_proposals.rfp_id",
        "vendor_proposals.vendor_id",
        "vendor_proposals.raw_email_text",
        "vendor_proposals.parsed_json",
        "vendor_proposals.attachment_document_path",
        "vendor_proposals.total_cost",
        "vendor_proposals.received_at",

        "vendors.vendor_name",
        "vendors.vendor_email",
        "vendors.vendor_phone",
        "vendors.vendor_organization",

        "rfps.title",
        "rfps.description",
      ])
      .execute();
  }

  static async getProposalById(id: string) {
    return db
      .selectFrom("vendor_proposals")
      .innerJoin("vendors", "vendors.vendor_id", "vendor_proposals.vendor_id")
      .innerJoin("rfps", "rfps.rfp_id", "vendor_proposals.rfp_id")
      .select([
        "vendor_proposals.proposal_id",
        "vendor_proposals.rfp_id",
        "vendor_proposals.vendor_id",
        "vendor_proposals.raw_email_text",
        "vendor_proposals.parsed_json",
        "vendor_proposals.attachment_document_path",
        "vendor_proposals.total_cost",
        "vendor_proposals.received_at",

        "vendors.vendor_name",
        "vendors.vendor_email",
        "vendors.vendor_phone",
        "vendors.vendor_organization",

        "rfps.title as rfp_title",
        "rfps.description as rfp_description",
      ])
      .where("vendor_proposals.proposal_id", "=", id)
      .executeTakeFirst();
  }

  static async getProposalsByRfp(rfpId: string) {
    return db
      .selectFrom("vendor_proposals")
      .innerJoin("vendors", "vendors.vendor_id", "vendor_proposals.vendor_id")
      .select([
        "vendor_proposals.proposal_id",
        "vendor_proposals.rfp_id",
        "vendor_proposals.vendor_id",
        "vendor_proposals.raw_email_text",
        "vendor_proposals.parsed_json",
        "vendor_proposals.attachment_document_path",
        "vendor_proposals.total_cost",
        "vendor_proposals.received_at",

        "vendors.vendor_name",
        "vendors.vendor_email",
        "vendors.vendor_phone",
        "vendors.vendor_organization",
      ])
      .where("vendor_proposals.rfp_id", "=", rfpId)
      .execute();
  }

  static async getProposalsByVendor(vendorId: string) {
    return db
      .selectFrom("vendor_proposals")
      .innerJoin("rfps", "rfps.rfp_id", "vendor_proposals.rfp_id")
      .select([
        "vendor_proposals.proposal_id",
        "vendor_proposals.rfp_id",
        "vendor_proposals.vendor_id",
        "vendor_proposals.raw_email_text",
        "vendor_proposals.parsed_json",
        "vendor_proposals.attachment_document_path",
        "vendor_proposals.total_cost",
        "vendor_proposals.received_at",

        "rfps.title as rfp_title",
        "rfps.description as rfp_description",
      ])
      .where("vendor_proposals.vendor_id", "=", vendorId)
      .execute();
  }
}
