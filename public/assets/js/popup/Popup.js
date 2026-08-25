class Popup {
  context = null;
  popups = {};
  #resolve = null;

  get popup() {
    return this.popups?.[this.context] ?? null;
  }

  notify() {
    window.dispatchEvent(new CustomEvent("popup-update"));
  }

  register(context, { title, confirm }) {
    this.popups[context] = { title, confirm };
  }

  open(context) {
    if (!Object.keys(this.popups).includes(context)) {
      return;
    }

    this.context = context;

    return new Promise((resolve) => {
      this.#resolve = resolve;
      this.notify();
    });
  }

  resolve(value, content) {
    this.#resolve?.({ value, content });
    this.close();
  }

  close() {
    this.context = null;
    this.#resolve = null;
    this.notify();
  }
}

export default new Popup();
