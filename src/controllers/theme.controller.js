import { GlobalLoaderService } from "@/services/loader.service";
import { ThemeApplication } from "@/infrastructure/theme/theme.application";
import { ThemeUIService } from "@/services/ui/theme-ui.service";

export const ThemeController = {
  _isInitialized: false,

  init() {
    if (this._isInitialized) return;

    // Ensure theme is applied
    ThemeApplication.init();
    ThemeUIService.updateIcon(ThemeApplication.getTheme());

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
        ThemeUIService.updateIcon(newTheme);

        // Hide loader after a brief delay for visual feedback
        setTimeout(() => {
          GlobalLoaderService.hide();
        }, 100);
      } catch (error) {
        console.error("Theme switch failure:", error);
        GlobalLoaderService.hide();
      }
    });
  },

  destroy() {
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.removeEventListener("click", this._handleToggle);
    }
    this._isInitialized = false;
  },
};
