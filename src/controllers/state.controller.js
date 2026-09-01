import { HabitMaintenanceUseCase } from "@/app/habits/habit-maintenance.usecase";
import { NotificationService } from "@/services/notification.service";
import { todayISO } from "@/shared/utils/date.utils";

/**
 * StateController - Manages application state maintenance
 * This is a thin controller that delegates to the maintenance use case
 */
export const StateController = {
  _hasExecuted: false,

  /**
   * Execute maintenance tasks on application startup
   * This should be called once during bootstrap
   */
  execute() {
    // Prevent multiple executions
    if (this._hasExecuted) return;
    this._hasExecuted = true;

    try {
      const today = todayISO();

      // Run all maintenance tasks
      const result = HabitMaintenanceUseCase.runAll(today);

      // Show notification if any changes were made
      if (result.skipped > 0) {
        this._showSkipNotification(result.skipped);
      }

      if (result.archived > 0) {
        this._showArchiveNotification(result.archived);
      }

      // If both happened, show combined notification
      if (result.skipped > 0 && result.archived > 0) {
        this._showCombinedNotification(result.skipped, result.archived);
      }

      return result;
    } catch (error) {
      console.error("State maintenance failed:", error);
      return { skipped: 0, archived: 0, error: error.message };
    }
  },

  /**
   * Show notification for skipped dates
   */
  _showSkipNotification(count) {
    NotificationService.show({
      type: "success",
      message: `${count} day(s) without status have been marked as skipped`,
      icon: "fa-circle-check",
      iconColor: "text-emerald-500/80",
      duration: 5000,
    });
  },

  /**
   * Show notification for archived habits
   */
  _showArchiveNotification(count) {
    NotificationService.show({
      type: "info",
      message: `${count} habit(s) have been archived due to inactivity`,
      icon: "fa-box-archive",
      iconColor: "text-brand/80",
      duration: 5000,
    });
  },

  /**
   * Show combined notification
   */
  _showCombinedNotification(skipped, archived) {
    // Remove previous notifications? Or just show one combined
    NotificationService.show({
      type: "info",
      message: `Maintenance complete: ${skipped} day(s) skipped, ${archived} habit(s) archived`,
      icon: "fa-wand-magic-sparkles",
      iconColor: "text-brand/80",
      duration: 6000,
    });
  },

  /**
   * Reset execution state (for testing)
   */
  reset() {
    this._hasExecuted = false;
  },

  /**
   * Run maintenance manually (for settings)
   */
  runManual() {
    this._hasExecuted = false;
    return this.execute();
  },
};
