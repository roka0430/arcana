class Shortcut {
  constructor() {
    this.context = null;
    this.shortcuts = {};
    this.order = {};

    window.addEventListener("keydown", this.handleKeydown.bind(this));
  }

  get availableShortcuts() {
    const order = this.order[this.context] ?? [];
    const orderIndex = new Map(order.map((key, index) => [key, index]));

    const shortcuts = this.shortcuts[this.context] ?? {};
    const shortcutList = Object.entries(shortcuts).map(([key, { kbd, description }]) => ({ key, kbd, description }));

    shortcutList.sort((a, b) => {
      const aIndex = orderIndex.get(a.key) ?? Infinity;
      const bIndex = orderIndex.get(b.key) ?? Infinity;
      return aIndex - bIndex;
    });

    return shortcutList;
  }

  notifyChange() {
    window.dispatchEvent(new CustomEvent("shortcut-change"));
  }

  setContext(context) {
    this.context = context;
    this.notifyChange();
  }

  setOrder(context, order) {
    this.order[context] = order;
  }

  register(contexts, { key, kbd, description, handler }) {
    if (!Array.isArray(contexts)) {
      contexts = [contexts];
    }

    for (const context of contexts) {
      if (!this.shortcuts[context]) {
        this.shortcuts[context] = {};
      }

      this.shortcuts[context][key] = { kbd, description, handler };
    }

    this.notifyChange();
  }

  handleKeydown(e) {
    const key = this.createKey(e);

    const shortcuts = this.shortcuts[this.context];
    const handler = shortcuts?.[key]?.handler ?? shortcuts["*"]?.handler;

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

    keys.push(e.key);
    return keys.join("+");
  }
}

export default new Shortcut();
