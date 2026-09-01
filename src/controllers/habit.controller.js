import { AnalyticsController } from "./analytics.controller";
import { AnalyticsView } from "@/views/analytics-view";
import { CategoryFilterManager } from "@/ui/services/category-filter-manager.service";
import { DeleteModalsComponent } from "@/components/modals/delete-modals.component";
import { DesktopNavComponent } from "@/components/layout/desktop-nav.component";
import { DropdownManager } from "@/ui/services/dropdown-manager.service";
import { EditModalsComponent } from "@/components/modals/edit-modals.component";
import { GlobalLoaderService } from "@/services/loader.service";
import { HabitActionController } from "./habits/habit-action.controller";
import { HabitApplication } from "@/app/habits/habit.application";
import { HabitFormController } from "./habits/habit-form.controller";
import { HabitsView } from "@/views/habits-view";
import { HeaderComponent } from "@/components/shared/header.component";
import { InfoModalComponent } from "@/components/modals/info-modal.component";
import { MenuManager } from "@/ui/services/menu-manager.service";
import { MobileNavComponent } from "@/components/layout/mobile-nav.component";
import { NavigationManager } from "@/ui/services/navigation-manager.service";
import { NotificationService } from "@/services/notification.service";
import { SearchManager } from "@/ui/services/search-manager.service";
import { SettingsViewComponent } from "@/components/features/settings/settings-view.component";
import { TabManager } from "@/ui/services/tab-manager.service";
import { renderHabitList } from "@/views/habits/habit-list.renderer";

