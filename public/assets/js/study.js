import AppState from "./state/AppState.js";
import Category from "./api/Category.js";

// main

const loadSubject = async () => {
  const categoryId = AppState.getCurrentCategoryId();
  const subjectId = Number(location.pathname.split("/").at(-1));

  try {
    return await Category.getSubject(categoryId, subjectId);
  } catch {
    return null;
  }
};

// Alpine.js

document.addEventListener("alpine:init", () => {
  Alpine.data("main", () => ({
    settings: {},
    subject: {},

    async init() {
      this.settings = AppState.getStudySettings();

      this.subject = await loadSubject();

      if (!this.subject) {
        location.replace("/");
        return;
      }

      console.log(this.subject);
    },

    get categoryName() {
      return this.subject?.category_name ?? "";
    },

    get subjectName() {
      return this.subject?.name ?? "";
    },
  }));

  Alpine.data("question", () => ({
    async init() {},
  }));
});
