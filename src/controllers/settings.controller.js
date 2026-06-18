import { NotificationService } from "@/services/notification.service.js";
import { StateManager } from "@/models/state.model.js";

export const SettingsController = {
  init(mainController) {
    this.mainController = mainController;
    this.bindSettingsEvents();
  },

  bindSettingsEvents() {
    const settingsView = document.getElementById("settings-view");
    if (!settingsView) return;

    const themeRadios = settingsView.querySelectorAll(
      'input[name="theme-toggle"]',
    );
    themeRadios.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        const selectedTheme = e.target.value;
        this.executeThemeChange(selectedTheme);
      });
    });

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

  executeThemeChange(theme) {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    document.dispatchEvent(
      new CustomEvent("themeChanged", { detail: { theme } }),
    );

    NotificationService.show({
      type: "success",
      message: `Interface theme swapped to ${theme} workspace environment!`,
      icon: theme === "dark" ? "fa-moon" : "fa-sun",
      iconColor: theme === "dark" ? "text-indigo-400" : "text-amber-500",
      duration: 2500,
    });
  },

  executeApplicationReset() {
    localStorage.removeItem("habits_v4");

    StateManager.init();

    if (this.mainController) {
      this.mainController.refreshUI();
    }

    NotificationService.show({
      type: "delete",
      message:
        "Application synchronization storage has been completely cleared.",
      icon: "fa-triangle-exclamation",
      iconColor: "text-rose-500",
      duration: 4000,
    });
  },
};
