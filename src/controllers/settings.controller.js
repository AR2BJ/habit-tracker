import { STORAGE_KEY, STORAGE_VERSION } from "@/models/storage.model";
import { StateManager, state } from "@/models/state.model.js";

import { HabitController } from "./habit.controller";
import { NotificationService } from "@/services/notification.service.js";
import { formatDate } from "@/utils/helpers";
import mockData from "@/models/mocks/habits-seed.json";

export const SettingsController = {
  init(mainController) {
    this.mainController = mainController;
    this.bindSettingsEvents();
  },

  bindSettingsEvents() {
    const settingsView = document.getElementById("settings-view");
    if (!settingsView) return;

    document
      .getElementById("sett-theme-light")
      ?.addEventListener("click", () => this.handleThemeSwitch("light"));
    document
      .getElementById("sett-theme-dark")
      ?.addEventListener("click", () => this.handleThemeSwitch("dark"));

    document.addEventListener("themeChanged", (event) => {
      this.syncThemeControls(
        event.detail?.theme || localStorage.getItem("theme") || "light",
      );
    });

    this.syncThemeControls(localStorage.getItem("theme") || "light");

    document
      .getElementById("sett-export-btn")
      ?.addEventListener("click", () => this.handleDataExport());

    this.initImportDropzone();

    document
      .getElementById("sett-seed-btn")
      ?.addEventListener("click", () => this.handleDataSeeding());

    document
      .getElementById("sett-auto-archive-toggle")
      ?.addEventListener("click", () => this.handleAutoArchiveToggle());

    document.addEventListener("keydown", (e) => {
      const resetModal = document.getElementById("settings-reset-modal");
      const resetOpen = resetModal && !resetModal.classList.contains("hidden");

      if (!resetOpen) return;

      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
      }

      if (e.key === "Escape") {
        this.closeResetModal();
      }

      if (e.key === "Enter") {
        document.getElementById("confirm-settings-reset")?.click();
      }
    });

    this.initResetModalEvents();
  },

  syncThemeControls(targetTheme) {
    const indicator = document.getElementById("theme-tab-indicator");
    const btnLight = document.getElementById("sett-theme-light");
    const btnDark = document.getElementById("sett-theme-dark");

    if (!indicator || !btnLight || !btnDark) return;

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
  },

  handleThemeSwitch(targetTheme) {
    const currentTheme = localStorage.getItem("theme") || "light";
    if (currentTheme === targetTheme) return;

    document.getElementById("theme-toggle")?.click();
    this.syncThemeControls(targetTheme);

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

  handleDataExport() {
    const rawData = JSON.stringify(
      JSON.parse(localStorage.getItem(STORAGE_KEY))?.habits || [],
    );

    if (rawData === "[]") {
      NotificationService.show({
        type: "info",
        message: "There is no data to export.",
        icon: "fa-circle-info",
        iconColor: "text-sky-500",
        duration: 3000,
      });
    } else {
      const dataStr =
        "data:text/json;charset=utf-8," + encodeURIComponent(rawData);
      const downloadAnchor = document.createElement("a");

      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute(
        "download",
        `Habits_Backup_${formatDate(new Date())}.json`,
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      NotificationService.show({
        type: "success",
        message: "Database structural JSON ledger exported successfully.",
        icon: "fa-file-arrow-down",
        iconColor: "text-emerald-500",
        duration: 3000,
      });
    }
  },

  initImportDropzone() {
    const dropzone = document.getElementById("sett-dropzone");
    const fileInput = document.getElementById("sett-import-file");

    dropzone?.addEventListener("click", () => fileInput?.click());

    dropzone?.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("border-brand/80", "bg-brand/5");
    });

    ["dragleave", "drop"].forEach((event) => {
      dropzone?.addEventListener(event, () => {
        dropzone.classList.remove("border-brand/80", "bg-brand/5");
      });
    });

    dropzone?.addEventListener("drop", (e) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length) this.processImportedFile(files[0]);
    });

    fileInput?.addEventListener("change", (e) => {
      if (e.target.files.length) this.processImportedFile(e.target.files[0]);
    });
  },

  processImportedFile(file) {
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      NotificationService.show({
        type: "error",
        message: "Invalid format! Only structural JSON files are permitted.",
        icon: "fa-circle-xmark",
        iconColor: "text-red-500",
        duration: 3500,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const importedHabits = JSON.parse(event.target.result);

        if (!Array.isArray(importedHabits))
          throw new Error("Format is not a proper tracking array");

        const parsedData = {
          version: STORAGE_VERSION,
          habits: importedHabits,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedData));
        StateManager.save(parsedData.habits);

        state.activeTab = "active";
        state.currentView = "habits";
        state.currentCategory = "all";

        const { renderHabitList } =
          await import("@/views/habits/habit-list.renderer.js");
        renderHabitList(StateManager.getFilteredHabits(), state.activeTab);

        HabitController.refreshUI();

        NotificationService.show({
          type: "success",
          message: "Data ledger synchronized and parsed successfully.",
          icon: "fa-circle-check",
          iconColor: "text-emerald-500",
          duration: 3500,
        });
      } catch (err) {
        NotificationService.show({
          type: "error",
          message: "Failed to parse structural integrity of JSON file.",
          icon: "fa-triangle-exclamation",
          iconColor: "text-red-500",
          duration: 3500,
        });
      }
    };

    reader.readAsText(file);
  },

  async handleDataSeeding() {
    StateManager.save(mockData.mockHabits);

    state.activeTab = "active";
    state.currentView = "habits";
    state.currentCategory = "all";

    const { renderHabitList } =
      await import("@/views/habits/habit-list.renderer.js");
    renderHabitList(StateManager.getFilteredHabits(), state.activeTab);

    HabitController.refreshUI();

    NotificationService.show({
      type: "success",
      message: "Sandbox environment seeded with 3 months historical logs.",
      icon: "fa-flask-vial",
      iconColor: "text-brand/80",
      duration: 3500,
    });
  },

  handleAutoArchiveToggle() {
    const current = localStorage.getItem("sett_auto_archive") === "true";
    const nextState = !current;
    localStorage.setItem("sett_auto_archive", nextState ? "true" : "false");

    const toggleBtn = document.getElementById("sett-auto-archive-toggle");
    const toggleDot = document.getElementById("sett-auto-archive-dot");

    if (nextState) {
      toggleBtn?.classList.replace("bg-neutral-300", "bg-brand");
      toggleBtn?.classList.replace("dark:bg-neutral-700", "bg-brand");
      toggleDot?.classList.replace("translate-x-0", "translate-x-5");
    } else {
      toggleBtn?.classList.replace("bg-brand", "bg-neutral-300");
      toggleBtn?.classList.add("dark:bg-neutral-700");
      toggleDot?.classList.replace("translate-x-5", "translate-x-0");
    }

    NotificationService.show({
      type: "info",
      message: `Autonomous archiving pipeline has been ${nextState ? "activated" : "deactivated"}.`,
      icon: "fa-robot",
      iconColor: "text-indigo-500",
      duration: 3000,
    });

    if (nextState) {
      this.runAutoArchivePipeline();
    }
  },

  runAutoArchivePipeline() {
    if (localStorage.getItem("sett_auto_archive") !== "true") return;

    const habits = StateManager.getHabits() || [];
    if (habits.length === 0) return;

    let modified = false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    habits.forEach((habit) => {
      if (habit.archived === true) return;

      const allActivityDates = [
        ...(habit.completedDates || []),
        ...(habit.skippedDates || []),
      ];

      let lastActivityDateStr = habit.createdAt;

      if (allActivityDates.length > 0) {
        allActivityDates.sort();
        lastActivityDateStr = allActivityDates[allActivityDates.length - 1];
      }

      const lastActivityDate = new Date(lastActivityDateStr);
      lastActivityDate.setHours(0, 0, 0, 0);
      const lastActivityTimestamp = lastActivityDate.getTime();

      const msDiff = todayTimestamp - lastActivityTimestamp;
      const daysDiff = Math.floor(msDiff / (1000 * 60 * 60 * 24));

      if (daysDiff >= 30) {
        habit.archived = true;
        modified = true;
      }
    });

    if (modified) {
      StateManager.save(habits);

      if (this.mainController) {
        this.mainController.refreshUI();
      }

      NotificationService.show({
        type: "info",
        message:
          "Stale habits exceeding 30 days structural limits auto-archived.",
        icon: "fa-box-archive",
        iconColor: "text-indigo-400",
        duration: 4000,
      });
    }
  },

  closeResetModal() {
    const resetModal = document.getElementById("settings-reset-modal");
    if (!resetModal) return;

    resetModal.classList.add("hidden");
    resetModal.classList.remove("flex");
  },

  initResetModalEvents() {
    const triggerResetBtn = document.getElementById("trigger-reset-btn");
    const resetModal = document.getElementById("settings-reset-modal");
    const cancelResetBtn = document.getElementById("cancel-settings-reset");
    const confirmResetBtn = document.getElementById("confirm-settings-reset");

    triggerResetBtn?.addEventListener("click", () =>
      resetModal?.classList.replace("hidden", "flex"),
    );
    cancelResetBtn?.addEventListener("click", () => this.closeResetModal());

    confirmResetBtn?.addEventListener("click", () => {
      this.closeResetModal();
      this.executeApplicationReset();
    });
  },

  async executeApplicationReset() {
    this.closeResetModal();

    localStorage.removeItem(STORAGE_KEY);

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
