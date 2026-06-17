import {
  calculateStreak,
  calculateSuccessRate,
  todayISO,
} from "../../utils/helpers.js";

import { renderCalendar } from "../habits/habit.calendar.js";
import { state } from "../../models/state.model.js";

export function renderHabits(habits, activeTab = "active") {
  const container = document.getElementById("habit-list");
  if (!container) return;

  container.innerHTML = "";

  const isArchived = activeTab === "archived";
  const emoji = isArchived ? "🗃️" : "🎯";
  const title = isArchived ? "No archived habits" : "No habits yet";
  const description = isArchived
    ? "Archived habits will appear here."
    : "Create your first habit and start building consistency.";

  if (habits.length === 0) {
    container.innerHTML = `
      <div class="border border-dashed border-border rounded-3xl p-16 text-center bg-surface-2">
        <div class="text-6xl mb-6">${emoji}</div>
        <h2 class="text-2xl font-bold text-primary">${title}</h2>
        <p class="mt-3 text-secondary max-w-sm mx-auto">${description}</p>
      </div>
    `;
    return;
  }

  habits.forEach((habit) => {
    const { current, best } = calculateStreak(habit.completedDates);

    const completedToday = habit.completedDates.includes(todayISO());

    const totalChecks = habit.completedDates.length;

    const isArchived = habit.archived;

    const successRate = calculateSuccessRate(habit);

    const item = document.createElement("div");

    item.className =
      "bg-surface border border-border p-7 rounded-3xl transition-all duration-300 hover:border-brand/30 hover:shadow-2xl hover:shadow-brand/5";

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
              <div
                class="mt-2 text-sm text-secondary flex items-center gap-1.5"
              >
                <i
                  class="fa-regular fa-check-double text-lg opacity-75 text-emerald-500"
                ></i>
                Total: ${totalChecks} ticks
              </div>
            </div>
          </div>

          <div class="flex items-center gap-8">
            <div class="text-center">
              <div class="text-2xl font-bold">${successRate}%</div>
              <div
                class="text-sm text-secondary flex flex-row justify-center items-center gap-2"
              >
                <i
                  class="fa-regular fa-chart-line text-lg text-brand opacity-70"
                ></i>
                success rate
              </div>
            </div>

            <div class="w-px h-16 bg-border"></div>

            <div class="text-center">
              <div class="text-2xl font-bold text-primary">${current}</div>
              <div
                class="text-sm text-secondary flex flex-row justify-center items-center gap-2"
              >
                <i
                  class="fa-regular fa-fire text-lg text-orange-500 opacity-70"
                ></i>
                day streak
              </div>
            </div>

            <div class="w-px h-16 bg-border"></div>

            <div class="text-center">
              <div class="text-2xl font-bold text-primary">${best}</div>
              <div
                class="text-sm text-secondary flex flex-row justify-center items-center gap-2"
              >
                <i
                  class="fa-regular fa-trophy text-lg text-yellow-500 opacity-70"
                ></i>
                best streak
              </div>
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
                    class="fa-regular ${
                      state.activeTab === "archived"
                        ? "fa-arrow-rotate-left text-emerald-500"
                        : "fa-box-archive text-yellow-500"
                    }"
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
