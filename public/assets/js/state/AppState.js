export default class AppState {
  static #CURRENT_CATEGORY_ID = "arcana:current_category_id";
  static #STUDY_SETTINGS = "arcana:study_settings";
  static #SUBJECT_SELECTOR = "arcana:subject_selector";
  static #STUDY_RESULT = "arcana:study_result";
  static #STUDY_REVIEW = "arcana:study_review";

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

  static setStudySettings(settings) {
    this.set(this.#STUDY_SETTINGS, settings);
  }

  // Subject selector

  static getSubjectSelector() {
    return this.get(this.#SUBJECT_SELECTOR);
  }

  static setSubjectSelector(id) {
    this.set(this.#SUBJECT_SELECTOR, id);
  }

  // Study result

  static getStudyResult() {
    return this.get(this.#STUDY_RESULT);
  }

  static setStudyResult(result) {
    this.set(this.#STUDY_RESULT, result);
  }

  // Study review

  static getStudyReview() {
    return this.get(this.#STUDY_REVIEW);
  }

  static setStudyReview(data) {
    this.set(this.#STUDY_REVIEW, data);
  }
}
