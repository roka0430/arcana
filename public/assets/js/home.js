import AppState from "./state/AppState.js";
import Category from "./api/Category.js";

const initCurrentCategoryId = async () => {
  const categories = await Category.getCategories();

  const categoryId = Math.min(...categories.map(({ id }) => id));
  AppState.setCurrentCategoryId(categoryId);
  return categoryId;
};

const loadSubjects = async () => {
  const categoryId = AppState.getCurrentCategoryId() ?? (await initCurrentCategoryId());

  try {
    return await Category.getSubjects(categoryId);
  } catch {
    const categoryId = await initCurrentCategoryId();
    return await Category.getSubjects(categoryId);
  }
};

document.addEventListener("alpine:init", () => {
  Alpine.data("subjects", () => ({
    subjects: [],

    async init() {
      this.subjects = await loadSubjects();
    },
  }));
});
