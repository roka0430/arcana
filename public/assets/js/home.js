import AppState from "./state/AppState.js";
import Category from "./api/Category.js";

// settings

const defaultSettings = {
  order: "ordered",
  answer: "input",
  format: "individual",
  blank: "text",
};

const validSettings = {
  order: ["ordered", "random"],
  answer: ["input", "flip"],
  format: ["individual", "combined"],
  blank: ["text", "fixed"],
};

const isValidSettings = (settings) => {
  if (!settings || typeof settings !== "object") {
    return false;
  }

  return Object.entries(validSettings).every(([key, values]) => values.includes(settings[key]));
};

const getStoredSettings = () => {
  const settings = AppState.getStudySettings();

  if (!isValidSettings(settings)) {
    return null;
  }

  return settings;
};

// subjects

const initCurrentCategoryId = async () => {
  const categories = await Category.getCategories();

  if (categories.length === 0) {
    AppState.setCurrentCategoryId(null);
    return null;
  }

  const categoryId = Math.min(...categories.map(({ id }) => id));
  AppState.setCurrentCategoryId(categoryId);
  return categoryId;
};

const getCurrentCategory = async () => {
  const categoryId = AppState.getCurrentCategoryId() ?? (await initCurrentCategoryId());

  if (categoryId === null) {
    return null;
  }

  try {
    return await Category.getCategory(categoryId);
  } catch {
    const categoryId = await initCurrentCategoryId();

    if (categoryId === null) {
      return null;
    }

    return await Category.getCategory(categoryId);
  }
};

// Alpine.js

document.addEventListener("alpine:init", () => {
  Alpine.data("main", () => ({
    currentCategory: null,

    async init() {
      this.currentCategory = await getCurrentCategory();

      if (this.currentCategory === null) {
        console.log("no category");
        return;
      }
    },
  }));

  Alpine.data("category", () => ({
    isOpen: false,

    get name() {
      return this.currentCategory?.name ?? "";
    },
  }));

  Alpine.data("settings", () => ({
    settings: { ...defaultSettings },

    init() {
      const storedSettings = getStoredSettings();

      if (storedSettings) {
        this.settings = storedSettings;
      } else {
        this.settings = defaultSettings;
        AppState.setStudySettings(this.settings);
      }

      this.$watch("settings", (settings) => {
        AppState.setStudySettings(settings);
      });
    },
  }));

  Alpine.data("subjects", () => ({
    get subjects() {
      return this.currentCategory?.subjects ?? [];
    },
  }));
});
