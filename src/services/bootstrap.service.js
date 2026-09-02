import { AnalyticsController } from "@/controllers/analytics.controller";
import { Composition } from "@/main/composition";
import { GlobalLoaderService } from "@/services/loader.service";
import { HabitApplication } from "@/app/habits/habit.application";
import { HabitController } from "@/controllers/habit.controller";
import { HabitFiltersScrollService } from "./ui/habit-filters-scroll.service";
import { NavigationController } from "@/controllers/navigation.controller";
import { SettingsController } from "@/controllers/settings.controller";
import { StateController } from "@/controllers/state.controller";
import { StorageService } from "./storage.service";
import { ThemeController } from "@/controllers/theme.controller";
import { ThemeService } from "./theme.service";
import { TooltipController } from "@/controllers/tooltip.controller";
import { state } from "@/models/state.model";

export const BootstrapService = {
  async init() {
    try {
      // 1. Initialize composition root
      Composition.init();

      // 2. Initialize loader
      GlobalLoaderService.init();

      // 3. LOAD DATA FIRST
      HabitApplication.load();

      // 4. Initialize storage sync (listens for external changes)
      StorageService.init();

      // 5. Initialize theme sync
      ThemeService.init();

      // 6. Initialize controllers
      await this._initControllers();

      // 7. Initial render
      this._initialRender();

      // 8. Run maintenance
      this._runMaintenance();

      // 9. Show app
      this._showApp();
    } catch (error) {
      console.error("Bootstrap failed:", error);
      this._showApp(); // Show app even on error
    }
  },

  async _initControllers() {
    // Initialize in correct order
    NavigationController.init();
    HabitController.init();
    SettingsController.init();

    // Analytics is already imported
    AnalyticsController.init();

    ThemeController.init();
    TooltipController.init();
    HabitFiltersScrollService.init();
  },

  _initialRender() {
    AnalyticsController.dispatchRender();
  },

  _runMaintenance() {
    StateController.execute();
  },

  _showApp() {
    const loader = document.querySelector("#app-loader");
    const app = document.querySelector("#app");

    if (loader) {
      loader.classList.add("opacity-0", "pointer-events-none");
      // Remove loader after fade-out
      setTimeout(() => {
        loader.remove();
      }, 300);
    }

    if (app) {
      app.classList.remove("hidden");
    }

    // Update tab styles after app is visible
    requestAnimationFrame(() => {
      HabitController.updateTabStyles(state.activeTab);
    });
  },
};
