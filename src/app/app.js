import { HabitController } from "@/controllers/habit.controller.js";
import { NavigationController } from "@/controllers/navigation.controller.js";
import { StateController } from "@/controllers/state.controller";
import { ThemeController } from "@/controllers/theme.controller.js";

document.addEventListener("DOMContentLoaded", () => {
  HabitController.initApplication();
  ThemeController.init();
  NavigationController.init();
  StateController.execute();
});
