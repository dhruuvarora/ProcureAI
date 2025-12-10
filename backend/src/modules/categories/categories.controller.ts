import { Request, Response } from "express";
import CategoryService from "./categories.service";

export class CategoriesController {
  async createCategory(req: Request, res: Response) {
    const { category_name } = req.body;

    try {
      const newCategory = await CategoryService.createCategory({
        category_name,
      });

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

  async getCategories(req: Request, res: Response) {
    try {
      const categories = await CategoryService.getCategories();
      return res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }

  async updateCategory(req: Request, res: Response) {
    try {
      const id = req.params.id;

      const updated = await CategoryService.updateCategory(id, req.body);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: updated,
      });
    } catch (error) {
      console.error("Error updating category:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async deleteCategory(req: Request, res: Response) {
    const id = req.params.id;

    const deleted = await CategoryService.deleteCategory(id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: deleted,
    });
  }
}

export default new CategoriesController();
