import { formatDate } from "@/utils/helpers.js";

export const STORAGE_KEY = "habit_tracker";
export const STORAGE_VERSION = 4;

function migrateHabit(habit) {
  return {
    id: habit.id,
    name: habit.name,
    category: habit.category ?? "general",
    frequency: Number(habit.frequency ?? 7),
    createdAt: habit.createdAt ?? formatDate(new Date()),
    archived: habit.archived ?? false,
    completedDates: habit.completedDates ?? [],
    skippedDates: habit.skippedDates ?? [],
  };
}

function migrateData(data) {
  const version = data.version ?? 1;

  switch (version) {
    case 1:
      return {
        version: STORAGE_VERSION,

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
      habits: data,
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
