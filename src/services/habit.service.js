import { HabitMutations } from "@/domain/habits/habit.mutations";
import { todayISO } from "@/shared/utils/date.utils";

export const HabitService = {
  createHabit(currentHabits, habitData) {
    return HabitMutations.create(currentHabits, habitData);
  },

  toggleHabit(currentHabits, id) {
    const today = todayISO();
    return HabitMutations.toggleDate(currentHabits, id, today);
  },

  toggleHabitDate(currentHabits, habitId, date) {
    return HabitMutations.toggleDate(currentHabits, habitId, date);
  },

  toggleSkipHabitDate(currentHabits, habitId, date) {
    return HabitMutations.toggleSkippedDate(currentHabits, habitId, date);
  },

  editHabit(currentHabits, id, updatedFields) {
    return HabitMutations.edit(currentHabits, id, updatedFields);
  },

  deleteHabit(currentHabits, id) {
    const result = HabitMutations.delete(currentHabits, id);
    return result.habits;
  },

  archiveHabit(currentHabits, id) {
    return HabitMutations.archive(currentHabits, id);
  },

  restoreHabit(currentHabits, id) {
    return HabitMutations.restore(currentHabits, id);
  },
};
