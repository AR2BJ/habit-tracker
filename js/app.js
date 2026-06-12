// =============================
// APP BOOTSTRAP START
// =============================

import { initState } from "./state.js";

document.addEventListener("DOMContentLoaded", () => {
  initState();

  // =============================
  // DARK / LIGHT MODE TOGGLE START
  // =============================

  const themeToggleBtn = document.getElementById("theme-toggle");
  const root = document.documentElement;

  const savedTheme = localStorage.getItem("theme") || "dark";
  setTheme(savedTheme);

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = root.classList.contains("dark") ? "dark" : "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  });

  function setTheme(mode) {
    if (mode === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      themeToggleBtn.innerHTML = `<i class="fa-regular fa-moon"></i>`;
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
      themeToggleBtn.innerHTML = `<i class="fa-regular fa-sun text-yellow-400"></i>`;
    }
    localStorage.setItem("theme", mode);
  }

  // =============================
  // DARK / LIGHT MODE TOGGLE END
  // =============================
});

// =============================
// APP BOOTSTRAP END
// =============================
