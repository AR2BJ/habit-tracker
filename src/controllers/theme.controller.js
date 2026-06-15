import { getTheme, setTheme, toggleTheme } from "../services/theme.service.js";

export const ThemeController = {
  updateIcon(theme) {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.innerHTML =
      theme === "dark"
        ? `<i class="fa-regular fa-sun text-yellow-400"></i>`
        : `<i class="fa-regular fa-moon"></i>`;
  },

  init() {
    setTheme(getTheme());
    this.updateIcon(getTheme());
    const btn = document.getElementById("theme-toggle");
    btn?.addEventListener("click", () => {
      toggleTheme();
      this.updateIcon(getTheme());
    });
  },
};
