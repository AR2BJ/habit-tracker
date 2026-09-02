import { ThemeRepository } from "./theme.repository";
import { ThemeUIService } from "@/services/ui/theme-ui.service";

export const ThemeApplication = {
  _currentTheme: null,

  getTheme() {
    if (this._currentTheme === null) {
      this._currentTheme = ThemeRepository.get();
    }
    return this._currentTheme;
  },

  setTheme(mode) {
    this._currentTheme = mode;
    ThemeRepository.set(mode);
    ThemeUIService.applyTheme(mode);
  },

  toggleTheme() {
    const current = this.getTheme();
    const next = current === "dark" ? "light" : "dark";
    this.setTheme(next);
    return next;
  },

  init() {
    const theme = this.getTheme();
    ThemeUIService.applyTheme(theme);
    return theme;
  },
};
