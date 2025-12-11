import { Request, Response } from "express";
import { RfpVendorService } from "./rfpVendor.service";

export class RfpVendorController {
  async mapVendorsToRfp(req: Request, res: Response) {
    try {
      const rfpId = req.params.rfpId;
      const { vendor_ids } = req.body;

      if (!vendor_ids || vendor_ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: "vendor_ids array is required",
        });
      }

      const result = await RfpVendorService.mapVendors(rfpId, vendor_ids);

      return res.status(200).json({
        success: true,
        message: "Vendors mapped successfully",
        count: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async getVendorsForRfp(req: Request, res: Response) {
    try {
      const rfpId = req.params.rfpId;

      const vendors = await RfpVendorService.getMappedVendors(rfpId);

      if (!vendors || vendors.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No vendors mapped to this RFP",
        });
      }

      return res.status(200).json({
        success: true,
        vendors,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async updateEmailStatus(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { email_sent } = req.body;

      const updated = await RfpVendorService.updateEmailStatus(id, email_sent);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Mapping not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Email status updated successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async deleteMapping(req: Request, res: Response) {
    try {
      const id = req.params.id;

      const deleted = await RfpVendorService.deleteMapping(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Mapping not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Vendor unmapped from RFP successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async sendEmails(req: Request, res: Response) {
    try {
      const rfpId = req.params.rfpId;

      const result = await RfpVendorService.sendEmailsToMappedVendors(rfpId);

      return res.status(200).json({
        success: true,
        message: "Email sending process completed",
        sent: result.sent,
        failed: result.failed,
      });
    } catch (error) {
      console.error("Error sending emails:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to send RFP emails",
      });
    }
  }
}

export default new RfpVendorController();
