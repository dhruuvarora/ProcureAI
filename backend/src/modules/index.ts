import { Router } from "express";
import rfpRoutes from "./rfp/rfp.routes"
import vendorRoutes from "./vendors/vendor.routes"
import categoryRoutes from "./categories/categories.routes"

const router = Router();

router.use("/rfp", rfpRoutes);
router.use("/vendor", vendorRoutes);
router.use("/category", categoryRoutes);

export default router;