import { formatDate, todayISO } from "@/shared/utils/date.utils";

import { StateController } from "@/controllers/state.controller";

/**
 * HabitActionService - Manages habit action click handling
 * This is a UI service that delegates to HabitApplication
 */
export class HabitActionService {
  constructor(habitApp, notificationService, loaderService) {
    this._habitApp = habitApp;
    this._notification = notificationService;
    this._loader = loaderService;
    this._clickTimeout = null;
  }

  /**
   * Handle habit toggle (complete/uncomplete today)
   */
  handleToggle(habitId) {
    const habits = this._habitApp.getHabits();
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    this._loader.show(`Updating state for "${habit.name}"...`);

    requestAnimationFrame(() => {
      try {
        const updated = this._habitApp.toggleToday(habitId);
        const todayStr = todayISO();
        const isNowCompleted = updated
          .find((h) => h.id === habitId)
          .completedDates.includes(todayStr);

        this._notification.show({
          type: isNowCompleted ? "success" : "info",
          message: isNowCompleted
            ? `Completed "${habit.name}" for today! ✨`
            : `Removed completion for "${habit.name}"`,
          icon: isNowCompleted ? "fa-circle-check" : "fa-circle",
          iconColor: isNowCompleted ? "text-emerald-500/80" : "text-brand/80",
          duration: 5000,
        });
      } catch (error) {
        console.error("Toggle failed:", error);
        this._notification.show({
          type: "error",
          message: error.message || "Failed to toggle habit",
          icon: "fa-triangle-exclamation",
          duration: 3000,
        });
      } finally {
        this._loader.hide();
      }
    });
  }

  /**
   * Handle calendar day click with double-click detection
   */
  handleCalendarDay(habitId, date) {
    const habits = this._habitApp.getHabits();
    const habit = habits.find((h) => h.id === habitId);
    if (!habit || habit.archived) return;

    const today = todayISO();
    const yesterday = formatDate(new Date(Date.now() - 86400000));

    if (date !== today && date !== yesterday) return;

    if (this._clickTimeout) {
      clearTimeout(this._clickTimeout);
      this._clickTimeout = null;

      // Double click - toggle skipped
      this._toggleSkippedDate(habitId, date, habit);
    } else {
      this._clickTimeout = setTimeout(() => {
        this._clickTimeout = null;
        // Single click - toggle completed
        this._toggleCompletedDate(habitId, date, habit);
      }, 250);
    }
  }

  /**
   * Toggle completed date (single click)
   */
  _toggleCompletedDate(habitId, date, habit) {
    const today = todayISO();
    const dateLabel = date === today ? "Today" : "Yesterday";

    this._loader.show(`Updating history for ${dateLabel}...`);

    requestAnimationFrame(() => {
      try {
        const updated = this._habitApp.toggleDate(habitId, date);
        const isNowCompleted = updated
          .find((h) => h.id === habitId)
          .completedDates.includes(date);

        this._notification.show({
          type: isNowCompleted ? "success" : "info",
          message: isNowCompleted
            ? `Marked "${habit.name}" as done for ${dateLabel}! ✨`
            : `Unchecked "${habit.name}" for ${dateLabel}`,
          icon: isNowCompleted ? "fa-square-check" : "fa-square-xmark",
          iconColor: isNowCompleted ? "text-emerald-500/80" : "text-brand/80",
          duration: 5000,
        });
      } catch (error) {
        console.error("Toggle date failed:", error);
        this._notification.show({
          type: "error",
          message: error.message || "Failed to update date",
          icon: "fa-triangle-exclamation",
          duration: 3000,
        });
      } finally {
        this._loader.hide();
      }
    });
  }

  /**
   * Toggle skipped date (double click)
   */
  _toggleSkippedDate(habitId, date, habit) {
    const today = todayISO();
    const dateLabel = date === today ? "Today" : "Yesterday";

    this._loader.show(`Processing calendar entry for ${dateLabel}...`);

    requestAnimationFrame(() => {
      try {
        const updated = this._habitApp.toggleSkippedDate(habitId, date);
        const isNowSkipped = updated
          .find((h) => h.id === habitId)
          .skippedDates?.includes(date);

        this._notification.show({
          type: isNowSkipped ? "warning" : "info",
          message: isNowSkipped
            ? `Safeguard activated: Skipped day for "${habit.name}".`
            : `Removed safeguard for "${habit.name}"`,
          icon: isNowSkipped ? "fa-shield-halved" : "fa-calendar",
          iconColor: isNowSkipped ? "text-amber-500/80" : "text-brand/80",
          duration: 5000,
        });
      } catch (error) {
        console.error("Toggle skipped failed:", error);
        this._notification.show({
          type: "error",
          message: error.message || "Failed to update skipped date",
          icon: "fa-triangle-exclamation",
          duration: 3000,
        });
      } finally {
        this._loader.hide();
      }
    });
  }

  /**
   * Handle edit button click
   */
  handleEdit(habitId, onEdit) {
    if (onEdit) {
      onEdit(habitId);
    }
  }

  /**
   * Handle delete button click
   */
  handleDelete(habitId, onDelete) {
    if (onDelete) {
      onDelete(habitId);
    }
  }

  /**
   * Handle archive button click with undo support
   */
  handleArchive(habitId) {
    const habits = this._habitApp.getHabits();
    const targetHabit = habits.find((h) => h.id === habitId);
    if (!targetHabit) return;

    this._loader.show(`Archiving "${targetHabit.name}" record...`);

    requestAnimationFrame(() => {
      try {
        this._habitApp.archiveHabit(habitId);

        this._notification.show({
          type: "info",
          message: `Archived: "${targetHabit.name}"`,
          duration: 5000,
          undoAction: () => {
            this._loader.show("Rolling back archive operation...");
            requestAnimationFrame(() => {
              try {
                this._habitApp.restoreHabit(habitId);
              } finally {
                this._loader.hide();
              }
            });
          },
        });
      } finally {
        this._loader.hide();
      }
    });
  }

  /**
   * Handle restore button click with undo support
   */
  handleRestore(habitId) {
    const habits = this._habitApp.getHabits();
    const targetHabit = habits.find((h) => h.id === habitId);
    if (!targetHabit) return;

    this._loader.show(`Restoring "${targetHabit.name}" to workspace...`);

    requestAnimationFrame(() => {
      try {
        this._habitApp.restoreHabit(habitId);

        StateController.runManual();

        this._notification.show({
          type: "info",
          message: `Restored: "${targetHabit.name}"`,
          duration: 5000,
          undoAction: () => {
            this._loader.show("Re-archiving record...");
            requestAnimationFrame(() => {
              try {
                this._habitApp.archiveHabit(habitId);
              } finally {
                this._loader.hide();
              }
            });
          },
        });
      } finally {
        this._loader.hide();
      }
    });
  }

  /**
   * Clean up
   */
  destroy() {
    if (this._clickTimeout) {
      clearTimeout(this._clickTimeout);
      this._clickTimeout = null;
    }
  }
}
