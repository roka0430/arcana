import Category from "./Category.js";
import AppState from "../state/AppState.js";

const initCurrentCategoryId = (categories) => {
  const categoryId = Math.min(...categories.map(({ id }) => id));

  AppState.setCurrentCategoryId(categoryId);

  return categoryId;
};

export const getCurrentCategory = async (categories) => {
  const categoryId = AppState.getCurrentCategoryId() ?? initCurrentCategoryId(categories);

  try {
    return await Category.getCategory(categoryId);
  } catch {
    const categoryId = initCurrentCategoryId(categories);

    return await Category.getCategory(categoryId);
  }
};
