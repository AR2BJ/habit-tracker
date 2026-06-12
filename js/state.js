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
};

// =============================
// STATE INITIALIZATION LOGIC START
// =============================

export function initState() {
  const saved = loadFromStorage();

  if (saved) {
    state.habits = saved.habits || [];
  }

  renderHabits(state.habits);
  renderDashboard(state.habits);
  bindHabitEvents();

  console.log("App Initialized");
}

// =============================
// STATE INITIALIZATION LOGIC END
// =============================

// =============================
// GLOBAL STATE END
// =============================
