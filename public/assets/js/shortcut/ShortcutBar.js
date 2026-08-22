import Shortcut from "./Shortcut.js";

export default () => ({
  shortcuts: [],

  init() {
    this.shortcuts = Shortcut.availableShortcuts;

    this.update = () => {
      this.shortcuts = Shortcut.availableShortcuts;
    };

    this.update();
    window.addEventListener("shortcut-change", this.update);
  },
});
