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
      this.categories = await Category.getCategories();
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

    async initPopup() {
      Popup.register("new-category", { title: "新しいカテゴリ", confirm: "OK" });

      const res = await Popup.open("new-category");
      console.log(res);
    },

    createCategory() {
      console.log("create");
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
