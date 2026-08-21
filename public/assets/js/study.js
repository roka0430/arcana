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
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

// Alpine.js

document.addEventListener("alpine:init", () => {
  Alpine.data("main", () => ({
    settings: {},
    subject: {},
    questions: [],
    results: {},

    async init() {
      this.settings = AppState.getStudySettings();
      this.subject = await loadSubject();

      if (!this.subject) {
        location.replace("/");
        return;
      }

      this.questions = this.subject.questions;
      this.orderQuestions();
      this.initResults();

      console.log(this.results);
    },

    orderQuestions() {
      if (this.settings.order === "random") {
        randomShuffle(this.questions);
      }
    },

    initResults() {
      this.questions.forEach((question) => {
        this.results[question.id] = {
          isCorrect: null,
          blanks: Array(question.blank_count).fill(null),
        };
      });
    },
  }));

  Alpine.data("question", () => ({
    async init() {},
  }));
});
