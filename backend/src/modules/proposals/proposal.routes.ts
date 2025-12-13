import { Router } from "express";
import { ProposalController } from "./proposal.controller";

const router = Router();

router.post("/proposal", ProposalController.createProposal);
router.get("/proposals", ProposalController.getAllProposals);
router.get("/proposal/:id", ProposalController.getProposalById);
router.get("/proposals/rfp/:rfpId", ProposalController.getProposalsByRfp);
router.get(
  "/proposals/vendor/:vendorId",
  ProposalController.getProposalsByVendor
);
router.put(
  "/proposal/:proposalId/evaluate",
  ProposalController.evaluateProposal
);
router.post(
  "/proposal/:proposalId/ai-summary",
  ProposalController.generateAiSummary
);

export default router;
