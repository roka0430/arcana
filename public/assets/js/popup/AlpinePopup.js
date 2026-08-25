import Popup from "./Popup.js";

export default () => ({
  isOpen: false,
  disableConfirm: true,

  context: "",
  title: "",
  confirm: "",
  type: "",
  validate: null,

  init() {
    this.initialContent = this.$refs.content.innerHTML;

    this.update();
    window.addEventListener("popup-update", () => this.update());
  },

  update() {
    const popup = Popup.popup;
    this.isOpen = popup !== null;

    if (!popup) {
      return;
    }

    this.context = Popup.context;
    this.title = Popup.popup.title;
    this.confirm = Popup.popup.confirm;
    this.type = Popup.popup.type;
    this.validate = Popup.popup.validate;

    this.disableConfirm = this.validate !== null;

    this.$refs.content.innerHTML = this.initialContent;
    [...this.$refs.content.children].forEach((el) => {
      el.hidden = el.dataset.context !== Popup.context;
    });
  },

  get currentContent() {
    return this.$refs.content.querySelector(`[data-context="${this.context}"]`);
  },

  updatePopupContent() {
    if (!this.currentContent) {
      this.disableConfirm = true;
    }

    if (!this.validate) {
      this.disableConfirm = false;
    }

    this.disableConfirm = !this.validate(this.currentContent);
  },

  cancel() {
    const content = this.currentContent;
    Popup.resolve(null, content);
  },

  action() {
    const content = this.currentContent;
    Popup.resolve(true, content);
  },
});
