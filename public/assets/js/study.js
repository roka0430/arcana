import { StudyStorage } from "./common/storage.js";

const studyStorage = new StudyStorage();

document.addEventListener("alpine:init", () => {
  Alpine.data("studyContent", () => ({
    progress: {},
    question: null,

    async init() {
      this.progress = studyStorage.get();

      const res = await fetch(`/api/question/${this.progress.id}`);
      if (!res.ok) throw new Error("Failed to fetch questions");
      this.question = await res.json();
    },

    get currentQuestionHtml() {
      const q = this.question?.questions?.[this.progress.index] ?? "";
      return q.replace(/；(.*?)；/g, `<span style="background: orange;">$1</span>`);
    },
  }));
});
