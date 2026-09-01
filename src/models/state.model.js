import { HabitRepository } from "@/infrastructure/persistence/habit.repository";
import { HabitSelectors } from "@/domain/habits/habit.selectors";
import { Store } from "@/infrastructure/store/store";

export const StateManager = {
  init() {
    const data = HabitRepository.load();
    if (data) {
      Store.setHabits(data.habits || []);
    }
    return Store.getHabits();
  },

  getHabits() {
    return Store.getHabits();
  },

  getFilteredHabits() {
    const state = Store.getState();
    return HabitSelectors.getFiltered(Store.getHabits(), {
      tab: state.ui.activeTab,
      category: state.ui.currentCategory,
      searchQuery: state.ui.searchQuery,
    });
  },

  setCategory(category) {
    Store.setCategory(category);
  },

  setTab(tab) {
    Store.setActiveTab(tab);
  },

  setView(view) {
    Store.setView(view);
  },

  setSearchQuery(query) {
    Store.setSearchQuery(query);
  },

  save(habits) {
    Store.setHabits(habits);
    HabitRepository.save(habits);
  },

  get state() {
    const state = Store.getState();
    return {
      habits: state.habits,
      lastDeletedHabit: state.session.lastDeletedHabit,
      activeTab: state.ui.activeTab,
      currentView: state.ui.currentView,
      currentCategory: state.ui.currentCategory,
      searchQuery: state.ui.searchQuery,
    };
  },

  set state(value) {
    if (value.habits !== undefined) {
      Store.setHabits(value.habits);
    }
  },

  // Subscribe to store changes
  subscribe(listener) {
    return Store.subscribe(listener);
  },
};

export const state = StateManager.state;
