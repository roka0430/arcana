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

const loadCategory = async () => {
  const categories = await Category.getCategories();

  if (categories.length === 0) {
    AppState.setCurrentCategoryId(null);
    location.replace("/edit/category");
    return;
  }

  return categories;
};

const sortSubjects = (subjects) => {
  return subjects.sort((a, b) => a.name.localeCompare(b.name));
};

const getCurrentSubject = (subjects, subjectId) => {
  if (subjectId !== null) {
    const subject = subjects.find((subject) => subject.id === subjectId);

    if (subject) {
      return subject;
    }
  }

  return subjects[0];
};

document.addEventListener("alpine:init", () => {
  Alpine.data("shortcutBar", ShortcutBar);

  Alpine.data("main", () => ({
    categories: [],
    currentCategory: null,

    subjects: [],
    currentSubject: null,

    content: "",

    async init() {
      this.initShortcut();
      await this.initCategory();
      this.initSubject();

      this.setContent();
    },

    initShortcut() {
      Shortcut.setContext("edit");
      Shortcut.setOrder("edit", ["Escape"]);
    },

    async initCategory() {
      this.categories = await loadCategory();
      this.currentCategory = await getCurrentCategory(this.categories);
    },

    initSubject() {
      this.subjects = this.currentCategory.subjects;

      if (this.subjects.length === 0) {
        console.log("no subjects");
        return;
      }

      this.subjects = sortSubjects(this.subjects);
      this.currentSubject = getCurrentSubject(this.subjects, AppState.getSubjectSelector());
    },

    setContent() {
      if (!this.currentSubject) {
        console.log("cannot set content");
        return;
      }

      const questions = this.currentSubject.questions;

      if (!questions) {
        this.content = "";
        return;
      }

      this.content = questions.map(({ question }) => question).join("\n\n");
    },

    async saveCategory() {
      const blankCount = this.subjects.reduce((sum, { blank_count }) => sum + blank_count, 0);
      this.currentCategory.blank_count = blankCount;
      await Category.overwriteCategory(this.currentCategory);
    },
  }));

  Alpine.data("directory", () => ({
    editingSubjectId: null,

    selectSubject(subjectId) {
      if (subjectId === this.currentSubject.id) {
        return;
      }

      this.currentSubject = getCurrentSubject(this.subjects, subjectId);
      this.setContent();
    },

    startEditingName(subjectId) {
      this.editingSubjectId = subjectId;

      this.$nextTick(() => {
        const input = document.querySelector("input.editing");
        input?.select();
      });
    },

    async finishEditingName() {
      this.editingSubjectId = null;
      this.subjects = sortSubjects(this.subjects);
      await Category.overwriteCategory(this.currentCategory);
    },

    async createSubject() {
      let id = 1;
      while (this.subjects.some((subject) => subject.id === id)) id++;

      const newSubject = {
        id: id,
        name: "new subject",
        blank_count: 0,
        questions: [],
      };

      this.subjects.push(newSubject);
      this.subjects = sortSubjects(this.subjects);

      this.currentSubject = newSubject;
      this.setContent();
      this.startEditingName(id);

      await this.saveCategory();
    },

    async deleteSubject() {
      if (!confirm("削除しますか？")) return;

      const id = this.currentSubject.id;
      const index = this.subjects.findIndex((subject) => subject.id === id);

      this.subjects.splice(index, 1);

      this.currentSubject = this.subjects[index] ?? this.subjects[index - 1] ?? null;

      this.setContent();
      await this.saveCategory();
    },
  }));

  Alpine.data("edit", () => ({
    timeout: null,

    init() {
      Shortcut.register("edit", {
        key: "Escape",
        kbd: "Esc",
        description: "保存して終了",
        handler: () => this.exit(),
      });
    },

    async exit() {
      await this.saveContent();
      location.href = "/";
    },

    inputContent() {
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.saveContent(), 1000);
    },

    async saveContent() {
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

      await this.saveCategory();
    },
  }));
});
