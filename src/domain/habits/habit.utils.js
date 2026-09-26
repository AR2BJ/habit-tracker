import { addDays, parseISODate, todayISO } from "@/shared/utils/date.utils";

export function diffDays(fromISO, toISO) {
  const from = parseISODate(fromISO);
  const to = parseISODate(toISO);
  return Math.round((to - from) / 86400000);
}

export function isScheduledOn(habit, isoDate) {
  if (!habit.createdAt) return false;

  const diff = diffDays(habit.createdAt, isoDate);
  if (diff < 0) return false;

  const freq = Math.min(7, Math.max(1, Number(habit.frequency) || 7));
  const interval = Math.max(1, Math.round(7 / freq));

  return diff % interval === 0;
}

export function getCurrentStreak(habit) {
  const set = new Set(habit.completedDates || []);
  if (set.size === 0) return 0;

  const today = todayISO();
  let cursor = today;

  if (!set.has(today)) {
    cursor = addDays(today, -1);
  }

  let streak = 0;
  while (set.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function getLongestStreak(habit) {
  const dates = [...new Set(habit.completedDates || [])].sort();
  if (dates.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < dates.length; i++) {
    const gap = diffDays(dates[i - 1], dates[i]);
    if (gap === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }
  return longest;
}

export function getCompletionRate(habit) {
  if (!habit.createdAt) return 0;

  const totalDays = Math.max(1, diffDays(habit.createdAt, todayISO()) + 1);
  const done = (habit.completedDates || []).length;

  return done / totalDays;
}

export function getTodayStatus(habit) {
  const today = todayISO();
  if (habit.completedDates?.includes(today)) return "done";
  if (habit.skippedDates?.includes(today)) return "skipped";
  if (isScheduledOn(habit, today)) return "pending";
  return "not_scheduled";
}

export function getTotalCompletions(habit) {
  return (habit.completedDates || []).length;
}
