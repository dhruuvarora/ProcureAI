import { Router } from "express";
import { ProposalController } from "./proposal.controller";

const router = Router();

router.post("/create", ProposalController.createProposal);
router.get("/get", ProposalController.getAllProposals);
router.get("/get/:id", ProposalController.getProposalById);
router.get("/get/rfp/:rfpId", ProposalController.getProposalsByRfp);
router.get(
  "/get/vendor/:vendorId",
  ProposalController.getProposalsByVendor
);
router.put(
  "/:proposalId/evaluate",
  ProposalController.evaluateProposal
);
router.post(
  "/:proposalId/ai-summary",
  ProposalController.generateAiSummary
);

export default router;
