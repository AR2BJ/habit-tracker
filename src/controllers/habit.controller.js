import { StateManager, state } from "../models/state.js";

import { HabitService } from "../services/habit.service.js";
import { renderDashboard } from "../views/dashboard/dashboard.ui.js";
import { renderHabits } from "../views/habits/habit.ui.js";

let pendingDeleteId = null;
let pendingEditId = null;
let undoTimer = null;
let undoInterval = null;

export const HabitController = {
  initApplication() {
    StateManager.init();
    this.refreshUI();
    this.bindStaticEvents();
    this.bindDynamicEvents();
  },

  refreshUI() {
    const allHabits = StateManager.getHabits();
    const filteredHabits = StateManager.getFilteredHabits();

    renderHabits(filteredHabits, state.activeTab);
    renderDashboard(allHabits);
    this.updateNavigationDOM();
  },

  bindStaticEvents() {
    const input = document.getElementById("habit-input");
    const addBtn = document.getElementById("add-habit-btn");

    addBtn?.addEventListener("click", () => {
      const name = input.value;
      if (!name.trim()) return;

      const currentHabits = StateManager.getHabits();
      const updated = HabitService.createHabit(currentHabits, name);
      StateManager.save(updated);
      input.value = "";
      this.refreshUI();
    });

    document
      .getElementById("tab-active")
      ?.addEventListener("click", () => this.handleTabSwitch("active"));
    document
      .getElementById("tab-archived")
      ?.addEventListener("click", () => this.handleTabSwitch("archived"));

    ["habits", "analytics", "settings"].forEach((view) => {
      document
        .getElementById(`nav-${view}`)
        ?.addEventListener("click", () => this.handleViewSwitch(view));
      document
        .getElementById(`mobile-${view}`)
        ?.addEventListener("click", () => this.handleViewSwitch(view));
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
  },

  bindDynamicEvents() {
    const listContainer = document.getElementById("habit-list");

    listContainer?.addEventListener("click", (e) => {
      const target = e.target;

      const toggleBtn = target.closest(".toggle-btn");
      if (toggleBtn && toggleBtn.dataset.id) {
        const id = toggleBtn.dataset.id;
        const habit = StateManager.getHabits().find((h) => h.id === id);
        if (habit?.archived) return;

        const updated = HabitService.toggleHabit(StateManager.getHabits(), id);
        StateManager.save(updated);
        this.refreshUI();
        return;
      }

      const dayBtn = target.closest(".calendar-day");
      if (dayBtn && dayBtn.dataset.habitId) {
        const id = dayBtn.dataset.habitId;
        const date = dayBtn.dataset.date;
        const updated = HabitService.toggleHabitDate(
          StateManager.getHabits(),
          id,
          date,
        );
        StateManager.save(updated);
        this.refreshUI();
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
        const updated = HabitService.archiveHabit(StateManager.getHabits(), id);
        StateManager.save(updated);
        this.refreshUI();
        this.showArchiveToast();
        return;
      }

      const restoreBtn = target.closest(".restore-btn");
      if (restoreBtn) {
        const id = restoreBtn.dataset.id;
        const updated = HabitService.restoreHabit(StateManager.getHabits(), id);
        StateManager.save(updated);
        this.refreshUI();
        this.showRestoreToast();
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
    if (!pendingDeleteId) return;
    const currentHabits = StateManager.getHabits();
    const habitToDelete = currentHabits.find((h) => h.id === pendingDeleteId);

    if (habitToDelete) {
      state.lastDeletedHabit = habitToDelete;
      const updated = HabitService.deleteHabit(currentHabits, pendingDeleteId);
      StateManager.save(updated);
      this.toggleModal("delete-modal", false);
      this.refreshUI();
      this.showUndoToast();
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

  showUndoToast() {
    const toast = document.getElementById("undo-toast");
    const countdown = document.getElementById("undo-countdown");
    if (!toast || !countdown) return;

    toast.classList.remove("hidden");

    clearTimeout(undoTimer);
    clearInterval(undoInterval);

    let seconds = 5;
    countdown.textContent = `${seconds}s`;

    undoInterval = setInterval(() => {
      seconds--;
      countdown.textContent = `${seconds}s`;

      if (seconds <= 1) {
        clearInterval(undoInterval);
      }
    }, 1000);

    undoTimer = setTimeout(() => {
      clearInterval(undoInterval);
      toast.classList.add("hidden");
      state.lastDeletedHabit = null;
      countdown.textContent = `5s`;
    }, 5000);
  },

  hideUndoToast() {
    const toast = document.getElementById("undo-toast");
    const countdown = document.getElementById("undo-countdown");
    if (!toast) return;

    toast.classList.add("hidden");
    clearTimeout(undoTimer);
    clearInterval(undoInterval);
    if (countdown) countdown.textContent = `5s`;
  },

  executeUndo() {
    if (!state.lastDeletedHabit) return;
    const currentHabits = StateManager.getHabits();
    const updated = [state.lastDeletedHabit, ...currentHabits];
    StateManager.save(updated);

    this.hideUndoToast();
    state.lastDeletedHabit = null;
    this.refreshUI();
  },

  showRestoreToast() {
    const toast = document.getElementById("restore-toast");
    if (!toast) return;
    toast.classList.remove("hidden");
    setTimeout(() => {
      toast.classList.add("hidden");
    }, 2500);
  },

  showArchiveToast() {
    const toast = document.getElementById("archive-toast");
    if (!toast) return;
    toast.classList.remove("hidden");
    setTimeout(() => {
      toast.classList.add("hidden");
    }, 2500);
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
