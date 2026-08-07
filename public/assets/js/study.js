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

      this.progress.mistake = this.question.questions.map((q) => {
        const blankCount = q.match(/；.*?；/g)?.length ?? 0;
        return Array(blankCount).fill(false);
      });
      studyStorage.set(this.progress);
    },

    get currentQuestion() {
      return this.question?.questions?.[this.progress.index] ?? "";
    },

    get currentQuestionHtml() {
      let index = 0;
      return this.currentQuestion.replace(/；(.*?)；/g, (_, answer) => {
        const className = index === 0 ? "blank target" : "blank";
        return `<span class="${className}" data-index="${index++}" data-answer="${answer}">${answer}</span>`;
      });
    },

    checkAnswer() {
      if (this.input === "") return;

      const targetBlank = document.querySelector(".blank.target");

      if (targetBlank.dataset.answer === this.input) {
        this.nextBlank(targetBlank);
      } else {
        this.progress.mistake[this.progress.index][Number(targetBlank.dataset.index)] = true;
        studyStorage.set(this.progress);
      }

      this.input = "";
    },

    nextBlank(currentBlank) {
      const nextBlank = currentBlank.nextElementSibling;

      if (!nextBlank) {
        this.nextQuestion();
        return;
      }

      nextBlank.classList.add("target");
      currentBlank.classList.remove("target");
    },

    nextQuestion() {
      this.progress.index++;

      if (this.progress.index > this.question.questions.length - 1) {
        console.log("finish");
        return;
      }

      studyStorage.set(this.progress);
    },
  }));
});
