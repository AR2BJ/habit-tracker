import { StateManager, state } from "../models/state.model.js";

import { AnalyticsView } from "../views/analytics-view.js";
import { DeleteModalsComponent } from "../components/modals/delete-modals.component.js";
import { DesktopNavComponent } from "../components/layout/desktop-nav.component.js";
import { EditModalsComponent } from "../components/modals/edit-modals.component.js";
import { HabitActionController } from "./habits/habit-action.controller";
import { HabitFormController } from "./habits/habit-form.controller";
import { HabitsView } from "../views/habits-view.js";
import { HeaderComponent } from "../components/shared/header.component.js";
import { InfoModalComponent } from "../components/modals/info-modal.component.js";
import { MobileNavComponent } from "../components/layout/mobile-nav.component.js";
import { renderAnalytics } from "../views/dashboard/analytics.renderer.js";
import { renderHabitList } from "../views/habits/habit-list.renderer.js";

export const HabitController = {
  initApplication() {
    StateManager.init();
    this.renderComponent();
    this.refreshUI();

    HabitFormController.init(this);
    HabitActionController.init(this);

    this.bindStaticEvents();
    this.bindMenuToggle();
  },

  renderComponent() {
    const renderMap = {
      "header-container": HeaderComponent.render,
      "desktop-nav-container": DesktopNavComponent.render,
      "mobile-nav-container": MobileNavComponent.render,
      "habits-view-container": HabitsView.render,
      "analytics-view-container": AnalyticsView.render,
      "help-modal-container": InfoModalComponent.render,
      "edit-modals-container": EditModalsComponent.render,
      "delete-modals-container": DeleteModalsComponent.render,
    };

    Object.entries(renderMap).forEach(([id, renderFn]) => {
      const container = document.getElementById(id);
      if (container) container.innerHTML = renderFn();
    });
  },

  refreshUI() {
    const allHabits = StateManager.getHabits();
    const filteredHabits = StateManager.getFilteredHabits();

    renderHabitList(filteredHabits, state.activeTab);
    renderAnalytics(allHabits);
    this.updateNavigationDOM();
  },

  bindMenuToggle() {
    const menuToggle = document.getElementById("menu-toggle");
    const desktopNav = document.getElementById("desktop-nav");
    const app = document.getElementById("app");

    let isMenuOpen = false;

    menuToggle?.addEventListener("click", () => {
      isMenuOpen = !isMenuOpen;
      if (isMenuOpen) {
        desktopNav?.classList.replace(
          "-translate-x-[calc(100%+2rem)]",
          "translate-x-0",
        );
        app?.classList.replace("lg:pl-8", "lg:pl-30");
      } else {
        desktopNav?.classList.replace(
          "translate-x-0",
          "-translate-x-[calc(100%+2rem)]",
        );
        app?.classList.replace("lg:pl-30", "lg:pl-8");
      }
    });
  },

  bindStaticEvents() {
    const filterButtons = document.querySelectorAll(".category-filter-btn");
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const selectedCategory = e.currentTarget.dataset.category;
        StateManager.setCategory(selectedCategory);

        filterButtons.forEach((b) => {
          b.classList.remove("bg-brand", "text-white");
          b.classList.add("bg-surface-2", "text-secondary");
        });

        e.currentTarget.classList.remove("bg-surface-2", "text-secondary");
        e.currentTarget.classList.add("bg-brand", "text-white");

        this.refreshUI();
      });
    });

    const activeBtn = document.getElementById("tab-active");
    const archivedBtn = document.getElementById("tab-archived");

    activeBtn?.addEventListener("click", () => {
      state.activeTab = "active";
      this.updateTabStyles("active");
      this.refreshUI();
    });

    archivedBtn?.addEventListener("click", () => {
      state.activeTab = "archived";
      this.updateTabStyles("archived");
      this.refreshUI();
    });

    const navButtons = ["habits", "analytics", "settings"];
    navButtons.forEach((v) => {
      const desktopBtn = document.getElementById(`nav-${v}`);
      const mobileBtn = document.getElementById(`mobile-${v}`);

      const handleNav = () => {
        state.currentView = v;
        navButtons.forEach((nav) => {
          const dEl = document.getElementById(`nav-${nav}`);
          const mEl = document.getElementById(`mobile-${nav}`);
          dEl?.classList.replace("text-brand", "text-secondary");
          mEl?.classList.replace("text-brand", "text-secondary");
        });
        desktopBtn?.classList.replace("text-secondary", "text-brand");
        mobileBtn?.classList.replace("text-secondary", "text-brand");
        this.refreshUI();
      };

      desktopBtn?.addEventListener("click", handleNav);
      mobileBtn?.addEventListener("click", handleNav);
    });

    const helpToggle = document.getElementById("help-toggle");
    const helpModal = document.getElementById("help-modal");
    const closeHelpModal = document.getElementById("close-help-modal");
    const btnCloseHelp = document.getElementById("btn-close-help");
    const helpBackdrop = document.getElementById("help-modal-backdrop");

    const openHelp = () => {
      if (helpModal) helpModal.classList.replace("hidden", "flex");
    };
    const closeHelp = () => {
      if (helpModal) helpModal.classList.replace("flex", "hidden");
    };

    helpToggle?.addEventListener("click", openHelp);
    closeHelpModal?.addEventListener("click", closeHelp);
    btnCloseHelp?.addEventListener("click", closeHelp);
    helpBackdrop?.addEventListener("click", closeHelp);
  },

  handleTabSwitch(tab) {
    StateManager.setTab(tab);
    this.refreshUI();
    this.updateTabStyles(tab);
  },

  handleViewSwitch(view) {
    StateManager.setView(view);
    this.refreshUI();
  },

  toggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    if (show) modal.classList.replace("hidden", "flex");
    else modal.classList.replace("flex", "hidden");
  },

  updateNavigationDOM() {
    const views = ["habits", "analytics", "settings"];
    views.forEach((v) => {
      const el = document.getElementById(`${v}-view`);
      if (el) {
        if (state.currentView === v) el.classList.replace("hidden", "flex");
        else el.classList.replace("flex", "hidden");
      }
    });
  },

  updateTabStyles(tab) {
    const indicator = document.getElementById("tab-indicator");
    const activeBtn = document.getElementById("tab-active");
    const archivedBtn = document.getElementById("tab-archived");

    if (!indicator) return;

    if (tab === "active") {
      indicator.classList.replace("translate-x-27.5", "translate-x-0");
      activeBtn.classList.replace(
        "text-secondary",
        "text-(--color-btn-primary-text)",
      );
      archivedBtn.classList.replace(
        "text-(--color-btn-primary-text)",
        "text-secondary",
      );
    } else {
      indicator.classList.replace("translate-x-0", "translate-x-27.5");
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
};
