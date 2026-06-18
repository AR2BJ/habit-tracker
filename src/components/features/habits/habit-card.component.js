import { calculateStreak, todayISO } from "@/utils/helpers.js";

import { HabitCalendarComponent } from "./habit-calendar.component";

export const HabitCardComponent = {
  render(habit) {
    const { current, best } = calculateStreak(
      habit.completedDates,
      habit.skippedDates || [],
    );
    const completedToday = habit.completedDates.includes(todayISO());
    const totalChecks = habit.completedDates.length;
    const isHabitArchived = habit.archived;

    const categoryColors = {
      General: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      Health: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      Work: "bg-sky-500/10 text-sky-500 border-sky-500/20",
      Finance: "bg-violet-500/10 text-violet-500 border-violet-500/20",
      Mind: "bg-rose-500/10 text-rose-500 border-rose-500/20",
      Harmful: "bg-mauve-500/10 text-mauve-500 border-mauve-500/20",
    };
    const badgeClass = categoryColors[habit.category] || categoryColors.General;

    const actionButtonClass = isHabitArchived
      ? "restore-btn hover:bg-emerald-600/10"
      : "archive-btn hover:bg-yellow-600/10";
    const actionTooltip = isHabitArchived ? "Restore" : "Archive";
    const actionIcon = isHabitArchived
      ? "fa-arrow-rotate-left text-emerald-500"
      : "fa-box-archive text-amber-500";

    return `
      <div class="flex flex-col gap-4">
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-4">
            ${
              isHabitArchived
                ? ""
                : `
                  <button
                    data-id="${habit.id}"
                    class="toggle-btn w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition hover:cursor-pointer ${
                      completedToday
                        ? "bg-brand border-brand text-(--color-btn-primary-text) shadow-lg shadow-brand/20"
                        : "border-border text-secondary hover:border-brand hover:text-brand"
                    }"
                  >
                    <i class="fa-regular ${completedToday ? "fa-check text-xl font-bold" : "fa-square text-lg"}"></i>
                  </button>
                `
            }

            <div>
              <div class="flex items-center flex-wrap gap-2">
                <h3 class="text-lg font-semibold text-primary">
                  ${habit.name}
                </h3>
                <span
                  class="text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}"
                >
                  ${habit.category ?? "General"}
                </span>
                <span
                  class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-3 border border-border text-secondary"
                >
                  ${habit.frequency ?? 7} days/wk
                </span>
              </div>
              <p class="text-xs text-secondary mt-1">
                Created on ${habit.createdAt} • Total ${totalChecks} check-ins
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <div
              class="hidden sm:flex items-center gap-4 mr-2 border-r border-border pr-4"
            >
              <div class="text-center">
                <span class="block text-xs font-bold text-primary"
                  >${current}d</span
                >
                <span
                  class="text-[10px] text-secondary uppercase tracking-wider font-semibold"
                  >Streak</span
                >
              </div>
              <div class="text-center">
                <span class="block text-xs font-bold text-primary"
                  >${best}d</span
                >
                <span
                  class="text-[10px] text-secondary uppercase tracking-wider font-semibold"
                  >Best</span
                >
              </div>
            </div>

            <div class="flex items-center gap-2">
              <div class="relative">
                <button
                  data-id="${habit.id}"
                  class="${actionButtonClass} w-10 h-10 rounded-xl bg-surface-3 border border-border flex items-center justify-center hover:cursor-pointer peer transition"
                >
                  <i class="fa-regular ${actionIcon} text-lg"></i>
                </button>
                <div
                  class="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-surface-2 text-xs text-primary opacity-0 cursor-default peer-hover:opacity-100 transition z-10"
                >
                  ${actionTooltip}
                </div>
              </div>

              <div class="relative">
                <button
                  data-id="${habit.id}"
                  class="edit-btn w-10 h-10 rounded-xl bg-surface-3 hover:bg-blue-600/10 border border-border flex items-center justify-center hover:cursor-pointer peer transition"
                >
                  <i
                    class="fa-regular fa-pen-to-square text-blue-500 text-lg"
                  ></i>
                </button>
                <div
                  class="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-surface-2 text-xs text-primary opacity-0 cursor-default peer-hover:opacity-100 transition z-10"
                >
                  Edit
                </div>
              </div>

              <div class="relative">
                <button
                  data-id="${habit.id}"
                  class="delete-btn w-10 h-10 rounded-xl bg-surface-3 hover:bg-red-600/10 border border-border flex items-center justify-center hover:cursor-pointer peer transition"
                >
                  <i class="fa-regular fa-trash-can text-red-500 text-lg"></i>
                </button>
                <div
                  class="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-surface-2 text-xs text-primary opacity-0 cursor-default peer-hover:opacity-100 transition z-10"
                >
                  Delete
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-2 overflow-x-auto">
          ${HabitCalendarComponent.render(
            habit.completedDates,
            habit.id,
            habit.createdAt,
            habit.archived,
            habit.skippedDates || [],
          )}
        </div>
      </div>
    `;
  },
};
