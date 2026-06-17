import { loadFromStorage, saveToStorage } from "./storage.model.js";

export const state = {
  habits: [],
  lastDeletedHabit: null,
  activeTab: "active",
  currentView: "habits",
  currentCategory: "all",
};

export const StateManager = {
  init() {
    const saved = loadFromStorage();
    if (saved) {
      state.habits = saved.habits || [];
    }
    return state.habits;
  },

  getHabits() {
    return state.habits;
  },

  getFilteredHabits() {
    let list = this.getHabits();

    if (state.activeTab === "active") {
      list = list.filter((h) => !h.archived);
    } else {
      list = list.filter((h) => h.archived);
    }

    if (state.currentCategory && state.currentCategory !== "all") {
      list = list.filter((h) => h.category === state.currentCategory);
    }

    return list;
  },

  setCategory(category) {
    state.currentCategory = category;
  },

  setTab(tab) {
    state.activeTab = tab;
  },

  setView(view) {
    state.currentView = view;
  },

  save(habits) {
    state.habits = habits;
    saveToStorage({ habits: state.habits });
  },
};
