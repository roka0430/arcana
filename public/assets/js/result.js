import AppState from "./state/AppState.js";
import Category from "./api/Category.js";

document.addEventListener("alpine:init", () => {
  Alpine.data("main", () => ({
    subjectId: null,
    questions: [],
    canReview: false,
  }));

  Alpine.data("result", () => ({
    init() {
      const result = AppState.getStudyResult();

      if (result === null) {
        // location.replace("/");
        return;
      }

      AppState.setStudyResult(null);

      this.subjectId = result.subjectId;
      this.questions = result.questions;

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
          const reviewData = {
            subjectId: this.subjectId,
            incorrect: this.questions.filter(({ incorrect }) => incorrect).map(({ id }) => id),
          };

          AppState.setStudyReview(reviewData);
          location.replace(`/study/${this.subjectId}`);
          break;
      }
    },
  }));
});
