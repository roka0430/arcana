import AppState from "./state/AppState.js";
import Category from "./api/Category.js";

const initCurrentCategoryId = async () => {
  const categories = await Category.getCategories();

  if (categories.length === 0) {
    AppState.setCurrentCategoryId(null);
    return null;
  }

  const categoryId = Math.min(...categories.map(({ id }) => id));
  AppState.setCurrentCategoryId(categoryId);
  return categoryId;
};

const getCurrentCategory = async () => {
  const categoryId = AppState.getCurrentCategoryId() ?? (await initCurrentCategoryId());

  if (categoryId === null) {
    return null;
  }

  try {
    return await Category.getCategory(categoryId);
  } catch {
    const categoryId = await initCurrentCategoryId();

    if (categoryId === null) {
      return null;
    }

    return await Category.getCategory(categoryId);
  }
};

document.addEventListener("alpine:init", () => {
  Alpine.data("subjects", () => ({
    subjects: [],

    async init() {
      this.category = await getCurrentCategory();

      if (this.category === null) {
        console.log("no category");
      }

      this.subjects = this.category.subjects;
    },
  }));
});
