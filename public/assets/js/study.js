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
    index: 0,

    answer: "",
    previousAnswer: "",

    async init() {
      this.settings = AppState.getStudySettings();
      this.subject = await loadSubject();

      if (!this.subject) {
        location.replace("/");
        return;
      }

      this.questions = this.subject.questions;

      this.prepareQuestions();

      if (this.questions.length === 0) {
        location.replace("/");
        return;
      }

      this.$watch("currentQuestionHtml", () => {
        this.$nextTick(() => {
          this.$refs.question.querySelector(".blank.active")?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        });
      });
    },

    prepareQuestions() {
      if (this.settings.order === "random") {
        this.questions = randomShuffle(this.questions);
      }

      if (this.settings.format === "combined") {
        const combinedQuestion = {
          id: -1,
          blank_count: this.questions.reduce((sum, question) => sum + question.blank_count, 0),
          question: this.questions.map((question) => question.question).join("\n\n"),
        };

        this.questions.splice(0);
        this.questions.push(combinedQuestion);
      }

      this.questions = this.questions.filter((question) => question.blank_count > 0);

      for (const question of this.questions) {
        const matches = [...question.question.matchAll(/；(.*?)；/g)];
        const blanks = matches.map((match) => match[1]);

        question.blanks = blanks.map((blank, i) => {
          return {
            answer: blank,
            state: i === 0 ? "active" : "closed",
            isOpened: false,
            hasIncorrect: false,
          };
        });
      }
    },

    get currentQuestionHtml() {
      if (this.questions.length === 0) {
        return "";
      }

      const question = this.questions[this.index];
      let blankIndex = 0;

      return question.question.replace(/；(.*?)；/g, () => {
        const blank = question.blanks[blankIndex++];
        const className = ["blank"];

        if (blank.state === "active") {
          className.push("active");
        }

        if (blank.isOpened || blank.state === "correct" || blank.state === "incorrect") {
          className.push("opened");
        }

        return `<span class="${className.join(" ")}">${blank.answer}</span>`;
      });
    },

    get activeBlank() {
      const blanks = this.questions[this.index].blanks;
      return blanks.find((blank) => blank.state === "active");
    },

    advance() {
      const blanks = this.questions[this.index].blanks;
      const blankIndex = blanks.findIndex((blank) => blank.state === "active");

      if (blankIndex === -1) {
        return;
      }

      blanks[blankIndex].state = this.activeBlank.hasIncorrect ? "incorrect" : "correct";

      const nextBlank = blanks[blankIndex + 1];
      if (nextBlank) {
        nextBlank.state = "active";
        return;
      }

      this.nextQuestion();
    },

    nextQuestion() {
      this.index++;

      if (this.index >= this.questions.length) {
        this.finish();
      }
    },

    finish() {
      const questions = this.questions.map((question) => {
        return {
          id: question.id,
          incorrect: question.blanks.some((blank) => blank.hasIncorrect),
          blanks: question.blanks.map((blank) => ({
            answer: blank.answer,
            incorrect: blank.hasIncorrect,
          })),
        };
      });

      const result = {
        subjectId: this.subject.id,
        questions: questions,
      };

      AppState.setStudyResult(result);
      location.replace("/result");
      return;
    },

    submitAnswer() {
      if (this.answer === "") {
        return;
      }

      this.previousAnswer = this.answer;
      this.answer = "";

      if (this.previousAnswer !== this.activeBlank.answer) {
        this.activeBlank.hasIncorrect = true;
        return;
      }

      this.advance();
    },

    revealAnswer() {
      this.activeBlank.isOpened = true;
      this.activeBlank.hasIncorrect = true;
    },

    skipAnswer(e) {
      this.activeBlank.hasIncorrect = true;
      this.advance();
      e.preventDefault();
    },

    restorePreviousAnswer() {
      this.answer = this.previousAnswer;

      this.$nextTick(() => {
        const input = this.$refs.answerInput;
        input.setSelectionRange(input.value.length, input.value.length);
      });
    },

    focusAnswerInput(e) {
      if (document.activeElement !== this.$refs.answerInput) {
        this.$refs.answerInput.focus();
        e.preventDefault();
      }
    },
  }));
});
