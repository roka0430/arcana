export default class AppState {
  static #CURRENT_CATEGORY_ID = "arcana:current_category_id";

  static get(key) {
    const value = localStorage.getItem(key);
    if (value === null) return null;

    try {
      return JSON.parse(value);
    } catch {
      localStorage.removeItem(key);
      return null;
    }
  }

  static set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static getCurrentCategoryId() {
    return this.get(this.#CURRENT_CATEGORY_ID);
  }

  static setCurrentCategoryId(id) {
    this.set(this.#CURRENT_CATEGORY_ID, id);
  }
}
