import {
  calculateStreak,
  calculateSuccessRate,
  formatDate,
} from "../../utils/helpers.js";

import ApexCharts from "apexcharts";
import { DashboardComponent } from "../../components/features/analytics/dashboard.component.js";
import { StateManager } from "../../models/state.model.js";

let heatmapChartInstance = null;
let barChartInstance = null;
let currentHeatmapView = "weekly";

const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

function generateHeatmapSeries(habits, view) {
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
    const startSunday = new Date(startDate);
    startSunday.setDate(startDate.getDate() - startSunday.getDay());

    const totalWeeksToShow = 12;

    return weekdayNames.map((dayName, dayIdx) => {
      const rowData = [];
      for (let w = 0; w < totalWeeksToShow; w++) {
        const currentTarget = new Date(startSunday);
        currentTarget.setDate(startSunday.getDate() + w * 7 + dayIdx);

        const isoStr = formatDate(currentTarget);
        const count =
          currentTarget < startDate || currentTarget > today
            ? 0
            : globalActivityMap[isoStr] || 0;
        const monthName = currentTarget.toLocaleString("en-US", {
          month: "short",
        });

        rowData.push({ x: `${monthName} W${w + 1}`, y: count });
      }
      return { name: dayName, data: rowData };
    });
  }

  if (view === "monthly") {
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
      let last = activeMonthsRange[activeMonthsRange.length - 1];
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
        let weeklyTicks = 0;
        let totalPossibleTicksInWeek = 0;
        const daysInMonth = getDaysInMonth(mInfo.year, mInfo.month);

        const startDay = weekIdx * 7 + 1;
        const endDay = Math.min(startDay + 6, daysInMonth);

        if (startDay <= daysInMonth) {
          for (let d = startDay; d <= endDay; d++) {
            const targetDate = new Date(mInfo.year, mInfo.month, d);
            if (targetDate >= startDate && targetDate <= today) {
              totalPossibleTicksInWeek += activeHabits.length;
              const isoStr = formatDate(targetDate);
              if (globalActivityMap[isoStr]) {
                weeklyTicks += globalActivityMap[isoStr];
              }
            }
          }
        }

        const monthlyDensityScore =
          totalPossibleTicksInWeek > 0
            ? Math.round((weeklyTicks / totalPossibleTicksInWeek) * 100)
            : 0;

        return {
          x: `${mInfo.name} ${mInfo.year}`,
          y: monthlyDensityScore,
        };
      });

      return { name: weekLabel, data: rowData };
    });
  }

  if (view === "yearly") {
    const startYear = startDate.getFullYear();
    const endYear = today.getFullYear();
    const yearsRange = [];
    for (let y = startYear; y <= endYear; y++) {
      yearsRange.push(y);
    }

    return yearsRange.map((year) => {
      const rowData = monthNames.map((monthName, mIdx) => {
        let monthlyTotalTicks = 0;
        let validDaysInTracking = 0;

        const daysInMonth = getDaysInMonth(year, mIdx);

        for (let d = 1; d <= daysInMonth; d++) {
          const targetDate = new Date(year, mIdx, d);
          if (targetDate >= startDate && targetDate <= today) {
            validDaysInTracking++;
            const isoStr = formatDate(targetDate);
            if (globalActivityMap[isoStr]) {
              monthlyTotalTicks += globalActivityMap[isoStr];
            }
          }
        }

        const densityScore =
          validDaysInTracking > 0
            ? Math.round((monthlyTotalTicks / validDaysInTracking) * 100)
            : 0;

        return {
          x: monthName,
          y: densityScore,
        };
      });

      return { name: String(year), data: rowData };
    });
  }

  return [];
}

