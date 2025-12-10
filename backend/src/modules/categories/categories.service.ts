import { db } from "../../db";

interface createCategoryPayload {
  category_name: string;
}

export class CategoryService {
  async createCategory(payload: createCategoryPayload) {
    try {
      const newCategory = await db
        .insertInto("categories")
        .values({
          category_name: payload.category_name,
        })
        .returningAll()
        .executeTakeFirst();

      return newCategory;
    } catch (error) {
      throw new Error("Failed to create category: " + error);
    }
  }
}

export default new CategoryService();
