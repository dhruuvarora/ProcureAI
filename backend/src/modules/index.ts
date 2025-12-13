import { Router } from "express";
import rfpRoutes from "./rfp/rfp.routes"
import vendorRoutes from "./vendors/vendor.routes"
import categoryRoutes from "./categories/categories.routes"
import proposalRoutes from "./proposals/proposal.routes"
import rfpVendorRoutes from "./rfp-vendors/rfpVendor.routes"

const router = Router();

router.use("/rfp", rfpRoutes);
router.use("/vendor", vendorRoutes);
router.use("/category", categoryRoutes);
router.use("/proposal", proposalRoutes);
router.use("/rfp-vendor", rfpVendorRoutes);


export default router;