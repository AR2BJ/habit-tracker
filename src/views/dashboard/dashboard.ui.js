import {
  calculateStreak,
  calculateSuccessRate,
  formatDate,
} from "../../utils/helpers.js";

import ApexCharts from "apexcharts";

let heatmapChartInstance = null;
let barChartInstance = null;

export function renderDashboard(habits) {
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

  const todayStr = formatDate(new Date());
  const totalHabits = habits.length;

  const completedToday = habits.filter((habit) =>
    habit.completedDates.includes(todayStr),
  ).length;

  const bestStreak = habits.length
    ? Math.max(
        0,
        ...habits.map((habit) => calculateStreak(habit.completedDates).best),
      )
    : 0;

  const averageSuccessRate = habits.length
    ? Math.round(
        habits.reduce((sum, habit) => sum + calculateSuccessRate(habit), 0) /
          habits.length,
      )
    : 0;

  const archivedCount = habits.filter((habit) => habit.archived).length;
  const activeHabits = habits.filter((h) => !h.archived);

  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekdayCounts = [0, 0, 0, 0, 0, 0, 0];

  habits.forEach((habit) => {
    habit.completedDates.forEach((dateStr) => {
      const dayIndex = new Date(dateStr).getDay();
      if (dayIndex >= 0 && dayIndex <= 6) {
        weekdayCounts[dayIndex]++;
      }
    });
  });

  const totalWeeksToShow = 18;
  const globalActivityMap = {};
  habits.forEach((h) => {
    h.completedDates.forEach((d) => {
      globalActivityMap[d] = (globalActivityMap[d] || 0) + 1;
    });
  });

  const heatmapSeries = weekdayNames.map((dayName, dayIdx) => {
    const rowData = [];
    const today = new Date();

    for (let w = totalWeeksToShow - 1; w >= 0; w--) {
      const targetDate = new Date();
      targetDate.setDate(
        today.getDate() - (w * 7 + ((today.getDay() - dayIdx + 7) % 7)),
      );

      const isoStr = formatDate(targetDate);
      const count = globalActivityMap[isoStr] || 0;
      const monthName = targetDate.toLocaleString("en-US", { month: "short" });

      rowData.push({
        x: `${monthName} W${totalWeeksToShow - w}`,
        y: count,
      });
    }
    return {
      name: dayName,
      data: rowData,
    };
  });

  dashboard.innerHTML = `
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full col-span-full">
      <div class="bg-surface border border-border hover:-translate-y-1 hover:border-brand/30 rounded-3xl p-6 transition shadow-sm flex flex-col justify-between min-h-36">
        <div class="flex items-center justify-between gap-2 text-secondary">
          <span class="text-sm font-bold tracking-wide truncate">Total Habits</span>
          <i class="fa-regular fa-layer-group text-6xl opacity-70 text-sky-500"></i>
        </div>
        <div class="text-4xl font-extrabold tracking-tight text-primary mt-3">${totalHabits}</div>
      </div>

      <div class="bg-surface border border-border hover:-translate-y-1 hover:border-brand/30 rounded-3xl p-6 transition shadow-sm flex flex-col justify-between min-h-36">
        <div class="flex items-center justify-between gap-2 text-secondary">
          <span class="text-sm font-bold tracking-wide truncate">Completed Today</span>
          <i class="fa-regular fa-circle-check text-6xl opacity-70 text-emerald-500"></i>
        </div>
        <div class="text-4xl font-extrabold tracking-tight text-primary mt-3">${completedToday}</div>
      </div>

      <div class="bg-surface border border-border hover:-translate-y-1 hover:border-brand/30 rounded-3xl p-6 transition shadow-sm flex flex-col justify-between min-h-36">
        <div class="flex items-center justify-between gap-2 text-secondary">
          <span class="text-sm font-bold tracking-wide truncate">Best Streak</span>
          <i class="fa-regular fa-fire text-6xl text-orange-500 opacity-70"></i>
        </div>
        <div class="text-4xl font-extrabold tracking-tight text-primary mt-3">
          ${bestStreak}<span class="text-sm font-bold text-secondary ml-1">days</span>
        </div>
      </div>

      <div class="bg-surface border border-border hover:-translate-y-1 hover:border-brand/30 rounded-3xl p-6 transition shadow-sm flex flex-col justify-between min-h-36">
        <div class="flex items-center justify-between gap-2 text-secondary">
          <span class="text-sm font-bold tracking-wide truncate">Avg Success</span>
          <i class="fa-regular fa-chart-line text-6xl text-brand opacity-70"></i>
        </div>
        <div class="text-4xl font-extrabold tracking-tight text-primary mt-3">${averageSuccessRate}%</div>
      </div>

      <div class="col-span-2 md:col-span-4 lg:col-span-1 bg-surface border border-border hover:-translate-y-1 hover:border-brand/30 rounded-3xl p-6 transition shadow-sm flex flex-col justify-between min-h-36">
        <div class="flex items-center justify-between gap-2 text-secondary">
          <span class="text-sm font-bold tracking-wide truncate">Archived</span>
          <i class="fa-regular fa-box-archive text-6xl opacity-70"></i>
        </div>
        <div class="text-4xl font-extrabold tracking-tight text-primary mt-3">${archivedCount}</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full col-span-full mt-6">
      <div class="lg:col-span-2 bg-surface border border-border rounded-3xl p-6 flex flex-col justify-between shadow-sm">
        <div>
          <h4 class="text-lg font-bold text-primary flex items-center gap-2">
            <i class="fa-regular fa-calendar text-brand text-2xl"></i> Lifetime Activity Grid
          </h4>
          <p class="text-sm text-secondary mt-1">Automated execution heat map driven by global system commits.</p>
        </div>
        <div id="apex-heatmap-chart" class="w-full mt-6"></div>
      </div>

      <div class="bg-surface border border-border rounded-3xl p-6 flex flex-col justify-between shadow-sm">
        <div>
          <h4 class="text-lg font-bold text-primary flex items-center gap-2">
            <i class="fa-regular fa-chart-simple text-amber-500 text-2xl"></i> Weekday Distribution
          </h4>
          <p class="text-sm text-secondary mt-1">Analysis of your execution behavior mapped by day of the week.</p>
        </div>
        <div id="apex-weekday-chart" class="w-full"></div>
      </div>
    </div>

    <div class="w-full col-span-full mt-8 space-y-4">
      <h3 class="text-xl font-bold text-primary tracking-tight flex items-center gap-2">
        <i class="fa-regular fa-layer-group text-brand text-3xl"></i> Individual All-Time Analytics
      </h3>
      <div class="grid grid-cols-1 gap-4">
        ${
          activeHabits.length === 0
            ? `<div class="text-center py-12 text-secondary text-base bg-surface rounded-3xl border border-dashed border-border flex flex-col items-center justify-center gap-2">
                <i class="fa-regular fa-box-open text-2xl opacity-40"></i>
                <span>No active habits to review.</span>
               </div>`
            : activeHabits
                .map((habit) => {
                  const stats = calculateStreak(habit.completedDates);
                  const totalChecks = habit.completedDates.length;
                  const lifetimeRate = calculateSuccessRate(habit);

                  let batteryColor = "bg-red-500";
                  let batteryText = "At Risk";
                  let badgeStyle =
                    "border-red-500/20 bg-red-500/5 text-red-500";

                  if (lifetimeRate >= 75) {
                    batteryColor = "bg-emerald-500";
                    batteryText = "Solidified";
                    badgeStyle =
                      "border-emerald-500/20 bg-emerald-500/5 text-emerald-500";
                  } else if (lifetimeRate >= 45) {
                    batteryColor = "bg-amber-500";
                    batteryText = "Stabilizing";
                    badgeStyle =
                      "border-amber-500/20 bg-amber-500/5 text-amber-500";
                  }

                  return `
                    <div class="bg-surface border border-border rounded-3xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-md transition duration-200">
                      <div>
                        <h4 class="text-lg font-bold text-primary">${habit.name}</h4>
                        <p class="text-sm text-secondary mt-1"><i class="fa-regular fa-clock text-xs"></i> Since: ${habit.createdAt}</p>
                      </div>

                      <div class="grid grid-cols-3 gap-6 text-center bg-surface-2/40 border border-border/50 px-6 py-3 rounded-2xl w-full lg:w-auto">
                        <div>
                          <div class="text-[11px] uppercase font-bold text-secondary tracking-wider">Ticks</div>
                          <div class="text-lg font-extrabold text-primary mt-1">${totalChecks}</div>
                        </div>
                        <div>
                          <div class="text-[11px] uppercase font-bold text-secondary tracking-wider">Streak</div>
                          <div class="text-lg font-extrabold text-amber-500 mt-1">${stats.best}d</div>
                        </div>
                        <div>
                          <div class="text-[11px] uppercase font-bold text-secondary tracking-wider">Success</div>
                          <div class="text-lg font-extrabold text-brand mt-1">${lifetimeRate}%</div>
                        </div>
                      </div>

                      <div class="w-full lg:w-48 flex items-center justify-between gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-border/50">
                        <div class="w-full space-y-1.5">
                          <div class="flex justify-between items-center text-xs">
                            <span class="text-secondary font-medium">Stability</span>
                            <span class="font-bold text-primary">${lifetimeRate}%</span>
                          </div>
                          <div class="w-full h-2 bg-surface-3 rounded-full overflow-hidden">
                            <div class="${batteryColor} h-full rounded-full transition-all duration-500" style="width: ${lifetimeRate}%"></div>
                          </div>
                        </div>
                        <span class="text-xs font-bold px-3 py-1 rounded-xl border ${badgeStyle} whitespace-nowrap self-end lg:self-center">
                          ${batteryText}
                        </span>
                      </div>
                    </div>
                  `;
                })
                .join("")
        }
      </div>
    </div>
  `;

  const isDark =
    document.documentElement.classList.contains("dark") ||
    localStorage.getItem("theme") === "dark";
  const axisTextColor = isDark ? "#9ca3af" : "#4b5563";

  const heatmapOptions = {
    series: heatmapSeries,
    chart: {
      id: "lifetime-heatmap",
      type: "heatmap",
      height: 300,
      toolbar: { show: true },
      fontFamily: "inherit",
    },
    dataLabels: { enabled: false },
    colors: ["#00bc7d"],
    plotOptions: {
      heatmap: {
        radius: 5,
        cellMargin: 12,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 0,
              color: isDark ? "#1f2937" : "#e2e8f0",
              name: "none",
            },
            {
              from: 1,
              to: 99,
              color: "#00bc7d",
              name: "completed",
            },
          ],
        },
      },
    },
    stroke: {
      show: true,
      width: 4,
      colors: [isDark ? "#161f30" : "#ffffff"],
    },
    xaxis: {
      type: "category",
      labels: {
        show: true,
        style: { colors: axisTextColor, fontSize: "12px", fontWeight: 600 },
        offsetY: 5,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: axisTextColor, fontSize: "13px", fontWeight: 700 },
        offsetX: -5,
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: function (val) {
          return val + " habits completed";
        },
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
      toolbar: { show: true },
      fontFamily: "inherit",
    },
    colors: ["#00bc7d"],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: "55%",
        dataLabels: { position: "end" },
        distributed: false,
      },
    },
    dataLabels: {
      enabled: true,
      textAnchor: "end",
      offsetX: 10,
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        colors: [isDark ? "#ffffff" : "#1f2937"],
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
      borderColor: isDark ? "#374151" : "#e5e7eb",
      strokeDashArray: 4,
    },
    tooltip: { theme: isDark ? "dark" : "light" },
  };

  const barChart = new ApexCharts(
    document.getElementById("apex-weekday-chart"),
    barChartOptions,
  );
  barChart.render();

  if (window.currentThemeListener) {
    document.removeEventListener("themeChanged", window.currentThemeListener);
  }

  window.currentThemeListener = () => {
    renderDashboard(habits);
  };

  document.addEventListener("themeChanged", window.currentThemeListener);
}
