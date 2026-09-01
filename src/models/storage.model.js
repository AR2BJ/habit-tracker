import { HabitRepository } from "@/infrastructure/persistence/habit.repository";

export function saveToStorage(data) {
  HabitRepository.save(data);
}

export function loadFromStorage() {
  const data = HabitRepository.load();
  return data;
}

export function migrateHabit(habit) {
  return HabitRepository.normalizeHabit(habit);
}
