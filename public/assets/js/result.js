import AppState from "./state/AppState.js";
import Category from "./api/Category.js";

document.addEventListener("alpine:init", () => {
  Alpine.data("main", () => ({
    init() {
      const result = AppState.getStudyResult();

      if (result === null) {
        location.replace("/");
        return;
      }

      AppState.setStudyResult(null);
      console.log(result);
    },
  }));
});
