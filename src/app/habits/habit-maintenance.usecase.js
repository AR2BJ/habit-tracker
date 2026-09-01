import { HabitApplication } from "./habit.application";
import { HabitLifecycle } from "@/domain/habits/habit.lifecycle";

export const HabitMaintenanceUseCase = {
  /**
   * Execute maintenance: mark missing dates as skipped
   * @param {string} today - ISO date string (YYYY-MM-DD)
   * @returns {Object} { changes: number, habits: Array }
   */
  applyMissingDatePolicy(today) {
    const habits = HabitApplication.getHabits();

    // Filter out archived habits
    const activeHabits = habits.filter((h) => !h.archived);

    // Apply domain policy
    const result = HabitLifecycle.applyMissingDatePolicy(activeHabits, today);

    // Merge with archived habits
    const archivedHabits = habits.filter((h) => h.archived);
    const allHabits = [...result.habits, ...archivedHabits];

    // Save if changes were made
    if (result.changes > 0) {
      HabitApplication.saveHabits(allHabits);
    }

    return {
      changes: result.changes,
      habits: allHabits,
    };
  },

  /**
   * Execute maintenance: auto-archive stale habits
   * @param {string} today - ISO date string (YYYY-MM-DD)
   * @param {number} threshold - Days of inactivity (default: 30)
   * @returns {Object} { archived: number, habits: Array }
   */
  applyAutoArchivePolicy(today, threshold = 30) {
    const habits = HabitApplication.getHabits();

    // Apply domain policy
    const result = HabitLifecycle.applyAutoArchivePolicy(
      habits,
      today,
      threshold,
    );

    // Save if changes were made
    if (result.archived > 0) {
      HabitApplication.saveHabits(result.habits);
    }

    return result;
  },

  /**
   * Run all maintenance tasks
   * @param {string} today - ISO date string (YYYY-MM-DD)
   * @returns {Object} { skipped: number, archived: number }
   */
  runAll(today) {
    // First, mark missing dates as skipped
    const skipResult = this.applyMissingDatePolicy(today);

    // Then, auto-archive stale habits
    const archiveResult = this.applyAutoArchivePolicy(today);

    return {
      skipped: skipResult.changes,
      archived: archiveResult.archived,
    };
  },
};
