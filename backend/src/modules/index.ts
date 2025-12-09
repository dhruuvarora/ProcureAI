import { Router } from "express";
import rfpRoutes from "./rfp/rfp.routes"

const router = Router();

router.use("/create-rfp", rfpRoutes);

export default router;