function getColorRanges(view, maxVal, isDark) {
  if (view === "yearly") {
    return [
      { from: 0, to: 0, color: isDark ? "#1f2937" : "#e2e8f0", name: "none" },
      {
        from: 1,
        to: 16,
        color: isDark ? "#d1f7e0" : "#e6fbef",
        name: "very low",
      },
      { from: 17, to: 33, color: isDark ? "#9be9a8" : "#9be9a8", name: "low" },
      {
        from: 34,
        to: 50,
        color: isDark ? "#7bd48f" : "#7bd48f",
        name: "medium",
      },
      { from: 51, to: 67, color: isDark ? "#40c463" : "#40c463", name: "high" },
      {
        from: 68,
        to: 84,
        color: isDark ? "#22a25f" : "#22a25f",
        name: "very high",
      },
      { from: 85, to: 100, color: "#00bc7d", name: "extreme" },
    ];
  }

  if (view === "monthly") {
    const s = Math.max(1, Math.ceil(maxVal / 4));
    return [
      { from: 0, to: 0, color: isDark ? "#111827" : "#f3f4f6", name: "none" },
      { from: 1, to: s, color: isDark ? "#e6f7ee" : "#e6fbef", name: "low" },
      {
        from: s + 1,
        to: s * 2,
        color: isDark ? "#c8f0d1" : "#bff0cf",
        name: "medium",
      },
      {
        from: s * 2 + 1,
        to: s * 3,
        color: isDark ? "#7bd48f" : "#7bd48f",
        name: "high",
      },
      {
        from: s * 3 + 1,
        to: s * 4,
        color: isDark ? "#40c463" : "#40c463",
        name: "very high",
      },
      { from: s * 4 + 1, to: maxVal, color: "#00bc7d", name: "extreme" },
    ];
  }

  const st = Math.max(1, Math.floor(maxVal / 4));
  return [
    { from: 0, to: 0, color: isDark ? "#1f2937" : "#e2e8f0", name: "none" },
    {
      from: 1,
      to: maxVal,
      color: "#00bc7d",
      name: "default",
    },
  ];
}

function handleTabSwitch(tab) {
  if (tab === currentHeatmapView) return;
  currentHeatmapView = tab;

  updateTabStyles(tab);

  if (heatmapChartInstance) {
    const habits = StateManager.getHabits();
    const newSeries = generateHeatmapSeries(habits, tab);
    const isDark =
      document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark";

    const allValues = newSeries.flatMap((s) => s.data.map((d) => d.y));
    let maxVal = Math.max(1, ...allValues);

    // ensure weekly has a minimum dynamic range so colors appear stronger
    if (tab === "weekly") {
      maxVal = Math.max(maxVal, 4);
    }

    heatmapChartInstance.updateOptions(
      {
        chart: {
          height: tab === "monthly" ? 380 : 300,
        },
        plotOptions: {
          heatmap: {
            cellMargin: tab === "weekly" ? 12 : 6,
            colorScale: {
              ranges: getColorRanges(tab, maxVal, isDark),
            },
          },
        },
        stroke: {
          width: tab === "weekly" ? 4 : 2,
        },
      },
      false,
      true,
      true,
    );

    heatmapChartInstance.updateSeries(newSeries);
  }
}

function updateTabStyles(tab) {
  const indicator = document.getElementById("heatmap-tab-indicator");
  const btnWeekly = document.getElementById("view-btn-weekly");
  const btnMonthly = document.getElementById("view-btn-monthly");
  const btnYearly = document.getElementById("view-btn-yearly");

  if (!indicator || !btnWeekly || !btnMonthly || !btnYearly) return;

  indicator.classList.remove(
    "translate-x-0",
    "translate-x-27.5",
    "translate-x-54",
  );

  [btnWeekly, btnMonthly, btnYearly].forEach((btn) => {
    btn.classList.remove("text-(--color-btn-primary-text)");
    btn.classList.add("text-secondary");
  });

  if (tab === "weekly") {
    indicator.classList.add("translate-x-0");
    btnWeekly.classList.replace(
      "text-secondary",
      "text-(--color-btn-primary-text)",
    );
  } else if (tab === "monthly") {
    indicator.classList.add("translate-x-27.5");
    btnMonthly.classList.replace(
      "text-secondary",
      "text-(--color-btn-primary-text)",
    );
  } else if (tab === "yearly") {
    indicator.classList.add("translate-x-54");
    btnYearly.classList.replace(
      "text-secondary",
      "text-(--color-btn-primary-text)",
    );
  }
}

