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

  static async getSubjects(categoryId) {
    const category = await this.getCategory(categoryId);
    return category.subjects.map(({ id, name }) => ({ id, name }));
  }

  static async getSubject(categoryId, subjectId) {
    const category = await this.getCategory(categoryId);
    const subject = category.subjects?.find(({ id }) => id === subjectId);

    if (!subject) throw new Error("subject not found");

    return subject;
  }
}
