import AppState from "./state/AppState.js";
import Shortcut from "./shortcut/Shortcut.js";
import ShortcutBar from "./shortcut/ShortcutBar.js";

import Category from "./category/Category.js";
import { getCurrentCategory } from "./category/currentCategory.js";

document.addEventListener("alpine:init", () => {
  Alpine.data("shortcutBar", ShortcutBar);

  Alpine.data("main", () => ({
    categories: [],
    category: null,

    subjects: [],
    subject: null,

    async init() {
      this.initShortcut();
      await this.loadCategory();
      this.loadSubject();
    },

    initShortcut() {
      Shortcut.setContext("edit");
      Shortcut.setOrder("edit", []);

      Shortcut.register("edit", {
        key: "dummy",
        kbd: "dummy",
        description: "dummy",
        handler: null,
      });
    },

    async loadCategory() {
      this.categories = await Category.getCategories();

      if (this.categories.length === 0) {
        AppState.setCurrentCategoryId(null);
        location.replace("/edit/category");
        return;
      }

      this.category = await getCurrentCategory(this.categories);
    },

    loadSubject() {},
  }));
});
