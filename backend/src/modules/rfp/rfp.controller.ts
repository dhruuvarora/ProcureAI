import { Request, Response } from "express";
import RfpService from "./rfp.service";
import { ProposalService } from "../proposals/proposal.service";

export class RfpController {
  async createRfp(req: Request, res: Response) {
    try {
      const {
        title,
        description,
        budget,
        delivery_time,
        attachment_path,
        structured_json,
      } = req.body;

      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Title is required",
        });
      }

      const payload = {
        title,
        description,
        budget,
        delivery_time,
        attachment_path,
        structured_json,
      };

      const newRfp = await RfpService.createRfp(payload);

      return res.status(201).json({
        success: true,
        message: "RFP created successfully",
        data: newRfp,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Something went wrong",
      });
    }
  }
  async getRfps(req: Request, res: Response) {
    try {
      const data = await RfpService.getRfps();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Something went wrong",
      });
    }
  }

  async getRfpById(req: Request, res: Response) {
    const id = req.params.id;

    const rfp = await RfpService.getRfpById(id);

    return res.status(200).json({
      success: true,
      data: rfp,
    });
  }

  async updateRfp(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const payload = req.body;

      const updateRfp = await RfpService.updateRfp(id, payload);

      return res.status(200).json({
        success: true,
        message: "RFP updated successfully",
        data: updateRfp,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }

  async deleteRfp(req: Request, res: Response) {
    const id = req.params.id;

    const result = await RfpService.deleteRfp(id);

    if (!result.ok && result.reason === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "RFP not found",
      });
    }

    if (!result.ok) {
      return res.status(409).json({
        success: false,
        message: "RFP has mapped vendors or proposals and cannot be deleted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "RFP deleted successfully",
    });
  }

  async createFromText(req: Request, res: Response) {
    try {
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({
          success: false,
          message: "text is required",
        });
      }

      const rfp = await RfpService.createRfpFromText(text);

      return res.status(201).json({
        success: true,
        message: "RFP created from natural language",
        data: rfp,
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to create RFP",
      });
    }
  }

  async compareRfp(req: Request, res: Response) {
    try {
      const { rfpId } = req.params;

      const comparison = await ProposalService.compareProposals(rfpId);

      return res.status(200).json({
        success: true,
        data: comparison,
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to compare proposals",
      });
    }
  }
}

export default new RfpController();
