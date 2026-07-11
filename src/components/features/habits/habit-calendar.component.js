import { formatDate } from "@/utils/helpers";

export const HabitCalendarComponent = {
  render(dates, habitId, createdAt, isArchived = false, skippedDates = []) {
    const dateSet = new Set(dates);
    const skipSet = new Set(skippedDates);

    const days = [];
    const created = new Date(createdAt);
    const todayDate = new Date();

    const diffDays = Math.floor((todayDate - created) / 86400000);
    const periodIndex = Math.max(0, Math.floor(diffDays / 60));

    const periodStart = new Date(created);
    periodStart.setDate(periodStart.getDate() + periodIndex * 59);

    const periodEnd = new Date(periodStart);
    periodEnd.setDate(periodEnd.getDate() + 59);

    for (let i = 0; i < 60; i++) {
      const date = new Date(periodStart);
      date.setDate(periodStart.getDate() + i);
      const iso = formatDate(date);

      days.push({
        date: iso,
        completed: dateSet.has(iso),
        skipped: skipSet.has(iso),
      });
    }

    const today = formatDate(new Date());
    const yesterday = formatDate(new Date(Date.now() - 86400000));

    return `
    <div class="space-y-4 p-4 overflow-hidden">
      <!-- Timeline -->

      <div class="flex justify-between text-secondary text-xs sm:text-sm select-none">
        <span>${formatDate(periodStart)}</span>
        <span>${formatDate(periodEnd)}</span>
      </div>

      <!-- Calendar Grid -->

      <div class="grid gap-2 grid-cols-5 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-30">
        ${days
          .map((day) => {
            let tooltip = `Status: Pending • ${day.date}`;
            if (day.completed) tooltip = `Status: Completed • ${day.date}`;
            if (day.skipped)
              tooltip = `Status: Skipped (Safeguard) • ${day.date}`;

            const editable = day.date === today || day.date === yesterday;

            let bgClass = "bg-(--color-surface-4)";
            if (day.completed) {
              bgClass = "bg-emerald-500/80 shadow-lg shadow-emerald-500/20";
            } else if (day.skipped) {
              bgClass = "bg-amber-500/80 shadow-lg shadow-amber-500/20";
            }

            return `
              <button
                data-date="${day.date}"
                data-habit-id="${habitId}"
                title="${tooltip}"
                class="calendar-day w-full aspect-square ${
                  editable && !isArchived
                    ? "cursor-pointer hover:scale-110"
                    : "cursor-not-allowed opacity-45"
                } rounded-md flex flex-row justify-center items-center transition-all duration-200 ${bgClass} ${
                  editable && !isArchived && !day.completed && !day.skipped
                    ? "hover:bg-(--color-surface-4)/60"
                    : ""
                }"
              >
                ${
                  day.completed
                    ? `<span class="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl @min-[100rem]:text-4xl leading-none text-white">✓</span>`
                    : day.skipped
                      ? `<span class="text-base xl:text-xl 2xl:text-2xl @min-[100rem]:text-3xl leading-none text-white"><i class="fa-regular fa-shield leading-none text-white"></i></span>`
                      : ""
                }
              </button>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
  },
};
