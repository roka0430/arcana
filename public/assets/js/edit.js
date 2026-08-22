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

    subjects: [],
    currentSubject: null,

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

      this.currentCategory = await getCurrentCategory(this.categories);
    },

    loadSubject() {
      this.subjects = this.currentCategory.subjects;

      if (this.subjects.length === 0) {
        console.log("no-subject");
        return;
      }

      this.subjects.sort((a, b) => a.name.localeCompare(b.name));

      let subjectId = AppState.getSubjectSelector();
      if (subjectId === null) {
        subjectId = this.subjects[0].id;
      }

      this.currentSubject = this.subjects.find((subject) => subject.id === subjectId);
      if (!this.currentSubject) {
        this.currentSubject = this.subjects[0];
      }
    },

    selectSubject(subjectId) {
      if (subjectId === this.currentSubject.id) {
        return;
      }
    },
  }));
});
