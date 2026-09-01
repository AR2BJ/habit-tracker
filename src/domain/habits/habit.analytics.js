import { daysBetween, formatDate, todayISO } from "@/shared/utils/date.utils";

export const HabitAnalytics = {
  /**
   * Get weekly completion count
   */
  getWeeklyCompletionCount(completedDates = []) {
    if (!completedDates || !Array.isArray(completedDates)) return 0;

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const todayISOStr = formatDate(today);
    const sevenDaysAgoISOStr = formatDate(sevenDaysAgo);

    return completedDates.filter((dateStr) => {
      return dateStr >= sevenDaysAgoISOStr && dateStr <= todayISOStr;
    }).length;
  },

  /**
   * Calculate current and best streak for a habit
   */
  calculateStreak(completedDates = [], skippedDates = []) {
    if (!completedDates.length) return { current: 0, best: 0 };

    const sortedCompletes = [...completedDates].sort();
    const dateSet = new Set(sortedCompletes);
    const skipSet = new Set(skippedDates || []);
    const today = todayISO();

    let current = 0;
    let best = 0;

    let cursor = new Date(today);

    if (!dateSet.has(today) && !skipSet.has(today)) {
      cursor.setDate(cursor.getDate() - 1);
    }

    while (true) {
      const iso = formatDate(cursor);

      if (dateSet.has(iso)) {
        current++;
        cursor.setDate(cursor.getDate() - 1);
      } else if (skipSet.has(iso)) {
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }

    const allTimelineDates = Array.from(
      new Set([...completedDates, ...skippedDates]),
    ).sort();

    let temp = 0;
    for (let i = 0; i < allTimelineDates.length; i++) {
      const currentDate = new Date(allTimelineDates[i]);
      const isoCheck = formatDate(currentDate);

      if (!dateSet.has(isoCheck)) continue;

      temp = 1;
      let nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);

      while (true) {
        const nextIso = formatDate(nextDate);
        if (dateSet.has(nextIso)) {
          temp++;
          nextDate.setDate(nextDate.getDate() + 1);
        } else if (skipSet.has(nextIso)) {
          nextDate.setDate(nextDate.getDate() + 1);
        } else {
          break;
        }
      }

      if (temp > best) best = temp;
    }

    return { current, best };
  },

  /**
   * Calculate success rate for a habit
   */
  calculateSuccessRate(habit) {
    const completedDates = Array.isArray(habit?.completedDates)
      ? habit.completedDates
      : [];
    const createdAt = new Date(habit?.createdAt);

    if (Number.isNaN(createdAt.getTime())) return 0;

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const diffDays =
      Math.floor((today - createdAt) / (1000 * 60 * 60 * 24)) + 1;

    if (diffDays <= 0) return 0;

    const validCompletedDates = completedDates.filter((dateStr) => {
      const date = new Date(dateStr);
      return (
        !Number.isNaN(date.getTime()) && date >= createdAt && date <= today
      );
    });

    const successRate = Math.round(
      (validCompletedDates.length / diffDays) * 100,
    );

    return Math.min(100, Math.max(0, successRate));
  },

  /**
   * Get all activity dates for a habit (completed + skipped)
   */
  getAllActivityDates(habit) {
    const completed = habit.completedDates || [];
    const skipped = habit.skippedDates || [];
    return Array.from(new Set([...completed, ...skipped])).sort();
  },

  /**
   * Get activity count by month
   */
  getActivityCountByMonth(habit, year, month) {
    const allDates = this.getAllActivityDates(habit);
    const monthStr = `${year}-${String(month).padStart(2, "0")}`;
    return allDates.filter((date) => date.startsWith(monthStr)).length;
  },

  /**
   * Get completion rate for a specific period
   */
  getCompletionRate(habit, startDate, endDate) {
    const completed = habit.completedDates || [];
    const totalDays = daysBetween(startDate, endDate) + 1;
    if (totalDays <= 0) return 0;

    const completedInRange = completed.filter(
      (date) => date >= startDate && date <= endDate,
    ).length;

    return Math.round((completedInRange / totalDays) * 100);
  },
};
