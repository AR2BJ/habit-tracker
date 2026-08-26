import ApexCharts from "apexcharts";
import { DashboardComponent } from "@/components/features/analytics/dashboard.component";

let heatmapChartInstance = null;
let barChartInstance = null;
let resizeListenerAttached = false;
let activeHeatmapTab = "weekly";

const weekdayNames = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

/**
 * Get heatmap options from data (pure function)
 */
function getHeatmapOptions(data, isDark) {
  const { series, colorRanges, view } = data;
  const axisTextColor = isDark ? "#e5e7eb" : "#4b5563";

  return {
    series: series,
    chart: {
      id: "lifetime-heatmap",
      type: "heatmap",
      height: 400,
      toolbar: { show: false },
      fontFamily: "inherit",
      animations: {
        enabled: true,
        speed: 250,
      },
    },
    dataLabels: { enabled: false },
    plotOptions: {
      heatmap: {
        radius: view === "weekly" ? 4 : 2,
        cellMargin: view === "weekly" ? 8 : view === "monthly" ? 4 : 2,
        colorScale: { ranges: colorRanges },
      },
    },
    stroke: {
      show: true,
      width: view === "weekly" ? 3 : view === "monthly" ? 2 : 1,
      colors: [isDark ? "#222f47" : "#e2e8f0"],
    },
    xaxis: {
      type: "category",
      labels: {
        show: true,
        style: {
          colors: axisTextColor,
          fontSize: view === "weekly" ? "11px" : "10px",
          fontWeight: 600,
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: axisTextColor,
          fontSize: view === "weekly" ? "11px" : "10px",
          fontWeight: 700,
        },
        offsetX: -5,
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val) => `${val} activity checks`,
      },
    },
  };
}

/**
 * Get bar chart options
 */
function getBarChartOptions(weekdayCounts, isDark) {
  const axisTextColor = isDark ? "#e5e7eb" : "#4b5563";

  return {
    series: [{ name: "Habits Completed", data: weekdayCounts }],
    chart: {
      id: "weekday-bar",
      type: "bar",
      height: 400,
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    colors: ["#00bc7d"],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: "50%",
        dataLabels: { position: "end" },
      },
    },
    dataLabels: {
      enabled: true,
      textAnchor: "end",
      colors: [isDark ? "#e2e8f0" : "#222f47"],
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        colors: [axisTextColor],
      },
      formatter: (val) => val + " checks",
    },
    xaxis: {
      categories: weekdayNames,
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: axisTextColor, fontSize: "12px", fontWeight: 700 },
      },
    },
    grid: {
      show: true,
      borderColor: isDark ? "#e5e7eb" : "#bfcbd9",
      strokeDashArray: 4,
    },
    tooltip: { theme: isDark ? "dark" : "light" },
  };
}

/**
 * Render empty state for charts
 */
function renderEmptyState(chartEl, title, icon, subtitle) {
  if (!chartEl) return;

  chartEl.innerHTML = `
    <div
      class="empty-state-box flex w-full h-full min-h-60 items-center justify-center rounded-2xl border border-dashed border-border/80 bg-surface-2 p-6 text-center"
    >
      <div class="max-w-xs">
        <i class="text-4xl mb-3 fa-regular ${icon} text-brand/60"></i>
        <div class="mb-2 text-lg font-semibold text-color">
          ${title}
        </div>
        <p class="text-sm leading-6 text-secondary">
          ${subtitle}
        </p>
      </div>
    </div>
  `;
}

/**
 * Render empty state for all charts
 */
function renderNoDataState() {
  const emptyStateConfigs = [
    {
      id: "apex-heatmap-chart",
      title: "Activity Heatmap",
      icon: "fa-table-cells",
      subtitle:
        "Add habits to see your weekly, monthly, and yearly activity trend.",
    },
    {
      id: "apex-weekday-chart",
      title: "Weekly Activity",
      icon: "fa-chart-bar",
      subtitle:
        "Your habit activity by weekday will appear here once data exists.",
    },
  ];

  emptyStateConfigs.forEach(({ id, title, icon, subtitle }) => {
    const chartEl = document.getElementById(id);
    renderEmptyState(chartEl, title, icon, subtitle);
  });
}

