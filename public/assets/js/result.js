import AppState from "./state/AppState.js";
import Category from "./api/Category.js";

document.addEventListener("alpine:init", () => {
  Alpine.data("main", () => ({}));

  Alpine.data("result", () => ({
    result: {},
    subjectId: [],
    questions: [],

    init() {
      this.result = AppState.getStudyResult() ?? {};

      if (!this.result) {
        // location.replace("/");
        return;
      }

      AppState.setStudyResult(null);

      this.subjectId = this.result.subjectId;
      this.questions = this.result.questions;
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
          location.replace("/study");
          break;
        case "review":
          break;
      }
    },
  }));
});
