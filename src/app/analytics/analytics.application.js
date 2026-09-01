import { AnalyticsCalculator } from "@/domain/analytics/analytics.calculator";
import { HabitApplication } from "@/app/habits/habit.application";

export const AnalyticsApplication = {
  /**
   * Get analytics data for charts
   * @param {string} view - 'weekly' | 'monthly' | 'yearly'
   * @param {boolean} isDark - Whether dark mode is active
   * @returns {Object} Analytics data
   */
  getAnalyticsData(view = "weekly", isDark = false, habits = null) {
    const allHabits = habits || HabitApplication.getHabits();

    const series = AnalyticsCalculator.generateHeatmapSeries(allHabits, view);
    const weekdayCounts = AnalyticsCalculator.generateWeekdayCounts(allHabits);
    const maxVal = AnalyticsCalculator.getMaxValue(series);
    const colorRanges = AnalyticsCalculator.getColorRanges(
      view,
      maxVal,
      isDark,
    );

    return {
      habits: allHabits,
      series,
      weekdayCounts,
      colorRanges,
      maxVal,
      view,
      isDark,
    };
  },

  /**
   * Update analytics data for a specific view
   */
  getHeatmapData(view, isDark) {
    return this.getAnalyticsData(view, isDark);
  },
};
