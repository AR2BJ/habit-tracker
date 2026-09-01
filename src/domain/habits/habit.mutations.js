import { formatDate } from "@/shared/utils/date.utils";
import { generateId } from "@/infrastructure/browser/id-generator.adapter";

export const HabitMutations = {
  create(currentHabits, habitData) {
    const rawName = typeof habitData === "string" ? habitData : habitData.name;

    const cleanedName = (rawName || "").trim().replace(/\s+/g, " ");

    if (!cleanedName || cleanedName.length < 2 || cleanedName.length > 20) {
      throw new Error("Invalid habit name length (2-20 chars)");
    }

    const alreadyExists = currentHabits.some(
      (habit) =>
        habit.name.toLowerCase() === cleanedName.toLowerCase() &&
        !habit.archived,
    );
    if (alreadyExists) {
      throw new Error("An active habit with this title already exists");
    }

    const habitCategory = habitData.category || "general";
    const habitFrequency = habitData.frequency || 7;

    const newHabit = {
      id: generateId(),
      name: cleanedName,
      category: habitCategory,
      frequency: Number(habitFrequency),
      createdAt: formatDate(new Date()),
      archived: false,
      completedDates: [],
      skippedDates: [],
    };

    return [newHabit, ...currentHabits];
  },

  toggleDate(currentHabits, habitId, date) {
    return currentHabits.map((habit) => {
      if (habit.id !== habitId) return habit;

      const completedDates = [...habit.completedDates];
      const index = completedDates.indexOf(date);
      if (index > -1) {
        completedDates.splice(index, 1);
      } else {
        completedDates.push(date);
      }
      return { ...habit, completedDates };
    });
  },

  toggleSkippedDate(currentHabits, habitId, date) {
    return currentHabits.map((habit) => {
      if (habit.id !== habitId) return habit;

      let completedDates = [...habit.completedDates];
      const compIndex = completedDates.indexOf(date);
      if (compIndex > -1) completedDates.splice(compIndex, 1);

      let skippedDates = [...(habit.skippedDates || [])];
      const skipIndex = skippedDates.indexOf(date);

      if (skipIndex > -1) {
        skippedDates.splice(skipIndex, 1);
      } else {
        skippedDates.push(date);
      }

      return { ...habit, completedDates, skippedDates };
    });
  },

  edit(currentHabits, id, updatedFields) {
    const habit = currentHabits.find((h) => h.id === id);
    if (!habit) throw new Error("Habit not found");

    let cleanedTitle = habit.name;
    if (updatedFields.title) {
      cleanedTitle = updatedFields.title.trim().replace(/\s+/g, " ");
      if (
        !cleanedTitle ||
        cleanedTitle.length < 2 ||
        cleanedTitle.length > 20
      ) {
        throw new Error("Invalid habit name length (2-20 chars)");
      }
    }

    const targetCategory = updatedFields.category || habit.category;
    const targetFrequency = updatedFields.frequency || habit.frequency;

    const alreadyExists = currentHabits.some(
      (h) => h.id !== id && h.name.toLowerCase() === cleanedTitle.toLowerCase(),
    );
    if (alreadyExists) {
      throw new Error("Habit already exists");
    }

    return currentHabits.map((h) => {
      if (h.id !== id) return h;
      return {
        ...h,
        name: cleanedTitle,
        category: targetCategory,
        frequency: targetFrequency,
      };
    });
  },

  delete(currentHabits, id) {
    const deleted = currentHabits.find((h) => h.id === id);
    const updated = currentHabits.filter((h) => h.id !== id);
    return { habits: updated, deleted };
  },

  archive(currentHabits, id) {
    return currentHabits.map((h) =>
      h.id === id ? { ...h, archived: true } : h,
    );
  },

  restore(currentHabits, id) {
    return currentHabits.map((h) =>
      h.id === id ? { ...h, archived: false } : h,
    );
  },
};
