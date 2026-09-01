import "@/vendor/fontawesome/js/all";

import { BootstrapService } from "@/services/bootstrap.service";
import { StorageSyncService } from "@/infrastructure/persistence/storage-sync.service";
import { ThemeApplication } from "@/infrastructure/theme/theme.application";

// Ensure theme is applied before any rendering
// (ThemeApplication.init was already called in theme.js, but this is a safeguard)
if (
  !document.documentElement.classList.contains("dark") &&
  !document.documentElement.classList.contains("light")
) {
  ThemeApplication.init();
}

// Hide app initially (already hidden via CSS, but ensure it)
const app = document.querySelector("#app");
if (app) app.classList.add("hidden");

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  // Use requestAnimationFrame for next tick to ensure smooth startup
  requestAnimationFrame(() => {
    BootstrapService.init();
  });
});

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  // Clean up controllers
  import("@/controllers/tooltip.controller").then(({ TooltipController }) => {
    TooltipController.destroy();
  });

  import("@/controllers/habit.controller").then(({ HabitController }) => {
    HabitController.destroy();
  });

  import("@/controllers/analytics.controller").then(
    ({ AnalyticsController }) => {
      AnalyticsController.destroy();
    },
  );

  // Clean up UI services
  import("@/ui/services/habit-filters-scroll.service").then(
    ({ HabitFiltersScrollService }) => {
      HabitFiltersScrollService.destroy();
    },
  );
});

// Expose for debugging (optional)
if (import.meta.env.DEV) {
  window.__app = {
    BootstrapService,
    ThemeApplication,
  };
}

if (typeof window !== "undefined") {
  window.__sync = {
    force: () => StorageSyncService.forceSync(),
    status: () => {
      const raw = localStorage.getItem("habit_tracker");
      const habits = raw ? JSON.parse(raw)?.habits : [];
      return habits;
    },
  };
}
