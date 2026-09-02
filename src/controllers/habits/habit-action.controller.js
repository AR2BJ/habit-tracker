import { setPendingDeleteId, setPendingEditId } from "./habit-form.controller";

import { GlobalLoaderService } from "@/services/loader.service";
import { HabitActionService } from "@/services/ui/habit-action.service";
import { HabitApplication } from "@/app/habits/habit.application";
import { NotificationService } from "@/services/notification.service";

export const HabitActionController = {
  _service: null,
  _toggleModal: null,

  /**
   * Initialize the action controller
   * @param {Object} deps - Dependencies
   * @param {Function} deps.toggleModal - Function to toggle modals
   * @param {Function} deps.onEdit - Function to handle edit (optional)
   * @param {Function} deps.onDelete - Function to handle delete (optional)
   */
  init(deps = {}) {
    this._toggleModal = deps.toggleModal || this._defaultToggleModal;

    // Create service with dependencies
    this._service = new HabitActionService(
      HabitApplication,
      NotificationService,
      GlobalLoaderService,
    );

    this.bindDynamicEvents();
  },

  /**
   * Default modal toggle (fallback)
   */
  _defaultToggleModal(modalId, show) {
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

  /**
   * Toggle modal (uses injected callback or default)
   */
  _toggleModalFn(modalId, show) {
    if (this._toggleModal) {
      this._toggleModal(modalId, show);
    } else {
      this._defaultToggleModal(modalId, show);
    }
  },

  bindDynamicEvents() {
    const listContainer = document.getElementById("habit-list");
    if (!listContainer) return;

    // Use event delegation
    listContainer.addEventListener("click", (e) => {
      const target = e.target;

      // Toggle button (complete today)
      const toggleBtn = target.closest(".toggle-btn");
      if (toggleBtn) {
        const id = toggleBtn.dataset.id;
        this._service.handleToggle(id);
        return;
      }

      // Calendar day button
      const dayBtn = target.closest(".calendar-day");
      if (dayBtn && dayBtn.dataset.habitId) {
        e.preventDefault();
        e.stopPropagation();

        const id = dayBtn.dataset.habitId;
        const date = dayBtn.dataset.date;
        this._service.handleCalendarDay(id, date);
        return;
      }

      // Edit button
      const editBtn = target.closest(".edit-btn");
      if (editBtn) {
        const id = editBtn.dataset.id;
        // Populate edit modal and show it
        setPendingEditId(id);
        const habit = HabitApplication.getHabits().find((h) => h.id === id);
        const editInput = document.getElementById("edit-habit-input");
        if (editInput && habit) editInput.value = habit.name;
        this._toggleModalFn("edit-modal", true);
        return;
      }

      // Delete button
      const deleteBtn = target.closest(".delete-btn");
      if (deleteBtn) {
        setPendingDeleteId(deleteBtn.dataset.id);
        this._toggleModalFn("delete-modal", true);
        return;
      }

      // Archive button
      const archiveBtn = target.closest(".archive-btn");
      if (archiveBtn) {
        const id = archiveBtn.dataset.id;
        this._service.handleArchive(id);
        return;
      }

      // Restore button
      const restoreBtn = target.closest(".restore-btn");
      if (restoreBtn) {
        const id = restoreBtn.dataset.id;
        this._service.handleRestore(id);
        return;
      }
    });
  },

  /**
   * Clean up resources
   */
  destroy() {
    if (this._service) {
      this._service.destroy();
      this._service = null;
    }
  },
};
