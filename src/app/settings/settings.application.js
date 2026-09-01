import { HabitApplication } from "@/app/habits/habit.application";
import { STORAGE_KEY } from "@/infrastructure/persistence/local-storage.adapter";

const AUTO_ARCHIVE_KEY = "sett_auto_archive";

export const SettingsApplication = {
  /**
   * Get auto-archive setting
   */
  getAutoArchiveEnabled() {
    return localStorage.getItem(AUTO_ARCHIVE_KEY) === "true";
  },

  /**
   * Set auto-archive setting
   */
  setAutoArchiveEnabled(enabled) {
    localStorage.setItem(AUTO_ARCHIVE_KEY, enabled ? "true" : "false");
  },

  /**
   * Toggle auto-archive setting
   */
  toggleAutoArchive() {
    const current = this.getAutoArchiveEnabled();
    const next = !current;
    this.setAutoArchiveEnabled(next);
    return next;
  },

  /**
   * Reset all data
   * @returns {Object} { previousData, previousHabits } for undo
   */
  reset() {
    const previousData = localStorage.getItem(STORAGE_KEY);
    const previousHabits = HabitApplication.getHabits().map((h) => ({ ...h }));

    localStorage.removeItem(STORAGE_KEY);
    HabitApplication.saveHabits([]);

    return { previousData, previousHabits };
  },

  /**
   * Undo reset
   */
  undoReset(snapshot) {
    if (snapshot.previousData) {
      localStorage.setItem(STORAGE_KEY, snapshot.previousData);
    }
    if (snapshot.previousHabits) {
      HabitApplication.saveHabits(snapshot.previousHabits);
    }
  },
};
