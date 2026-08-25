import Popup from "./Popup.js";

export default () => ({
  isOpen: false,
  title: "",
  confirmText: "",

  init() {
    this.update();
    window.addEventListener("popup-update", () => this.update());
  },

  update() {
    const popup = Popup.popup;

    this.isOpen = popup !== null;

    if (!popup) {
      return;
    }

    this.title = Popup.popup.title;
    this.confirmText = Popup.popup.confirm;

    [...this.$refs.content.children].forEach((el) => {
      el.hidden = el.dataset.context !== Popup.context;
    });
  },

  cancel() {
    const content = this.$refs.content.querySelector(`[data-context="${Popup.context}"]`);
    Popup.resolve(null, content);
  },

  confirm() {
    const content = this.$refs.content.querySelector(`[data-context="${Popup.context}"]`);
    Popup.resolve(true, content);
  },
});
