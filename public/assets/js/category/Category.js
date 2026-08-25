export default class Category {
  static async getCategories() {
    const res = await fetch("/api/category");

    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.status}`);
    }

    return res.json();
  }

  static async getCategory(categoryId) {
    const res = await fetch(`/api/category/${categoryId}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch category: ${res.status}`);
    }

    return res.json();
  }

  static async getSubject(categoryId, subjectId) {
    const category = await this.getCategory(categoryId);
    const subject = category.subjects?.find(({ id }) => id === subjectId);
    subject.category_name = category.name;

    if (!subject) {
      throw new Error("subject not found.");
    }

    return subject;
  }

  static async renameCategory(categoryId, newName = null) {
    if (newName === null || newName.trim() === "") {
      throw new Error("Category name is required.");
    }

    const res = await fetch(`/api/category/${categoryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to rename category.");
    }

    return await res.json();
  }

  static async overwriteCategory(data) {
    const keys = Object.keys(data);
    const requiredKeys = ["id", "name", "blank_count", "subjects"];

    if (keys.length < requiredKeys.length || !requiredKeys.every((key) => keys.includes(key))) {
      throw new Error("Invalid category data keys.");
    }

    const res = await fetch("/api/category", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to overwrite category.");
    }

    return await res.json();
  }

  static async createCategory(newName = null) {
    if (newName === null || newName.trim() === "") {
      throw new Error("Category name is required.");
    }

    const res = await fetch("/api/category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to create category.");
    }

    return await res.json();
  }

  static async deleteCategory(categoryId) {
    const res = await fetch(`/api/category/${categoryId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete category.");
    }

    return await res.json();
  }
}