export function updateTabStyles(tab) {
  activeHeatmapTab = tab;

  const indicator = document.getElementById("heatmap-tab-indicator");
  const btnWeekly = document.getElementById("view-btn-weekly");
  const btnMonthly = document.getElementById("view-btn-monthly");
  const btnYearly = document.getElementById("view-btn-yearly");
  const switcher = document.getElementById("chart-view-switcher");

  if (!indicator || !btnWeekly || !btnMonthly || !btnYearly || !switcher)
    return;

  syncMobileMenuSelection(tab);

  const buttons = [btnWeekly, btnMonthly, btnYearly];
  const activeButton =
    tab === "monthly" ? btnMonthly : tab === "yearly" ? btnYearly : btnWeekly;

  buttons.forEach((btn) => {
    btn.classList.remove("text-(--color-btn-primary-text)", "text-secondary");
    btn.classList.add("text-secondary");
  });

  activeButton.classList.remove("text-secondary");
  activeButton.classList.add("text-(--color-btn-primary-text)");

  const switcherStyle = window.getComputedStyle(switcher);
  const paddingLeft = parseFloat(switcherStyle.paddingLeft) || 0;

  const activeRect = activeButton.getBoundingClientRect();
  const switcherRect = switcher.getBoundingClientRect();

  const left = Math.max(
    paddingLeft,
    activeRect.left - switcherRect.left - paddingLeft,
  );
  const width = Math.max(activeRect.width, 0);

  indicator.style.left = `${left}px`;
  indicator.style.width = `${width}px`;
}

function syncMobileMenuSelection(view) {
  const buttons = document.querySelectorAll("#heatmap-mobile-menu [data-view]");
  buttons.forEach((btn) => {
    const isActive = btn.getAttribute("data-view") === view;
    btn.classList.toggle("bg-brand/10", isActive);
    btn.classList.toggle("text-brand/80", isActive);
    btn.classList.toggle("text-secondary", !isActive);
    btn.classList.toggle("font-semibold", isActive);
  });
}

export function updateHeatmapChart(data, isDark) {
  if (!heatmapChartInstance) return;

  const nextOptions = getHeatmapOptions(data, isDark);
  heatmapChartInstance.updateOptions(nextOptions, false, true, true);
}

function handleAnalyticsResize() {
  updateTabStyles(activeHeatmapTab);
}

export function renderAnalyticsCharts(data) {
  const dashboard = document.getElementById("dashboard");
  if (!dashboard) return;

  const { habits, series, weekdayCounts, view, isDark, hasHabits } = data;

  // Clean up existing chart instances
  if (heatmapChartInstance) {
    heatmapChartInstance.destroy();
    heatmapChartInstance = null;
  }
  if (barChartInstance) {
    barChartInstance.destroy();
    barChartInstance = null;
  }

  // Render dashboard
  dashboard.innerHTML = DashboardComponent.render(habits);

  // Show/hide chart switchers based on data
  const chartBox = document.querySelectorAll('[id^="apex"]');
  const heatmapSwitcher = document.getElementById("chart-view-switcher");
  const mobileHeatmapSwitcher = document.getElementById(
    "heatmap-mobile-menu-toggle",
  );

  if (hasHabits) {
    chartBox.forEach((chart) => {
      ["px-2", "min-w-200", "md:min-w-full", "overflow-hidden"].forEach((c) =>
        chart.classList.add(c),
      );
    });
    heatmapSwitcher?.classList.replace("sm:hidden", "sm:flex");
    mobileHeatmapSwitcher?.classList.replace("hidden", "inline-flex");
  } else {
    heatmapSwitcher?.classList.replace("sm:flex", "sm:hidden");
    mobileHeatmapSwitcher?.classList.replace("inline-flex", "hidden");
    renderNoDataState();
    requestAnimationFrame(() => {
      updateTabStyles(view || "weekly");
    });
    return;
  }

  // Setup resize listener
  if (!resizeListenerAttached) {
    window.addEventListener("resize", handleAnalyticsResize);
    resizeListenerAttached = true;
  }

  // Mount heatmap chart
  const heatmapOptions = getHeatmapOptions(
    { series, colorRanges: data.colorRanges, view: view || "weekly" },
    isDark,
  );
  const heatmapChartElement = document.getElementById("apex-heatmap-chart");
  if (heatmapChartElement) {
    heatmapChartInstance = new ApexCharts(heatmapChartElement, heatmapOptions);
    heatmapChartInstance.render();
  }

  // Mount bar chart
  const barOptions = getBarChartOptions(weekdayCounts, isDark);
  const barChartElement = document.getElementById("apex-weekday-chart");
  if (barChartElement) {
    barChartInstance = new ApexCharts(barChartElement, barOptions);
    barChartInstance.render();
  }

  // Update tab styles after charts are mounted
  requestAnimationFrame(() => {
    const currentView = view || "weekly";
    updateTabStyles(currentView);
  });
}

export function destroyAnalyticsCharts() {
  if (heatmapChartInstance) {
    heatmapChartInstance.destroy();
    heatmapChartInstance = null;
  }
  if (barChartInstance) {
    barChartInstance.destroy();
    barChartInstance = null;
  }
  if (resizeListenerAttached) {
    window.removeEventListener("resize", handleAnalyticsResize);
    resizeListenerAttached = false;
  }
  _isFirstRender = true;
}
