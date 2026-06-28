import { AnalyticsAdapter } from "@/utils/analytics.adapter.js";
import { AnalyticsController } from "@/controllers/analytics.controller.js";
import ApexCharts from "apexcharts";
import { DashboardComponent } from "@/components/features/analytics/dashboard.component.js";

let heatmapChartInstance = null;
let barChartInstance = null;

const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function updateHeatmapChart(habits, tab) {
  if (!heatmapChartInstance) return;

  const newSeries = AnalyticsAdapter.generateHeatmapSeries(habits, tab);
  const isDark =
    document.documentElement.classList.contains("dark") ||
    localStorage.getItem("theme") === "dark";

  const allValues = newSeries.flatMap((s) => s.data.map((d) => d.y));
  let maxVal = Math.max(1, ...allValues);

  if (tab === "weekly") {
    maxVal = Math.max(maxVal, 4);
  }

  heatmapChartInstance.updateOptions(
    {
      chart: { height: tab === "monthly" ? 380 : 300 },
      plotOptions: {
        heatmap: {
          cellMargin: tab === "weekly" ? 12 : 6,
          colorScale: {
            ranges: AnalyticsAdapter.getColorRanges(tab, maxVal, isDark),
          },
        },
      },
      stroke: { width: tab === "weekly" ? 4 : 2 },
    },
    false,
    true,
    true,
  );

  heatmapChartInstance.updateSeries(newSeries);
}

export function updateTabStyles(tab) {
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
    btn.classList.remove("text-(--color-btn-primary-text)", "text-secondary");
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

export function renderAnalyticsCharts(habits, currentHeatmapView) {
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

  dashboard.innerHTML = DashboardComponent.render(habits);

  AnalyticsController.init();

  updateTabStyles(currentHeatmapView);

  const heatmapSeries = AnalyticsAdapter.generateHeatmapSeries(
    habits,
    currentHeatmapView,
  );
  const weekdayCounts = AnalyticsAdapter.generateWeekdayCounts(habits);

  const isDark =
    document.documentElement.classList.contains("dark") ||
    localStorage.getItem("theme") === "dark";
  const axisTextColor = isDark ? "#e5e7eb" : "#4b5563";

  const currentTabCounts = heatmapSeries.flatMap((s) => s.data.map((d) => d.y));
  let maxCommit = Math.max(1, ...currentTabCounts);
  if (currentHeatmapView === "weekly") {
    maxCommit = Math.max(maxCommit, 4);
  }

  const ranges = AnalyticsAdapter.getColorRanges(
    currentHeatmapView,
    maxCommit,
    isDark,
  );

  const heatmapOptions = {
    series: heatmapSeries,
    chart: {
      id: "lifetime-heatmap",
      type: "heatmap",
      height: currentHeatmapView === "monthly" ? 380 : 300,
      toolbar: { show: false },
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
        colorScale: { ranges },
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
        formatter: (val) => `${val} ticks`,
      },
    },
  };

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

  heatmapChartInstance = new ApexCharts(
    document.getElementById("apex-heatmap-chart"),
    heatmapOptions,
  );
  heatmapChartInstance.render();

  barChartInstance = new ApexCharts(
    document.getElementById("apex-weekday-chart"),
    barChartOptions,
  );
  barChartInstance.render();
}

export function renderAnalytics(habits) {
  renderAnalyticsCharts(habits, "weekly");
}
