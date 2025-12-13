import { Request, Response } from "express";
import { ProposalService } from "./proposal.service";
import { ProposalStatus } from "../../db/db";

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

  static async getAllProposals(req: Request, res: Response) {
    try {
      const proposals = await ProposalService.getAllProposals();

      if (!proposals || proposals.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No proposals found",
        });
      }

      return res.status(200).json({
        success: true,
        count: proposals.length,
        data: proposals,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async getProposalById(req: Request, res: Response) {
    try {
      const id = req.params.id;

      const proposal = await ProposalService.getProposalById(id);

      if (!proposal) {
        return res.status(404).json({
          success: false,
          message: "Proposal not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: proposal,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async getProposalsByRfp(req: Request, res: Response) {
    try {
      const rfpId = req.params.rfpId;

      const proposals = await ProposalService.getProposalsByRfp(rfpId);

      return res.status(200).json({
        success: true,
        count: proposals.length,
        data: proposals,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async getProposalsByVendor(req: Request, res: Response) {
    try {
      const vendorId = req.params.vendorId;

      const proposals = await ProposalService.getProposalsByVendor(vendorId);

      return res.status(200).json({
        success: true,
        count: proposals.length,
        data: proposals,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async evaluateProposal(req: Request, res: Response) {
    try {
      const { proposalId } = req.params;
      const { status, score, remarks } = req.body as {
        status: ProposalStatus;
        score?: number;
        remarks?: string;
      };

      const updated = await ProposalService.evaluateProposal(
        proposalId,
        status,
        score,
        remarks
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Proposal not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Proposal evaluated successfully",
        data: updated,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async generateAiSummary(req: Request, res: Response) {
    try {
      const { proposalId } = req.params;

      const updated = await ProposalService.generateAiSummary(proposalId);

      return res.status(200).json({
        success: true,
        message: "AI summary generated",
        data: updated,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to generate AI summary",
      });
    }
  }
}
