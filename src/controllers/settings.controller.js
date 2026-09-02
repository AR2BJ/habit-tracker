import { StateManager, state } from "@/models/state.model";

import { FileService } from "@/services/file.service";
import { GlobalLoaderService } from "@/services/loader.service";
import { HabitApplication } from "@/app/habits/habit.application";
import { NotificationService } from "@/services/notification.service";
import { SettingsApplication } from "@/app/settings/settings.application";
import { StateController } from "./state.controller";
import { ThemeApplication } from "@/infrastructure/theme/theme.application";
import { todayISO } from "@/shared/utils/date.utils";

export const SettingsController = {
  _themeUnsubscribe: null,

  init() {
    this.bindSettingsEvents();
  },

  bindSettingsEvents() {
    const settingsView = document.getElementById("settings-view");
    if (!settingsView) return;

    // Theme controls
    this._bindThemeControls();

    // Export buttons
    this._bindExportButtons();

    // Import dropzone
    this._bindImportDropzone();

    // Auto-archive toggle
    this._bindAutoArchiveToggle();

    // Reset modal
    this._bindResetModal();

    // Theme change listener
    document.addEventListener("themeChanged", (event) => {
      this.syncThemeControls(
        event.detail?.theme || ThemeApplication.getTheme(),
      );
    });

    this.syncThemeControls(ThemeApplication.getTheme());

    window.addEventListener("resize", () => {
      this.syncThemeControls(ThemeApplication.getTheme());
    });
  },

  _bindThemeControls() {
    document
      .getElementById("sett-theme-light")
      ?.addEventListener("click", () => this.handleThemeSwitch("light"));
    document
      .getElementById("sett-theme-dark")
      ?.addEventListener("click", () => this.handleThemeSwitch("dark"));
  },

  _bindExportButtons() {
    document
      .getElementById("sett-export-btn")
      ?.addEventListener("click", () => this.handleDataExport("json"));
    document
      .getElementById("sett-export-md-btn")
      ?.addEventListener("click", () => this.handleDataExport("markdown"));
    document
      .getElementById("sett-export-csv-btn")
      ?.addEventListener("click", () => this.handleDataExport("csv"));
  },

  _bindImportDropzone() {
    const dropzone = document.getElementById("sett-dropzone");
    const fileInput = document.getElementById("sett-import-file");

    FileService.setupDropzone(dropzone, fileInput, async (file) => {
      await this.handleFileImport(file);
    });
  },

  _bindAutoArchiveToggle() {
    document
      .getElementById("sett-auto-archive-toggle")
      ?.addEventListener("click", () => this.handleAutoArchiveToggle());
    this.syncAutoArchiveToggle();
  },

  _bindResetModal() {
    const triggerResetBtn = document.getElementById("trigger-reset-btn");
    const resetModal = document.getElementById("settings-reset-modal");
    const cancelResetBtn = document.getElementById("cancel-settings-reset");
    const confirmResetBtn = document.getElementById("confirm-settings-reset");

    triggerResetBtn?.addEventListener("click", () => {
      resetModal?.classList.replace("hidden", "flex");
      document.body.classList.add("overflow-hidden");
    });

    cancelResetBtn?.addEventListener("click", () => this.closeResetModal());

    confirmResetBtn?.addEventListener("click", () => {
      this.closeResetModal();
      this.executeApplicationReset();
    });

    document.addEventListener("keydown", (e) => {
      const resetOpen = resetModal && !resetModal.classList.contains("hidden");
      if (!resetOpen) return;
      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.key === "Escape") this.closeResetModal();
      if (e.ctrlKey && e.key === "Enter") {
        document.getElementById("confirm-settings-reset")?.click();
      }
    });
  },

  syncThemeControls(targetTheme) {
    const indicator = document.getElementById("theme-tab-indicator");
    const btnLight = document.getElementById("sett-theme-light");
    const btnDark = document.getElementById("sett-theme-dark");

    if (!indicator || !btnLight || !btnDark) return;

    const isDesktop = window.innerWidth >= 375;

    indicator.classList.remove(
      "xs:translate-x-0",
      "xs:translate-x-full",
      "translate-y-0",
      "translate-y-full",
    );

    if (targetTheme === "dark") {
      if (isDesktop) {
        indicator.classList.add("xs:translate-x-full");
      } else {
        indicator.classList.add("translate-y-full");
      }
      btnDark.classList.replace(
        "text-secondary",
        "text-(--color-btn-primary-text)",
      );
      btnLight.classList.replace(
        "text-(--color-btn-primary-text)",
        "text-secondary",
      );
    } else {
      if (isDesktop) {
        indicator.classList.add("xs:translate-x-0");
      } else {
        indicator.classList.add("translate-y-0");
      }
      btnLight.classList.replace(
        "text-secondary",
        "text-(--color-btn-primary-text)",
      );
      btnDark.classList.replace(
        "text-(--color-btn-primary-text)",
        "text-secondary",
      );
    }
  },

  handleThemeSwitch(targetTheme) {
    const currentTheme = ThemeApplication.getTheme();
    if (currentTheme === targetTheme) return;

    document.getElementById("theme-toggle")?.click();
    this.syncThemeControls(targetTheme);
  },

  handleDataExport(format = "json") {
    const habits = HabitApplication.getHabits();

    if (habits.length === 0) {
      NotificationService.show({
        type: "info",
        message: "There is no data to export",
        icon: "fa-circle-info",
        iconColor: "text-brand/80",
        duration: 5000,
      });
      return;
    }

    try {
      FileService.exportData(habits, format);
      NotificationService.show({
        type: "success",
        message: `Database layer exported successfully as ${format.toUpperCase()}`,
        icon: "fa-file-arrow-down",
        iconColor: "text-emerald-500/80",
        duration: 5000,
      });
    } catch (error) {
      NotificationService.show({
        type: "error",
        message: error.message || "Export failed",
        icon: "fa-triangle-exclamation",
        duration: 5000,
      });
    }
  },

  async handleFileImport(file) {
    GlobalLoaderService.show(`Parsing storage integrity from ${file.name}...`);

    try {
      const importedHabits = await FileService.importFile(file);

      // Save imported habits
      HabitApplication.saveHabits(importedHabits);

      StateController.runManual();

      // Reset UI state
      StateManager.setTab("active");
      StateManager.setView("habits");
      StateManager.setCategory("all");

      NotificationService.show({
        type: "success",
        message: `Data ledger parsed and synchronized from ${file.name}`,
        icon: "fa-circle-check",
        iconColor: "text-emerald-500/80",
        duration: 5000,
      });
    } catch (error) {
      console.error("Import error:", error);
      NotificationService.show({
        type: "error",
        message: error.message || "Failed to parse file",
        icon: "fa-triangle-exclamation",
        iconColor: "text-red-500/80",
        duration: 5000,
      });
    } finally {
      GlobalLoaderService.hide();
    }
  },

  syncAutoArchiveToggle() {
    const enabled = SettingsApplication.getAutoArchiveEnabled();
    const toggleBtn = document.getElementById("sett-auto-archive-toggle");
    const toggleDot = document.getElementById("sett-auto-archive-dot");

    if (enabled) {
      toggleBtn?.classList.replace("bg-neutral-300/80", "bg-brand/80");
      toggleBtn?.classList.replace(
        "dark:bg-neutral-700/80",
        "dark:bg-brand/80",
      );
      toggleDot?.classList.replace("translate-x-0", "translate-x-5");
    } else {
      toggleBtn?.classList.replace("bg-brand/80", "bg-neutral-300/80");
      toggleBtn?.classList.replace(
        "dark:bg-brand/80",
        "dark:bg-neutral-700/80",
      );
      toggleDot?.classList.replace("translate-x-5", "translate-x-0");
    }
  },

  handleAutoArchiveToggle() {
    const nextState = SettingsApplication.toggleAutoArchive();
    this.syncAutoArchiveToggle();

    NotificationService.show({
      type: "info",
      message: `Autonomous archiving pipeline has been ${nextState ? "activated" : "deactivated"}`,
      icon: "fa-robot",
      iconColor: "text-brand/80",
      duration: 5000,
    });

    if (nextState) {
      this.runAutoArchivePipeline();
    }
  },

  runAutoArchivePipeline() {
    if (!SettingsApplication.getAutoArchiveEnabled()) return;

    const habits = HabitApplication.getHabits();
    if (habits.length === 0) return;

    const today = todayISO();
    const result = HabitApplication.applyAutoArchivePolicy(today, 30);

    if (result.archived > 0) {
      NotificationService.show({
        type: "info",
        message: `${result.archived} stale habit(s) exceeding 30 days auto-archived`,
        icon: "fa-box-archive",
        iconColor: "text-brand/80",
        duration: 5000,
      });
    }
  },

  closeResetModal() {
    const resetModal = document.getElementById("settings-reset-modal");
    if (!resetModal) return;
    resetModal.classList.add("hidden");
    resetModal.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
  },

  async executeApplicationReset() {
    this.closeResetModal();

    GlobalLoaderService.show("Purging storage layers & resetting workspace...");

    try {
      const snapshot = SettingsApplication.reset();

      // Reset UI state
      StateManager.setTab("active");
      StateManager.setView("habits");
      StateManager.setCategory("all");

      NotificationService.show({
        type: "error",
        message:
          "Application synchronization storage has been completely cleared",
        duration: 5000,
        undoAction: async () => {
          GlobalLoaderService.show(
            "Re-instating application database state...",
          );
          try {
            SettingsApplication.undoReset(snapshot);
          } finally {
            GlobalLoaderService.hide();
          }
        },
      });
    } finally {
      GlobalLoaderService.hide();
    }
  },

  destroy() {
    if (this._themeUnsubscribe) {
      this._themeUnsubscribe();
      this._themeUnsubscribe = null;
    }
  },
};
