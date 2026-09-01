import { GlobalLoaderService } from "@/services/loader.service";
import { HabitApplication } from "@/app/habits/habit.application";

/**
 * CategoryFilterManager - Manages category filter buttons
 */
export const CategoryFilterManager = {
  _categoryNames: {
    all: "All Habits",
    general: "General & Miscellaneous",
    health: "Health & Bio-Maintenance",
    work: "Work & Production Dev",
    research: "Research & Deep Dive",
    academics: "Academics & Advanced Knowledge",
    openSource: "Open Source & Side Projects",
    systemDesign: "System Design & Soft Skills",
    digitalDetox: "Digital Detox & Reset",
    routine: "Daily Routines & Workflow",
    harmful: "Harmful Habits",
  },

  init() {
    this._bindFilterEvents();
  },

  _bindFilterEvents() {
    const filterButtons = document.querySelectorAll(".category-filter-btn");

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const currentBtn = e.currentTarget;
        const selectedCategory = currentBtn.dataset.category;

        if (currentBtn.classList.contains("bg-brand/80")) return;

        GlobalLoaderService.show(
          `Filtering workspace by ${this._categoryNames[selectedCategory] || selectedCategory}...`,
        );

        try {
          HabitApplication.setCategory(selectedCategory);
          this._updateButtonStates(filterButtons, currentBtn);
        } finally {
          GlobalLoaderService.hide();
        }
      });
    });
  },

  _updateButtonStates(buttons, activeBtn) {
    buttons.forEach((btn) => {
      const isActive = btn === activeBtn;
      this._setButtonState(btn, isActive);
    });
  },

  _setButtonState(button, isActive) {
    const icon = button.querySelector(".category-icon");
    const svg =
      icon?.tagName?.toLowerCase() === "svg"
        ? icon
        : icon?.querySelector("svg");

    button.classList.toggle("bg-brand/80", isActive);
    button.classList.toggle("text-white", isActive);
    button.classList.toggle("shadow-brand/10", isActive);
    button.classList.toggle("shadow-sm", isActive);
    button.classList.toggle("border-brand/80", isActive);
    button.classList.toggle("bg-surface", !isActive);
    button.classList.toggle("border-border", !isActive);
    button.classList.toggle("text-secondary", !isActive);
    button.classList.toggle("hover:text-color", !isActive);
    button.classList.toggle("hover:bg-surface-2", !isActive);

    if (icon) {
      icon.style.color = isActive ? "#fff" : "";
    }
    if (svg) {
      svg.style.fill = isActive ? "currentColor" : "";
      svg.style.stroke = isActive ? "currentColor" : "";
    }
    svg?.querySelectorAll("path, circle, rect, polygon").forEach((shape) => {
      shape.style.fill = isActive ? "currentColor" : "";
      shape.style.stroke = isActive ? "currentColor" : "";
    });
  },
};
