import { HabitController } from "../controllers/habit.controller.js";
import { NavigationController } from "../controllers/navigation.controller.js";
import { ThemeController } from "../controllers/theme.controller.js";

document.addEventListener("DOMContentLoaded", () => {
  ThemeController.init();
  NavigationController.init();
  HabitController.initApplication();
});
