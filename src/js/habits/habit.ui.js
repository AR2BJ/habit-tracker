// =============================
// HABIT UI START
// =============================

import { calculateStreak, todayISO as getToday } from "../utils/helpers.js";

import { renderCalendar } from "./habit.calendar.js";

export function renderHabits(habits) {
  const container = document.getElementById("habit-list");

  container.innerHTML = "";

  // =============================
  // EMPTY STATE START
  // =============================

  if (habits.length === 0) {
    container.innerHTML = `
  
    <div
      class="
        border
        border-dashed
        border-gray-700
        rounded-3xl
        p-16
        text-center
        bg-gray-900/30
      "
    >

      <div class="text-6xl mb-6">
        🎯
      </div>

      <h2
        class="
          text-2xl
          font-bold
          text-white
        "
      >
        No habits yet
      </h2>

      <p
        class="
          mt-3
          text-gray-400
          max-w-sm
          mx-auto
        "
      >
        Create your first habit and
        start building consistency.
      </p>

    </div>

  `;

    return;
  }

  // =============================
  // EMPTY STATE END
  // =============================

  habits.forEach((habit) => {
    const { current, best } = calculateStreak(habit.completedDates);

    const completedToday = habit.completedDates.includes(getToday());

    const item = document.createElement("div");

    // =============================
    // HABIT CARD START
    // =============================

    item.className = `
      bg-gradient-to-r
      from-gray-900
      via-gray-950
      to-gray-900
      border
      border-gray-800
      p-7
      rounded-3xl
      transition-all
      duration-300
      hover:border-indigo-500/30
      hover:shadow-2xl
      hover:shadow-indigo-500/5
    `;

    // =============================
    // HABIT CARD END
    // =============================

    item.innerHTML = `
      <div class="space-y-8">
        <!-- Header -->
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-6">
            <button
              data-id="${habit.id}"
              class="toggle-btn w-7 h-7 rounded-full border-[3px] flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                completedToday
                  ? "bg-emerald-500 border-emerald-500"
                  : "border-slate-500"
              }"
            >
              ${completedToday ? "✓" : ""}
            </button>

            <div>
              <h3 class="text-2xl font-bold text-white">${habit.name}</h3>

              <div class="mt-2 text-sm text-orange-400">
                🔥 ${current} day streak
              </div>
            </div>
          </div>

          <div class="flex items-center gap-8">
            <div class="text-center">
              <div class="text-2xl font-bold text-white">${current}</div>

              <div class="text-sm text-gray-400">🔥 day streak</div>
            </div>

            <div class="w-px h-16 bg-gray-800"></div>

            <div class="text-center">
              <div class="text-2xl font-bold text-white">${best}</div>

              <div class="text-sm text-gray-400">🏆 best streak</div>
            </div>

            <div class="w-px h-16 bg-gray-800"></div>

            <div class="relative group">
              <button
                data-id="${habit.id}"
                data-name="${habit.name}"
                class="edit-btn w-10 h-10 rounded-xl bg-blue-300/10 hover:bg-blue-500/10 flex items-center justify-center transition"
              >
                <i
                  class="fa-regular fa-pen-to-square text-blue-500 text-lg"
                ></i>
              </button>

              <div
                class="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-black text-xs text-white opacity-0 group-hover:opacity-100 transition"
              >
                Edit
              </div>
            </div>

            <div class="relative group">
              <button
                data-id="${habit.id}"
                class="delete-btn w-10 h-10 rounded-xl bg-red-300/10 hover:bg-red-500/10 flex items-center justify-center transition"
              >
                <i class="fa-regular fa-trash-can text-red-500 text-xl"></i>
              </button>

              <div
                class="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-black text-xs text-white opacity-0 group-hover:opacity-100 transition"
              >
                Delete
              </div>
            </div>
          </div>
        </div>

        <!-- Calendar -->
        <div class="pt-4 overflow-x-auto">
          ${renderCalendar(habit.completedDates, habit.id)}
        </div>
      </div>
    `;

    container.appendChild(item);
  });
}

// =============================
// HABIT UI END
// =============================
