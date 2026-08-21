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
    index: 0,
    answer: "",

    async init() {
      this.settings = AppState.getStudySettings();
      this.subject = await loadSubject();

      if (!this.subject) {
        location.replace("/");
        return;
      }

      this.questions = this.subject.questions;

      this.prepareQuestions();
      this.initResults();
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
          };
        });
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
        } else if (blank.state === "correct" || blank.state === "incorrect") {
          className.push("opened");
        }

        return `<span class="${className.join(" ")}">${blank.answer}</span>`;
      });
    },

    submitAnswer() {
      this.answer = "";
    },
  }));
});
