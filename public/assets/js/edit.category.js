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
        description: "ホームへ戻る",
        handler: () => (location.href = "/"),
      });
    },

    initPopup() {
      Popup.register("new-category", {
        title: "新しいカテゴリ",
        confirm: "作成",
        type: "success",
        validate: (content) => {
          const input = content.querySelector(".popup__input");
          return input.value.trim() !== "";
        },
      });

      Popup.register("rename-category", {
        title: "カテゴリ名の変更",
        confirm: "変更",
        type: "success",
        validate: (content) => {
          const input = content.querySelector(".popup__input");
          return input.value.trim() !== "";
        },
      });

      Popup.register("delete-category-1", {
        title: "カテゴリの削除",
        confirm: "確認",
        type: "danger",
        validate: null,
      });

      Popup.register("delete-category-2", {
        title: "カテゴリの削除",
        confirm: "削除",
        type: "danger",
        validate: (content) => {
          const input = content.querySelector(".popup__input");
          return input.value === "delete";
        },
      });
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

    async renameCategory(categoryId) {
      const popup = await Popup.open("rename-category");
      const input = popup.content.querySelector(".popup__input");
      const name = input.value;

      if (!popup.value || name === "") {
        return;
      }

      await Category.renameCategory(categoryId, name);
      await this.loadCategories();
    },

    async deleteCategory(categoryId) {
      const popup1 = await Popup.open("delete-category-1");

      if (!popup1.value) {
        return;
      }

      const popup2 = await Popup.open("delete-category-2");
      const input = popup2.content.querySelector(".popup__input");

      if (!popup2.value || input.value !== "delete") {
        return;
      }

      await Category.deleteCategory(categoryId);
      await this.loadCategories();
    },
  }));
});
