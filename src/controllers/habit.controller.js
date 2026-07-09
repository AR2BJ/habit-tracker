import { StateManager, state } from "@/models/state.model.js";

import { AnalyticsController } from "./analytics.controller.js";
import { AnalyticsView } from "@/views/analytics-view.js";
import { DeleteModalsComponent } from "@/components/modals/delete-modals.component.js";
import { DesktopNavComponent } from "@/components/layout/desktop-nav.component.js";
import { EditModalsComponent } from "@/components/modals/edit-modals.component.js";
import { HabitActionController } from "./habits/habit-action.controller";
import { HabitFormController } from "./habits/habit-form.controller";
import { HabitsView } from "@/views/habits-view.js";
import { HeaderComponent } from "@/components/shared/header.component.js";
import { InfoModalComponent } from "@/components/modals/info-modal.component.js";
import { MobileNavComponent } from "@/components/layout/mobile-nav.component.js";
import { SettingsController } from "./settings.controller.js";
import { SettingsViewComponent } from "@/components/features/settings/settings-view.component.js";
import { renderHabitList } from "@/views/habits/habit-list.renderer.js";

export const HabitController = {
  initApplication() {
    StateManager.init();
    this.renderComponent();
    this.refreshUI();

    HabitFormController.init(this);
    HabitActionController.init(this);

    SettingsController.init(this);
    SettingsController.runAutoArchivePipeline();

    this.bindStaticEvents();
    this.bindMenuToggle();
    this.bindActionMenuToggle();

    window.addEventListener("DOMContentLoaded", () => {
      this.updateTabStyles(state.activeTab);
    });

    window.addEventListener("resize", () => {
      this.updateTabStyles(state.activeTab);
    });
  },

  renderComponent() {
    const renderMap = {
      "header-container": HeaderComponent.render,
      "desktop-nav-container": DesktopNavComponent.render,
      "mobile-nav-container": MobileNavComponent.render,
      "habits-view-container": HabitsView.render,
      "analytics-view-container": AnalyticsView.render,
      "settings-view-container": SettingsViewComponent.render,
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
    AnalyticsController.dispatchRender(allHabits);
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

  bindActionMenuToggle() {
    document.addEventListener("click", (e) => {
      const toggleBtn = e.target.closest(".dropdown-toggle-btn");

      if (toggleBtn) {
        e.stopPropagation();
        const container = toggleBtn.closest(".dropdown-container");
        const menu = container?.querySelector(".dropdown-menu");

        document.querySelectorAll(".dropdown-menu").forEach((m) => {
          if (m !== menu) m.classList.add("hidden");
        });

        menu?.classList.toggle("hidden");
        return;
      }

      if (!e.target.closest(".dropdown-container")) {
        document
          .querySelectorAll(".dropdown-menu")
          .forEach((m) => m.classList.add("hidden"));
      }
    });
  },

  bindStaticEvents() {
    const filterButtons = document.querySelectorAll(".category-filter-btn");

    const setFilterButtonState = (button, isActive) => {
      const icon = button.querySelector(".category-icon");
      const svg =
        icon?.tagName?.toLowerCase() === "svg"
          ? icon
          : icon?.querySelector("svg");

      button.classList.toggle("bg-brand/80", isActive);
      button.classList.toggle("shadow-brand/10", isActive);
      button.classList.toggle("text-white", isActive);
      button.classList.toggle("bg-surface-2", !isActive);
      button.classList.toggle("text-secondary", !isActive);
      button.classList.toggle(
        "hover:bg-(--color-(--color-surface-3))",
        !isActive,
      );
      button.classList.toggle("hover:text-secondary", !isActive);

      if (icon) {
        icon.style.color = isActive ? "#fff" : "";
      }

      if (svg) {
        svg.style.fill = isActive ? "currentColor" : "";
        svg.style.stroke = isActive ? "currentColor" : "";
      }

      svg?.querySelectorAll("path, circle, rect, polygon").forEach((shape) => {
        shape.style.fill = isActive ? "currentColor" : "";
        shape.style.stroke = isActive ? "currentColor" : "";
      });
    };

    const initialCategory = "all";

    filterButtons.forEach((btn) => {
      const isActive = btn.dataset.category === initialCategory;
      setFilterButtonState(btn, isActive);

      btn.addEventListener("click", (e) => {
        const selectedCategory = e.currentTarget.dataset.category;
        StateManager.setCategory(selectedCategory);

        filterButtons.forEach((button) => setFilterButtonState(button, false));
        setFilterButtonState(e.currentTarget, true);

        this.refreshUI();
      });
    });

    const toggleFormBtn = document.getElementById("btn-toggle-habit-form");
    const formContainer = document.getElementById("habit-form-container");
    const formChevron = document.getElementById("form-chevron");

    if (toggleFormBtn && formContainer && formChevron) {
      toggleFormBtn.addEventListener("click", () => {
        const isHidden = formContainer.classList.contains("hidden");
        if (isHidden) {
          formContainer.classList.replace("hidden", "flex");
          formChevron.classList.add("rotate-180");
        } else {
          formContainer.classList.replace("flex", "hidden");
          formChevron.classList.remove("rotate-180");
        }
      });
    }

    const searchInput = document.getElementById("search-habits");
    if (searchInput) {
      searchInput.value = state.searchQuery || "";

      searchInput.addEventListener("input", (e) => {
        state.searchQuery = e.target.value;
        this.refreshUI();
      });
    }

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
          dEl?.classList.replace("text-brand/80", "text-secondary");
          mEl?.classList.replace("text-brand/80", "text-secondary");
        });
        desktopBtn?.classList.replace("text-secondary", "text-brand/80");
        mobileBtn?.classList.replace("text-secondary", "text-brand/80");
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

      document.body.classList.add("overflow-hidden");

      const tabSafeguard = document.getElementById("tab-help-safeguard");
      const tabShortcuts = document.getElementById("tab-help-shortcuts");
      const contentSafeguard = document.getElementById(
        "content-help-safeguard",
      );
      const contentShortcuts = document.getElementById(
        "content-help-shortcuts",
      );

      if (
        tabSafeguard &&
        tabShortcuts &&
        contentSafeguard &&
        contentShortcuts
      ) {
        const resetTabs = () => {
          tabSafeguard.classList.remove(
            "bg-surface",
            "text-primary",
            "border",
            "border-border/40",
            "shadow-sm",
          );
          tabSafeguard.classList.add("text-secondary");
          tabShortcuts.classList.remove(
            "bg-surface",
            "text-primary",
            "border",
            "border-border/40",
            "shadow-sm",
          );
          tabShortcuts.classList.add("text-secondary");
          contentSafeguard.classList.add("hidden");
          contentShortcuts.classList.add("hidden");
        };

        tabSafeguard.onclick = () => {
          resetTabs();
          tabSafeguard.classList.add(
            "bg-surface",
            "text-primary",
            "border",
            "border-border/40",
            "shadow-sm",
          );
          contentSafeguard.classList.remove("hidden");
        };

        tabShortcuts.onclick = () => {
          resetTabs();
          tabShortcuts.classList.add(
            "bg-surface",
            "text-primary",
            "border",
            "border-border/40",
            "shadow-sm",
          );
          contentShortcuts.classList.remove("hidden");
        };
      }
    };
    const closeHelp = () => {
      if (helpModal) helpModal.classList.replace("flex", "hidden");

      document.body.classList.remove("overflow-hidden");
    };

    helpToggle?.addEventListener("click", openHelp);
    closeHelpModal?.addEventListener("click", closeHelp);
    btnCloseHelp?.addEventListener("click", closeHelp);
    helpBackdrop?.addEventListener("click", closeHelp);

    if (window.currentThemeListener) {
      document.removeEventListener("themeChanged", window.currentThemeListener);
    }
    window.currentThemeListener = () => {
      const allHabits = StateManager.getHabits();
      AnalyticsController.dispatchRender(allHabits);
    };
    document.addEventListener("themeChanged", window.currentThemeListener);
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
    if (show) {
      modal.classList.replace("hidden", "flex");
      document.body.classList.add("overflow-hidden");
    } else {
      modal.classList.replace("flex", "hidden");
      document.body.classList.remove("overflow-hidden");
    }
  },

  updateNavigationDOM() {
    const views = ["habits", "analytics", "settings"];
    views.forEach((v) => {
      const el = document.getElementById(`${v}-view`);
      if (el) {
        if (state.currentView === v) el.classList.replace("hidden", "flex");
        else el.classList.replace("flex", "hidden");
      }

      const desktopBtn = document.getElementById(`nav-${v}`);
      const mobileBtn = document.getElementById(`mobile-${v}`);

      if (state.currentView === v) {
        desktopBtn?.classList.replace("text-secondary", "text-brand/80");
        desktopBtn?.classList.add("active");
        mobileBtn?.classList.replace("text-secondary", "text-brand/80");
        mobileBtn?.classList.add("active");
      } else {
        desktopBtn?.classList.replace("text-brand/80", "text-secondary");
        desktopBtn?.classList.remove("active");
        mobileBtn?.classList.replace("text-brand/80", "text-secondary");
        mobileBtn?.classList.remove("active");
      }
    });
  },

  updateTabStyles(tab) {
    const indicator = document.getElementById("tab-indicator");
    const activeBtn = document.getElementById("tab-active");
    const archivedBtn = document.getElementById("tab-archived");

    if (!indicator || !activeBtn || !archivedBtn) return;

    const buttonWidth = activeBtn.getBoundingClientRect().width;
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
};
