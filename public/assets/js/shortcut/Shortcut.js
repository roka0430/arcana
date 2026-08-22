class Shortcut {
  constructor() {
    this.context = null;
    this.shortcuts = {};

    window.addEventListener("keydown", this.handleKeydown.bind(this));
  }

  get availableShortcuts() {
    const shortcuts = this.shortcuts[this.context] ?? [];
    return Object.entries(shortcuts).map(([key, { label }]) => ({ key, label }));
  }

  notifyChange() {
    window.dispatchEvent(new CustomEvent("shortcut-change"));
  }

  setContext(context) {
    this.context = context;
    this.notifyChange();
  }

  register(context, key, label, handler) {
    if (!this.shortcuts[context]) {
      this.shortcuts[context] = {};
    }

    this.shortcuts[context][key] = { label, handler };
    this.notifyChange();
  }

  handleKeydown(e) {
    const key = this.createKey(e);

    const handler = this.shortcuts[this.context]?.[key]?.handler;

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
