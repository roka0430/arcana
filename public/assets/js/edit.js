import AppState from "./state/AppState.js";
import Shortcut from "./shortcut/Shortcut.js";
import ShortcutBar from "./shortcut/ShortcutBar.js";

import Category from "./category/Category.js";
import { getCurrentCategory } from "./category/currentCategory.js";

const escapeHtml = (str) => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

document.addEventListener("alpine:init", () => {
  Alpine.data("shortcutBar", ShortcutBar);

  Alpine.data("main", () => ({
    categories: [],
    currentCategory: null,

    subjects: [],
    currentSubject: null,

    content: "",
    timeout: null,

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

      const subjectId = AppState.getSubjectSelector();
      this.setCurrentSubject(subjectId);
    },

    setCurrentSubject(subjectId) {
      this.currentSubject = this.getCurrentSubject(subjectId);
      this.loadContent();
    },

    getCurrentSubject(subjectId) {
      if (subjectId !== null) {
        const subject = this.subjects.find((subject) => subject.id === subjectId);

        if (subject) {
          return subject;
        }
      }

      return this.subjects[0];
    },

    loadContent() {
      const questions = this.currentSubject.questions;

      if (!questions) {
        this.content = "";
        return;
      }

      this.content = questions.map(({ question }) => question).join("\n\n");
    },

    saveContent() {
      const splitted = this.content.split(/\n{2,}/);
      const shaped = splitted.filter((item) => item.trim() !== "");
      const escaped = shaped.map(escapeHtml);

      const questions = [];
      let blankCount = 0;
      for (const [i, question] of Object.entries(escaped)) {
        const blanks = question.match(/；.*?；/g) ?? [];
        blankCount += blanks.length;

        questions.push({
          id: Number(i) + 1,
          blank_count: blanks.length,
          question: question,
        });
      }

      this.currentSubject.blank_count = blankCount;
      this.currentSubject.questions = questions;

      this.saveCategory();
    },

    saveCategory() {
      const blankCount = this.subjects.reduce((sum, { blank_count }) => sum + blank_count, 0);
      this.currentCategory.blank_count = blankCount;
    },

    inputContent() {
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.saveContent(), 1000);
    },

    selectSubject(subjectId) {
      if (subjectId === this.currentSubject.id) {
        return;
      }

      this.setCurrentSubject(subjectId);
    },
  }));
});
