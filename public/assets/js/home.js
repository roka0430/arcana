document.addEventListener("alpine:init", () => {
  Alpine.data("subjectList", () => ({
    subjects: [],

    async init() {
      const res = await fetch("/api/subjects");

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      this.subjects = await res.json();
    },
  }));
});
