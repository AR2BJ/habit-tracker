import { ThemeRepository } from "./theme.repository";

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
    this.applyTheme(mode);
  },

  toggleTheme() {
    const current = this.getTheme();
    const next = current === "dark" ? "light" : "dark";
    this.setTheme(next);
    return next;
  },

  applyTheme(mode) {
    const root = document.documentElement;

    // Remove both classes first
    root.classList.remove("dark", "light");

    // Add the appropriate class
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.add("light");
    }

    // Dispatch event for listeners
    document.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: { theme: mode },
      }),
    );
  },

  init() {
    const theme = this.getTheme();
    this.applyTheme(theme);
    return theme;
  },
};
