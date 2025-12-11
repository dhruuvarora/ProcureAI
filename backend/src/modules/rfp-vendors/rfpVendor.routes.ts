import { Router } from "express";
import rfpVendorController from "./rfpVendor.controller";

const router = Router();

router.post("/rfp/:rfpId/map-vendors", rfpVendorController.mapVendorsToRfp);
router.get("/rfp/:rfpId/vendors", rfpVendorController.getVendorsForRfp);
router.delete("/rfp-vendor/:id", rfpVendorController.deleteMapping);
router.put("/rfp-vendor/:id/email-status", rfpVendorController.updateEmailStatus);

export default router;
