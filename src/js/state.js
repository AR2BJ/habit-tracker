// =============================
// GLOBAL STATE START
// =============================
import { bindHabitEvents } from "./habits/habit.events.js";
import { loadFromStorage } from "./storage.js";
import { renderDashboard } from "./dashboard/dashboard.ui.js";
import { renderHabits } from "./habits/habit.ui.js";

export const state = {
  habits: [],

  // =============================
  // UNDO DELETE STATE START
  // =============================

  lastDeletedHabit: null,

  // =============================
  // UNDO DELETE STATE END
  // =============================

  // =============================
  // TAB STATE START
  // =============================

  activeTab: "active",

  // =============================
  // TAB STATE START
  // =============================
};

// =============================
// STATE INITIALIZATION LOGIC START
// =============================

export function initState() {
  const saved = loadFromStorage();

  if (saved) {
    state.habits = saved.habits || [];
  }

  renderHabits(getFilteredHabits());
  renderDashboard(state.habits);
  bindHabitEvents();

  console.log("App Initialized");
}

// =============================
// STATE INITIALIZATION LOGIC END
// =============================

// =============================
// FILTERED HABITS LOGIC START
// =============================

export function getFilteredHabits() {
  if (state.activeTab === "archived") {
    return state.habits.filter((h) => h.archived);
  }

  return state.habits.filter((h) => !h.archived);
}

// =============================
// FILTERED HABITS LOGIC END
// =============================

// =============================
// GLOBAL STATE END
// =============================
