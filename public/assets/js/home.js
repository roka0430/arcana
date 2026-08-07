document.addEventListener("alpine:init", () => {
  Alpine.data("questionList", () => ({
    async init() {
      const res = await fetch("/api/question");

      if (!res.ok) {
        throw new Error("Failed to fetch questions");
      }

      this.questions = await res.json();
    },

    startStudy(id) {
      alert(id);
    },
  }));
});
