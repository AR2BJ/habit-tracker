import { SprintCalculator } from "@/domain/habits/habit-sprint.calculator";
import { todayISO } from "@/shared/utils/date.utils";

export const HabitCalendarComponent = {
  /**
   * Render habit calendar
   * @param {Object} habit - Habit object
   * @param {string} today - ISO date string of today (for consistency)
   * @returns {string} HTML string
   */
  render(habit, today = todayISO()) {
    const {
      createdAt,
      id,
      archived,
    } = habit;

    // Calculate sprint
    const { sprintIndex, sprintStart, sprintEnd } =
      SprintCalculator.calculateSprint(createdAt, today);

    // Generate days
    const days = SprintCalculator.generateSprintDays(sprintStart, 60);

    return `
      <div
        class="space-y-4 p-3 sm:p-4 w-full max-w-full overflow-hidden box-border"
      >
        <div
          class="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-center text-secondary text-xs sm:text-sm select-none font-medium w-full"
        >
          <span
            class="flex items-center gap-1 order-2 sm:order-1 text-[11px] sm:text-xs md:text-sm whitespace-nowrap"
          >
            <i class="fa-regular fa-calendar-range text-brand/70"></i>
            Start: ${sprintStart}
          </span>

          <span
            class="relative inline-flex items-center justify-center order-1 sm:order-2"
          >
            <span
              class="absolute inset-0 animate-micro-ping rounded-full bg-brand/25"
            ></span>
            <span
              class="relative text-[10px] sm:text-xs bg-brand/10 text-brand/80 px-3 py-1 rounded-full font-bold tracking-wide border border-brand/20 shadow-sm select-none whitespace-nowrap"
            >
              Sprint ${sprintIndex + 1}
            </span>
          </span>

          <span
            class="flex items-center gap-1 order-3 text-[11px] sm:text-xs md:text-sm whitespace-nowrap"
          >
            End: ${sprintEnd}
            <i class="fa-regular fa-calendar-check text-brand/70"></i>
          </span>
        </div>

        <div
          class="grid gap-1 sm:gap-1.5 md:gap-2 grid-cols-5 xs:grid-cols-6 sm:grid-cols-10 md:grid-cols-15 xl:grid-cols-30 w-full distribution-grid"
        >
          ${days
            .map((date) => {
              const status = SprintCalculator.getDayStatus(habit, date);
              const editable =
                !archived && SprintCalculator.isDateEditable(date, today);

              let tooltip = `Status: Pending • ${date}`;
              let bgClass = "bg-surface-4";

              if (status === "completed") {
                tooltip = `Status: Completed • ${date}`;
                bgClass =
                  "bg-emerald-500/80 shadow-md sm:shadow-lg shadow-emerald-500/20 text-white";
              } else if (status === "skipped") {
                tooltip = `Status: Skipped (Auto Guard) • ${date}`;
                bgClass =
                  "bg-amber-500/80 shadow-md sm:shadow-lg shadow-amber-500/20 text-white";
              }

              const icon =
                status === "completed"
                  ? '<i class="fa-regular fa-check"></i>'
                  : status === "skipped"
                    ? '<i class="fa-regular fa-shield"></i>'
                    : "";

              return `
            <button
              data-date="${date}"
              data-habit-id="${id}"
              title="${tooltip}"
              class="calendar-day w-full aspect-square ${
                editable
                  ? "cursor-pointer hover:scale-105 sm:hover:scale-110 active:scale-95 border border-brand/40 sm:border-2"
                  : "cursor-not-allowed opacity-45"
              } rounded-sm sm:rounded-md flex flex-row justify-center items-center transition-all duration-200 ${bgClass} ${
                editable && status === "pending" ? "hover:bg-surface-4/60" : ""
              }"
            >
              ${icon ? `<span class="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold leading-none select-none">${icon}</span>` : ""}
            </button>
          `;
            })
            .join("")}
        </div>
      </div>
    `;
  },
};
