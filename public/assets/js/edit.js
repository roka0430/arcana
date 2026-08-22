import AppState from "./state/AppState.js";
import Shortcut from "./shortcut/Shortcut.js";
import ShortcutBar from "./shortcut/ShortcutBar.js";

import Category from "./category/Category.js";
import { getCurrentCategory } from "./category/currentCategory.js";

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
