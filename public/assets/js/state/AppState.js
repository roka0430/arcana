export default class AppState {
  static #CURRENT_CATEGORY_ID = "arcana:current_category_id";
  static #STUDY_SETTINGS = "arcana:study_settings";
  static #SUBJECT_SELECTOR = "arcana:subject_selector";

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

  // Current category ID

  static getCurrentCategoryId() {
    return this.get(this.#CURRENT_CATEGORY_ID);
  }

  static setCurrentCategoryId(id) {
    this.set(this.#CURRENT_CATEGORY_ID, id);
  }

  // Study settings

  static getStudySettings() {
    return this.get(this.#STUDY_SETTINGS);
  }

  static setStudySettings(id) {
    this.set(this.#STUDY_SETTINGS, id);
  }

  // Subject selector

  static getSubjectSelector() {
    return this.get(this.#SUBJECT_SELECTOR);
  }

  static setSubjectSelector(id) {
    this.set(this.#SUBJECT_SELECTOR, id);
  }
}
