import {
  calculateStreak,
  calculateSuccessRate,
  formatDate,
} from "@/utils/helpers";

export const DashboardComponent = {
  render(habits) {
    const todayStr = formatDate(new Date());
    const totalHabits = habits.length;

    const completedToday = habits.filter((habit) =>
      habit.completedDates.includes(todayStr),
    ).length;

    const bestStreak = habits.length
      ? Math.max(
          0,
          ...habits.map((habit) => calculateStreak(habit.completedDates).best),
        )
      : 0;

    const averageSuccessRate = habits.length
      ? Math.round(
          habits.reduce((sum, habit) => sum + calculateSuccessRate(habit), 0) /
            habits.length,
        )
      : 0;

    const archivedCount = habits.filter((habit) => habit.archived).length;
    const activeHabits = habits.filter((h) => !h.archived);

    return `
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full col-span-full">
      <div class="bg-surface-2 border border-border hover:-translate-y-1 hover:border-brand/30 rounded-3xl p-6 transition shadow-sm flex flex-col justify-between min-h-36">
        <div class="flex items-center justify-between gap-2 text-secondary">
          <span class="text-sm font-bold tracking-wide truncate">Total Habits</span>
          <i class="fa-regular fa-layer-group text-6xl opacity-70 text-sky-500"></i>
        </div>
        <div class="text-4xl font-extrabold tracking-tight text-primary mt-3">${totalHabits}</div>
      </div>

      <div class="bg-surface-2 border border-border hover:-translate-y-1 hover:border-brand/30 rounded-3xl p-6 transition shadow-sm flex flex-col justify-between min-h-36">
        <div class="flex items-center justify-between gap-2 text-secondary">
          <span class="text-sm font-bold tracking-wide truncate">Completed Today</span>
          <i class="fa-regular fa-circle-check text-6xl opacity-70 text-emerald-500"></i>
        </div>
        <div class="text-4xl font-extrabold tracking-tight text-primary mt-3">${completedToday}</div>
      </div>

      <div class="bg-surface-2 border border-border hover:-translate-y-1 hover:border-brand/30 rounded-3xl p-6 transition shadow-sm flex flex-col justify-between min-h-36">
        <div class="flex items-center justify-between gap-2 text-secondary">
          <span class="text-sm font-bold tracking-wide truncate">Best Streak</span>
          <i class="fa-regular fa-fire text-6xl text-orange-500 opacity-70"></i>
        </div>
        <div class="text-4xl font-extrabold tracking-tight text-primary mt-3">${bestStreak}<span class="text-sm font-bold text-secondary ml-1">days</span></div>
      </div>

      <div class="bg-surface-2 border border-border hover:-translate-y-1 hover:border-brand/30 rounded-3xl p-6 transition shadow-sm flex flex-col justify-between min-h-36">
        <div class="flex items-center justify-between gap-2 text-secondary">
          <span class="text-sm font-bold tracking-wide truncate">Avg Success</span>
          <i class="fa-regular fa-chart-line text-6xl text-brand opacity-70"></i>
        </div>
        <div class="text-4xl font-extrabold tracking-tight text-primary mt-3">${averageSuccessRate}%</div>
      </div>

      <div class="col-span-2 md:col-span-4 lg:col-span-1 bg-surface-2 border border-border hover:-translate-y-1 hover:border-brand/30 rounded-3xl p-6 transition shadow-sm flex flex-col justify-between min-h-36">
        <div class="flex items-center justify-between gap-2 text-secondary">
          <span class="text-sm font-bold tracking-wide truncate">Archived</span>
          <i class="fa-regular fa-box-archive text-6xl opacity-70"></i>
        </div>
        <div class="text-4xl font-extrabold tracking-tight text-primary mt-3">${archivedCount}</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full col-span-full mt-6">
      <div class="lg:col-span-2 bg-surface-2 border border-border rounded-3xl p-6 flex flex-col justify-between shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h4 class="text-lg font-bold text-primary flex items-center gap-2">
              <i class="fa-regular fa-calendar text-brand text-2xl"></i> Lifetime Activity Grid
            </h4>
            <p class="text-sm text-secondary mt-1">Advanced multi-tier habit density repository mapped by sprint lifecycle.</p>
          </div>

          <div id="chart-view-switcher" class="relative flex w-fit bg-surface-2 rounded-2xl p-1 border border-border isolation-auto">
            <div id="heatmap-tab-indicator" class="absolute top-1 left-1 h-[calc(100%-8px)] w-27.5 rounded-xl bg-brand transition-all duration-300 ease-out z-0 shadow-sm" style="background-color: var(--color-brand, #00bc7d);"></div>

            <button data-view="weekly" id="view-btn-weekly" class="relative z-10 w-27.5 py-2 text-sm font-bold text-secondary transition cursor-pointer">Weekly</button>
            <button data-view="monthly" id="view-btn-monthly" class="relative z-10 w-27.5 py-2 text-sm font-bold text-secondary transition cursor-pointer">Monthly</button>
            <button data-view="yearly" id="view-btn-yearly" class="relative z-10 w-27.5 py-2 text-sm font-bold text-secondary transition cursor-pointer">Yearly</button>
          </div>
        </div>
        <div id="apex-heatmap-chart" class="w-full mt-6"></div>
      </div>

      <div class="bg-surface-2 border border-border rounded-3xl p-6 flex flex-col justify-between shadow-sm">
        <div>
          <h4 class="text-lg font-bold text-primary flex items-center gap-2">
            <i class="fa-regular fa-chart-simple text-amber-500 text-2xl"></i> Weekday Distribution
          </h4>
          <p class="text-sm text-secondary mt-1">Analysis of your execution behavior mapped by day of the week.</p>
        </div>
        <div id="apex-weekday-chart" class="w-full"></div>
      </div>
    </div>

    <div class="w-full col-span-full mt-8 space-y-4">
      <h3 class="text-xl font-bold text-primary tracking-tight flex items-center gap-2">
        <i class="fa-regular fa-layer-group text-brand text-3xl"></i> Individual All-Time Analytics
      </h3>
      <div class="grid grid-cols-1 gap-4">
        ${
          activeHabits.length === 0
            ? `<div class="text-center py-12 text-secondary text-base bg-surface-2 rounded-3xl border border-dashed border-border flex flex-col items-center justify-center gap-2">
                <i class="fa-regular fa-box-open text-2xl opacity-40"></i>
                <span>No active habits to review.</span>
               </div>`
            : activeHabits
                .map((habit) => {
                  const stats = calculateStreak(habit.completedDates);
                  const totalChecks = habit.completedDates.length;
                  const lifetimeRate = calculateSuccessRate(habit);

                  let batteryColor = "bg-red-500";
                  let batteryText = "At Risk";
                  let badgeStyle =
                    "border-red-500/20 bg-red-500/5 text-red-500";

                  if (lifetimeRate >= 75) {
                    batteryColor = "bg-emerald-500";
                    batteryText = "Solidified";
                    badgeStyle =
                      "border-emerald-500/20 bg-emerald-500/5 text-emerald-500";
                  } else if (lifetimeRate >= 45) {
                    batteryColor = "bg-amber-500";
                    batteryText = "Stabilizing";
                    badgeStyle =
                      "border-amber-500/20 bg-amber-500/5 text-amber-500";
                  }

                  return `
                    <div class="bg-surface-2 border border-border rounded-3xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-md transition duration-200">
                      <div>
                        <h4 class="text-lg font-bold text-primary">${habit.name}</h4>
                        <p class="text-sm text-secondary mt-1"><i class="fa-regular fa-clock text-xs"></i> Since: ${habit.createdAt}</p>
                      </div>
                      <div class="grid grid-cols-3 gap-6 text-center bg-surface-2/40 border border-border/50 px-6 py-3 rounded-2xl w-full lg:w-auto">
                        <div>
                          <div class="text-[11px] uppercase font-bold text-secondary tracking-wider">Ticks</div>
                          <div class="text-lg font-extrabold text-primary mt-1">${totalChecks}</div>
                        </div>
                        <div>
                          <div class="text-[11px] uppercase font-bold text-secondary tracking-wider">Streak</div>
                          <div class="text-lg font-extrabold text-amber-500 mt-1">${stats.best}d</div>
                        </div>
                        <div>
                          <div class="text-[11px] uppercase font-bold text-secondary tracking-wider">Success</div>
                          <div class="text-lg font-extrabold text-brand mt-1">${lifetimeRate}%</div>
                        </div>
                      </div>
                      <div class="w-full lg:w-48 flex items-center justify-between gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-border/50">
                        <div class="w-full space-y-1.5">
                          <div class="flex justify-between items-center text-xs">
                            <span class="text-secondary font-medium">Stability</span>
                            <span class="font-bold text-primary">${lifetimeRate}%</span>
                          </div>
                          <div class="w-full h-2 bg-surface-3 rounded-full overflow-hidden">
                            <div class="${batteryColor} h-full rounded-full transition-all duration-500" style="width: ${lifetimeRate}%"></div>
                          </div>
                        </div>
                        <span class="text-xs font-bold px-3 py-1 rounded-xl border ${badgeStyle} whitespace-nowrap self-end lg:self-center">${batteryText}</span>
                      </div>
                    </div>
                  `;
                })
                .join("")
        }
      </div>
    </div>
  `;
  },
};
