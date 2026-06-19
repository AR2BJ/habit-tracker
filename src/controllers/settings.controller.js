import { HabitController } from "./habit.controller";
import { NavigationController } from "./navigation.controller";
import { NotificationService } from "@/services/notification.service.js";
import { state } from "@/models/state.model.js";

export const SettingsController = {
  init(mainController) {
    this.mainController = mainController;
    this.bindSettingsEvents();
  },

  bindSettingsEvents() {
    const settingsView = document.getElementById("settings-view-container");
    if (!settingsView) return;

    const btnLight = document.getElementById("sett-theme-light");
    const btnDark = document.getElementById("sett-theme-dark");

    btnLight?.addEventListener("click", () => this.handleThemeSwitch("light"));
    btnDark?.addEventListener("click", () => this.handleThemeSwitch("dark"));

    const triggerResetBtn = document.getElementById("trigger-reset-btn");
    const resetModal = document.getElementById("settings-reset-modal");
    const cancelResetBtn = document.getElementById("cancel-settings-reset");
    const confirmResetBtn = document.getElementById("confirm-settings-reset");

    triggerResetBtn?.addEventListener("click", () => {
      resetModal?.classList.replace("hidden", "flex");
    });

    cancelResetBtn?.addEventListener("click", () => {
      resetModal?.classList.replace("flex", "hidden");
    });

    confirmResetBtn?.addEventListener("click", () => {
      resetModal?.classList.replace("flex", "hidden");
      this.executeApplicationReset();
    });
  },

  handleThemeSwitch(targetTheme) {
    const currentTheme = localStorage.getItem("theme") || "light";
    if (currentTheme === targetTheme) return;

    const globalThemeBtn = document.getElementById("theme-toggle");
    globalThemeBtn?.click();

    const indicator = document.getElementById("theme-tab-indicator");
    const btnLight = document.getElementById("sett-theme-light");
    const btnDark = document.getElementById("sett-theme-dark");

    if (indicator && btnLight && btnDark) {
      if (targetTheme === "dark") {
        indicator.classList.replace("translate-x-0", "translate-x-full");
        btnDark.classList.replace(
          "text-secondary",
          "text-(--color-btn-primary-text)",
        );
        btnLight.classList.replace(
          "text-(--color-btn-primary-text)",
          "text-secondary",
        );
      } else {
        indicator.classList.replace("translate-x-full", "translate-x-0");
        btnLight.classList.replace(
          "text-secondary",
          "text-(--color-btn-primary-text)",
        );
        btnDark.classList.replace(
          "text-(--color-btn-primary-text)",
          "text-secondary",
        );
      }
    }
  },

  async executeApplicationReset() {
    localStorage.removeItem("habit_tracker");

    state.habits = [];
    state.activeTab = "active";
    state.currentView = "habits";
    state.currentCategory = "all";

    const { renderHabitList } =
      await import("@/views/habits/habit-list.renderer.js");
    renderHabitList([], state.activeTab);

    HabitController.refreshUI();

    NotificationService.show({
      type: "delete",
      message:
        "Application synchronization storage has been completely cleared.",
      icon: "fa-triangle-exclamation",
      iconColor: "text-rose-500",
      duration: 3500,
    });
  },
};
