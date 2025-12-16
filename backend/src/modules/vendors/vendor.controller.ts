import { Request, Response } from "express";
import VendorService from "./vendor.services";

export class VendorController {
  async registerVendor(req: Request, res: Response) {
    try {
      const {
        vendor_name,
        vendor_email,
        vendor_phone,
        vendor_organization,
        category_id,
      } = req.body;

      if (
        !vendor_name ||
        !vendor_email ||
        !vendor_phone ||
        !vendor_organization ||
        !category_id
      ) {
        return res.status(400).json({
          success: false,
          message:
            "vendor_name, vendor_email, vendor_phone, vendor_organization, and category_id are required",
        });
      }

      const newVendor = await VendorService.registerVendor({
        vendor_name,
        vendor_email,
        vendor_phone,
        vendor_organization,
        category_id,
      });

      return res.status(201).json({
        success: true,
        message: "Vendor registered successfully",
        data: newVendor,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async getVendors(req: Request, res: Response) {
    try {
      const vendors = await VendorService.getVendors();

      return res.status(200).json({
        success: true,
        data: vendors,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async getVendorById(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const vendor = await VendorService.getVendorById(id);

      if (!vendor) {
        return res.status(404).json({
          success: false,
          message: "Vendor not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: vendor,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async getVendorByCategory(req: Request, res: Response) {
    try {
      const categroyId = req.query.categoryId as string;
      const vendor = await VendorService.getVendorByCategory(categroyId);

      if (!vendor) {
        return res.status(404).json({
          success: false,
          message: "Vendor not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: vendor,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async deleteVendor(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const result = await VendorService.deleteVendor(id);

      if (!result.ok && result.reason === "NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Vendor not found",
        });
      }

      if (!result.ok && result.reason === "MAPPED_TO_RFP") {
        return res.status(409).json({
          success: false,
          message: "Vendor is mapped to an RFP and cannot be deleted",
        });
      }

      if (!result.ok && result.reason === "HAS_PROPOSALS") {
        return res.status(409).json({
          success: false,
          message: "Vendor has submitted proposals and cannot be deleted",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Vendor deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async updateVendor(req: Request, res: Response) {
    const id = req.params.id;
    const payload = req.body;

    try {
      if (payload.vendor_email || payload.vendor_phone) {
        return res.status(400).json({
          success: false,
          message: "vendor_email and vendor_phone cannot be updated",
        });
      }

      const updatedVendor = await VendorService.updateVendor(id, payload);

      if (!updatedVendor) {
        return res.status(404).json({
          success: false,
          message: "Vendor not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Vendor updated successfully",
        data: updatedVendor,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

export default new VendorController();
