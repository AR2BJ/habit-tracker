import { formatDate } from "@/shared/utils/date.utils";

/**
 * SprintCalculator - Calculates sprint periods for habit tracking
 * Pure domain logic - no DOM dependencies
 */
export const SprintCalculator = {
  /**
   * Calculate the current sprint period for a habit
   * @param {string} createdAt - ISO date string of habit creation
   * @param {string} today - ISO date string of today
   * @returns {Object} { sprintIndex, sprintStart, sprintEnd }
   */
  calculateSprint(createdAt, today) {
    const created = new Date(createdAt);
    created.setHours(0, 0, 0, 0);

    const todayObj = new Date(today);
    todayObj.setHours(0, 0, 0, 0);

    const utcCreated = Date.UTC(
      created.getFullYear(),
      created.getMonth(),
      created.getDate(),
    );
    const utcToday = Date.UTC(
      todayObj.getFullYear(),
      todayObj.getMonth(),
      todayObj.getDate(),
    );
    const diffDaysFromStart = Math.floor((utcToday - utcCreated) / 86400000);

    let sprintIndex = 0;
    const sprintStart = new Date(created);

    if (diffDaysFromStart >= 60) {
      sprintIndex = Math.floor((diffDaysFromStart - 60) / 59) + 1;
      sprintStart.setDate(created.getDate() + 60 + (sprintIndex - 1) * 59 - 1);
    }

    const sprintEnd = new Date(sprintStart);
    sprintEnd.setDate(sprintStart.getDate() + 59);

    return {
      sprintIndex,
      sprintStart: formatDate(sprintStart),
      sprintEnd: formatDate(sprintEnd),
    };
  },

  /**
   * Generate days for a sprint period
   * @param {string} sprintStart - ISO date string of sprint start
   * @param {number} days - Number of days to generate (default: 60)
   * @returns {Array} Array of date strings
   */
  generateSprintDays(sprintStart, days = 60) {
    const start = new Date(sprintStart);
    const dates = [];
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      dates.push(formatDate(currentDate));
    }
    return dates;
  },

  /**
   * Get day status for a habit on a specific date
   * @param {Object} habit - Habit object
   * @param {string} date - ISO date string
   * @returns {string} 'completed' | 'skipped' | 'pending'
   */
  getDayStatus(habit, date) {
    if (habit.completedDates.includes(date)) return "completed";
    if ((habit.skippedDates || []).includes(date)) return "skipped";
    return "pending";
  },

  /**
   * Check if a date is editable (today or yesterday)
   * @param {string} date - ISO date string
   * @param {string} today - ISO date string of today
   * @returns {boolean}
   */
  isDateEditable(date, today) {
    const todayObj = new Date(today);
    todayObj.setHours(0, 0, 0, 0);
    const yesterdayObj = new Date(todayObj);
    yesterdayObj.setDate(yesterdayObj.getDate() - 1);

    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);

    return (
      dateObj.getTime() === todayObj.getTime() ||
      dateObj.getTime() === yesterdayObj.getTime()
    );
  },
};
