import { formatDate, todayISO } from "@/shared/utils/date.utils";

import { HabitAnalytics } from "@/domain/habits/habit.analytics";

/**
 * DashboardAnalytics - Pure domain logic for dashboard statistics
 * No DOM dependencies - only data transformations
 */
export const DashboardAnalytics = {
  /**
   * Calculate all dashboard statistics from habits
   * @param {Array} habits - Array of habit objects
   * @param {string} today - ISO date string
   * @returns {Object} Dashboard statistics
   */
  calculateStats(habits, today = todayISO()) {
    const activeHabits = habits.filter((h) => !h.archived);
    const archivedHabits = habits.filter((h) => h.archived);

    const totalHabits = habits.length;
    const activeCount = activeHabits.length;
    const archivedCount = archivedHabits.length;

    const completedToday = habits.filter((habit) =>
      habit.completedDates.includes(today),
    ).length;

    // Calculate streaks
    let maxCurrentStreak = 0;
    let maxBestStreak = 0;
    let totalSuccessRate = 0;

    habits.forEach((habit) => {
      const streak = HabitAnalytics.calculateStreak(
        habit.completedDates,
        habit.skippedDates || [],
      );
      if (streak.current > maxCurrentStreak) maxCurrentStreak = streak.current;
      if (streak.best > maxBestStreak) maxBestStreak = streak.best;
      totalSuccessRate += HabitAnalytics.calculateSuccessRate(habit);
    });

    const averageSuccessRate = habits.length
      ? Math.round(totalSuccessRate / habits.length)
      : 0;

    // Calculate weekly goals
    let goalsMetThisWeek = 0;
    let goalsOverflowThisWeek = 0;

    habits.forEach((habit) => {
      const weeklyChecks = HabitAnalytics.getWeeklyCompletionCount(
        habit.completedDates,
      );
      const targetFrequency = Number(habit.frequency ?? 7);

      if (weeklyChecks > targetFrequency) {
        goalsOverflowThisWeek++;
      }
      if (weeklyChecks >= targetFrequency) {
        goalsMetThisWeek++;
      }
    });

    return {
      totalHabits,
      activeCount,
      archivedCount,
      completedToday,
      currentStreak: maxCurrentStreak,
      bestStreak: maxBestStreak,
      averageSuccessRate,
      goalsMetThisWeek,
      goalsOverflowThisWeek,
      activeHabits,
      archivedHabits,
    };
  },

  /**
   * Get individual habit stats for dashboard list
   * @param {Object} habit - Habit object
   * @param {string} today - ISO date string
   * @returns {Object} Habit stats
   */
  getHabitStats(habit) {
    const streak = HabitAnalytics.calculateStreak(
      habit.completedDates,
      habit.skippedDates || [],
    );
    const lifetimeRate = Math.round(HabitAnalytics.calculateSuccessRate(habit));
    const weeklyChecks = HabitAnalytics.getWeeklyCompletionCount(
      habit.completedDates,
    );
    const targetFrequency = Number(habit.frequency ?? 7);

    const isGoalMet = weeklyChecks >= targetFrequency;
    const isGoalOverflow = weeklyChecks > targetFrequency;

    return {
      streak,
      lifetimeRate,
      weeklyChecks,
      targetFrequency,
      isGoalMet,
      isGoalOverflow,
    };
  },

  /**
   * Get goal status classification
   */
  getGoalStatus(weeklyChecks, targetFrequency) {
    const isGoalMet = weeklyChecks >= targetFrequency;
    const isGoalOverflow = weeklyChecks > targetFrequency;

    if (isGoalOverflow) {
      return {
        status: "overachieved",
        label: "Overachieved",
        icon: "fa-bolt-lightning text-lime-500/80",
      };
    }
    if (isGoalMet) {
      return {
        status: "met",
        label: "Target Met",
        icon: "fa-circle-check text-brand/80",
      };
    }
    return {
      status: "on-track",
      label: "On Track",
      icon: "fa-bullseye-arrow text-pink-500/80",
    };
  },

  /**
   * Get stability classification based on success rate
   */
  getStabilityClassification(rate) {
    if (rate === 100) {
      return {
        color: "bg-emerald-500/80",
        label: "Perfect",
        badge: "bg-emerald-500/10 text-emerald-500/80 border-emerald-500/20",
      };
    }
    if (rate < 35) {
      return {
        color: "bg-red-500/80",
        label: "Critical",
        badge: "bg-red-500/10 text-red-500/80 border-red-500/20",
      };
    }
    if (rate < 65) {
      return {
        color: "bg-amber-500/80",
        label: "Warning",
        badge: "bg-amber-500/10 text-amber-500/80 border-amber-500/20",
      };
    }
    return {
      color: "bg-brand/80",
      label: "Stable",
      badge: "bg-brand/10 text-brand/80 border-brand/20",
    };
  },

  /**
   * Get completion status text
   */
  getCompletionStatus(completedToday, totalHabits) {
    if (totalHabits === 0) return "no habits added yet";
    if (completedToday === totalHabits) {
      return `<span class="text-emerald-500/80 font-bold flex items-center gap-1"><i class="fa-solid fa-sparkles"></i> All caught up!</span>`;
    }
    return `waiting for ${totalHabits - completedToday} more checks`;
  },

  /**
   * Get weekly target status text
   */
  getWeeklyTargetStatus(goalsOverflowThisWeek) {
    if (goalsOverflowThisWeek > 0) {
      return `<span class="text-lime-500/80 font-bold flex items-center gap-1 animate-pulse"><i class="fa-solid fa-fire text-[9px]"></i> ${goalsOverflowThisWeek} Smashed!</span>`;
    }
    return "goals met this week";
  },

  /**
   * Get success rate message
   */
  getSuccessRateMessage(rate) {
    if (rate >= 70) {
      return `<span class="text-yellow-500/80 font-bold">Excellent consistency</span>`;
    }
    return "keep pushing to break 70%";
  },

  /**
   * Get archived status text
   */
  getArchivedStatus(archivedCount) {
    if (archivedCount > 0) {
      return `<span class="text-slate-500/80 font-bold">${archivedCount} habits</span> safely stored`;
    }
    return "workspace is fully active";
  },
};
