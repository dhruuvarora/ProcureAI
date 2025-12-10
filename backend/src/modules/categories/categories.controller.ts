import { Request, Response } from "express";
import CategoryService from "./categories.service";

export class CategoriesController {
  async createCategory(req: Request, res: Response) {
    const { category_name } = req.body;
    try {
      const newCategory = await CategoryService.createCategory(category_name);
      return res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: newCategory,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }
}

export default new CategoriesController();
