// =============================
// HABIT CALENDAR START
// =============================

import { formatDate } from "../../utils/helpers.js";

export function renderCalendar(dates, habitId, createdAt, isArchived = false) {
  const dateSet = new Set(dates);

  const days = [];

  const created = new Date(createdAt);

  const today = new Date();

  const diffDays = Math.floor((today - created) / 86400000);

  const periodIndex = Math.max(0, Math.floor(diffDays / 59));

  const showCreatedAt = periodIndex > 0;

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
    });
  }

  return `
    <div class="space-y-4 p-4 overflow-hidden">
      <!-- Timeline -->

      <div class="flex justify-between text-secondary text-sm select-none">
        <span>${formatDate(periodStart)}</span>
        <span>${formatDate(periodEnd)}</span>
      </div>

      <!-- Calendar Grid -->

      <div class="grid gap-2 grid-cols-10 md:grid-cols-12 lg:grid-cols-30">
        ${days
          .map((day) => {
            const today = formatDate(new Date());

            const yesterday = formatDate(new Date(Date.now() - 86400000));

            const tooltip = day.completed
              ? `Completed • ${day.date}`
              : day.date < today
                ? `Missed • ${day.date}`
                : `Upcoming • ${day.date}`;

            const editable = day.date === today || day.date === yesterday;

            return `
              <button
                data-date="${day.date}"
                data-habit-id="${habitId}"
                title="${tooltip}"
                class="calendar-day w-full aspect-square ${
                  editable && !isArchived
                    ? "cursor-pointer hover:scale-110"
                    : "cursor-not-allowed opacity-60"
                } rounded-md flex flex-row justify-center items-center transition-all duration-200 ${
                  day.completed
                    ? "bg-emerald-500 shadow-lg shadow-emerald-500/20"
                    : "bg-(--color-surface-3)"
                } ${
                  editable && !isArchived && !day.completed
                    ? "hover:bg-(--color-surface-3)/70"
                    : ""
                }"
              >
                ${
                  day.completed
                    ? `<span class="text-2xl lg:text-xl leading-none">✓</span>`
                    : ""
                }
              </button>
            `;
          })
          .join("")}
      </div>
      ${
        showCreatedAt
          ? `
            <div class="ps-1.5 pt-3 text-xs text-gray-500 italic text-left">
              Created: ${createdAt}
            </div>
          `
          : ""
      }

    </div>
  `;
}

// =============================
// HABIT CALENDAR END
// =============================
