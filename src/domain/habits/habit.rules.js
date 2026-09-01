export const HabitRules = {
  isValidName(name) {
    const cleaned = (name || "").trim().replace(/\s+/g, " ");
    return cleaned.length >= 2 && cleaned.length <= 20;
  },

  normalizeName(name) {
    return (name || "").trim().replace(/\s+/g, " ");
  },

  isDuplicateActive(habits, name, excludeId = null) {
    const normalized = this.normalizeName(name);
    return habits.some(
      (h) =>
        h.name.toLowerCase() === normalized.toLowerCase() &&
        !h.archived &&
        h.id !== excludeId,
    );
  },

  isArchived(habit) {
    return habit.archived === true;
  },

  isActive(habit) {
    return !this.isArchived(habit);
  },

  hasCompletedOn(habit, date) {
    return habit.completedDates.includes(date);
  },

  hasSkippedOn(habit, date) {
    return (habit.skippedDates || []).includes(date);
  },

  getLastActivityDate(habit) {
    const allDates = [...(habit.completedDates || []), habit.createdAt];
    if (allDates.length === 0) return habit.createdAt;
    return allDates.sort().reverse()[0];
  },

  getInactiveDays(habit, today) {
    const lastActivity = this.getLastActivityDate(habit);
    const diff = new Date(today) - new Date(lastActivity);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  },

  shouldAutoArchive(habit, today, threshold = 30) {
    if (this.isArchived(habit)) return false;
    return this.getInactiveDays(habit, today) >= threshold;
  },
};
