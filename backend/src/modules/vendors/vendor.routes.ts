import { Router } from "express";
import vendorController from "./vendor.controller";

const router = Router();

router.post("/register-vendor", vendorController.registerVendor);
router.get("/get-vendors", vendorController.getVendors);
router.get("/get-vendor/:id", vendorController.getVendorById);
router.put("/vendor/:id", vendorController.updateVendor);
router.delete("/vendor/:id", vendorController.deleteVendor);

export default router;
