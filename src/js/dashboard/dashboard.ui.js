// =============================
// DASHBOARD START
// =============================

import { calculateStreak } from "../utils/helpers.js";

export function renderDashboard(habits) {
  const dashboard = document.getElementById("dashboard");

  const today = new Date().toISOString().split("T")[0];

  const totalHabits = habits.length;

  const completedToday = habits.filter((habit) =>
    habit.completedDates.includes(today),
  ).length;

  const bestStreak = Math.max(
    0,
    ...habits.map((habit) => calculateStreak(habit.completedDates).best),
  );

  const totalCompletions = habits.reduce(
    (sum, habit) => sum + habit.completedDates.length,
    0,
  );

  dashboard.innerHTML = `
    <div
      class="bg-gray-900 border border-gray-800 hover:-translate-y-1
      hover:border-indigo-500/30 rounded-3xl p-6 transition"
    >
      <div class="text-gray-400 text-sm truncate">🎯 Total Habits</div>

      <div class="text-3xl font-bold mt-2">${totalHabits}</div>
    </div>

    <div
      class="bg-gray-900 border border-gray-800 hover:-translate-y-1
      hover:border-indigo-500/30 rounded-3xl p-6 transition"
    >
      <div class="text-gray-400 text-sm truncate">✅ Completed Today</div>

      <div class="text-3xl font-bold mt-2">${completedToday}</div>
    </div>

    <div
      class="bg-gray-900 border border-gray-800 hover:-translate-y-1
      hover:border-indigo-500/30 rounded-3xl p-6 transition"
    >
      <div class="text-gray-400 text-sm truncate">🔥 Best Streak</div>

      <div class="text-3xl font-bold mt-2">${bestStreak}</div>
    </div>

    <div
      class="bg-gray-900 border border-gray-800 hover:-translate-y-1
      hover:border-indigo-500/30 rounded-3xl p-6 transition"
    >
      <div class="text-gray-400 text-sm truncate">📈 Total Completions</div>

      <div class="text-3xl font-bold mt-2">${totalCompletions}</div>
    </div>
  `;
}

// =============================
// DASHBOARD END
// =============================
