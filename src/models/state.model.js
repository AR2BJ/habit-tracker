import { loadFromStorage, saveToStorage } from "./storage.model.js";

export const state = {
  habits: [],
  lastDeletedHabit: null,
  activeTab: "active",
  currentView: "habits",
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
    if (state.activeTab === "archived") {
      return state.habits.filter((h) => h.archived);
    }
    return state.habits.filter((h) => !h.archived);
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
