import { Router } from "express";
import categoriesController from "./categories.controller";

const router = Router();

router.post("/create", categoriesController.createCategory);
router.get("/get", categoriesController.getCategories);
router.put("/update/:id", categoriesController.updateCategory);
router.delete("/delete/:id", categoriesController.deleteCategory);

export default router;
