const THEME_KEY = "theme";

export const ThemeRepository = {
  get() {
    return localStorage.getItem(THEME_KEY) || "dark";
  },

  set(mode) {
    localStorage.setItem(THEME_KEY, mode);

    // Dispatch event for theme changes
    window.dispatchEvent(
      new CustomEvent("theme-storage-update", {
        detail: {
          key: THEME_KEY,
          theme: mode,
          timestamp: Date.now(),
        },
      }),
    );
  },

  toggle() {
    const current = this.get();
    const next = current === "dark" ? "light" : "dark";
    this.set(next);
    return next;
  },
};
