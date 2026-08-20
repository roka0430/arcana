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

const initCurrentCategoryId = (categories) => {
  const categoryId = Math.min(...categories.map(({ id }) => id));
  AppState.setCurrentCategoryId(categoryId);
  return categoryId;
};

const getCurrentCategory = async (categories) => {
  const categoryId = AppState.getCurrentCategoryId() ?? initCurrentCategoryId(categories);

  try {
    return await Category.getCategory(categoryId);
  } catch {
    const categoryId = initCurrentCategoryId(categories);
    return await Category.getCategory(categoryId);
  }
};

// Alpine.js

document.addEventListener("alpine:init", () => {
  Alpine.data("main", () => ({
    categories: [],
    currentCategory: null,

    async init() {
      this.categories = await Category.getCategories();

      if (this.categories.length === 0) {
        console.log("no category");
        AppState.setCurrentCategoryId(null);
        return;
      }

      this.currentCategory = await getCurrentCategory(this.categories);
    },
  }));

  Alpine.data("category", () => ({
    isOpen: false,

    get name() {
      return this.currentCategory?.name ?? "";
    },

    async selectCategory(id) {
      this.isOpen = false;

      if (id === this.currentCategory.id) {
        return;
      }

      this.currentCategory = await Category.getCategory(id);
      AppState.setCurrentCategoryId(id);
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
