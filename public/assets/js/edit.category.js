import AppState from "./state/AppState.js";
import Shortcut from "./shortcut/Shortcut.js";
import ShortcutBar from "./shortcut/ShortcutBar.js";
import Popup from "./popup/Popup.js";
import AlpinePopup from "./popup/AlpinePopup.js";
import Category from "./category/Category.js";

document.addEventListener("alpine:init", () => {
  Alpine.data("shortcutBar", ShortcutBar);
  Alpine.data("popup", AlpinePopup);

  Alpine.data("main", () => ({
    categories: [],

    async init() {
      this.initShortcut();
      this.initPopup();
      await this.loadCategories();
    },

    initShortcut() {
      Shortcut.setContext("edit");
      Shortcut.setOrder("edit", ["Escape"]);

      Shortcut.register("edit", {
        key: "Escape",
        kbd: "Esc",
        description: "hoge",
        handler: null,
      });
    },

    initPopup() {
      Popup.register("new-category", { title: "新しいカテゴリ", confirm: "作成" });
    },

    async loadCategories() {
      this.categories = await Category.getCategories();
    },

    async createCategory() {
      const popup = await Popup.open("new-category");
      const input = popup.content.querySelector(".popup__input");
      const name = input.value;

      if (!popup.value || name === "") {
        return;
      }

      await Category.createCategory(name);
      await this.loadCategories();
    },

    renameCategory(categoryId) {
      console.log("rename", categoryId);
    },

    deleteCategory(categoryId) {
      console.log("delete", categoryId);
      // Category.deleteCategory(categoryId);
    },
  }));
});