export function renderAnalytics(habits) {
  const dashboard = document.getElementById("dashboard");
  if (!dashboard) return;

  if (heatmapChartInstance) {
    heatmapChartInstance.destroy();
    heatmapChartInstance = null;
  }
  if (barChartInstance) {
    barChartInstance.destroy();
    barChartInstance = null;
  }

  const weekdayCounts = [0, 0, 0, 0, 0, 0, 0];

  habits.forEach((habit) => {
    habit.completedDates.forEach((dateStr) => {
      const dayIndex = new Date(dateStr).getDay();
      if (dayIndex >= 0 && dayIndex <= 6) weekdayCounts[dayIndex]++;
    });
  });

  const heatmapSeries = generateHeatmapSeries(habits, currentHeatmapView);

  dashboard.innerHTML = DashboardComponent.render(habits);

  updateTabStyles(currentHeatmapView);

  const switcher = document.getElementById("chart-view-switcher");
  if (switcher) {
    document
      .getElementById("view-btn-weekly")
      .addEventListener("click", () => handleTabSwitch("weekly"));
    document
      .getElementById("view-btn-monthly")
      .addEventListener("click", () => handleTabSwitch("monthly"));
    document
      .getElementById("view-btn-yearly")
      .addEventListener("click", () => handleTabSwitch("yearly"));
  }

  const isDark =
    document.documentElement.classList.contains("dark") ||
    localStorage.getItem("theme") === "dark";
  const axisTextColor = isDark ? "#e5e7eb" : "#4b5563";
  const currentTabCounts = heatmapSeries.flatMap((s) => s.data.map((d) => d.y));
  let maxCommit = Math.max(1, ...currentTabCounts);
  const step = maxCommit / 4;

  if (currentHeatmapView === "weekly") {
    maxCommit = Math.max(maxCommit, 4);
  }

  const ranges = getColorRanges(currentHeatmapView, maxCommit, isDark);

  const heatmapOptions = {
    series: heatmapSeries,
    chart: {
      id: "lifetime-heatmap",
      type: "heatmap",
      height: currentHeatmapView === "monthly" ? 380 : 300,
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
      animations: {
        enabled: true,
        speed: 300,
        animateGradually: { enabled: true },
      },
    },
    dataLabels: { enabled: false },
    plotOptions: {
      heatmap: {
        radius: 4,
        cellMargin: currentHeatmapView === "weekly" ? 12 : 6,
        colorScale: {
          ranges,
        },
      },
    },
    stroke: {
      show: true,
      width: currentHeatmapView === "weekly" ? 4 : 2,
      colors: [isDark ? "#222f47" : "#e2e8f0"],
    },
    xaxis: {
      type: "category",
      labels: {
        show: true,
        style: { colors: axisTextColor, fontSize: "11px", fontWeight: 600 },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: axisTextColor, fontSize: "12px", fontWeight: 700 },
        offsetX: -5,
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val) =>
          currentHeatmapView === "weekly" ? `${val} ticks` : `${val}% density`,
      },
    },
  };

  heatmapChartInstance = new ApexCharts(
    document.getElementById("apex-heatmap-chart"),
    heatmapOptions,
  );
  heatmapChartInstance.render();

  const barChartOptions = {
    series: [{ name: "Habits Completed", data: weekdayCounts }],
    chart: {
      id: "weekday-bar",
      type: "bar",
      height: 300,
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    colors: ["#00bc7d"],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: "55%",
        dataLabels: { position: "end" },
      },
    },
    dataLabels: {
      enabled: true,
      textAnchor: "end",
      offsetX: 10,
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        colors: [isDark ? "#e2e8f0" : "#222f47"],
      },
      formatter: (val) => val + " ticks",
    },
    xaxis: {
      categories: weekdayNames,
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: axisTextColor, fontSize: "13px", fontWeight: 700 },
      },
    },
    grid: {
      show: true,
      borderColor: isDark ? "#e5e7eb" : "#111827",
      strokeDashArray: 4,
    },
    tooltip: { theme: isDark ? "dark" : "light" },
  };

  barChartInstance = new ApexCharts(
    document.getElementById("apex-weekday-chart"),
    barChartOptions,
  );
  barChartInstance.render();

  if (window.currentThemeListener) {
    document.removeEventListener("themeChanged", window.currentThemeListener);
  }
  window.currentThemeListener = () => {
    renderDashboard(habits);
  };
  document.addEventListener("themeChanged", window.currentThemeListener);
}
