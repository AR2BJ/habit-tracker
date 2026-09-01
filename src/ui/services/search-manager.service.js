import { GlobalLoaderService } from "@/services/loader.service";
import { HabitApplication } from "@/app/habits/habit.application";

/**
 * SearchManager - Manages habit search functionality
 */
export const SearchManager = {
  _input: null,
  _clearBtn: null,
  _container: null,

  init() {
    this._input = document.getElementById("search-habits");
    this._clearBtn = document.getElementById("clear-search-btn");
    this._container = this._input?.closest(".group\\/search");

    if (!this._input) return;

    const ui = HabitApplication.getUI();
    this._input.value = ui.searchQuery || "";

    this._bindEvents();
    this._evaluateSearchState();
  },

  _bindEvents() {
    this._input.addEventListener("input", (e) => {
      GlobalLoaderService.show("Loading, please wait...");
      try {
        HabitApplication.setSearchQuery(e.target.value);
        this._evaluateSearchState();
      } finally {
        GlobalLoaderService.hide();
      }
    });

    this._container?.addEventListener("mouseenter", () =>
      this._evaluateSearchState(),
    );
    this._container?.addEventListener("mouseleave", () =>
      this._evaluateSearchState(),
    );

    this._clearBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      GlobalLoaderService.show("Loading, please wait...");
      try {
        this._input.value = "";
        HabitApplication.setSearchQuery("");
        setTimeout(() => this._input.focus(), 10);
        this._evaluateSearchState();
      } finally {
        GlobalLoaderService.hide();
      }
    });
  },

  _evaluateSearchState() {
    const hasValue = this._input.value.trim().length > 0;
    const isHovered = this._container?.matches(":hover");

    if (hasValue && isHovered) {
      if (this._clearBtn) {
        this._clearBtn.classList.replace("hidden", "flex");
        requestAnimationFrame(() => {
          this._clearBtn.classList.remove("opacity-0", "scale-75");
          this._clearBtn.classList.add("opacity-100", "scale-100");
        });
      }
    } else if (this._clearBtn) {
      this._clearBtn.classList.remove("opacity-100", "scale-100");
      this._clearBtn.classList.add("opacity-0", "scale-75");

      setTimeout(() => {
        if (
          !this._input.value.trim().length ||
          !this._container?.matches(":hover")
        ) {
          this._clearBtn.classList.replace("flex", "hidden");
        }
      }, 200);
    }
  },

  getQuery() {
    return this._input?.value || "";
  },

  destroy() {
    this._input = null;
    this._clearBtn = null;
    this._container = null;
  },
};
