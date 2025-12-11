import {Router} from "express";
import { ProposalController } from "./proposal.controller";

const router = Router();

router.post("/proposal", ProposalController.createProposal);

export default router;