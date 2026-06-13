// =============================
// HABIT CALENDAR START
// =============================

export function renderCalendar(dates, habitId, isArchived = false) {
  const dateSet = new Set(dates);

  const days = [];

  const totalDays = 59;

  for (let i = totalDays; i >= 0; i--) {
    const date = new Date();

    date.setDate(date.getDate() - i);

    const iso = date.toISOString().split("T")[0];

    days.push({
      date: iso,
      completed: dateSet.has(iso),
    });
  }

  return `
    <div class="space-y-4 p-1 overflow-hidden">
      <!-- Timeline -->

      <div
        class="
          flex
          justify-between
          text-gray-400
          text-sm
          select-none
        "
      >
        <span>60 days ago</span>

        <span>Today</span>
      </div>

      <!-- Calendar Grid -->

      <div
        class="
          grid
          grid-flow-col
          grid-rows-2
          gap-2
          w-max
        "
      >
        ${days
          .map((day) => {
            const today = new Date().toISOString().split("T")[0];

            const yesterday = new Date(Date.now() - 86400000)
              .toISOString()
              .split("T")[0];

            const editable = day.date === today || day.date === yesterday;

            return `
              <div
                data-date="${day.date}"
                data-habit-id="${habitId}"
                title="${day.date}"
                class="calendar-day
                ${editable && !isArchived ? "cursor-pointer hover:scale-110" : "cursor-not-allowed opacity-60"}
                w-5.5
                h-5.5
                rounded-md
                transition-all
                duration-200
                ${
                  day.completed
                    ? "bg-emerald-500 shadow-lg shadow-emerald-500/20"
                    : "bg-slate-700"
                }
                ${editable && !isArchived && !day.completed ? "hover:bg-slate-600" : ""}
              "
              ></div>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

// =============================
// HABIT CALENDAR END
// =============================
