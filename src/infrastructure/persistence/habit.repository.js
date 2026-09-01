import {
  LocalStorageAdapter,
  STORAGE_KEY,
  STORAGE_VERSION,
} from "./local-storage.adapter";

import { todayISO } from "@/shared/utils/date.utils";

export const HabitRepository = {
  load() {
    const data = LocalStorageAdapter.getItem(STORAGE_KEY);
    if (!data) return null;
    return this.migrate(data);
  },

  save(habits) {
    // Save to storage
    LocalStorageAdapter.setItem(STORAGE_KEY, {
      version: STORAGE_VERSION,
      habits: habits,
    });

    // Dispatch custom event for same-tab listeners
    // This is for cases where storage changes but doesn't trigger 'storage' event
    window.dispatchEvent(
      new CustomEvent("local-storage-update", {
        detail: {
          key: STORAGE_KEY,
          habits: habits,
          timestamp: Date.now(),
        },
      }),
    );
  },

  clear() {
    LocalStorageAdapter.removeItem(STORAGE_KEY);

    window.dispatchEvent(
      new CustomEvent("local-storage-update", {
        detail: {
          key: STORAGE_KEY,
          habits: [],
          timestamp: Date.now(),
        },
      }),
    );
  },

  migrate(data) {
    const version = data.version ?? 1;

    switch (version) {
      case 1:
        return {
          version: STORAGE_VERSION,
          habits: (data.habits || []).map(this.normalizeHabit),
        };
      default:
        return data;
    }
  },

  normalizeHabit(habit) {
    return {
      id: habit.id,
      name: habit.name,
      category: habit.category ?? "general",
      frequency: Number(habit.frequency ?? 7),
      createdAt: habit.createdAt ?? todayISO(),
      archived: habit.archived ?? false,
      completedDates: habit.completedDates ?? [],
      skippedDates: habit.skippedDates ?? [],
    };
  },
};
