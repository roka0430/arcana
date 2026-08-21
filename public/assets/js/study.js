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

const randomShuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Alpine.js

document.addEventListener("alpine:init", () => {
  Alpine.data("main", () => ({
    settings: {},
    subject: {},
    questions: [],
    mistakes: [],

    async init() {
      this.settings = AppState.getStudySettings();

      this.subject = await loadSubject();

      if (!this.subject) {
        location.replace("/");
        return;
      }

      this.questions = this.subject.questions;

      if (this.settings.order === "random") {
        randomShuffle(this.questions);
      }

      console.log(this.questions);
    },
  }));

  Alpine.data("question", () => ({
    async init() {},
  }));
});
