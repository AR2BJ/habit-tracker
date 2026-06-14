// =============================
// DASHBOARD START
// =============================

import {
  calculateStreak,
  calculateSuccessRate,
  formatDate,
} from "../utils/helpers.js";

export function renderDashboard(habits) {
  const dashboard = document.getElementById("dashboard");

  const today = formatDate(new Date());

  const totalHabits = habits.length;

  const completedToday = habits.filter((habit) =>
    habit.completedDates.includes(today),
  ).length;

  const bestStreak = Math.max(
    0,
    ...habits.map((habit) => calculateStreak(habit.completedDates).best),
  );

  const averageSuccessRate = habits.length
    ? Math.round(
        habits.reduce((sum, habit) => sum + calculateSuccessRate(habit), 0) /
          habits.length,
      )
    : 0;

  const archivedCount = habits.filter((habit) => habit.archived).length;

  dashboard.innerHTML = `
    <div
      class="bg-surface border border-border hover:-translate-y-1 hover:border-brand/30 rounded-3xl p-6 transition"
    >
      <div class="text-secondary text-sm truncate">🎯 Total Habits</div>

      <div class="text-3xl font-bold mt-2 text-primary">${totalHabits}</div>
    </div>

    <div
      class="bg-surface border border-border hover:-translate-y-1 hover:border-brand/30 rounded-3xl p-6 transition"
    >
      <div class="text-secondary text-sm truncate">✅ Completed Today</div>

      <div class="text-3xl font-bold mt-2 text-primary">${completedToday}</div>
    </div>

    <div
      class="bg-surface border border-border hover:-translate-y-1 hover:border-brand/30 rounded-3xl p-6 transition"
    >
      <div class="text-secondary text-sm truncate">🔥 Best Streak</div>

      <div class="text-3xl font-bold mt-2 text-primary">${bestStreak}</div>
    </div>

    <div
      class="bg-surface border border-border hover:-translate-y-1 hover:border-brand/30 rounded-3xl p-6 transition"
    >
      <div class="text-secondary text-sm truncate">📈 Success Rate</div>

      <div class="text-3xl font-bold mt-2 text-primary">${averageSuccessRate}%</div>
    </div>

    <div
      class="bg-surface border border-border hover:-translate-y-1 hover:border-brand/30 rounded-3xl p-6 transition"
    >
      <div class="text-secondary text-sm truncate">🗃️ Archived</div>

      <div class="text-3xl font-bold mt-2 text-primary">${archivedCount}</div>
    </div>
  `;
}

// =============================
// DASHBOARD END
// =============================
