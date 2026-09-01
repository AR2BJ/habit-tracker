import { HabitRules } from "./habit.rules";
import { formatDate } from "@/shared/utils/date.utils";

export const HabitLifecycle = {
  /**
   * Mark missing dates as skipped for each active habit
   * @param {Array} habits - Current habits (filtered for active)
   * @param {string} today - ISO date string (YYYY-MM-DD)
   * @returns {Object} { habits: updated, changes: number }
   */
  applyMissingDatePolicy(habits, today) {
    let totalChanges = 0;
    const updated = habits.map((habit) => {
      // Skip archived habits
      if (habit.archived) return habit;

      const skippedDates = new Set(habit.skippedDates || []);
      const completedDates = new Set(habit.completedDates || []);
      const allMarked = new Set([...skippedDates, ...completedDates]);

      let changed = false;
      let currentDate = new Date(today);
      const createdAt = new Date(habit.createdAt);

      // Walk backward from yesterday to createdAt
      currentDate.setDate(currentDate.getDate() - 1);

      while (currentDate >= createdAt) {
        const dateStr = formatDate(currentDate);

        if (!allMarked.has(dateStr)) {
          skippedDates.add(dateStr);
          changed = true;
          totalChanges++;
        }

        currentDate.setDate(currentDate.getDate() - 1);
      }

      if (changed) {
        return {
          ...habit,
          skippedDates: Array.from(skippedDates).sort(),
        };
      }
      return habit;
    });

    return { habits: updated, changes: totalChanges };
  },

  /**
   * Auto-archive habits that have been inactive for threshold days
   * @param {Array} habits - Current habits
   * @param {string} today - ISO date string (YYYY-MM-DD)
   * @param {number} threshold - Days of inactivity to trigger archive (default: 30)
   * @returns {Object} { habits: updated, archived: number }
   */
  applyAutoArchivePolicy(habits, today, threshold = 30) {
    let archivedCount = 0;
    const updated = habits.map((habit) => {
      if (HabitRules.shouldAutoArchive(habit, today, threshold)) {
        archivedCount++;
        return { ...habit, archived: true };
      }
      return habit;
    });

    return { habits: updated, archived: archivedCount };
  },
};
