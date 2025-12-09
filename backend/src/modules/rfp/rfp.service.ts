import { db } from "../../db";
import { JsonValue } from "../../db/db";

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
}

export default new RfpService();
