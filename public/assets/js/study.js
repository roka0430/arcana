import { StudyStorage } from "./common/storage.js";

const studyStorage = new StudyStorage();

document.addEventListener("alpine:init", () => {
  Alpine.data("studyContent", () => ({
    input: "",
    progress: {},
    question: null,

    async init() {
      this.progress = studyStorage.get();

      const res = await fetch(`/api/question/${this.progress.id}`);
      if (!res.ok) throw new Error("Failed to fetch questions");
      this.question = await res.json();
    },

    get currentQuestion() {
      return this.question?.questions?.[this.progress.index] ?? "";
    },

    get currentQuestionHtml() {
      let first = true;
      return this.currentQuestion.replace(/；(.*?)；/g, (_, answer) => {
        const className = first ? "blank target" : "blank";
        first = false;
        return `<span class="${className}" data-answer="${answer}">${answer}</span>`;
      });
    },

    checkAnswer() {
      if (this.input === "") return;

      const targetBlank = document.querySelector(".blank, .target");

      if (targetBlank.dataset.answer === this.input) {
        console.log("ok");
      } else {
        console.log("mistake");
      }

      this.input = "";
    },
  }));
});
