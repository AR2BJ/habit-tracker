import { StateManager, state } from "../models/state.model.js";
import { formatDate, todayISO } from "../utils/helpers.js";

import { AnalyticsView } from "../views/analytics-view.js";
import { DeleteModalsComponent } from "../components/modals/delete-modals.component.js";
import { DesktopNavComponent } from "../components/layout/desktop-nav.component.js";
import { EditModalsComponent } from "../components/modals/edit-modals.component.js";
import { HabitService } from "../services/habit.service.js";
import { HabitsView } from "../views/habits-view.js";
import { HeaderComponent } from "../components/shared/header.component.js";
import { InfoModalComponent } from "../components/modals/info-modal.component.js";
import { MobileNavComponent } from "../components/layout/mobile-nav.component.js";
import { NotificationService } from "../services/notification.service.js";
import { renderAnalytics } from "../views/dashboard/analytics.renderer.js";
import { renderHabitList } from "../views/habits/habit-list.renderer.js";

let pendingDeleteId = null;
let pendingEditId = null;
let clickTimeout = null;

export const HabitController = {
  initApplication() {
    StateManager.init();
    this.renderComponent();
    this.refreshUI();
    this.bindStaticEvents();
    this.bindDynamicEvents();
    this.bindMenuToggle();
  },

  renderComponent() {
    const headerContainer = document.getElementById("header-container");
    const desktopNavContainer = document.getElementById(
      "desktop-nav-container",
    );
    const mobileNavContainer = document.getElementById("mobile-nav-container");
    const habitsViewContainer = document.getElementById(
      "habits-view-container",
    );
    const analyticsViewContainer = document.getElementById(
      "analytics-view-container",
    );
    const helpModalContainer = document.getElementById("help-modal-container");
    const editModalsContainer = document.getElementById(
      "edit-modals-container",
    );
    const deleteModalsContainer = document.getElementById(
      "delete-modals-container",
    );

    if (headerContainer) headerContainer.innerHTML = HeaderComponent.render();
    if (desktopNavContainer)
      desktopNavContainer.innerHTML = DesktopNavComponent.render();
    if (mobileNavContainer)
      mobileNavContainer.innerHTML = MobileNavComponent.render();
    if (habitsViewContainer)
      habitsViewContainer.innerHTML = HabitsView.render();
    if (analyticsViewContainer)
      analyticsViewContainer.innerHTML = AnalyticsView.render();
    if (helpModalContainer)
      helpModalContainer.innerHTML = InfoModalComponent.render();
    if (editModalsContainer)
      editModalsContainer.innerHTML = EditModalsComponent.render();
    if (deleteModalsContainer)
      deleteModalsContainer.innerHTML = DeleteModalsComponent.render();
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
    const input = document.getElementById("habit-input");
    const addBtn = document.getElementById("add-habit-btn");

    const categorySelect = document.getElementById("habit-category-select");
    const frequencySelect = document.getElementById("habit-frequency-select");

    const addHabit = () => {
      const name = input.value;
      const category = categorySelect ? categorySelect.value : "General";
      const frequency = frequencySelect ? frequencySelect.value : 7;

      if (!name.trim()) return;

      try {
        const currentHabits = StateManager.getHabits();
        const updated = HabitService.createHabit(
          currentHabits,
          name,
          category,
          frequency,
        );
        StateManager.save(updated);

        input.value = "";
        this.refreshUI();

        NotificationService.show({
          type: "success",
          message: `Habit "${name}" [${category}] created successfully!`,
          icon: "fa-check",
          iconColor: "text-emerald-500",
          duration: 3000,
        });
      } catch (error) {
        NotificationService.show({
          type: "error",
          message: error.message,
          icon: "fa-triangle-exclamation",
          iconColor: "text-rose-500",
          duration: 4000,
        });
      }
    };

    addBtn?.addEventListener("click", addHabit);

    input?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        addHabit();
      }
    });

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

    document.addEventListener("keydown", (e) => {
      const deleteModal = document.getElementById("delete-modal");
      const editModal = document.getElementById("edit-modal");

      const deleteOpen =
        deleteModal && !deleteModal.classList.contains("hidden");
      const editOpen = editModal && !editModal.classList.contains("hidden");

      if (!deleteOpen && !editOpen) return;

      if (e.key === "Escape") {
        if (deleteOpen) this.toggleModal("delete-modal", false);
        if (editOpen) this.toggleModal("edit-modal", false);
      }

      if (e.key === "Enter") {
        if (deleteOpen) {
          document.getElementById("confirm-delete-btn")?.click();
          document.getElementById("confirm-delete")?.click();
        }

        if (editOpen) {
          document.getElementById("confirm-edit-btn")?.click();
          document.getElementById("confirm-edit")?.click();
        }
      }
    });

    const addClick = (id, cb) =>
      document.getElementById(id)?.addEventListener("click", cb);

    addClick("confirm-delete-btn", () => this.executeDelete());
    addClick("confirm-delete", () => this.executeDelete());
    addClick("cancel-delete-btn", () =>
      this.toggleModal("delete-modal", false),
    );
    addClick("cancel-delete", () => this.toggleModal("delete-modal", false));

    addClick("confirm-edit-btn", () => this.executeEdit());
    addClick("confirm-edit", () => this.executeEdit());
    addClick("cancel-edit-btn", () => this.toggleModal("edit-modal", false));
    addClick("cancel-edit", () => this.toggleModal("edit-modal", false));

    addClick("undo-delete-btn", () => this.executeUndo());
    addClick("undo-delete", () => this.executeUndo());

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

  bindDynamicEvents() {
    const listContainer = document.getElementById("habit-list");

    listContainer?.addEventListener("click", (e) => {
      const target = e.target;

      const toggleBtn = target.closest(".toggle-btn");
      if (toggleBtn) {
        const id = toggleBtn.dataset.id;
        const currentHabits = StateManager.getHabits();
        const habit = currentHabits.find((h) => h.id === id);

        try {
          if (habit) {
            const updated = HabitService.toggleHabit(currentHabits, id);
            StateManager.save(updated);
            this.refreshUI();

            const todayStr = formatDate(new Date());
            const isNowCompleted = updated
              .find((h) => h.id === id)
              .completedDates.includes(todayStr);

            NotificationService.show({
              type: "info",
              message: isNowCompleted
                ? `Completed "${habit.name}" for today! ✨`
                : `Removed completion for "${habit.name}".`,
              icon: isNowCompleted ? "fa-circle-check" : "fa-circle",
              iconColor: isNowCompleted ? "text-emerald-500" : "text-slate-400",
              duration: 3000,
            });
          }
        } catch (error) {
          NotificationService.show({
            type: "error",
            message: error.message,
            icon: "fa-circle-exclamation",
            iconColor: "text-rose-500",
            duration: 4000,
          });
        }
        return;
      }

      const dayBtn = target.closest(".calendar-day");
      if (dayBtn && dayBtn.dataset.habitId) {
        const id = dayBtn.dataset.habitId;
        const date = dayBtn.dataset.date;
        const habit = StateManager.getHabits().find((h) => h.id === id);
        if (habit?.archived) return;

        const today = todayISO();
        const yesterday = formatDate(new Date(Date.now() - 86400000));

        if (date !== today && date !== yesterday) return;

        if (clickTimeout) {
          clearTimeout(clickTimeout);
          clickTimeout = null;

          try {
            const updated = HabitService.toggleSkipHabitDate(
              StateManager.getHabits(),
              id,
              date,
            );
            StateManager.save(updated);
            this.refreshUI();

            const isNowSkipped = updated
              .find((h) => h.id === id)
              .skippedDates?.includes(date);
            NotificationService.show({
              type: "info",
              message: isNowSkipped
                ? `Safeguard activated: Skipped day for "${habit.name}".`
                : `Removed safeguard for "${habit.name}".`,
              icon: isNowSkipped ? "fa-shield-halved" : "fa-calendar",
              iconColor: isNowSkipped ? "text-amber-500" : "text-slate-400",
              duration: 3000,
            });
          } catch (error) {
            NotificationService.show({ type: "error", message: error.message });
          }
        } else {
          clickTimeout = setTimeout(() => {
            clickTimeout = null;
            try {
              const updated = HabitService.toggleHabitDate(
                StateManager.getHabits(),
                id,
                date,
              );
              StateManager.save(updated);
              this.refreshUI();

              const isNowCompleted = updated
                .find((h) => h.id === id)
                .completedDates.includes(date);
              const dateLabel = date === today ? "Today" : "Yesterday";

              NotificationService.show({
                type: "info",
                message: isNowCompleted
                  ? `Marked "${habit.name}" as done for ${dateLabel}! ✨`
                  : `Unchecked "${habit.name}" for ${dateLabel}.`,
                icon: isNowCompleted ? "fa-square-check" : "fa-square-xmark",
                iconColor: isNowCompleted
                  ? "text-emerald-500"
                  : "text-gary-400",
                duration: 3000,
              });
            } catch (error) {
              NotificationService.show({
                type: "error",
                message: error.message,
              });
            }
          }, 250);
        }
        return;
      }

      const editBtn = target.closest(".edit-btn");
      if (editBtn) {
        pendingEditId = editBtn.dataset.id;
        const habit = StateManager.getHabits().find(
          (h) => h.id === pendingEditId,
        );
        const editInput = document.getElementById("edit-habit-input");
        if (editInput && habit) editInput.value = habit.name;
        this.toggleModal("edit-modal", true);
      }

      const deleteBtn = target.closest(".delete-btn");
      if (deleteBtn) {
        pendingDeleteId = deleteBtn.dataset.id;
        this.toggleModal("delete-modal", true);
        return;
      }

      const archiveBtn = target.closest(".archive-btn");
      if (archiveBtn) {
        const id = archiveBtn.dataset.id;
        const currentHabits = StateManager.getHabits();
        const targetHabit = currentHabits.find((h) => h.id === id);

        if (targetHabit) {
          const updated = HabitService.archiveHabit(currentHabits, id);
          StateManager.save(updated);
          this.refreshUI();

          NotificationService.show({
            type: "archive",
            message: `Archived: "${targetHabit.name}"`,
            duration: 4000,
            undoAction: () => {
              const rollbackHabits = StateManager.getHabits();
              const restored = HabitService.restoreHabit(rollbackHabits, id);
              StateManager.save(restored);
              this.refreshUI();
            },
          });
        }
        return;
      }

      const restoreBtn = target.closest(".restore-btn");
      if (restoreBtn) {
        const id = restoreBtn.dataset.id;
        const currentHabits = StateManager.getHabits();
        const targetHabit = currentHabits.find((h) => h.id === id);

        if (targetHabit) {
          const updated = HabitService.restoreHabit(currentHabits, id);
          StateManager.save(updated);
          this.refreshUI();

          NotificationService.show({
            type: "restore",
            message: `Restored: "${targetHabit.name}"`,
            duration: 4000,
            undoAction: () => {
              const rollbackHabits = StateManager.getHabits();
              const archived = HabitService.archiveHabit(rollbackHabits, id);
              StateManager.save(archived);
              this.refreshUI();
            },
          });
        }
        return;
      }
    });
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

  executeDelete() {
    const deleteModalId = document.getElementById("confirm-delete-btn")
      ? "delete-modal"
      : "delete-modal";

    const id = pendingDeleteId;
    if (!id) return;

    const currentHabits = StateManager.getHabits();
    const habitToDelete = currentHabits.find((h) => h.id === id);

    if (habitToDelete) {
      const capturedHabit = { ...habitToDelete };

      const updated = HabitService.deleteHabit(currentHabits, id);
      StateManager.save(updated);
      this.toggleModal("delete-modal", false);
      pendingDeleteId = null;
      this.refreshUI();

      NotificationService.show({
        type: "delete",
        message: `Deleted "${capturedHabit.name}"`,
        duration: 5000,
        undoAction: () => {
          const latestHabits = StateManager.getHabits();
          StateManager.save([capturedHabit, ...latestHabits]);
          this.refreshUI();
        },
      });
    }
  },

  executeEdit() {
    const editInput = document.getElementById("edit-habit-input");
    if (!pendingEditId || !editInput) return;

    const newName = editInput.value.trim();
    if (!newName) return;

    const currentHabits = StateManager.getHabits();
    const updated = HabitService.editHabit(
      currentHabits,
      pendingEditId,
      newName,
    );
    StateManager.save(updated);
    this.toggleModal("edit-modal", false);
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
