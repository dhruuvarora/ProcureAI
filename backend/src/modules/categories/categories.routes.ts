import { Router } from "express";
import categoriesController from "./categories.controller";

const router = Router();

router.post("/create-category", categoriesController.createCategory);

export default router;
