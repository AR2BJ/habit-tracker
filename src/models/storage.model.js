// =============================
// STORAGE LAYER START
// =============================

import { formatDate } from "../utils/helpers.js";

const STORAGE_KEY = "habit_tracker";
const STORAGE_VERSION = 4;

function migrateHabit(habit) {
  return {
    id: habit.id,
    name: habit.name,
    category: habit.category ?? "General",
    frequency: Number(habit.frequency ?? 7),
    createdAt: habit.createdAt ?? formatDate(new Date()),
    archived: habit.archived ?? false,
    completedDates: habit.completedDates ?? [],
    skippedDates: habit.skippedDates ?? [],
    stats: {
      bestStreak: habit.stats?.bestStreak ?? 0,
      allowedSkipsPerMonth: habit.stats?.allowedSkipsPerMonth ?? 3,
    },
  };
}

function migrateData(data) {
  const version = data.version ?? 1;

  switch (version) {
    case 1:
      return {
        version: 4,

        habits: (data.habits || []).map(migrateHabit),
      };

    default:
      return data;
  }
}

export function saveToStorage(data) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      version: STORAGE_VERSION,
      ...data,
    }),
  );
}

export function loadFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) return null;

  const data = JSON.parse(raw);

  const migrated = migrateData(data);

  return {
    ...migrated,

    habits: (migrated.habits || []).map(migrateHabit),
  };
}

// =============================
// STORAGE LAYER END
// =============================
