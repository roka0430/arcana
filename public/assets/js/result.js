import AppState from "./state/AppState.js";
import Category from "./api/Category.js";

document.addEventListener("alpine:init", () => {
  Alpine.data("main", () => ({}));

  Alpine.data("result", () => ({
    result: [],

    init() {
      this.result = AppState.getStudyResult() ?? [];

      if (this.result.length === 0) {
        // location.replace("/");
        return;
      }

      AppState.setStudyResult(null);
    },
  }));

  Alpine.data("menu", () => ({
    handleAction(e) {
      const action = e.target.value;
      console.log(action);
    },
  }));
});
