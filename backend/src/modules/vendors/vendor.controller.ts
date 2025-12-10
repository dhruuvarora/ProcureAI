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

  async deleteVendor(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const deleted = await VendorService.deleteVendor(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Vendor not found",
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
