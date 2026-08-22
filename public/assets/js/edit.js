import AppState from "./state/AppState.js";
import Shortcut from "./shortcut/Shortcut.js";
import ShortcutBar from "./shortcut/ShortcutBar.js";
import Category from "./api/Category.js";

const initCurrentCategoryId = (categories) => {
  const categoryId = Math.min(...categories.map(({ id }) => id));
  AppState.setCurrentCategoryId(categoryId);
  return categoryId;
};

const getCurrentCategory = async (categories) => {
  const categoryId = AppState.getCurrentCategoryId() ?? initCurrentCategoryId(categories);

  try {
    return await Category.getCategory(categoryId);
  } catch {
    const categoryId = initCurrentCategoryId(categories);
    return await Category.getCategory(categoryId);
  }
};

document.addEventListener("alpine:init", () => {
  Alpine.data("shortcutBar", ShortcutBar);

  Alpine.data("main", () => ({
    categories: [],
    currentCategory: null,

    async init() {
      Shortcut.setContext("edit");
      Shortcut.setOrder("edit", []);

      Shortcut.register("edit", {
        key: "dummy",
        kbd: "dummy",
        description: "dummy",
        handler: null,
      });

      this.categories = await Category.getCategories();

      if (this.categories.length === 0) {
        AppState.setCurrentCategoryId(null);
        location.replace("/edit/category");
        return;
      }

      this.currentCategory = await getCurrentCategory(this.categories);
      console.log(this.currentCategory);
    },
  }));
});
