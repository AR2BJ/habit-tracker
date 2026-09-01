import { formatDate } from "@/shared/utils/date.utils";

const weekdayNames = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * AnalyticsCalculator - Pure domain logic for analytics calculations
 * No browser dependencies, no ApexCharts, no DOM
 */
export const AnalyticsCalculator = {
  /**
   * Generate heatmap series data for charts
   * @param {Array} habits - Array of habit objects
   * @param {string} view - 'weekly' | 'monthly' | 'yearly'
   * @returns {Array} Series data for heatmap
   */
  generateHeatmapSeries(habits = [], view = "weekly") {
    const activeHabits = habits.filter((h) => !h.archived);

    let startDate = new Date();
    if (activeHabits.length > 0) {
      const creationDates = activeHabits.map((h) =>
        new Date(h.createdAt).getTime(),
      );
      startDate = new Date(Math.min(...creationDates));
    } else {
      startDate.setDate(startDate.getDate() - 120);
    }
    startDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const globalActivityMap = {};
    habits.forEach((h) => {
      h.completedDates.forEach((d) => {
        globalActivityMap[d] = (globalActivityMap[d] || 0) + 1;
      });
    });

    if (view === "weekly") {
      return this._generateWeeklyHeatmap(startDate, today, globalActivityMap);
    }

    if (view === "monthly") {
      return this._generateMonthlyHeatmap(
        startDate,
        today,
        globalActivityMap,
        activeHabits,
      );
    }

    if (view === "yearly") {
      return this._generateYearlyHeatmap(startDate, today, globalActivityMap);
    }

    return [];
  },

  _generateWeeklyHeatmap(startDate, today, activityMap) {
    const startSaturday = new Date(startDate);
    const dayOfWeek = startSaturday.getDay();
    const offsetToSaturday = (dayOfWeek + 1) % 7;
    startSaturday.setDate(startDate.getDate() - offsetToSaturday);

    const totalWeeksToShow = 12;

    return weekdayNames.map((dayName, dayIdx) => {
      const rowData = [];
      for (let w = 0; w < totalWeeksToShow; w++) {
        const currentTarget = new Date(startSaturday);
        currentTarget.setDate(startSaturday.getDate() + w * 7 + dayIdx);

        const isoStr = formatDate(currentTarget);
        const count =
          currentTarget < startDate || currentTarget > today
            ? 0
            : activityMap[isoStr] || 0;

        const monthName = currentTarget.toLocaleString("en-US", {
          month: "short",
        });

        rowData.push({ x: `${monthName} W${w + 1}`, y: count });
      }
      return { name: dayName, data: rowData };
    });
  },

  _generateMonthlyHeatmap(startDate, today, activityMap, activeHabits) {
    const startMonth = startDate.getMonth();
    const startYear = startDate.getFullYear();
    const endMonth = today.getMonth();
    const endYear = today.getFullYear();

    const activeMonthsRange = [];
    let curY = startYear;
    let curM = startMonth;

    while (curY < endYear || (curY === endYear && curM <= endMonth)) {
      activeMonthsRange.push({
        year: curY,
        month: curM,
        name: monthNames[curM],
      });
      curM++;
      if (curM > 11) {
        curM = 0;
        curY++;
      }
    }

    while (activeMonthsRange.length < 7) {
      const last = activeMonthsRange[activeMonthsRange.length - 1];
      let nextM = last.month + 1;
      let nextY = last.year;
      if (nextM > 11) {
        nextM = 0;
        nextY++;
      }
      activeMonthsRange.push({
        year: nextY,
        month: nextM,
        name: monthNames[nextM],
      });
    }

    const weekLabels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];

    return weekLabels.map((weekLabel, weekIdx) => {
      const rowData = activeMonthsRange.map((mInfo) => {
        let weeklyChecks = 0;
        const daysInMonth = getDaysInMonth(mInfo.year, mInfo.month);
        const startDay = weekIdx * 7 + 1;
        const endDay = Math.min(startDay + 6, daysInMonth);

        if (startDay <= daysInMonth) {
          for (let d = startDay; d <= endDay; d++) {
            const targetDate = new Date(mInfo.year, mInfo.month, d);
            if (targetDate >= startDate && targetDate <= today) {
              const isoStr = formatDate(targetDate);
              if (activityMap[isoStr]) {
                weeklyChecks += activityMap[isoStr];
              }
            }
          }
        }

        return { x: `${mInfo.name} ${mInfo.year}`, y: weeklyChecks };
      });

      return { name: weekLabel, data: rowData };
    });
  },

  _generateYearlyHeatmap(startDate, today, activityMap) {
    const startYear = startDate.getFullYear();
    const endYear = today.getFullYear();
    const yearsRange = [];
    for (let y = startYear; y <= endYear; y++) {
      yearsRange.push(y);
    }

    return yearsRange.map((year) => {
      const rowData = monthNames.map((monthName, mIdx) => {
        let monthlyTotalChecks = 0;
        const daysInMonth = getDaysInMonth(year, mIdx);

        for (let d = 1; d <= daysInMonth; d++) {
          const targetDate = new Date(year, mIdx, d);
          if (targetDate >= startDate && targetDate <= today) {
            const isoStr = formatDate(targetDate);
            if (activityMap[isoStr]) {
              monthlyTotalChecks += activityMap[isoStr];
            }
          }
        }

        return { x: monthName, y: monthlyTotalChecks };
      });

      return { name: String(year), data: rowData };
    });
  },

  /**
   * Generate weekday completion counts
   * @param {Array} habits - Array of habit objects
   * @returns {Array} Array of 7 numbers (Sat-Fri)
   */
  generateWeekdayCounts(habits) {
    const weekdayCounts = Array(7).fill(0);

    habits.forEach((habit) => {
      habit.completedDates.forEach((dateStr) => {
        const dayIndex = new Date(dateStr).getDay();
        const shiftedIndex = (dayIndex + 1) % 7;
        if (shiftedIndex >= 0 && shiftedIndex <= 6) {
          weekdayCounts[shiftedIndex]++;
        }
      });
    });

    return weekdayCounts;
  },

  /**
   * Get color ranges for heatmap
   * @param {string} view - 'weekly' | 'monthly' | 'yearly'
   * @param {number} maxVal - Maximum value for scaling
   * @param {boolean} isDark - Whether dark mode is active
   * @returns {Array} Color range configurations
   */
  getColorRanges(view, maxVal, isDark) {
    if (view === "yearly") {
      return [
        { from: 0, to: 0, color: isDark ? "#1f2937" : "#e2e8f0", name: "none" },
        {
          from: 1,
          to: 16,
          color: isDark ? "#c5fada" : "#dcfae9",
          name: "very low",
        },
        { from: 17, to: 33, color: "#9be9a8", name: "low" },
        { from: 34, to: 50, color: "#7bd48f", name: "medium" },
        { from: 51, to: 67, color: "#40c463", name: "high" },
        { from: 68, to: 84, color: "#22a25f", name: "very high" },
        { from: 85, to: maxVal, color: "#00bc7d", name: "extreme" },
      ];
    }

    if (view === "monthly") {
      const s = Math.max(1, Math.ceil(maxVal / 4));
      return [
        { from: 0, to: 0, color: isDark ? "#111827" : "#f3f4f6", name: "none" },
        { from: 1, to: s, color: isDark ? "#c5fada" : "#dcfae9", name: "low" },
        {
          from: s + 1,
          to: s * 2,
          color: isDark ? "#c8f0d1" : "#bff0cf",
          name: "medium",
        },
        { from: s * 2 + 1, to: s * 3, color: "#7bd48f", name: "high" },
        { from: s * 3 + 1, to: s * 4, color: "#40c463", name: "very high" },
        { from: s * 4 + 1, to: maxVal, color: "#00bc7d", name: "extreme" },
      ];
    }

    // Weekly (default)
    return [
      { from: 0, to: 0, color: isDark ? "#1f2937" : "#e2e8f0", name: "none" },
      { from: 1, to: maxVal, color: "#00bc7d", name: "completed" },
    ];
  },

  /**
   * Calculate max value from series data
   */
  getMaxValue(series) {
    let max = 0;
    series.forEach((s) => {
      s.data.forEach((d) => {
        if (d.y > max) max = d.y;
      });
    });
    return max;
  },
};
