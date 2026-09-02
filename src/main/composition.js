import { AnalyticsApplication } from "@/app/analytics/analytics.application";
import { HabitApplication } from "@/app/habits/habit.application";
import { HabitRepository } from "@/infrastructure/persistence/habit.repository";
import { SettingsApplication } from "@/app/settings/settings.application";
import { Store } from "@/infrastructure/store/store";
import { ThemeApplication } from "@/infrastructure/theme/theme.application";

export const Composition = {
  // Application services
  habitApp: HabitApplication,
  analyticsApp: AnalyticsApplication,
  settingsApp: SettingsApplication,

  // Infrastructure
  store: Store,
  repository: HabitRepository,
  theme: ThemeApplication,

  /**
   * Initialize all services
   */
  init() {
    ThemeApplication.init();
    // Store and Repository are ready
    return this;
  },
};
