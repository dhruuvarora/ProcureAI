import e from "express";
import { db } from "../../db";

export interface VendorPayload {
  vendor_name: string;
  vendor_email: string;
  vendor_phone: string;
  vendor_organization: string;
  category_id: string;
}

export class VendorService {
  async registerVendor(payload: VendorPayload) {
    try {
      const newVendor = await db
        .insertInto("vendors")
        .values({
          vendor_name: payload.vendor_name,
          vendor_email: payload.vendor_email,
          vendor_phone: payload.vendor_phone,
          vendor_organization: payload.vendor_organization,
          category_id: payload.category_id,
        })
        .returningAll()
        .executeTakeFirst();

      return newVendor;
    } catch (error) {
      throw new Error("Failed to register vendor: " + error);
    }
  }

  async getVendors() {
    try {
      const vendors = await db.selectFrom("vendors").selectAll().execute();

      return vendors;
    } catch (error) {
      throw new Error("Failed to fetch vendors: " + error);
    }
  }

  async getVendorById(vendorId: string) {
    try {
      const vendor = await db
        .selectFrom("vendors")
        .selectAll()
        .where("vendors.vendor_id", "=", vendorId)
        .executeTakeFirst();

      return vendor;
    } catch (error) {
      throw new Error("Failed to fetch vendor by ID: " + error);
    }
  }

  async deleteVendor(vendorId: string) {
    try {
      await db
        .deleteFrom("vendors")
        .where("vendors.vendor_id", "=", vendorId)
        .execute();

      return true;
    } catch (error) {
      throw new Error("Failed to delete vendor: " + error);
    }
  }

  async updateVendor(vendorId: string, payload: Partial<VendorPayload>) {
    try {
      const updateData: any = {
        ...(payload.vendor_name !== undefined && {
          vendor_name: payload.vendor_name,
        }),
        ...(payload.vendor_organization !== undefined && {
          vendor_organization: payload.vendor_organization,
        }),
        ...(payload.category_id !== undefined && {
          category_id: payload.category_id,
        }),
      };

      // If no allowed fields were provided
      if (Object.keys(updateData).length === 0) {
        return null;
      }

      const updatedVendor = await db
        .updateTable("vendors")
        .set(updateData)
        .where("vendor_id", "=", vendorId)
        .returningAll()
        .executeTakeFirst();

      return updatedVendor;
    } catch (error) {
      throw new Error("Failed to update vendor: " + error);
    }
  }
}

export default new VendorService();
