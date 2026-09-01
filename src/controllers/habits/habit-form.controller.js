import { AutocompleteManager } from "@/ui/services/autocomplete-manager.service";
import { GlobalLoaderService } from "@/services/loader.service";
import { HabitApplication } from "@/app/habits/habit.application";
import { ModalManager } from "@/ui/services/modal.service";
import { NotificationService } from "@/services/notification.service";

// Pending IDs for modals
let pendingDeleteId = null;
let pendingEditId = null;

/**
 * Set pending delete ID (called from habit-card)
 */
export function setPendingDeleteId(id) {
  pendingDeleteId = id;
}

/**
 * Set pending edit ID and populate modal (called from habit-card)
 */
export function setPendingEditId(id) {
  pendingEditId = id;
  if (id) {
    HabitFormController.populateEditModal(id);
  }
}

export const HabitFormController = {
  /**
   * Initialize the form controller
   * @param {Object} deps - Dependencies
   * @param {Function} deps.toggleModal - Function to toggle modals
   */
  init(deps = {}) {
    ModalManager.setToggleCallback(deps.toggleModal || null);

    AutocompleteManager.setupCreateAutocompletes();
    this._bindFormEvents();
    this._bindModalEvents();
  },

  /**
   * Populate edit modal with habit data
   */
  populateEditModal(habitId) {
    const habits = HabitApplication.getHabits();
    const habit = habits.find((h) => h.id === habitId);

    if (!habit) {
      NotificationService.show({
        type: "error",
        message: "Habit not found",
        icon: "fa-triangle-exclamation",
        duration: 3000,
      });
      return;
    }

    // Populate form fields
    const titleInput = document.getElementById("edit-habit-title");
    const descInput = document.getElementById("edit-habit-desc");

    if (titleInput) titleInput.value = habit.name || "";
    if (descInput) descInput.value = habit.description || "";

    // Setup edit autocompletes
    AutocompleteManager.setupEditAutocompletes(habit);
  },

  /**
   * Bind form events (add habit)
   */
  _bindFormEvents() {
    const input = document.getElementById("habit-input");
    const addBtn = document.getElementById("add-habit-btn");

    const addHabit = () => {
      const name = input?.value?.trim();
      if (!name) {
        NotificationService.show({
          type: "error",
          message: "Habit name cannot be empty",
          icon: "fa-triangle-exclamation",
          duration: 5000,
        });
        return;
      }

      const { category, frequency } = AutocompleteManager.getCreateValues();

      GlobalLoaderService.show(`Creating habit "${name}"...`);

      requestAnimationFrame(() => {
        try {
          HabitApplication.createHabit({ name, category, frequency });

          // Reset form
          if (input) input.value = "";
          AutocompleteManager.resetCreateForm();

          NotificationService.show({
            type: "success",
            message: `Habit "${name}" created successfully!`,
            icon: "fa-check",
            iconColor: "text-emerald-500/80",
            duration: 5000,
          });
        } catch (error) {
          NotificationService.show({
            type: "error",
            message: error.message || "Failed to create habit",
            icon: "fa-triangle-exclamation",
            iconColor: "text-red-500/80",
            duration: 5000,
          });
        } finally {
          GlobalLoaderService.hide();
        }
      });
    };

    addBtn?.addEventListener("click", addHabit);
    input?.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        addHabit();
      }
    });
  },

  /**
   * Bind modal events (delete/edit)
   */
  _bindModalEvents() {
    // Modal button bindings
    const bindClick = (id, handler) => {
      document.getElementById(id)?.addEventListener("click", handler);
    };

    bindClick("confirm-delete-btn", () => this.executeDelete());
    bindClick("confirm-delete", () => this.executeDelete());
    bindClick("cancel-delete-btn", () =>
      ModalManager.toggle("delete-modal", false),
    );
    bindClick("cancel-delete", () =>
      ModalManager.toggle("delete-modal", false),
    );

    bindClick("confirm-edit-btn", () => this.executeEdit());
    bindClick("confirm-edit", () => this.executeEdit());
    bindClick("cancel-edit-btn", () =>
      ModalManager.toggle("edit-modal", false),
    );
    bindClick("cancel-edit", () => ModalManager.toggle("edit-modal", false));
    bindClick("cancel-edit-modal", () =>
      ModalManager.toggle("edit-modal", false),
    );

    // Keyboard shortcuts for modals
    document.addEventListener("keydown", (e) => {
      const deleteModal = document.getElementById("delete-modal");
      const editModal = document.getElementById("edit-modal");

      const deleteOpen =
        deleteModal && !deleteModal.classList.contains("hidden");
      const editOpen = editModal && !editModal.classList.contains("hidden");

      if (!deleteOpen && !editOpen) return;

      if (e.key === "Escape") {
        if (deleteOpen) ModalManager.toggle("delete-modal", false);
        if (editOpen) ModalManager.toggle("edit-modal", false);
      }

      if (e.ctrlKey && e.key === "Enter") {
        if (deleteOpen) {
          document.getElementById("confirm-delete-btn")?.click();
        }
        if (editOpen) {
          document.getElementById("confirm-edit-btn")?.click();
        }
      }
    });
  },

  /**
   * Execute delete operation
   */
  executeDelete() {
    const id = pendingDeleteId;
    if (!id) return;

    const habits = HabitApplication.getHabits();
    const habitToDelete = habits.find((h) => h.id === id);

    if (!habitToDelete) {
      NotificationService.show({
        type: "error",
        message: "Habit not found",
        icon: "fa-triangle-exclamation",
        duration: 3000,
      });
      return;
    }

    const capturedHabit = { ...habitToDelete };

    GlobalLoaderService.show(
      `Purging "${capturedHabit.name}" from database...`,
    );

    requestAnimationFrame(() => {
      try {
        HabitApplication.deleteHabit(id);

        ModalManager.toggle("delete-modal", false);
        pendingDeleteId = null;

        NotificationService.show({
          type: "error",
          message: `Deleted "${capturedHabit.name}"`,
          duration: 5000,
          undoAction: () => {
            GlobalLoaderService.show("Restoring deleted record...");
            requestAnimationFrame(() => {
              try {
                const latestHabits = HabitApplication.getHabits();
                const restored = [capturedHabit, ...latestHabits];
                HabitApplication.saveHabits(restored);
              } finally {
                GlobalLoaderService.hide();
              }
            });
          },
        });
      } catch (error) {
        NotificationService.show({
          type: "error",
          message: error.message || "Failed to delete habit",
          icon: "fa-triangle-exclamation",
          duration: 5000,
        });
      } finally {
        GlobalLoaderService.hide();
      }
    });
  },

  /**
   * Execute edit operation
   */
  executeEdit() {
    if (!pendingEditId) {
      NotificationService.show({
        type: "error",
        message: "No habit selected for editing",
        icon: "fa-triangle-exclamation",
        duration: 3000,
      });
      return;
    }

    const titleInput = document.getElementById("edit-habit-title");
    const newName = titleInput?.value?.trim();

    if (!newName) {
      NotificationService.show({
        type: "error",
        message: "Habit name cannot be empty",
        icon: "fa-triangle-exclamation",
        duration: 5000,
      });
      return;
    }

    const { category, frequency } = AutocompleteManager.getEditValues();

    GlobalLoaderService.show("Updating habit...");

    requestAnimationFrame(() => {
      try {
        HabitApplication.editHabit(pendingEditId, {
          title: newName,
          category,
          frequency,
        });

        ModalManager.toggle("edit-modal", false);

        AutocompleteManager.destroyEditAutocompletes();
        pendingEditId = null;

        NotificationService.show({
          type: "success",
          message: "Habit updated successfully!",
          icon: "fa-check",
          iconColor: "text-emerald-500/80",
          duration: 5000,
        });
      } catch (error) {
        NotificationService.show({
          type: "error",
          message: error.message || "Failed to update habit",
          icon: "fa-triangle-exclamation",
          iconColor: "text-red-500/80",
          duration: 5000,
        });
      } finally {
        GlobalLoaderService.hide();
      }
    });
  },

  /**
   * Clean up resources
   */
  destroy() {
    AutocompleteManager.destroy();
    pendingDeleteId = null;
    pendingEditId = null;
  },
};
