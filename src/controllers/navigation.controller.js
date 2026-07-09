import { AnalyticsController } from "./analytics.controller.js";
import { HabitController } from "./habit.controller.js";
import { StateManager } from "@/models/state.model.js";

export class NavigationController {
  static init() {
    this.setupNavigationListeners();
    this.setupKeyboardShortcuts();
    this.setDefaultActive();
  }

  static setupNavigationListeners() {
    document.getElementById("nav-habits")?.addEventListener("click", () => {
      this.setActiveTab("habits");
    });
    document.getElementById("nav-analytics")?.addEventListener("click", () => {
      this.setActiveTab("analytics");
    });
    document.getElementById("nav-settings")?.addEventListener("click", () => {
      this.setActiveTab("settings");
    });

    document.getElementById("mobile-habits")?.addEventListener("click", () => {
      this.setActiveTab("habits");
    });
    document
      .getElementById("mobile-analytics")
      ?.addEventListener("click", () => {
        this.setActiveTab("analytics");
      });
    document
      .getElementById("mobile-settings")
      ?.addEventListener("click", () => {
        this.setActiveTab("settings");
      });
  }

  static setupKeyboardShortcuts() {
    window.addEventListener("keydown", (event) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.isContentEditable)
      ) {
        if (event.key === "Escape") {
          activeEl.blur();
          this.closeAllActiveModals();
        }
        return;
      }

      const key = event.key.toLowerCase();

      if (event.key === "Escape") {
        event.preventDefault();
        this.closeAllActiveModals();
        return;
      }

      if (event.altKey) {
        if (key === "c") {
          event.preventDefault();
          document.getElementById("btn-toggle-habit-form")?.click();
          return;
        }
        if (key === "n") {
          event.preventDefault();
          document.getElementById("add-habit-btn")?.click();
          return;
        }
        if (key === "t") {
          event.preventDefault();
          document.getElementById("theme-toggle")?.click();
          return;
        }
        if (key === "r") {
          event.preventDefault();
          this.setActiveTab("settings");
          document.getElementById("trigger-reset-btn")?.click() ||
            document.querySelector('[id*="reset"]')?.click();
          return;
        }
        if (key === "a") {
          event.preventDefault();
          document.getElementById("tab-active")?.click();
          return;
        }
        if (key === "x") {
          event.preventDefault();
          document.getElementById("tab-archived")?.click();
          return;
        }
        if (["1", "2", "3"].includes(event.key)) {
          const currentSection = document.querySelector("section:not(.hidden)");
          if (currentSection && currentSection.id === "analytics-view") {
            const chartViewButtons = document.querySelectorAll(
              "#heatmap-mobile-menu button, #chart-view-switcher button, button[data-view]",
            );
            const index = parseInt(event.key) - 1;
            if (chartViewButtons[index]) {
              event.preventDefault();
              chartViewButtons[index].click();
            }
          }
        }
      }

      if (event.shiftKey) {
        if (key === "h") {
          event.preventDefault();
          this.setActiveTab("habits");
          return;
        }
        if (key === "a") {
          event.preventDefault();
          this.setActiveTab("analytics");
          return;
        }
        if (key === "s") {
          event.preventDefault();
          this.setActiveTab("settings");
          return;
        }
      }

      if (key === "/") {
        const searchInput =
          document.getElementById("search-habits") ||
          document.querySelector('input[type="search"]');
        if (searchInput) {
          event.preventDefault();
          searchInput.focus();
          searchInput.select();
        }
        return;
      }

      if (event.key === "?") {
        event.preventDefault();
        document.getElementById("help-toggle")?.click();
        return;
      }

      if (["1", "2", "3", "4", "5", "6", "7"].includes(event.key)) {
        const currentSection = document.querySelector("section:not(.hidden)");
        if (currentSection && currentSection.id === "habits-view") {
          const categoryButtons = document.querySelectorAll(
            "#category-filters button, .category-filter-btn",
          );
          const index = parseInt(event.key) - 1;
          if (categoryButtons[index]) {
            event.preventDefault();
            categoryButtons[index].click();
          }
        }
      }
    });
  }

  static closeAllActiveModals() {
    const modalIds = [
      "help-modal",
      "habit-modal",
      "delete-modal",
      "reset-modal",
      "edit-modal",
    ];
    modalIds.forEach((id) => {
      const modal = document.getElementById(id);
      if (modal && !modal.classList.contains("hidden")) {
        modal.querySelector('[id*="close"], [id*="btn-close"]')?.click() ||
          modal.classList.add("hidden");
      }
    });
  }

  static setActiveTab(tabType) {
    document.querySelectorAll(".nav-item").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.getElementById(`nav-${tabType}`)?.classList.add("active");

    document.querySelectorAll(".mobile-nav-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.getElementById(`mobile-${tabType}`)?.classList.add("active");

    HabitController.handleViewSwitch(tabType);
    this.showSection(tabType);

    if (tabType === "analytics") {
      AnalyticsController.dispatchRender(StateManager.getHabits());
    }
  }

  static showSection(sectionType) {
    document.querySelectorAll('section[id$="-view"]').forEach((section) => {
      section.classList.add("hidden");
    });
    document.getElementById(`${sectionType}-view`)?.classList.remove("hidden");
  }

  static setDefaultActive() {
    this.setActiveTab("habits");
  }
}
