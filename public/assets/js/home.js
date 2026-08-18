import AppState from "./state/AppState.js";
import Category from "./api/Category.js";

document.addEventListener("alpine:init", () => {
  Alpine.data("subjects", () => ({
    subjects: [],

    async init() {
      await this.loadSubjects();
    },

    async loadSubjects() {
      const categoryId = AppState.getCurrentCategoryId() ?? (await this.initCurrentCategoryId());

      try {
        this.subjects = await Category.getSubjects(categoryId);
      } catch {
        const categoryId = await this.initCurrentCategoryId();
        this.subjects = await Category.getSubjects(categoryId);
      }
    },

    async initCurrentCategoryId() {
      const categories = await Category.getCategories();
      const categoryId = Math.min(...categories.map(({ id }) => id));
      AppState.setCurrentCategoryId(categoryId);
      return categoryId;
    },
  }));
});
