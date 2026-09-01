import { AnalyticsController } from "@/controllers/analytics.controller";
import { CompositionRoot } from "@/main/composition-root";
import { GlobalLoaderService } from "@/services/loader.service";
import { HabitApplication } from "@/app/habits/habit.application";
import { StorageSyncService } from "@/infrastructure/persistence/storage-sync.service";
import { ThemeSyncService } from "@/infrastructure/theme/theme-sync.service";

export const BootstrapService = {
  async init() {
    try {
      // 1. Initialize composition root
      CompositionRoot.init();

      // 2. Initialize loader
      GlobalLoaderService.init();

      // 3. LOAD DATA FIRST
      HabitApplication.load();

      // 4. Initialize storage sync (listens for external changes)
      StorageSyncService.init();

      // 5. Initialize theme sync
      ThemeSyncService.init();

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
    // Import all controllers (using dynamic imports for better loading)
    const [
      { NavigationController },
      { HabitController },
      { SettingsController },
      { ThemeController },
      { TooltipController },
      { HabitFiltersScrollService },
    ] = await Promise.all([
      import("@/controllers/navigation.controller"),
      import("@/controllers/habit.controller"),
      import("@/controllers/settings.controller"),
      import("@/controllers/theme.controller"),
      import("@/controllers/tooltip.controller"),
      import("@/ui/services/habit-filters-scroll.service"),
    ]);

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
    import("@/controllers/state.controller").then(({ StateController }) => {
      StateController.execute();
    });
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
    import("@/controllers/habit.controller").then(({ HabitController }) => {
      import("@/models/state.model").then(({ state }) => {
        requestAnimationFrame(() => {
          HabitController.updateTabStyles(state.activeTab);
        });
      });
    });
  },
};
