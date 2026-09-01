import { HabitRules } from "./habit.rules";
import { formatDate } from "@/shared/utils/date.utils";
import { generateId } from "@/infrastructure/browser/id-generator.adapter";

export const HabitFactory = {
  create(data) {
    const name = HabitRules.normalizeName(data.name);

    if (!HabitRules.isValidName(name)) {
      throw new Error("Invalid habit name length (2-20 chars)");
    }

    return {
      id: generateId(),
      name: name,
      category: data.category || "general",
      frequency: Number(data.frequency || 7),
      createdAt: formatDate(new Date()),
      archived: false,
      completedDates: [],
      skippedDates: [],
    };
  },
};
