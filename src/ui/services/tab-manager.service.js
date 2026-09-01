import { HabitApplication } from "@/app/habits/habit.application";

/**
 * TabManager - Manages habit tab switching (Active/Archived)
 */
export const TabManager = {
  _tabIndicatorObserver: null,

  init() {
    this.setupTabIndicatorObserver();
  },

  setupTabIndicatorObserver() {
    const activeBtn = document.getElementById("tab-active");
    const archivedBtn = document.getElementById("tab-archived");

    if (!activeBtn || !archivedBtn) return;

    if (!window.habitTabResizeObserver) {
      window.habitTabResizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => {
          const ui = HabitApplication.getUI();
          this.updateTabStyles(ui.activeTab);
        });
      });
    }

    window.habitTabResizeObserver.disconnect();
    window.habitTabResizeObserver.observe(activeBtn);
    window.habitTabResizeObserver.observe(archivedBtn);
  },

  updateTabStyles(tab) {
    const indicator = document.getElementById("tab-indicator");
    const activeBtn = document.getElementById("tab-active");
    const archivedBtn = document.getElementById("tab-archived");

    if (!indicator || !activeBtn || !archivedBtn) return;

    const buttonWidth =
      activeBtn.offsetWidth || activeBtn.getBoundingClientRect().width;
    if (!buttonWidth) return;

    const offset = 4;
    indicator.style.width = `${buttonWidth}px`;

    if (tab === "active") {
      indicator.style.left = `${offset}px`;
      activeBtn.classList.replace(
        "text-secondary",
        "text-(--color-btn-primary-text)",
      );
      archivedBtn.classList.replace(
        "text-(--color-btn-primary-text)",
        "text-secondary",
      );
    } else {
      indicator.style.left = `${buttonWidth + offset}px`;
      archivedBtn.classList.replace(
        "text-secondary",
        "text-(--color-btn-primary-text)",
      );
      activeBtn.classList.replace(
        "text-(--color-btn-primary-text)",
        "text-secondary",
      );
    }
  },

  switchTab(tab) {
    const ui = HabitApplication.getUI();
    if (ui.activeTab === tab) return;
    HabitApplication.setTab(tab);
    this.updateTabStyles(tab);
  },

  destroy() {
    if (window.habitTabResizeObserver) {
      window.habitTabResizeObserver.disconnect();
    }
  },
};
