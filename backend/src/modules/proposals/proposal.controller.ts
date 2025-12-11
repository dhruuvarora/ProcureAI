import { Request, Response } from "express";
import { ProposalService } from "./proposal.service";

export class ProposalController {
  static async createProposal(req: Request, res: Response) {
    try {
      const {
        rfp_id,
        vendor_id,
        raw_email_text,
        attachment_document_path,
        total_cost,
      } = req.body;

      // Basic validation
      if (!rfp_id || !vendor_id || !raw_email_text) {
        return res.status(400).json({
          success: false,
          message: "rfp_id, vendor_id and raw_email_text are required",
        });
      }

      const proposal = await ProposalService.createProposal({
        rfp_id,
        vendor_id,
        raw_email_text,
        attachment_document_path: attachment_document_path || null,
        total_cost: total_cost || null,
      });

      return res.status(201).json({
        success: true,
        message: "Proposal submitted successfully",
        data: proposal,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
}
