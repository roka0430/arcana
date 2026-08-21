import AppState from "./state/AppState.js";
import Category from "./api/Category.js";

document.addEventListener("alpine:init", () => {
  Alpine.data("main", () => ({
    subjectId: -1,
    canReview: false,
  }));

  Alpine.data("result", () => ({
    result: {},
    questions: [],

    init() {
      this.result = AppState.getStudyResult();

      if (this.result === null) {
        // location.replace("/");
        return;
      }

      AppState.setStudyResult(null);

      this.subjectId = this.result.subjectId;
      this.questions = this.result.questions;

      this.canReview = this.questions.some((question) => question.blanks.some((blank) => blank.incorrect));
    },
  }));

  Alpine.data("menu", () => ({
    handleAction(e) {
      const action = e.target.value;

      switch (action) {
        case "home":
          location.replace("/");
          break;
        case "retry":
          location.replace(`/study/${this.subjectId}`);
          break;
        case "review":
          break;
      }
    },
  }));
});
