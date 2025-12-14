import { db } from "../../db";
import { JsonValue } from "../../db/db";
import { llm } from "../../utils/llm";
import { normalizeRfp } from "../../utils/normalizer/rfp.normalizer";
import { RFP_CREATION_PROMPT } from "../../utils/prompts/rfp.prompts";

interface RfpPayload {
  title: string;
  description?: string;
  budget?: number;
  delivery_time?: string;
  attachment_path?: string;
  structured_json?: JsonValue;
}

export class RfpService {
  async createRfp(payload: RfpPayload) {
    try {
      const newRfp = await db
        .insertInto("rfps")
        .values({
          title: payload.title,
          description: payload.description,
          budget: payload.budget,
          delivery_time: payload.delivery_time,
          attachment_path: payload.attachment_path,
          structured_json: payload.structured_json,
        })
        .returningAll()
        .executeTakeFirst();

      return newRfp;
    } catch (error) {
      throw new Error("Failed to create RFP: " + error);
    }
  }

  async getRfps() {
    try {
      const rfps = await db.selectFrom("rfps").selectAll().execute();

      return rfps;
    } catch (error) {
      throw new Error("Failed to fetch RFPs: " + error);
    }
  }

  async getRfpById(rfpId: string) {
    try {
      const rfp = await db
        .selectFrom("rfps")
        .selectAll()
        .where("rfps.rfp_id", "=", rfpId)
        .executeTakeFirst();

      return rfp;
    } catch (error) {
      throw new Error("Failed to fetch RFP by ID: " + error);
    }
  }

  async updateRfp(rfpId: string, payload: Partial<RfpPayload>) {
    const updateRfp = await db
      .updateTable("rfps")
      .set({
        ...payload,
      })
      .where("rfp_id", "=", rfpId)
      .returningAll()
      .executeTakeFirst();

    return updateRfp;
  }

  async deleteRfp(rfpId: string) {
    const deleted = await db
      .deleteFrom("rfps")
      .where("rfp_id", "=", rfpId)
      .executeTakeFirst();

    return deleted;
  }

  async createRfpFromText(input: string) {
    const rawText = await llm.generate(RFP_CREATION_PROMPT(input));

    if (!rawText) {
      throw new Error("AI returned empty response");
    }

    let aiJson;
    try {
      aiJson = JSON.parse(rawText);
    } catch (err) {
      console.error("Gemini raw output:", rawText);
      throw new Error("AI returned invalid JSON");
    }

    const normalized = normalizeRfp(aiJson);

    if (!normalized.items || normalized.items.length === 0) {
      throw new Error("RFP must contain at least one item");
    }

    const inserted = await db
      .insertInto("rfps")
      .values({
        title: "AI Generated RFP",
        description: input,
        structured_json: normalized,
        budget: normalized.budget,
        delivery_time: normalized.delivery_days
          ? `${normalized.delivery_days} days`
          : null,
      })
      .returningAll()
      .executeTakeFirst();

    return inserted;
  }
}

export default new RfpService();
