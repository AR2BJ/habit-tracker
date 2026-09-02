/**
 * Theme UI Service - Manages theme-related DOM updates
 * This is a UI service that handles visual theme updates
 */
export const ThemeUIService = {
  /**
   * Update the theme toggle button icon
   */
  updateIcon(theme) {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;

    if (theme === "dark") {
      btn.innerHTML = `<i class="fa-regular fa-sun text-yellow-500/80"></i>`;
      btn.classList.replace("hover:bg-slate-600/10", "hover:bg-yellow-600/10");
    } else {
      btn.innerHTML = `<i class="fa-regular fa-moon text-secondary"></i>`;
      btn.classList.replace("hover:bg-yellow-600/10", "hover:bg-slate-600/10");
    }
  },

  /**
   * Apply theme to document root
   */
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
    this.dispatchThemeEvent(mode);
  },

  /**
   * Dispatch theme changed event
   */
  dispatchThemeEvent(theme) {
    const event = new CustomEvent("themeChanged", {
      detail: { theme },
    });
    document.dispatchEvent(event);
  },
};
