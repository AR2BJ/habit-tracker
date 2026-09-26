import {
  getCompletionRate,
  getCurrentStreak,
  isScheduledOn,
} from "./habit.utils";

import { todayISO } from "@/shared/utils/date.utils";

export const HabitSelectors = {
  getActive(habits) {
    return habits.filter((h) => !h.archived);
  },

  getArchived(habits) {
    return habits.filter((h) => h.archived);
  },

  getFiltered(habits, { tab, category, statusFilter, sortBy, searchQuery }) {
    let list = habits;

    list = tab === "active" ? this.getActive(list) : this.getArchived(list);

    if (category && category !== "all") {
      list = list.filter((h) => h.category === category);
    }

    if (statusFilter && statusFilter !== "all") {
      const today = todayISO();
      list = list.filter((habit) => {
        const doneToday = habit.completedDates?.includes(today);
        const skippedToday = habit.skippedDates?.includes(today);
        const scheduledToday = isScheduledOn(habit, today);

        switch (statusFilter) {
          case "done_today":
            return doneToday;
          case "pending_today":
            return scheduledToday && !doneToday && !skippedToday;
          case "skipped_today":
            return skippedToday;
          case "never_completed":
            return !habit.completedDates?.length;
          case "has_streak":
            return getCurrentStreak(habit) > 0;
          default:
            return true;
        }
      });
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((h) => {
        const name = (h.name || "").toLowerCase();
        const cat = (h.category || "").toLowerCase();
        return name.includes(q) || cat.includes(q);
      });
    }

    return this.sortHabits(list, sortBy);
  },

  sortHabits(habits, sortBy) {
    return [...habits].sort((a, b) => {
      switch (sortBy) {
        case "streak":
          return getCurrentStreak(b) - getCurrentStreak(a);
        case "frequency":
          return (b.frequency || 0) - (a.frequency || 0);
        case "completionRate":
          return getCompletionRate(b) - getCompletionRate(a);
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "category":
          return (a.category || "").localeCompare(b.category || "");
        case "createdAt":
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });
  },

  getById(habits, id) {
    return habits.find((h) => h.id === id);
  },
};
