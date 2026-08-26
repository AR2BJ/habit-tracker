import {
  destroyAnalyticsCharts,
  renderAnalyticsCharts,
  updateHeatmapChart,
  updateTabStyles,
} from "@/views/analytics/analytics.renderer";

import { AnalyticsApplication } from "@/app/analytics/analytics.application";
import { HabitApplication } from "@/app/habits/habit.application";
import { getTheme } from "@/services/theme.service";

let currentHeatmapView = "weekly";

export const AnalyticsController = {
  init() {
    this._bindEvents();
  },

  _bindEvents() {
    // Desktop switcher - event delegation
    const switcher = document.getElementById("chart-view-switcher");
    if (switcher) {
      // Remove any existing listeners by cloning
      const newSwitcher = switcher.cloneNode(true);
      switcher.parentNode?.replaceChild(newSwitcher, switcher);

      const finalSwitcher = document.getElementById("chart-view-switcher");
      finalSwitcher.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-view]");
        if (btn) {
          const view = btn.getAttribute("data-view");
          if (view && ["weekly", "monthly", "yearly"].includes(view)) {
            this.handleTabSwitch(view);
          }
        }
      });
    } else {
      console.warn("⚠️ chart-view-switcher not found");
    }

    // Mobile menu - event delegation
    const mobileMenu = document.getElementById("heatmap-mobile-menu");
    if (mobileMenu) {
      const newMobileMenu = mobileMenu.cloneNode(true);
      mobileMenu.parentNode?.replaceChild(newMobileMenu, mobileMenu);

      const finalMobileMenu = document.getElementById("heatmap-mobile-menu");
      finalMobileMenu.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-view]");
        if (btn) {
          const view = btn.getAttribute("data-view");
          if (view) {
            this.handleTabSwitch(view);
            finalMobileMenu.classList.add("hidden");
          }
        }
      });
    }

    // Mobile menu toggle
    const mobileToggle = document.getElementById("heatmap-mobile-menu-toggle");
    if (mobileToggle) {
      const newToggle = mobileToggle.cloneNode(true);
      mobileToggle.parentNode?.replaceChild(newToggle, mobileToggle);

      const finalToggle = document.getElementById("heatmap-mobile-menu-toggle");
      finalToggle.addEventListener("click", () => {
        const menu = document.getElementById("heatmap-mobile-menu");
        if (menu) {
          menu.classList.toggle("hidden");
        }
      });
    }

    // Listen for theme changes
    document.addEventListener("themeChanged", () => {
      this.dispatchRender();
    });
  },

  handleTabSwitch(tab) {
    if (tab === currentHeatmapView) return;

    currentHeatmapView = tab;

    // Update tab styles FIRST (UI feedback)
    updateTabStyles(tab);

    // Then update chart data
    const isDark = getTheme() === "dark";

    const data = AnalyticsApplication.getHeatmapData(tab, isDark);

    if (data.series && data.series.length > 0) {
      updateHeatmapChart(
        {
          series: data.series,
          colorRanges: data.colorRanges,
          view: data.view || tab,
        },
        isDark,
      );
    } else {
      console.warn("⚠️ No series data to update");
    }
  },

  dispatchRender(habits) {
    const allHabits = habits || HabitApplication.getHabits();

    const isDark = getTheme() === "dark";
    const data = AnalyticsApplication.getAnalyticsData(
      currentHeatmapView,
      isDark,
      allHabits,
    );

    const renderData = {
      habits: allHabits,
      series: data.series,
      weekdayCounts: data.weekdayCounts,
      view: data.view || currentHeatmapView,
      isDark: isDark,
      colorRanges: data.colorRanges,
      hasHabits: allHabits.length > 0,
    };

    renderAnalyticsCharts(renderData);

    // assign event
    this._bindEvents();
  },

  getCurrentView() {
    return currentHeatmapView;
  },

  setCurrentView(view) {
    if (["weekly", "monthly", "yearly"].includes(view)) {
      currentHeatmapView = view;
    }
  },

  destroy() {
    destroyAnalyticsCharts();
  },
};
