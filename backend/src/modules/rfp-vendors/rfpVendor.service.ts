import { db } from "../../db";

export class RfpVendorService {
  static async mapVendors(rfpId: string, vendorIds: string[]) {
    const rfp = await db
      .selectFrom("rfps")
      .select("rfp_id")
      .where("rfp_id", "=", rfpId)
      .executeTakeFirst();

    if (!rfp) {
      throw new Error("RFP does not exist");
    }

    const existingVendors = await db
      .selectFrom("vendors")
      .select("vendor_id")
      .where("vendor_id", "in", vendorIds)
      .execute();

    if (existingVendors.length !== vendorIds.length) {
      throw new Error("One or more vendor IDs are invalid");
    }

    const alreadyMapped = await db
      .selectFrom("rfps_vendors")
      .select("vendor_id")
      .where("rfp_id", "=", rfpId)
      .where("vendor_id", "in", vendorIds)
      .execute();

    if (alreadyMapped.length > 0) {
      throw new Error("One or more vendors are already mapped to this RFP");
    }

    const values = vendorIds.map((vid) => ({
      rfp_id: rfpId,
      vendor_id: vid,
      email_sent: false,
    }));

    await db.insertInto("rfps_vendors").values(values).execute();

    return vendorIds.length;
  }

  static async getMappedVendors(rfpId: string) {
    return db
      .selectFrom("rfps_vendors")
      .innerJoin("vendors", "vendors.vendor_id", "rfps_vendors.vendor_id")
      .select([
        "vendors.vendor_id",
        "vendors.vendor_name",
        "vendors.vendor_email",
        "vendors.vendor_phone",
        "vendors.vendor_organization",
        "rfps_vendors.email_sent",
      ])
      .where("rfps_vendors.rfp_id", "=", rfpId)
      .execute();
  }

  static async updateEmailStatus(id: string, emailSent: boolean) {
    const result = await db
      .updateTable("rfps_vendors")
      .set({ email_sent: emailSent })
      .where("id", "=", id)
      .executeTakeFirst();

    return result.numUpdatedRows > 0n;
  }

  static async deleteMapping(id: string) {
    const result = await db
      .deleteFrom("rfps_vendors")
      .where("id", "=", id)
      .executeTakeFirst();

    if (!result || result.numDeletedRows === 0n) {
      return false;
    }

    return true;
  }
}

export default new RfpVendorService();
