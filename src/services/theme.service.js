/**
 * This file serves as a compatibility bridge for legacy code.
 * All functionality has been moved to:
 * - src/infrastructure/theme/theme.application.js
 * - src/ui/services/theme.service.js
 *
 * Please update imports to use the new locations.
 */

import { ThemeApplication } from "@/infrastructure/theme/theme.application";

// Re-export for backward compatibility
export function setTheme(mode) {
  ThemeApplication.setTheme(mode);
}

export function getTheme() {
  return ThemeApplication.getTheme();
}

export function toggleTheme() {
  return ThemeApplication.toggleTheme();
}

// For backward compatibility with theme.controller.js
export const ThemeService = {
  setTheme,
  getTheme,
  toggleTheme,
};
