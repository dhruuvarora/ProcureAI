import { db } from "../../db";
import { ProposalStatus } from "../../db/db";
import { llm } from "../../utils/llm";

import { PROPOSAL_COMPARISON_PROMPT } from "../../utils/prompts/comparison.prompt";

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

  static async evaluateProposal(
    proposalId: string,
    status: ProposalStatus,
    score?: number,
    remarks?: string
  ) {
    return db
      .updateTable("vendor_proposals")
      .set({
        status,
        ...(score !== undefined && { score }),
        ...(remarks !== undefined && { remarks }),
      })
      .where("proposal_id", "=", proposalId)
      .returningAll()
      .executeTakeFirst();
  }

  static async generateAiSummary(proposalId: string) {
    const proposal = await db
      .selectFrom("vendor_proposals")
      .select(["proposal_id", "raw_email_text"])
      .where("proposal_id", "=", proposalId)
      .executeTakeFirst();

    if (!proposal) {
      throw new Error("Proposal not found");
    }

    const prompt = `
You are an AI assistant helping evaluate vendor proposals.

Read the proposal below and return STRICT JSON only:
{
  "summary": string,
  "total_cost": number | null,
  "delivery_time": string | null,
  "key_points": string[]
}

Rules:
- If a field is not mentioned, return null.
- Do not add explanations.
- Return only valid JSON.

Proposal:
${proposal.raw_email_text}
`;
    const rawText = await 
    llm.generate(prompt);

    if (!rawText) {
      throw new Error("AI returned empty response");
    }

    let parsed: any;
    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      console.error("Gemini raw output:", rawText);

      parsed = {
        summary: rawText,
        total_cost: null,
        delivery_time: null,
        key_points: [],
      };
    }

    const updated = await db
      .updateTable("vendor_proposals")
      .set({
        parsed_json: parsed,
      })
      .where("proposal_id", "=", proposalId)
      .returningAll()
      .executeTakeFirst();

    return updated;
  }

  static async getComparisonData(rfpId: string) {
    const rfp = await db
      .selectFrom("rfps")
      .select(["rfp_id", "structured_json"])
      .where("rfp_id", "=", rfpId)
      .executeTakeFirst();

    if (!rfp) throw new Error("RFP not found");

    const proposals = await db
      .selectFrom("vendor_proposals")
      .innerJoin("vendors", "vendors.vendor_id", "vendor_proposals.vendor_id")
      .select([
        "vendors.vendor_id",
        "vendors.vendor_name",
        "vendor_proposals.total_cost",
        "vendor_proposals.parsed_json",
      ])
      .where("vendor_proposals.rfp_id", "=", rfpId)
      .execute();

    return { rfp, proposals };
  }

  static async compareProposals(rfpId: string) {
    const { rfp, proposals } = await this.getComparisonData(rfpId);

    if (!proposals || proposals.length === 0) {
      throw new Error("No proposals available for comparison");
    }

    const rawText = await llm.generate(
      PROPOSAL_COMPARISON_PROMPT(rfp.structured_json, proposals)
    );

    if (!rawText) {
      throw new Error("AI returned empty comparison response");
    }

    let aiOutput: any;
    try {
      aiOutput = JSON.parse(rawText);
    } catch (err) {
      console.error("Gemini comparison raw output:", rawText);
      throw new Error("AI returned invalid comparison JSON");
    }

    return {
      rfp_id: rfp.rfp_id,
      summary: aiOutput.summary ?? "",
      recommended_vendor: aiOutput.recommended_vendor ?? null,
      comparison: Array.isArray(aiOutput.comparison) ? aiOutput.comparison : [],
    };
  }
}
