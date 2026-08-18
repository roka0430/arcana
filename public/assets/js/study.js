import AppState from "./state/AppState.js";
import Category from "./api/Category.js";

const loadSubject = async () => {
  const categoryId = AppState.getCurrentCategoryId();
  const subjectId = Number(location.pathname.split("/").at(-1));

  try {
    return await Category.getSubject(categoryId, subjectId);
  } catch {
    return null;
  }
};

document.addEventListener("alpine:init", () => {
  Alpine.data("subject", () => ({
    subject: {},

    async init() {
      this.subject = await loadSubject();

      if (!this.subject) {
        location.replace("/");
        return;
      }

      console.log(this.subject);
    },
  }));
});
