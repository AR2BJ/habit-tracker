// =============================
// HABIT UI START
// =============================

import { calculateStreak, todayISO } from "../../utils/helpers.js";

import { renderCalendar } from "../habits/habit.calendar.js";
import { state } from "../../models/state.js";

export function renderHabits(habits) {
  const container = document.getElementById("habit-list");

  container.innerHTML = "";

  const isArchived = state.activeTab === "archived";

  const emoji = isArchived ? "🗃️" : "🎯";

  const title = isArchived ? "No archived habits" : "No habits yet";

  const description = isArchived
    ? "Archived habits will appear here."
    : "Create your first habit and start building consistency.";

  // =============================
  // EMPTY STATE START
  // =============================

  if (habits.length === 0) {
    container.innerHTML = `
  
    <div
      class="border border-dashed border-border rounded-3xl p-16 text-center bg-surface-2"
    >

      <div class="text-6xl mb-6">
        ${emoji}
      </div>

      <h2
        class="text-2xl font-bold text-primary"
      >
        ${title}
      </h2>

      <p
        class="mt-3 text-secondary max-w-sm mx-auto"
      >
        ${description}
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

    const completedToday = habit.completedDates.includes(todayISO());

    const isArchived = habit.archived;

    const item = document.createElement("div");

    // =============================
    // HABIT CARD START
    // =============================

    item.className =
      "bg-surface border border-border p-7 rounded-3xl transition-all duration-300 hover:border-brand/30 hover:shadow-2xl hover:shadow-brand/5";

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
              class="toggle-btn w-7 h-7 rounded-full border-[3px] flex items-center justify-center transition-all duration-300 ${
                completedToday
                  ? "bg-emerald-500 border-emerald-500"
                  : "border-border"
              } ${
                isArchived
                  ? "cursor-not-allowed opacity-60 border-border"
                  : "hover:cursor-pointer hover:scale-110"
              }"
            >
              ${completedToday ? "✓" : ""}
            </button>

            <div>
              <h3 class="text-2xl font-bold text-primary">${habit.name}</h3>

              <div class="mt-2 text-sm text-brand">
                🔥 ${current} day streak
              </div>
            </div>
          </div>

          <div class="flex items-center gap-8">
            <div class="text-center">
              <div class="text-2xl font-bold text-primary">${current}</div>

              <div class="text-sm text-secondary">🔥 day streak</div>
            </div>

            <div class="w-px h-16 bg-border"></div>

            <div class="text-center">
              <div class="text-2xl font-bold text-primary">${best}</div>

              <div class="text-sm text-secondary">🏆 best streak</div>
            </div>

            <div class="w-px h-16 bg-border"></div>

            <div class="flex flex-row justify-center items-center gap-3">
              <div class="relative">
                <button
                  data-id="${habit.id}"
                  class="${
                    state.activeTab === "archived"
                      ? "restore-btn"
                      : "archive-btn"
                  }
                    w-10 h-10 rounded-xl
                    ${
                      state.activeTab === "archived"
                        ? "bg-surface-2 hover:bg-green-600/10"
                        : "bg-surface-2 hover:bg-yellow-600/10"
                    }
                    flex items-center justify-center hover:cursor-pointer peer transition"
                >
                  <i
                    class="
                      fa-regular
                      ${
                        state.activeTab === "archived"
                          ? "fa-arrow-rotate-left text-emerald-500"
                          : "fa-box-archive text-yellow-500"
                      }
                    "
                  ></i>
                </button>

                <div
                  class="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-surface-2 text-xs text-primary opacity-0 cursor-default peer-hover:opacity-100 transition"
                >
                  ${state.activeTab === "archived" ? "Restore" : "Archive"}
                </div>
              </div>

              <div class="relative">
                <button
                  data-id="${habit.id}"
                  data-name="${habit.name}"
                  class="edit-btn w-10 h-10 rounded-xl bg-surface-2 hover:bg-blue-600/10 flex items-center justify-center hover:cursor-pointer peer transition"
                >
                  <i
                    class="fa-regular fa-pen-to-square text-blue-500 text-lg"
                  ></i>
                </button>

                <div
                  class="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-surface-2 text-xs text-primary opacity-0 cursor-default peer-hover:opacity-100 transition"
                >
                  Edit
                </div>
              </div>

              <div class="relative">
                <button
                  data-id="${habit.id}"
                  class="delete-btn w-10 h-10 rounded-xl bg-surface-2 hover:bg-red-600/10 flex items-center justify-center hover:cursor-pointer peer transition"
                >
                  <i class="fa-regular fa-trash-can text-red-500 text-xl"></i>
                </button>

                <div
                  class="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-surface-2 text-xs text-primary opacity-0 cursor-default peer-hover:opacity-100 transition"
                >
                  Delete
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Calendar -->
        <div class="pt-4 overflow-x-auto">
          ${renderCalendar(
            habit.completedDates,
            habit.id,
            habit.createdAt,
            habit.archived,
          )}
        </div>
      </div>
    `;

    container.appendChild(item);
  });
}

// =============================
// HABIT UI END
// =============================
