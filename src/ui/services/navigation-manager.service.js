import { GlobalLoaderService } from "@/services/loader.service";
import { HabitApplication } from "@/app/habits/habit.application";

/**
 * NavigationManager - Manages view navigation (Habits/Analytics/Settings)
 */
export const NavigationManager = {
  _viewNames: {
    habits: "Workspace Overview",
    analytics: "Data Analytics Engine",
    settings: "System Configuration",
  },

  switchView(view) {
    const ui = HabitApplication.getUI();
    if (ui.currentView === view) return;

    GlobalLoaderService.show(
      `Navigating to ${this._viewNames[view] || view}...`,
    );

    try {
      HabitApplication.setView(view);
      this.updateNavigationDOM(view);
    } finally {
      GlobalLoaderService.hide();
    }
  },

  updateNavigationDOM(view) {
    const views = ["habits", "analytics", "settings"];

    views.forEach((v) => {
      const el = document.getElementById(`${v}-view`);
      if (el) {
        if (view === v) el.classList.replace("hidden", "flex");
        else el.classList.replace("flex", "hidden");
      }

      const desktopBtn = document.getElementById(`nav-${v}`);
      const mobileBtn = document.getElementById(`mobile-${v}`);

      if (view === v) {
        desktopBtn?.classList.replace("text-secondary", "text-brand/80");
        desktopBtn?.classList.add("shadow-brand/10", "active");
        mobileBtn?.classList.replace("text-secondary", "text-brand/80");
        mobileBtn?.classList.add("active");
      } else {
        desktopBtn?.classList.replace("text-brand/80", "text-secondary");
        desktopBtn?.classList.remove("shadow-brand/10", "active");
        mobileBtn?.classList.replace("text-brand/80", "text-secondary");
        mobileBtn?.classList.remove("active");
      }
    });

    requestAnimationFrame(() => {
      if (view === "habits") {
        const ui = HabitApplication.getUI();
        import("@/ui/services/tab-manager.service").then(({ TabManager }) => {
          TabManager.updateTabStyles(ui.activeTab);
        });
      }
    });
  },

  getCurrentView() {
    return HabitApplication.getUI().currentView;
  },
};
