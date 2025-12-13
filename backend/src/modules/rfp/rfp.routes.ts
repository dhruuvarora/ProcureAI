import express from "express";
import rfpController from "./rfp.controller";

const router = express.Router();

router.post("/create", rfpController.createRfp);
router.get("/get", rfpController.getRfps);
router.get("/get/:id", rfpController.getRfpById);
router.put("/update/:id", rfpController.updateRfp);
router.delete("/delete/:id", rfpController.deleteRfp);
router.post("/rfp/ai-create", rfpController.createFromText);
router.get("/rfp/:rfpId/compare", rfpController.compareRfp);

export default router;
