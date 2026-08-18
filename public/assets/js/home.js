document.addEventListener("alpine:init", () => {
  Alpine.data("subjects", () => ({
    init() {
      console.log("init alpine");
    },
  }));
});
