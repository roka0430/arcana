import { StudyStorage } from "./common/storage.js";

const studyStorage = new StudyStorage();

document.addEventListener("alpine:init", () => {
  Alpine.data("questionList", () => ({
    questions: [],

    async init() {
      const res = await fetch("/api/question");

      if (!res.ok) {
        throw new Error("Failed to fetch questions");
      }

      this.questions = await res.json();
    },

    startStudy(id) {
      studyStorage.setQuestion(id);
    },
  }));
});