export const HabitController = {
  _unsubscribe: null,
  _isInitialized: false,

  init() {
    if (this._isInitialized) return;
    this._isInitialized = true;

    // Subscribe to store changes
    this._unsubscribe = HabitApplication.subscribe(() => {
      this.refreshUI();
    });

    // Render components
    this.renderComponent();
    this.refreshUI();

    // Initialize sub-controllers
    HabitFormController.init({
      toggleModal: (modalId, show) => this.toggleModal(modalId, show),
    });

    HabitActionController.init({
      toggleModal: (modalId, show) => this.toggleModal(modalId, show),
    });

    // Initialize UI services
    TabManager.init();
    MenuManager.init();
    DropdownManager.init();
    SearchManager.init();

    // Bind all UI events
    this._bindAllEvents();

    // Initial tab styles
    requestAnimationFrame(() => {
      const ui = HabitApplication.getUI();
      TabManager.updateTabStyles(ui.activeTab);
    });
  },

  renderComponent() {
    const isDark =
      document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark";
    const autoArchiveEnabled =
      localStorage.getItem("sett_auto_archive") === "true";

    const renderMap = {
      "header-container": HeaderComponent.render,
      "desktop-nav-container": DesktopNavComponent.render,
      "mobile-nav-container": MobileNavComponent.render,
      "habits-view-container": HabitsView.render,
      "analytics-view-container": AnalyticsView.render,
      "settings-view-container": () =>
        SettingsViewComponent.render({ isDark, autoArchiveEnabled }),
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
    const allHabits = HabitApplication.getHabits();
    const filteredHabits = HabitApplication.getFilteredHabits();
    const ui = HabitApplication.getUI();

    renderHabitList(filteredHabits, ui.activeTab);

    AnalyticsController.dispatchRender(allHabits);

    NavigationManager.updateNavigationDOM(ui.currentView);
  },

  /**
   * Bind all UI events in one place
   */
  _bindAllEvents() {
    // sync storage
    this._bindStorageSync();

    // Tab events (Active / Archived)
    this._bindTabs();

    // Navigation events (Habits / Analytics / Settings)
    this._bindNavigation();

    // Category filter events
    CategoryFilterManager.init();

    // Help modal
    this._bindHelpModal();

    // Scroll to top
    this._bindScrollToTop();

    // Form toggle
    this._bindFormToggle();

    // Theme change listener
    this._bindThemeListener();
  },

  _bindStorageSync() {
    // Listen for local storage updates (same tab)
    window.addEventListener("local-storage-update", (event) => {
      // Refresh UI without showing loader
      this.refreshUI();
    });
  },

  _bindTabs() {
    const activeBtn = document.getElementById("tab-active");
    const archivedBtn = document.getElementById("tab-archived");

    // Remove old listeners to prevent duplicates
    const newActiveBtn = activeBtn?.cloneNode(true);
    const newArchivedBtn = archivedBtn?.cloneNode(true);

    if (activeBtn && newActiveBtn) {
      activeBtn.parentNode?.replaceChild(newActiveBtn, activeBtn);
    }
    if (archivedBtn && newArchivedBtn) {
      archivedBtn.parentNode?.replaceChild(newArchivedBtn, archivedBtn);
    }

    const finalActiveBtn = document.getElementById("tab-active");
    const finalArchivedBtn = document.getElementById("tab-archived");

    finalActiveBtn?.addEventListener("click", () => {
      const ui = HabitApplication.getUI();
      if (ui.activeTab === "active") return;

      GlobalLoaderService.show("Switching workspace to Active Habits...");

      try {
        HabitApplication.setTab("active");
        TabManager.updateTabStyles("active");
      } finally {
        GlobalLoaderService.hide();
      }
    });

    finalArchivedBtn?.addEventListener("click", () => {
      const ui = HabitApplication.getUI();
      if (ui.activeTab === "archived") return;

      GlobalLoaderService.show("Loading Archived Habits ledger...");

      try {
        HabitApplication.setTab("archived");
        TabManager.updateTabStyles("archived");
      } finally {
        GlobalLoaderService.hide();
      }
    });
  },

  _bindNavigation() {
    const navButtons = ["habits", "analytics", "settings"];
    const viewNames = {
      habits: "Workspace Overview",
      analytics: "Data Analytics Engine",
      settings: "System Configuration",
    };

    navButtons.forEach((v) => {
      const desktopBtn = document.getElementById(`nav-${v}`);
      const mobileBtn = document.getElementById(`mobile-${v}`);

      // Remove old listeners by cloning
      const newDesktopBtn = desktopBtn?.cloneNode(true);
      const newMobileBtn = mobileBtn?.cloneNode(true);

      if (desktopBtn && newDesktopBtn) {
        desktopBtn.parentNode?.replaceChild(newDesktopBtn, desktopBtn);
      }
      if (mobileBtn && newMobileBtn) {
        mobileBtn.parentNode?.replaceChild(newMobileBtn, mobileBtn);
      }

      const finalDesktopBtn = document.getElementById(`nav-${v}`);
      const finalMobileBtn = document.getElementById(`mobile-${v}`);

      const handleNav = () => {
        const ui = HabitApplication.getUI();
        if (ui.currentView === v) return;

        GlobalLoaderService.show(`Navigating to ${viewNames[v] || v}...`);

        try {
          HabitApplication.setView(v);
          NavigationManager.updateNavigationDOM(v);
        } finally {
          GlobalLoaderService.hide();
        }
      };

      finalDesktopBtn?.addEventListener("click", handleNav);
      finalMobileBtn?.addEventListener("click", handleNav);
    });
  },

  _bindHelpModal() {
    const helpToggle = document.getElementById("help-toggle");
    const helpModal = document.getElementById("help-modal");
    const closeHelpModal = document.getElementById("close-help-modal");
    const btnCloseHelp = document.getElementById("btn-close-help");
    const helpBackdrop = document.getElementById("help-modal-backdrop");

    // Remove old listeners
    const newHelpToggle = helpToggle?.cloneNode(true);
    if (helpToggle && newHelpToggle) {
      helpToggle.parentNode?.replaceChild(newHelpToggle, helpToggle);
    }

    const finalHelpToggle = document.getElementById("help-toggle");

    const switchHelpTab = (tabName) => {
      const btnSafeguard = document.getElementById("tab-help-safeguard");
      const btnShortcuts = document.getElementById("tab-help-shortcuts");
      const contentSafeguard = document.getElementById(
        "content-help-safeguard",
      );
      const contentShortcuts = document.getElementById(
        "content-help-shortcuts",
      );

      if (!btnSafeguard || !btnShortcuts) return;

      // Reset both buttons first
      btnSafeguard.className =
        "flex-1 py-2 text-xs font-bold rounded-lg text-secondary hover:text-color transition cursor-pointer";
      btnShortcuts.className =
        "flex-1 py-2 text-xs font-bold rounded-lg text-secondary hover:text-color transition cursor-pointer";

      // Set active button
      if (tabName === "safeguard") {
        btnSafeguard.className =
          "flex-1 py-2 text-xs font-bold rounded-lg bg-brand text-white transition cursor-pointer";
        contentSafeguard.classList.remove("hidden");
        contentShortcuts.classList.add("hidden");
      } else if (tabName === "shortcuts") {
        btnShortcuts.className =
          "flex-1 py-2 text-xs font-bold rounded-lg bg-brand text-white transition cursor-pointer";
        contentShortcuts.classList.remove("hidden");
        contentSafeguard.classList.add("hidden");
      }
    };

    const openHelp = (defaultTab = "safeguard") => {
      if (helpModal) helpModal.classList.replace("hidden", "flex");

      switchHelpTab(defaultTab);

      const btnSafeguard = document.getElementById("tab-help-safeguard");
      const btnShortcuts = document.getElementById("tab-help-shortcuts");

      // Remove old listeners by cloning
      if (btnSafeguard) {
        const newBtnSafeguard = btnSafeguard.cloneNode(true);
        btnSafeguard.parentNode?.replaceChild(newBtnSafeguard, btnSafeguard);
      }
      if (btnShortcuts) {
        const newBtnShortcuts = btnShortcuts.cloneNode(true);
        btnShortcuts.parentNode?.replaceChild(newBtnShortcuts, btnShortcuts);
      }

      const finalBtnSafeguard = document.getElementById("tab-help-safeguard");
      const finalBtnShortcuts = document.getElementById("tab-help-shortcuts");

      if (finalBtnSafeguard) {
        finalBtnSafeguard.addEventListener("click", () => {
          switchHelpTab("safeguard");
        });
      }

      if (finalBtnShortcuts) {
        finalBtnShortcuts.addEventListener("click", () => {
          switchHelpTab("shortcuts");
        });
      }

      document.body.classList.add("overflow-hidden");
    };

    const closeHelp = () => {
      if (helpModal) helpModal.classList.replace("flex", "hidden");
      document.body.classList.remove("overflow-hidden");
    };

    finalHelpToggle?.addEventListener("click", () => openHelp("safeguard"));
    closeHelpModal?.addEventListener("click", closeHelp);
    btnCloseHelp?.addEventListener("click", closeHelp);
    helpBackdrop?.addEventListener("click", closeHelp);
  },

  _bindFormToggle() {
    const toggleFormBtn = document.getElementById("btn-toggle-habit-form");
    const formContainer = document.getElementById("habit-form-container");
    const formChevron = document.getElementById("form-chevron");

    if (toggleFormBtn && formContainer && formChevron) {
      // Remove old listener
      const newToggleBtn = toggleFormBtn.cloneNode(true);
      toggleFormBtn.parentNode?.replaceChild(newToggleBtn, toggleFormBtn);

      const finalToggleBtn = document.getElementById("btn-toggle-habit-form");

      finalToggleBtn.addEventListener("click", () => {
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
  },

  _bindScrollToTop() {
    const scrollTopBtn = document.getElementById("scroll-to-top-btn");

    if (scrollTopBtn) {
      let isVisible = false;
      let hideTimeout;

      // Remove old listener
      const newScrollBtn = scrollTopBtn.cloneNode(true);
      scrollTopBtn.parentNode?.replaceChild(newScrollBtn, scrollTopBtn);

      const finalScrollBtn = document.getElementById("scroll-to-top-btn");

      window.addEventListener("scroll", () => {
        const scrollThreshold = 600;

        if (window.scrollY > scrollThreshold) {
          if (!isVisible) {
            isVisible = true;
            clearTimeout(hideTimeout);
            finalScrollBtn?.classList.replace("hidden", "flex");
            requestAnimationFrame(() => {
              finalScrollBtn?.classList.remove("opacity-0", "scale-75");
              finalScrollBtn?.classList.add("opacity-100", "scale-100");
            });
          }
        } else {
          if (isVisible) {
            isVisible = false;
            requestAnimationFrame(() => {
              finalScrollBtn?.classList.remove("opacity-100", "scale-100");
              finalScrollBtn?.classList.add("opacity-0", "scale-75");
            });
            hideTimeout = setTimeout(() => {
              if (!isVisible) {
                finalScrollBtn?.classList.replace("flex", "hidden");
              }
            }, 200);
          }
        }
      });

      finalScrollBtn?.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  },

  _bindThemeListener() {
    if (window.currentThemeListener) {
      document.removeEventListener("themeChanged", window.currentThemeListener);
    }
    window.currentThemeListener = () => {
      const allHabits = HabitApplication.getHabits();
      AnalyticsController.dispatchRender(allHabits);
    };
    document.addEventListener("themeChanged", window.currentThemeListener);
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

  handleTabSwitch(tab) {
    TabManager.switchTab(tab);
  },

  handleViewSwitch(view) {
    NavigationManager.switchView(view);
  },

  updateTabStyles(tab) {
    TabManager.updateTabStyles(tab);
  },

  updateNavigationDOM() {
    const ui = HabitApplication.getUI();
    NavigationManager.updateNavigationDOM(ui.currentView);
  },

  setupTabIndicatorObserver() {
    TabManager.setupTabIndicatorObserver();
  },

  destroy() {
    if (this._unsubscribe) {
      this._unsubscribe();
      this._unsubscribe = null;
    }
    TabManager.destroy();
    SearchManager.destroy();
    DropdownManager.closeAll();
    this._isInitialized = false;
  },
};
