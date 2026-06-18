import { StateManager, state } from "../../models/state.model.js";
import { formatDate, todayISO } from "../../utils/helpers.js";
import {
  setPendingDeleteId,
  setPendingEditId,
} from "./habit-form.controller.js";

import { HabitService } from "../../services/habit.service.js";
import { NotificationService } from "../../services/notification.service.js";

let clickTimeout = null;

export const HabitActionController = {
  init(mainController) {
    this.mainController = mainController;
    this.bindDynamicEvents();
  },

  bindDynamicEvents() {
    const listContainer = document.getElementById("habit-list");
    if (!listContainer) return;

    listContainer.addEventListener("click", (e) => {
      const target = e.target;

      // ۱. دکمه تیک زدن امروز
      const toggleBtn = target.closest(".toggle-btn");
      if (toggleBtn) {
        const id = toggleBtn.dataset.id;
        const currentHabits = StateManager.getHabits();
        const habit = currentHabits.find((h) => h.id === id);

        try {
          if (habit) {
            const updated = HabitService.toggleHabit(currentHabits, id);
            StateManager.save(updated);
            this.mainController.refreshUI();

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

      // ۲. کلیک روی روزهای تقویم (تک‌کلیک تیک / دبل‌کلیک اسکیپ)
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
            this.mainController.refreshUI();

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
              this.mainController.refreshUI();

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

      // ۳. دکمه ویرایش کارت
      const editBtn = target.closest(".edit-btn");
      if (editBtn) {
        const id = editBtn.dataset.id;
        setPendingEditId(id);
        const habit = StateManager.getHabits().find((h) => h.id === id);
        const editInput = document.getElementById("edit-habit-input");
        if (editInput && habit) editInput.value = habit.name;
        this.mainController.toggleModal("edit-modal", true);
        return;
      }

      // ۴. دکمه حذف کارت
      const deleteBtn = target.closest(".delete-btn");
      if (deleteBtn) {
        setPendingDeleteId(deleteBtn.dataset.id);
        this.mainController.toggleModal("delete-modal", true);
        return;
      }

      // ۵. دکمه آرشیو کارت
      const archiveBtn = target.closest(".archive-btn");
      if (archiveBtn) {
        const id = archiveBtn.dataset.id;
        const currentHabits = StateManager.getHabits();
        const targetHabit = currentHabits.find((h) => h.id === id);

        if (targetHabit) {
          const updated = HabitService.archiveHabit(currentHabits, id);
          StateManager.save(updated);
          this.mainController.refreshUI();

          NotificationService.show({
            type: "archive",
            message: `Archived: "${targetHabit.name}"`,
            duration: 4000,
            undoAction: () => {
              const rollbackHabits = StateManager.getHabits();
              const restored = HabitService.restoreHabit(rollbackHabits, id);
              StateManager.save(restored);
              this.mainController.refreshUI();
            },
          });
        }
        return;
      }

      // ۶. دکمه بازگردانی از آرشیو
      const restoreBtn = target.closest(".restore-btn");
      if (restoreBtn) {
        const id = restoreBtn.dataset.id;
        const currentHabits = StateManager.getHabits();
        const targetHabit = currentHabits.find((h) => h.id === id);

        if (targetHabit) {
          const updated = HabitService.restoreHabit(currentHabits, id);
          StateManager.save(updated);
          this.mainController.refreshUI();

          NotificationService.show({
            type: "restore",
            message: `Restored: "${targetHabit.name}"`,
            duration: 4000,
            undoAction: () => {
              const rollbackHabits = StateManager.getHabits();
              const archived = HabitService.archiveHabit(rollbackHabits, id);
              StateManager.save(archived);
              this.mainController.refreshUI();
            },
          });
        }
        return;
      }
    });
  },
};
