import { DashboardAnalytics } from "@/domain/analytics/dashboard.analytics";
import { todayISO } from "@/shared/utils/date.utils";

export const DashboardComponent = {
  /**
   * Render dashboard
   * @param {Array} habits - Array of habit objects
   * @param {string} today - ISO date string (for consistency)
   * @returns {string} HTML string
   */
  render(habits = [], today = todayISO()) {
    const stats = DashboardAnalytics.calculateStats(habits, today);

    return `
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full col-span-full"
      >
        ${this._renderStatCards(stats)}
        ${this._renderChartsSection(habits, stats)}
      </div>
    `;
  },

  /**
   * Render stat cards
   */
  _renderStatCards(stats) {
    const {
      totalHabits,
      completedToday,
      goalsMetThisWeek,
      goalsOverflowThisWeek,
      bestStreak,
      currentStreak,
      averageSuccessRate,
      archivedCount,
    } = stats;

    const completionStatus = DashboardAnalytics.getCompletionStatus(
      completedToday,
      totalHabits,
    );
    const weeklyTargetStatus = DashboardAnalytics.getWeeklyTargetStatus(
      goalsOverflowThisWeek,
    );
    const successMessage =
      DashboardAnalytics.getSuccessRateMessage(averageSuccessRate);
    const archivedStatus = DashboardAnalytics.getArchivedStatus(archivedCount);

    // Determine weekly target card style
    let weeklyBorderClass = "hover:border-pink-500/30";
    let weeklyIcon = "fa-bullseye-arrow text-pink-500";
    if (goalsOverflowThisWeek > 0) {
      weeklyBorderClass = "hover:border-lime-500/30";
      weeklyIcon = "fa-bolt-lightning text-lime-500";
    } else if (goalsOverflowThisWeek === 0 && goalsMetThisWeek > 0) {
      weeklyBorderClass = "hover:border-brand/30";
      weeklyIcon = "fa-circle-check text-brand/80";
    }

    return `
      <!-- Total Habits -->
      <div
        class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 hover:-translate-y-1 hover:border-sky-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
      >
        <i
          class="fa-solid fa-layer-group absolute -right-4 -bottom-6 text-[10rem] text-sky-500 opacity-[0.04] dark:opacity-[0.06] rotate-20 pointer-events-none group-hover:scale-110 group-hover:rotate-10 transition-transform duration-500"
        ></i>

        <div class="flex flex-col gap-1 z-10">
          <span
            class="text-xs font-bold text-secondary uppercase tracking-wider"
            >Total Habits</span
          >
          <div class="text-4xl font-black text-color tracking-tight mt-2">
            ${totalHabits}
          </div>
          <p class="text-[10px] text-muted font-medium mt-1">
            <span class="text-sky-500/80 font-bold"
              >${totalHabits} active</span
            >
            right now
          </p>
        </div>
      </div>

      <!-- Completed Today -->
      <div
        class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 hover:-translate-y-1 hover:border-emerald-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
      >
        <i
          class="fa-solid fa-calendar-check absolute -right-4 -bottom-6 text-[10rem] text-emerald-500 opacity-[0.04] dark:opacity-[0.06] rotate-15 pointer-events-none group-hover:scale-110 group-hover:rotate-5 transition-transform duration-500"
        ></i>

        <div class="flex flex-col gap-1 z-10">
          <span
            class="text-xs font-bold text-secondary uppercase tracking-wider"
            >Completed Today</span
          >
          <div class="text-4xl font-black text-color tracking-tight mt-2">
            ${completedToday}
          </div>
          <p class="text-[10px] text-muted font-medium mt-1">
            ${completionStatus}
          </p>
        </div>
      </div>

      <!-- Weekly Targets -->
      <div
        class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 ${weeklyBorderClass} rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
      >
        <i
          class="fa-solid ${weeklyIcon} absolute -right-2 -bottom-6 text-[10rem] opacity-[0.04] dark:opacity-[0.06] rotate-25 pointer-events-none group-hover:scale-110 group-hover:rotate-15 transition-transform duration-500"
        ></i>

        <div class="flex flex-col gap-1 z-10">
          <span
            class="text-xs font-bold text-secondary uppercase tracking-wider"
            >Weekly Targets</span
          >
          <div class="text-4xl font-black text-color tracking-tight mt-2">
            ${goalsMetThisWeek}<span class="text-sm font-bold text-muted"
              >/${totalHabits}</span
            >
          </div>
          <p class="text-[10px] text-muted font-medium mt-1">
            ${weeklyTargetStatus}
          </p>
        </div>
      </div>

      <!-- Best Streak -->
      <div
        class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 hover:-translate-y-1 hover:border-orange-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
      >
        <i
          class="fa-solid fa-fire absolute -right-2 -bottom-4 text-[10rem] text-orange-500 opacity-[0.04] dark:opacity-[0.06] rotate-12 pointer-events-none group-hover:scale-110 group-hover:rotate-0 transition-transform duration-500"
        ></i>

        <div class="flex flex-col gap-1 z-10">
          <span
            class="text-xs font-bold text-secondary uppercase tracking-wider"
            >Best Streak</span
          >
          <div class="text-4xl font-black text-color tracking-tight mt-2">
            ${bestStreak}<span class="text-sm font-bold text-secondary ms-0.5"
              >days</span
            >
          </div>
          <p class="text-[10px] text-muted font-medium mt-1">
            current streak is
            <span class="text-orange-500/80 font-bold">${currentStreak}d</span>
          </p>
        </div>
      </div>

      <!-- Avg Success -->
      <div
        class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 hover:-translate-y-1 hover:border-yellow-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
      >
        <i
          class="fa-solid fa-chart-line absolute -right-4 -bottom-6 text-[10rem] text-yellow-500 opacity-[0.04] dark:opacity-[0.06] rotate-18 pointer-events-none group-hover:scale-110 group-hover:rotate-[8deg] transition-transform duration-500"
        ></i>

        <div class="flex flex-col gap-1 z-10">
          <span
            class="text-xs font-bold text-secondary uppercase tracking-wider"
            >Avg Success</span
          >
          <div class="text-4xl font-black text-color tracking-tight mt-2">
            ${averageSuccessRate}%
          </div>
          <p class="text-[10px] text-muted font-medium mt-1">
            ${successMessage}
          </p>
        </div>
      </div>

      <!-- Archived -->
      <div
        class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 hover:-translate-y-1 hover:border-slate-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
      >
        <i
          class="fa-regular fa-box-archive absolute -right-4 -bottom-6 text-[10rem] text-slate-500 opacity-[0.04] dark:opacity-[0.06] rotate-18 pointer-events-none group-hover:scale-110 group-hover:rotate-[8deg] transition-transform duration-500"
        ></i>

        <div class="flex flex-col gap-1 z-10">
          <span
            class="text-xs font-bold text-secondary uppercase tracking-wider"
            >Archived</span
          >
          <div class="text-4xl font-black text-color tracking-tight mt-2">
            ${archivedCount}
          </div>
          <p class="text-[10px] text-muted font-medium mt-1">
            ${archivedStatus}
          </p>
        </div>
      </div>
    `;
  },

  /**
   * Render charts section
   */
  _renderChartsSection(habits, stats) {
    const { activeCount, archivedCount } = stats;

    return `
      <div
        class="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full col-span-2 sm:col-span-full mt-4"
      >
        <!-- Heatmap Chart -->
        <div
          class="lg:col-span-2 bg-surface-2 border border-border/70 rounded-2xl p-6 flex flex-col justify-between"
        >
          <div
            class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
          >
            <div>
              <h4
                class="text-lg font-bold text-color flex items-center gap-2"
              >
                <i class="fa-regular fa-calendar text-brand/80 text-xl"></i>
                Lifetime Activity Grid
              </h4>
              <p class="text-sm text-secondary mt-1">
                Advanced multi-tier habit density repository mapped by sprint
                lifecycle.
              </p>
            </div>

            <div class="relative flex items-center justify-end">
              <button
                id="heatmap-mobile-menu-toggle"
                class="sm:hidden inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-surface text-secondary hover:text-color transition shadow-sm cursor-pointer"
                aria-label="Open view menu"
              >
                <i class="fa-regular fa-ellipsis-vertical text-lg"></i>
              </button>

              <div
                id="heatmap-mobile-menu"
                class="hidden absolute right-0 top-full mt-2 w-44 rounded-2xl border border-border bg-surface-2 shadow-lg z-20 overflow-hidden"
              >
                <button
                  data-view="weekly"
                  class="w-full px-4 py-2.5 text-left text-xs font-medium text-secondary hover:bg-surface"
                >
                  Weekly
                </button>
                <button
                  data-view="monthly"
                  class="w-full px-4 py-2.5 text-left text-xs font-medium text-secondary hover:bg-surface"
                >
                  Monthly
                </button>
                <button
                  data-view="yearly"
                  class="w-full px-4 py-2.5 text-left text-xs font-medium text-secondary hover:bg-surface"
                >
                  Yearly
                </button>
              </div>

              <div
                id="chart-view-switcher"
                class="hidden sm:flex relative overflow-hidden rounded-xl border border-border/80 bg-surface p-1 isolation-auto"
              >
                <div
                  id="heatmap-tab-indicator"
                  class="absolute top-1 left-1 h-[calc(100%-8px)] w-24 rounded-lg bg-brand/80 transition-all duration-300 ease-out z-0 shadow-sm"
                ></div>

                <button
                  data-view="weekly"
                  id="view-btn-weekly"
                  class="relative z-10 w-24 py-1.5 text-xs font-bold text-secondary transition cursor-pointer text-center"
                >
                  Weekly
                </button>
                <button
                  data-view="monthly"
                  id="view-btn-monthly"
                  class="relative z-10 w-24 py-1.5 text-xs font-bold text-secondary transition cursor-pointer text-center"
                >
                  Monthly
                </button>
                <button
                  data-view="yearly"
                  id="view-btn-yearly"
                  class="relative z-10 w-24 py-1.5 text-xs font-bold text-secondary transition cursor-pointer text-center"
                >
                  Yearly
                </button>
              </div>
            </div>
          </div>

          <div
            class="w-full mt-6 overflow-x-auto scrollbar-thin scrollbar-thumb-surface"
          >
            <div
              id="apex-heatmap-chart"
              class="w-full"
            ></div>
          </div>
        </div>

        <!-- Weekday Chart -->
        <div
          class="bg-surface-2 border border-border/70 rounded-2xl p-6 flex flex-col justify-between"
        >
          <div>
            <h4
              class="text-lg font-bold text-color flex items-center gap-2"
            >
              <i
                class="fa-regular fa-chart-simple text-amber-500/80 text-xl"
              ></i>
              Distribution Trends
            </h4>
            <p class="text-sm text-secondary mt-1">
              Analysis of your execution behavior mapped by day of the week.
            </p>
          </div>

          <div
            class="w-full mt-6 overflow-x-auto scrollbar-thin scrollbar-thumb-surface"
          >
            <div
              id="apex-weekday-chart"
              class="w-full"
            ></div>
          </div>
        </div>
      </div>

      <!-- Individual Habits List -->
      <div
        class="w-full col-span-2 sm:col-span-full mt-4 bg-surface-2 rounded-2xl"
      >
        <div class="w-full col-span-full bg-surface-2 border border-border/70 rounded-2xl p-6">
          <div
            class="flex flex-wrap sm:flex-nowrap sm:items-center justify-between gap-2"
          >
            <div>
              <h4
                class="text-lg font-bold text-color flex items-center gap-2"
              >
                <i
                  class="fa-regular fa-layer-group text-brand/80 text-xl"
                ></i>
                Individual All-Time Analytics
              </h4>
              <p class="text-xs text-secondary/80 mt-1 font-medium">
                A deep dive into your behavioural consistency and peak
                performance trends mapped across weekdays.
              </p>
            </div>
            <span
              class="text-xs text-center font-semibold px-2.5 py-1 rounded-lg bg-surface border border-border text-secondary self-center sm:self-auto w-full sm:w-auto"
            >
              ${activeCount} Active Tracked (${archivedCount} Archived)
            </span>
          </div>

          <div class="mt-6 space-y-3">
            ${this._renderHabitList(habits, stats)}
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render individual habit list
   */
  _renderHabitList(habits, today = todayISO()) {
    if (habits.length === 0) {
      return `
        <div
          class="min-h-80 bg-surface border border-dashed border-border rounded-2xl p-16 text-center"
        >
          <div class="text-6xl mb-6">
            <i class="fa-regular fa-box-open text-brand/60"></i>
          </div>
          <h2 class="text-2xl font-bold text-color">
            No active habits
          </h2>
          <p class="mt-3 text-secondary max-w-sm mx-auto">
            You're all caught up! Create a new habit to get started.
          </p>
        </div>
      `;
    }

    return `
      <div class="mt-5 flex flex-col justify-center gap-2">
        ${habits
          .map((habit) => {
            const habitStats = DashboardAnalytics.getHabitStats(habit, today);
            const goalStatus = DashboardAnalytics.getGoalStatus(
              habitStats.weeklyChecks,
              habitStats.targetFrequency,
            );
            const stability = DashboardAnalytics.getStabilityClassification(
              habitStats.lifetimeRate,
            );

            const rowBadgeStyle =
              goalStatus.status === "overachieved"
                ? "bg-lime-500/10 text-lime-500/80 border-lime-500/30 font-bold animate-pulse shadow-sm"
                : goalStatus.status === "met"
                  ? "bg-brand/10 text-brand/80 border-brand/20 font-semibold"
                  : "bg-surface-3 text-secondary border-border/50";

            const rowBadgeText = goalStatus.label;
            const rowBadgeIcon =
              goalStatus.status === "overachieved"
                ? `<i class="fa-solid fa-bolt-lightning text-lime-500/80 text-[10px] ps-1"></i>`
                : "";

            const batteryColor = stability.color;
            const batteryText = stability.label;
            const badgeStyle = stability.badge;

            let rateColor = "text-brand/80";
            if (habitStats.lifetimeRate === 100)
              rateColor = "text-emerald-500/80";
            else if (habitStats.lifetimeRate < 35)
              rateColor = "text-red-500/80";
            else if (habitStats.lifetimeRate < 65)
              rateColor = "text-amber-500/80";

            return `
              <div
                class="flex flex-col lg:flex-row lg:items-center justify-between gap-5 group/row bg-surface p-4 rounded-xl shadow-sm"
              >
                <div class="flex items-center gap-3 min-w-0 flex-1">
                  <div class="w-full">
                    <div
                      class="text-sm pb-3 sm:pb-0 font-bold text-color truncate flex flex-wrap items-center gap-2"
                    >
                      <span
                        class="md:hidden truncate cursor-pointer js-tooltip-target"
                        data-tooltip-title="${habit.name}"
                        tabindex="0"
                        role="button"
                        aria-label="Show habit title"
                      >
                        ${habit.name}
                      </span>
                      <span class="hidden md:flex">
                        ${habit.name}
                      </span>
                      <span
                        class="inline-flex lg:hidden items-center rounded-md border ${rowBadgeStyle} px-1.5 py-0.5 text-[9px] uppercase tracking-wider"
                      >
                        ${rowBadgeText}
                        ${rowBadgeIcon}
                      </span>
                      ${
                        habit.archived
                          ? `<span class="inline-flex lg:hidden items-center rounded-md border bg-surface-3 text-secondary border-border/50 px-1.5 py-0.5 text-[9px] uppercase tracking-wider">Archived</span>`
                          : ""
                      }
                    </div>

                    <div
                      class="text-[11px] text-secondary/70 mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-medium"
                    >
                      <div
                        class="hidden lg:flex flex-row items-center gap-2"
                      >
                        <span
                          class="inline-flex items-center rounded-md border ${rowBadgeStyle} px-1.5 py-0.5 text-[9px] uppercase tracking-wider"
                        >
                          ${rowBadgeText}
                          ${rowBadgeIcon}
                        </span>
                        ${
                          habit.archived
                            ? `<span class="inline-flex items-center rounded-md border bg-surface-3 text-secondary border-border/50 px-1.5 py-0.5 text-[9px] uppercase tracking-wider">Archived</span>`
                            : ""
                        }
                      </div>
                      <span
                        class="flex flex-row items-center gap-1"
                      >
                        <i
                          class="fa-regular fa-clock text-sky-500/80"
                        ></i>
                        Since:
                        <strong class="text-secondary font-semibold"
                          >${habit.createdAt}</strong
                        >
                      </span>
                      <span
                        class="flex flex-row items-center gap-1"
                      >
                        <i
                          class="fa-regular fa-shapes text-amber-500/80"
                        ></i>
                        Category:
                        <strong class="text-secondary font-semibold"
                          >${habit.category}</strong
                        >
                      </span>
                      <span class="inline-flex items-center gap-1">
                        <i class="fa-regular ${goalStatus.icon}"></i> This
                        Week:
                        <strong class="text-color font-bold"
                          >${habitStats.weeklyChecks}/${habitStats.targetFrequency}</strong
                        >
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  class="flex flex-col sm:flex-row sm:justify-between items-center gap-6 lg:gap-8 bg-surface-2 lg:bg-transparent p-4 lg:p-0 rounded-xl border border-border/30 lg:border-0 shadow-sm lg:shadow-none"
                >
                  <div
                    class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-8 text-center sm:text-left min-w-0"
                  >
                    <div
                      class="flex flex-col justify-center items-center"
                    >
                      <div
                        class="text-[10px] uppercase font-bold text-muted/80 tracking-wider text-nowrap"
                      >
                        Current Streak
                      </div>
                      <div
                        class="text-lg sm:text-base font-black text-color mt-0.5 truncate"
                      >
                        ${habitStats.streak.current}d
                      </div>
                    </div>
                    <div
                      class="flex flex-col justify-center items-center"
                    >
                      <div
                        class="text-[10px] uppercase font-bold text-muted/80 tracking-wider"
                      >
                        Best Streak
                      </div>
                      <div
                        class="text-lg sm:text-base font-black text-color mt-0.5 truncate"
                      >
                        ${habitStats.streak.best}d
                      </div>
                    </div>
                    <div
                      class="flex flex-col xs:col-span-2 sm:col-span-1 justify-center items-center"
                    >
                      <div
                        class="text-[10px] uppercase font-bold text-muted/80 tracking-wider"
                      >
                        Lifetime Rate
                      </div>
                      <div
                        class="text-lg sm:text-base font-black ${rateColor} mt-0.5 truncate"
                      >
                        ${habitStats.lifetimeRate}%
                      </div>
                    </div>
                  </div>

                  <div
                    class="w-full sm:w-44 flex flex-col xs:flex-row items-center justify-between gap-4 border-t sm:border-t-0 border-border/40 pt-3 sm:pt-0"
                  >
                    <div class="w-full space-y-1 min-w-0">
                      <div
                        class="flex justify-between items-center text-[11px]"
                      >
                        <span class="text-secondary font-medium"
                          >Stability</span
                        >
                        <span class="font-bold text-color"
                          >${habitStats.lifetimeRate}%</span
                        >
                      </div>
                      <div
                        class="w-full h-1.5 bg-surface-3 lg:bg-surface-4 rounded-full overflow-hidden"
                      >
                        <div
                          class="${batteryColor} h-full rounded-full transition-all duration-500"
                          style="width: ${habitStats.lifetimeRate}%"
                        ></div>
                      </div>
                    </div>
                    <span
                      class="text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${badgeStyle} whitespace-nowrap lg:self-center"
                      >${batteryText}</span
                    >
                  </div>
                </div>
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  },
};
