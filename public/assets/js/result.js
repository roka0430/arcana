import AppState from "./state/AppState.js";
import Shortcut from "./shortcut/Shortcut.js";
import ShortcutBar from "./shortcut/ShortcutBar.js";

document.addEventListener("alpine:init", () => {
  Alpine.data("shortcutBar", ShortcutBar);

  Alpine.data("main", () => ({
    subjectId: null,
    questions: [],
    canReview: false,
  }));

  Alpine.data("result", () => ({
    init() {
      const result = AppState.getStudyResult();

      if (result === null) {
        location.replace("/");
        return;
      }

      AppState.setStudyResult(null);

      this.subjectId = result.subjectId;
      this.questions = result.questions;

      this.canReview = this.questions.some((question) => question.blanks.some((blank) => blank.incorrect));
    },
  }));

  Alpine.data("menu", () => ({
    init() {
      Shortcut.setContext("result");
      Shortcut.setOrder("result", ["Escape", "r", "w"]);

      Shortcut.register("result", {
        key: "Escape",
        kbd: "Esc",
        description: "ホームへ戻る",
        handler: () => this.goHome(),
      });

      Shortcut.register("result", {
        key: "r",
        kbd: "R",
        description: "もう一度",
        handler: () => this.retryStudy(),
      });

      Shortcut.register("result", {
        key: "w",
        kbd: "W",
        description: "間違いのみ",
        handler: () => this.reviewStudy(),
      });
    },

    handleAction(e) {
      const action = e.target.value;

      switch (action) {
        case "home":
          this.goHome();
          break;
        case "retry":
          this.retryStudy();
          break;
        case "review":
          this.reviewStudy();
          break;
      }
    },

    goHome() {
      location.replace("/");
    },

    retryStudy() {
      location.replace(`/study/${this.subjectId}`);
    },

    reviewStudy() {
      if (!this.canReview) {
        return;
      }

      const reviewData = {
        subjectId: this.subjectId,
        incorrect: this.questions.filter(({ incorrect }) => incorrect).map(({ id }) => id),
      };

      AppState.setStudyReview(reviewData);
      location.replace(`/study/${this.subjectId}`);
    },
  }));
});
