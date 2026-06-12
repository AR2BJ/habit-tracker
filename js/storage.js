// =============================
// STORAGE LAYER START
// =============================

const STORAGE_KEY = "habit_tracker";

export function saveToStorage(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) return null;

  const data = JSON.parse(raw);

  data.habits = data.habits.map(migrateHabit);

  return data;
}

function migrateHabit(habit) {
  return {
    id: habit.id,
    name: habit.name,
    createdAt: habit.createdAt ?? new Date().toISOString(),
    archived: habit.archived ?? false,
    completedDates: habit.completedDates ?? [],
    stats: {
      bestStreak: habit.stats?.bestStreak ?? 0,
    },
  };
}

// =============================
// STORAGE LAYER END
// =============================
