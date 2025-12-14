import { Router } from "express";
import rfpVendorController from "./rfpVendor.controller";

const router = Router();

router.post("/:rfpId/map-vendors", rfpVendorController.mapVendorsToRfp);
router.get("/:rfpId/vendors", rfpVendorController.getVendorsForRfp);
router.delete("/:id", rfpVendorController.deleteMapping);
router.put("/:id/email-status", rfpVendorController.updateEmailStatus);
router.post("/:rfpId/send-emails", rfpVendorController.sendEmails);

export default router;
