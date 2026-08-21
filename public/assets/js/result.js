import AppState from "./state/AppState.js";
import Category from "./api/Category.js";

document.addEventListener("alpine:init", () => {
  Alpine.data("main", () => ({
    result: [],

    init() {
      this.result = AppState.getStudyResult();

      if (this.result === null) {
        location.replace("/");
        return;
      }

      AppState.setStudyResult(null);
      console.log(this.result);
    },
  }));
});
