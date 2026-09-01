import { HabitFactory } from "@/domain/habits/habit.factory";
import { HabitLifecycle } from "@/domain/habits/habit.lifecycle";
import { HabitMutations } from "@/domain/habits/habit.mutations";
import { HabitRepository } from "@/infrastructure/persistence/habit.repository";
import { HabitRules } from "@/domain/habits/habit.rules";
import { HabitSelectors } from "@/domain/habits/habit.selectors";
import { Store } from "@/infrastructure/store/store";
import { todayISO } from "@/shared/utils/date.utils";

export const HabitApplication = {
  _syncListeners: [],

  /**
   * Load habits from repository into store
   * This should be called during bootstrap
   */
  load() {
    const data = HabitRepository.load();
    if (data && data.habits) {
      Store.setHabits(data.habits);
    }
    return Store.getHabits();
  },

  // Query methods
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

  getState() {
    return Store.getState();
  },

  getUI() {
    return Store.getUI();
  },

  // UI state mutations
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

  // Domain operations
  saveHabits(habits) {
    Store.setHabits(habits);
    HabitRepository.save(habits);
  },

  createHabit(habitData) {
    // Validate first
    const name = HabitRules.normalizeName(habitData.name);
    if (!HabitRules.isValidName(name)) {
      throw new Error("Invalid habit name length (2-20 chars)");
    }

    const habits = this.getHabits();
    if (HabitRules.isDuplicateActive(habits, name)) {
      throw new Error("An active habit with this title already exists");
    }

    const newHabit = HabitFactory.create(habitData);
    const updated = [newHabit, ...habits];
    this.saveHabits(updated);
    return updated;
  },

  toggleDate(habitId, date) {
    const habits = this.getHabits();
    const updated = HabitMutations.toggleDate(habits, habitId, date);
    this.saveHabits(updated);
    return updated;
  },

  toggleSkippedDate(habitId, date) {
    const habits = this.getHabits();
    const updated = HabitMutations.toggleSkippedDate(habits, habitId, date);
    this.saveHabits(updated);
    return updated;
  },

  toggleToday(habitId) {
    const today = todayISO();
    return this.toggleDate(habitId, today);
  },

  editHabit(habitId, habitData) {
    const habits = this.getHabits();
    const updated = HabitMutations.edit(habits, habitId, habitData);
    this.saveHabits(updated);
    return updated;
  },

  deleteHabit(habitId) {
    const habits = this.getHabits();
    const result = HabitMutations.delete(habits, habitId);
    this.saveHabits(result.habits);
    Store.setLastDeleted(result.deleted);
    return result;
  },

  archiveHabit(habitId) {
    const habits = this.getHabits();
    const updated = HabitMutations.archive(habits, habitId);
    this.saveHabits(updated);
    return updated;
  },

  restoreHabit(habitId) {
    const habits = this.getHabits();
    const updated = HabitMutations.restore(habits, habitId);
    this.saveHabits(updated);
    return updated;
  },

  // Lifecycle operations
  applyMissingDatePolicy(today) {
    const habits = this.getHabits();
    const result = HabitLifecycle.applyMissingDatePolicy(habits, today);
    if (result.changes > 0) {
      this.saveHabits(result.habits);
    }
    return result;
  },

  applyAutoArchivePolicy(today, threshold = 30) {
    const habits = this.getHabits();
    const result = HabitLifecycle.applyAutoArchivePolicy(
      habits,
      today,
      threshold,
    );
    if (result.archived > 0) {
      this.saveHabits(result.habits);
    }
    return result;
  },

  // Subscribe to store changes
  subscribe(listener) {
    return Store.subscribe(listener);
  },
};
