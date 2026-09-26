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

    btn.addEventListener("mouseenter", () => {
      const sunIcon = document.getElementById("btn-sun");
      const moonIcon = document.getElementById("btn-moon");
      const moonStarsIcon = document.getElementById("btn-moon-stars");

      if (sunIcon) {
        sunIcon.classList.add("rotate-45", "scale-110");
        sunIcon.classList.replace("ti-sun", "ti-sun-high");
      }

      if (moonIcon && moonStarsIcon) {
        moonIcon.classList.replace("opacity-100", "opacity-0");
        moonIcon.classList.replace("scale-100", "scale-75");

        moonStarsIcon.classList.replace("opacity-0", "opacity-100");
        moonStarsIcon.classList.replace("scale-75", "scale-110");
      }
    });

    btn.addEventListener("mouseleave", () => {
      const sunIcon = document.getElementById("btn-sun");
      const moonIcon = document.getElementById("btn-moon");
      const moonStarsIcon = document.getElementById("btn-moon-stars");

      if (sunIcon) {
        sunIcon.classList.remove("rotate-45", "scale-110");
        sunIcon.classList.replace("ti-sun-high", "ti-sun");
      }

      if (moonIcon && moonStarsIcon) {
        moonIcon.classList.replace("opacity-0", "opacity-100");
        moonIcon.classList.replace("scale-75", "scale-100");

        moonStarsIcon.classList.replace("opacity-100", "opacity-0");
        moonStarsIcon.classList.replace("scale-110", "scale-75");
      }
    });
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
