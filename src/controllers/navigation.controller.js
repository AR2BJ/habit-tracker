import { AnalyticsController } from "./analytics.controller";
import { CategoryShortcutService } from "@/services/ui/category-shortcut.service";
import { GlobalLoaderService } from "@/services/loader.service";
import { HabitApplication } from "@/app/habits/habit.application";
import { KeyboardShortcutService } from "@/services/ui/keyboard-shortcut.service";
import { ModalManager } from "@/services/modal.service";

/**
 * NavigationController - Manages navigation and view switching
 * This is a thin UI controller that delegates to application services
 */
export class NavigationController {
  static _isInitialized = false;
  static _unsubscribeShortcuts = null;

  static init() {
    if (this._isInitialized) return;
    this._isInitialized = true;

    this.setupNavigationListeners();
    this.setupKeyboardShortcuts();
    this.setDefaultActive();
  }

  static setupNavigationListeners() {
    const navMap = {
      "nav-habits": "habits",
      "nav-analytics": "analytics",
      "nav-settings": "settings",
      "mobile-habits": "habits",
      "mobile-analytics": "analytics",
      "mobile-settings": "settings",
    };

    Object.entries(navMap).forEach(([id, view]) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener("click", () => {
          this.setActiveTab(view);
        });
      }
    });
  }

  static setupKeyboardShortcuts() {
    // Initialize keyboard service
    KeyboardShortcutService.init();

    // Register navigation shortcuts
    this._unsubscribeShortcuts = KeyboardShortcutService.register((event) => {
      return this._handleKeyboardShortcut(event);
    });
  }

  static _handleKeyboardShortcut(event) {
    const { key, event: originalEvent } = event;
    const e = originalEvent || event;

    // Escape - close modals
    if (e.key === "Escape") {
      e.preventDefault();
      ModalManager.closeAll();
      return true;
    }

    // Alt + shortcuts
    if (e.altKey) {
      return this._handleAltShortcuts(e);
    }

    // Shift + shortcuts
    if (e.shiftKey) {
      return this._handleShiftShortcuts(e);
    }

    // Single key shortcuts
    return this._handleSingleKeyShortcuts(e);
  }

  static _handleAltShortcuts(e) {
    const key = e.key.toLowerCase();

    const shortcuts = {
      b: "scroll-to-top-btn",
      c: "btn-toggle-habit-form",
      t: "theme-toggle",
      n: "menu-toggle",
      a: "tab-active",
      x: "tab-archived",
    };

    if (shortcuts[key]) {
      e.preventDefault();
      document.getElementById(shortcuts[key])?.click();
      return true;
    }

    // Alt + R - Reset (special case with loader)
    if (key === "r") {
      e.preventDefault();
      GlobalLoaderService.show("Redirecting to purge terminal...");
      setTimeout(() => {
        try {
          this.setActiveTab("settings");
          const resetBtn =
            document.getElementById("trigger-reset-btn") ||
            document.querySelector('[id*="reset"]');
          setTimeout(() => resetBtn?.click(), 10);
        } finally {
          GlobalLoaderService.hide();
        }
      }, 50);
      return true;
    }

    // Alt + 1,2,3 for analytics chart views
    if (["1", "2", "3"].includes(e.key)) {
      const currentSection = document.querySelector("section:not(.hidden)");
      if (currentSection?.id === "analytics-view") {
        const chartViewButtons = Array.from(
          document.querySelectorAll(
            "#heatmap-mobile-menu button, #chart-view-switcher button, button[data-view]",
          ),
        ).filter((btn) => {
          const style = window.getComputedStyle(btn);
          return (
            !btn.disabled &&
            style.display !== "none" &&
            style.visibility !== "hidden"
          );
        });

        const index = parseInt(e.key, 10) - 1;
        const targetButton = chartViewButtons[index];
        if (targetButton) {
          e.preventDefault();
          setTimeout(() => targetButton.click(), 10);
        }
        return true;
      }
    }

    return false;
  }

  static _handleShiftShortcuts(e) {
    const key = e.key.toLowerCase();

    if (["h", "a", "s"].includes(key)) {
      e.preventDefault();

      const viewMap = {
        h: "habits",
        a: "analytics",
        s: "settings",
      };
      const viewNames = {
        h: "Habits Dashboard",
        a: "Analytical Metrics",
        s: "System Settings",
      };

      const targetTab = viewMap[key];
      GlobalLoaderService.show(`Navigating to ${viewNames[key]}...`);

      setTimeout(() => {
        try {
          this.setActiveTab(targetTab);
        } finally {
          GlobalLoaderService.hide();
        }
      }, 40);
      return true;
    }

    // '?' - Help
    if (e.key === "?" || e.key === "؟") {
      e.preventDefault();
      const helpToggle = document.getElementById("help-toggle");
      if (helpToggle) {
        helpToggle.click();
      } else {
        // Fallback: open help modal directly
        const helpModal = document.getElementById("help-modal");
        if (helpModal) {
          helpModal.classList.replace("hidden", "flex");
          document.body.classList.add("overflow-hidden");
        }
      }
      return true;
    }

    return false;
  }

  static _handleSingleKeyShortcuts(e) {
    const key = e.key.toLowerCase();

    // '/' - Focus search
    if (key === "/") {
      const searchInput =
        document.getElementById("search-habits") ||
        document.querySelector('input[type="search"]');
      if (searchInput) {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
      return true;
    }

    // Number keys for category shortcuts (only in habits view)
    if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(e.key)) {
      const currentSection = document.querySelector("section:not(.hidden)");
      if (currentSection?.id === "habits-view") {
        e.preventDefault();
        CategoryShortcutService.queueDigit(e.key, (button) => {
          setTimeout(() => button.click(), 10);
        });
        return true;
      }
    }

    return false;
  }

  static setActiveTab(tabType) {
    // Update navigation UI
    document.querySelectorAll(".nav-item").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.getElementById(`nav-${tabType}`)?.classList.add("active");

    document.querySelectorAll(".mobile-nav-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.getElementById(`mobile-${tabType}`)?.classList.add("active");

    // Update view via application
    HabitApplication.setView(tabType);
    this.showSection(tabType);

    // Refresh analytics if needed
    if (tabType === "analytics") {
      const habits = HabitApplication.getHabits();
      AnalyticsController.dispatchRender(habits);
    }
  }

  static showSection(sectionType) {
    document.querySelectorAll('section[id$="-view"]').forEach((section) => {
      section.classList.add("hidden");
    });
    document.getElementById(`${sectionType}-view`)?.classList.remove("hidden");
  }

  static setDefaultActive() {
    // Get current view from application
    const ui = HabitApplication.getUI();
    const currentView = ui.currentView || "habits";
    this.setActiveTab(currentView);
  }

  static closeAllActiveModals() {
    ModalManager.closeAll();
  }

  static queueCategoryShortcutKey(digit) {
    CategoryShortcutService.queueDigit(digit, (button) => {
      setTimeout(() => button.click(), 10);
    });
  }

  static processCategoryShortcutKey() {
    // Handled by CategoryShortcutService
  }

  static destroy() {
    if (this._unsubscribeShortcuts) {
      this._unsubscribeShortcuts();
      this._unsubscribeShortcuts = null;
    }
    KeyboardShortcutService.destroy();
    CategoryShortcutService.reset();
    this._isInitialized = false;
  }
}
