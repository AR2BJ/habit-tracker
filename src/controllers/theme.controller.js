import { GlobalLoaderService } from "@/services/loader.service";
import { ThemeApplication } from "@/infrastructure/theme/theme.application";

export const ThemeController = {
  _isInitialized: false,

  init() {
    if (this._isInitialized) return;

    // Ensure theme is applied
    ThemeApplication.init();
    this.updateIcon(ThemeApplication.getTheme());

    this._bindEvents();
    this._isInitialized = true;
  },

  _bindEvents() {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;

    btn.removeEventListener("click", this._handleToggle);
    btn.addEventListener("click", this._handleToggle);
  },

  _handleToggle(event) {
    event.preventDefault();
    event.stopPropagation();

    GlobalLoaderService.show("Recalibrating workspace interface...");

    // Use requestAnimationFrame for smooth transition
    requestAnimationFrame(() => {
      try {
        const newTheme = ThemeApplication.toggleTheme();
        ThemeController.updateIcon(newTheme);

        // Hide loader after a brief delay for visual feedback
        setTimeout(() => {
          GlobalLoaderService.hide();
        }, 300);
      } catch (error) {
        console.error("Theme switch failure:", error);
        GlobalLoaderService.hide();
      }
    });
  },

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

  applyTheme(theme) {
    ThemeApplication.applyTheme(theme);
    this.updateIcon(theme);
  },

  destroy() {
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.removeEventListener("click", this._handleToggle);
    }
    this._isInitialized = false;
  },
};
