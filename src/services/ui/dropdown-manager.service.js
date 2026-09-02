/**
 * DropdownManager - Manages dropdown menus (action menu on habit cards)
 */
export const DropdownManager = {
  init() {
    document.addEventListener("click", this._handleClick.bind(this));
  },

  _handleClick(e) {
    const toggleBtn = e.target.closest(".dropdown-toggle-btn");

    if (toggleBtn) {
      e.stopPropagation();
      const container = toggleBtn.closest(".dropdown-container");
      const menu = container?.querySelector(".dropdown-menu");

      document.querySelectorAll(".dropdown-menu").forEach((m) => {
        if (m !== menu) m.classList.add("hidden");
      });

      menu?.classList.toggle("hidden");
      return;
    }

    if (!e.target.closest(".dropdown-container")) {
      document
        .querySelectorAll(".dropdown-menu")
        .forEach((m) => m.classList.add("hidden"));
    }
  },

  closeAll() {
    document
      .querySelectorAll(".dropdown-menu")
      .forEach((m) => m.classList.add("hidden"));
  },
};
