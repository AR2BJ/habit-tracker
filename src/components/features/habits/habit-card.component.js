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

    const checkTooltip = completedToday ? "Uncheck Today" : "Check Today";

    return `
      <div
        data-id="${habit.id}"
        class="habit-card group relative flex flex-col gap-4 p-4 md:p-6"
      >
        <div
          class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div class="flex flex-row justify-start items-start gap-3 min-w-0 pr-8 md:pr-0">
            <div class="relative shrink-0">
              ${
                isHabitArchived
                  ? ""
                  : `
                  <button
                    data-id="${habit.id}"
                    class="toggle-btn w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl border-2 flex items-center justify-center transition peer hover:cursor-pointer ${
                      completedToday
                        ? "bg-brand/80 border-brand/80 text-(--color-btn-primary-text) shadow-lg shadow-brand/20"
                        : "border-border text-secondary hover:border-brand/80 hover:text-brand/80"
                    }"
                  >
                    <i class="fa-regular ${completedToday ? "fa-check text-base md:text-xl font-bold" : "fa-square text-sm md:text-lg"}"></i>
                  </button>
                `
              }
              <div
                class="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-surface-2 text-xs text-primary opacity-0 cursor-default peer-hover:opacity-100 transition z-10 whitespace-nowrap pointer-events-none border border-border/60"
              >
                ${checkTooltip}
              </div>
            </div>

            <div class="flex flex-col min-w-0">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span
                  class="px-2 py-0.5 text-[9px] md:text-[10px] font-bold rounded-md border ${badgeClass} whitespace-nowrap"
                >
                  ${habit.category}
                </span>
                <span
                  class="px-2 py-0.5 text-[9px] md:text-[10px] font-bold rounded-md border border-border text-secondary whitespace-nowrap"
                >
                  ${habit.frequency ?? 7} days/wk
                </span>
              </div>
              <h2
                class="mt-1 text-sm md:text-base font-bold text-primary tracking-tight leading-snug wrap-break-word"
              >
                ${habit.name}
              </h2>
              <p class="text-[10px] md:text-xs text-secondary mt-0.5">
                Created on ${habit.createdAt}
              </p>
            </div>
          </div>

          <div class="flex flex-row justify-end items-center gap-4 w-full md:w-auto">

            <div
              class="grid grid-cols-3 gap-1 w-full md:w-auto md:flex md:items-center md:gap-5 bg-surface-2/40 md:bg-transparent p-2 md:p-0 rounded-2xl border border-border/40 md:border-0"
            >
              <div
                class="flex flex-col items-center px-1 border-r border-border/40 md:border-0"
              >
                <span
                  class="text-[9px] md:text-xs font-semibold text-secondary uppercase tracking-wider"
                  >Current</span
                >
                <span
                  class="text-xs md:text-sm font-bold text-primary flex items-center gap-1 mt-0.5"
                >
                  <i class="fa-solid fa-fire text-amber-500 text-[10px] md:text-sm"></i>
                  <span>${current}d</span>
                </span>
              </div>
              <div
                class="flex flex-col items-center px-1 border-r border-border/40 md:border-0"
              >
                <span
                  class="text-[9px] md:text-xs font-semibold text-secondary uppercase tracking-wider"
                  >Best</span
                >
                <span
                  class="text-xs md:text-sm font-bold text-primary flex items-center gap-1 mt-0.5"
                >
                  <i class="fa-solid fa-crown text-yellow-500 text-[10px] md:text-sm"></i>
                  <span>${best}d</span>
                </span>
              </div>
              <div class="flex flex-col items-center px-1">
                <span
                  class="text-[9px] md:text-xs font-semibold text-secondary uppercase tracking-wider"
                  >Total</span
                >
                <span
                  class="text-xs md:text-sm font-bold text-primary flex items-center gap-1 mt-0.5"
                >
                  <i class="fa-solid fa-chart-simple text-brand/80 text-[10px] md:text-sm"></i>
                  <span>${totalChecks}</span>
                </span>
              </div>
            </div>

            <div class="hidden md:flex separator w-px h-8 bg-border/70"></div>

            <div
              class="absolute top-3 right-3 md:static md:top-auto md:right-auto z-20 shrink-0"
            >
              <div class="hidden md:flex items-center gap-2">
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
                    class="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-surface-2 text-xs text-primary opacity-0 cursor-default peer-hover:opacity-100 transition z-10 whitespace-nowrap pointer-events-none border border-border/60"
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
                    class="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-surface-2 text-xs text-primary opacity-0 cursor-default peer-hover:opacity-100 transition z-10 whitespace-nowrap pointer-events-none border border-border/60"
                  >
                    Delete
                  </div>
                </div>
              </div>

              <div class="flex md:hidden relative dropdown-container">
                <button
                  data-id="${habit.id}"
                  class="dropdown-toggle-btn h-8 w-8 rounded-lg border border-border bg-surface text-secondary hover:text-primary hover:bg-surface-2 flex items-center justify-center transition shadow-sm cursor-pointer"
                >
                  <i class="fa-regular fa-ellipsis-vertical text-sm"></i>
                </button>

                <div
                  data-id="${habit.id}"
                  class="dropdown-menu absolute right-0 mt-1.5 w-40 rounded-xl border border-border bg-surface p-1 shadow-xl hidden z-30 flex-col gap-0.5"
                >
                  <button
                    data-id="${habit.id}"
                    class="${
                      isHabitArchived ? "restore-btn" : "archive-btn"
                    } flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium border-0 bg-transparent text-secondary hover:text-primary hover:bg-surface-2 transition cursor-pointer"
                  >
                    <i class="fa-regular ${actionIcon} text-xs"></i>
                    <span
                      >${
                        isHabitArchived ? "Restore Habit" : "Archive Habit"
                      }</span
                    >
                  </button>

                  <button
                    data-id="${habit.id}"
                    class="edit-btn flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium border-0 bg-transparent text-secondary hover:text-primary hover:bg-surface-2 transition cursor-pointer"
                  >
                    <i
                      class="fa-regular fa-pen-to-square text-xs text-blue-500"
                    ></i>
                    <span>Edit Title</span>
                  </button>

                  <div class="my-0.5 border-t border-border/40"></div>

                  <button
                    data-id="${habit.id}"
                    class="delete-btn flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium border-0 bg-transparent text-red-500 hover:bg-red-500/5 transition cursor-pointer"
                  >
                    <i class="fa-regular fa-trash-can text-xs"></i>
                    <span>Delete Permanently</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto pt-1 scrollbar-thin">
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
