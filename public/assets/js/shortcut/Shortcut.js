class Shortcut {
  constructor() {
    this.context = null;
    this.shortcuts = new Map();

    window.addEventListener("keydown", this.handleKeydown.bind(this));
  }

  setContext(context) {
    this.context = context;
  }

  register(context, key, handler) {
    if (!this.shortcuts.has(context)) {
      this.shortcuts.set(context, new Map());
    }

    this.shortcuts.get(context).set(key, handler);
  }

  handleKeydown(e) {
    const key = this.createKey(e);

    const handler = this.shortcuts.get(this.context)?.get(key);

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
