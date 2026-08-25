import Popup from "./Popup.js";

export default () => ({
  isOpen: false,
  title: "",
  content: "",
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
    this.content = Popup.popup.content;
    this.confirmText = Popup.popup.confirm;
  },

  cancel() {
    Popup.resolve(null, this.$refs.content);
  },

  confirm() {
    Popup.resolve(true, this.$refs.content);
  },
});
