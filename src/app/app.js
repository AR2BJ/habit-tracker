// =============================
// APP BOOTSTRAP START
// =============================

import { getTheme, setTheme, toggleTheme } from "../services/theme.service.js";

import { initState } from "../models/state.js";

function updateThemeToggleIcon(theme) {
  const themeToggleBtn = document.getElementById("theme-toggle");
  if (!themeToggleBtn) return;

  themeToggleBtn.innerHTML =
    theme === "dark"
      ? `<i class="fa-regular fa-sun text-yellow-400"></i>`
      : `<i class="fa-regular fa-moon"></i>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const theme = getTheme();

  initState();
  setTheme(theme);
  updateThemeToggleIcon(theme);
});

document.addEventListener("click", (e) => {
  if (e.target.closest("#theme-toggle")) {
    toggleTheme();
    updateThemeToggleIcon(getTheme());
  }
});

// =============================
// APP BOOTSTRAP END
// =============================
