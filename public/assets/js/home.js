import AppState from "./state/AppState.js";
import Category from "./api/Category.js";

document.addEventListener("alpine:init", () => {
  Alpine.data("subjects", () => ({
    subjects: [],

    async init() {
      await this.loadSubjects();
    },

    async loadSubjects() {
      let categoryId = AppState.getCurrentCategoryId();

      if (!categoryId) {
        const categories = await Category.getCategories();
        categoryId = Math.min(...categories.map(({ id }) => id));
        AppState.setCurrentCategoryId(categoryId);
      }

      const subjects = await Category.getSubjects(categoryId);
      this.subjects = subjects;
    },
  }));
});
