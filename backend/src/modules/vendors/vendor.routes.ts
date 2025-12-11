import { Router } from "express";
import vendorController from "./vendor.controller";

const router = Router();

router.post("/register", vendorController.registerVendor);
router.get("/get", vendorController.getVendors);
router.get("/get/:id", vendorController.getVendorById);
router.get("/get/vendor", vendorController.getVendorByCategory);
router.put("/update/:id", vendorController.updateVendor);
router.delete("/delete/:id", vendorController.deleteVendor);

export default router;
