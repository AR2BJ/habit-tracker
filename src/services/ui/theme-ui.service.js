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
      btn.innerHTML = `<i id="btn-sun" class="ti ti-sun text-yellow-500/80 text-lg lg:text-xl transition-transform duration-300 ease-in-out"></i>`;
      btn.classList.replace("hover:bg-slate-600/10", "hover:bg-yellow-600/10");
    } else {
      btn.innerHTML = `
        <div class="relative w-5 h-5 flex items-center justify-center">
          <i id="btn-moon" class="ti ti-moon text-secondary text-lg lg:text-xl absolute transition-all duration-300 ease-in-out opacity-100 scale-100"></i>
          <i id="btn-moon-stars" class="ti ti-moon-stars text-secondary text-lg lg:text-xl absolute transition-all duration-300 ease-in-out opacity-0 scale-75 -rotate-12"></i>
        </div>
      `;
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
