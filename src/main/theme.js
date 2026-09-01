/**
 * This file is a compatibility bridge for theme initialization.
 * Theme is now managed by ThemeApplication from infrastructure.
 *
 * This file applies theme immediately to prevent FOUC (Flash of Unstyled Content)
 * and delegates to ThemeApplication for full management.
 *
 * @deprecated Will be removed after full migration
 */

import { ThemeApplication } from "@/infrastructure/theme/theme.application.js";

// Apply theme immediately - prevents FOUC
ThemeApplication.init();

// Make ThemeApplication available globally for debugging
if (typeof window !== "undefined") {
  window.__theme = ThemeApplication;
}

export const savedTheme = ThemeApplication.getTheme();
