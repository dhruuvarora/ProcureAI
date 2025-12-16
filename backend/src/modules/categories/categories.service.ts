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

  async getCategories() {
    try {
      const getCategories = await db
        .selectFrom("categories")
        .selectAll()
        .execute();
      return getCategories;
    } catch (error) {
      throw new Error("Failed to fetch categories: " + error);
    }
  }

  async updateCategory(id: string, payload: Partial<createCategoryPayload>) {
    try {
      const updateData = {
        ...(payload.category_name !== undefined && {
          category_name: payload.category_name,
        }),
      };

      const updatedCategory = await db
        .updateTable("categories")
        .set(updateData)
        .where("category_id", "=", id)
        .returningAll()
        .executeTakeFirst();

      return updatedCategory;
    } catch (error) {
      throw new Error("Failed to update category: " + error);
    }
  }

  async deleteCategory(id: string) {
    // check if category exists
    const category = await db
      .selectFrom("categories")
      .select("category_id")
      .where("category_id", "=", id)
      .executeTakeFirst();

    if (!category) {
      return { ok: false, reason: "NOT_FOUND" };
    }

    // check if vendors are using this category
    const vendorUsing = await db
      .selectFrom("vendors")
      .select("vendor_id")
      .where("category_id", "=", id)
      .executeTakeFirst();

    if (vendorUsing) {
      return { ok: false, reason: "IN_USE" };
    }

    await db
      .deleteFrom("categories")
      .where("category_id", "=", id)
      .executeTakeFirst();

    return { ok: true };
  }
}

export default new CategoryService();
