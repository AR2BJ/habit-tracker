// =============================
// HABIT SERVICE START
// =============================

import { generateId } from "../utils/helpers.js";
import { saveToStorage } from "../storage.js";
import { state } from "../state.js";
import { todayISO } from "../utils/helpers.js";

export function createHabit(name) {
  // =============================
  // CREATE HABIT VALIDATION START
  // =============================

  const cleaned = name.trim().replace(/\s+/g, " ");

  if (!cleaned) return;

  // =============================
  // CREATE HABIT VALIDATION END
  // =============================

  // =============================
  // INPUT VALIDATION START
  // =============================

  if (cleaned.length < 2) {
    alert("Habit name must be at least 2 characters.");
    return;
  }

  if (cleaned.length > 20) {
    alert("Habit name must be less than 20 characters.");
    return;
  }

  // =============================
  // INPUT VALIDATION END
  // =============================

  // =============================
  // DUPLICATE PREVENTION START
  // =============================

  const alreadyExists = state.habits.some(
    (habit) => habit.name.toLowerCase() === cleaned.toLowerCase(),
  );

  if (alreadyExists) {
    alert("Habit already exists");
    return;
  }

  // =============================
  // DUPLICATE PREVENTION END
  // =============================

  const habit = {
    id: generateId(),
    name: cleaned,
    createdAt: new Date().toISOString(),
    archived: false,
    completedDates: [],
    stats: {
      bestStreak: 0,
    },
  };

  state.habits.push(habit);
  saveToStorage(state);
  return habit;
}

// =============================
// TOGGLE HABIT COMPLETION START
// =============================

export function toggleHabit(id) {
  const habit = state.habits.find((h) => h.id === id);
  if (!habit) return;

  const today = todayISO();
  const index = habit.completedDates.indexOf(today);

  if (index > -1) {
    habit.completedDates.splice(index, 1);
  } else {
    habit.completedDates.push(today);
  }

  saveToStorage(state);
}

// =============================
// TOGGLE HABIT COMPLETION END
// =============================

// =============================
// EDIT HABIT START
// =============================

export function editHabit(id, newName) {
  const habit = state.habits.find((h) => h.id === id);

  if (!habit) return;

  const cleaned = newName.trim().replace(/\s+/g, " ");

  // =============================
  // EDIT VALIDATION START
  // =============================

  if (cleaned.length < 2) {
    alert("Habit name must be at least 2 characters.");
    return;
  }

  if (cleaned.length > 20) {
    alert("Habit name must be less than 20 characters.");
    return;
  }

  // =============================
  // EDIT VALIDATION END
  // =============================

  const alreadyExists = state.habits.some(
    (h) => h.id !== id && h.name.toLowerCase() === cleaned.toLowerCase(),
  );

  if (alreadyExists) {
    alert("Habit already exists");
    return;
  }

  if (!cleaned) return;

  habit.name = cleaned;

  saveToStorage(state);
}

// =============================
// EDIT HABIT END
// =============================

// =============================
// DELETE HABIT START
// =============================

export function deleteHabit(id) {
  state.habits = state.habits.filter((h) => h.id !== id);
  saveToStorage(state);
}

// =============================
// DELETE HABIT END
// =============================

// =============================
// TOGGLE SPECIFIC DATE START
// =============================

export function toggleHabitDate(habitId, date) {
  const habit = state.habits.find((h) => h.id === habitId);

  if (!habit) return;

  const index = habit.completedDates.indexOf(date);

  if (index > -1) {
    habit.completedDates.splice(index, 1);
  } else {
    habit.completedDates.push(date);
  }

  saveToStorage(state);
}

// =============================
// TOGGLE SPECIFIC DATE END
// =============================

// =============================
// HABIT SERVICE END
// =============================
