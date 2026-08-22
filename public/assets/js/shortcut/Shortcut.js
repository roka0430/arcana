class Shortcut {
  constructor() {
    this.context = null;
    this.shortcuts = {};

    window.addEventListener("keydown", this.handleKeydown.bind(this));
  }

  get availableShortcuts() {
    return this.shortcuts[this.context] ?? [];
  }

  notifyChange() {
    window.dispatchEvent(new CustomEvent("shortcut-change"));
  }

  setContext(context) {
    this.context = context;
    this.notifyChange();
  }

  register(context, key, handler) {
    if (!this.shortcuts[context]) {
      this.shortcuts[context] = {};
    }

    this.shortcuts[context][key] = handler;
    this.notifyChange();
  }

  handleKeydown(e) {
    const key = this.createKey(e);

    const handler = this.shortcuts[this.context]?.[key];

    if (!handler) {
      return;
    }

    e.preventDefault();
    handler(e);
  }

  createKey(e) {
    const keys = [];

    if (e.ctrlKey) {
      keys.push("Ctrl");
    }

    if (e.shiftKey) {
      keys.push("Shift");
    }

    if (e.altKey) {
      keys.push("Alt");
    }

    keys.push(e.key.toUpperCase());

    return keys.join("+");
  }
}

export default new Shortcut();
