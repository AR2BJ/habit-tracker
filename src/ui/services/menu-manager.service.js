/**
 * MenuManager - Manages desktop menu toggle
 */
export const MenuManager = {
  _isOpen: false,

  init() {
    const menuToggle = document.getElementById("menu-toggle");
    menuToggle?.addEventListener("click", () => this.toggle());
  },

  toggle() {
    this._isOpen = !this._isOpen;
    const desktopNav = document.getElementById("desktop-nav");
    const app = document.getElementById("app");

    if (this._isOpen) {
      desktopNav?.classList.replace(
        "-translate-x-[calc(100%+2rem)]",
        "translate-x-0",
      );
      app?.classList.replace("lg:ps-8", "lg:ps-30");
    } else {
      desktopNav?.classList.replace(
        "translate-x-0",
        "-translate-x-[calc(100%+2rem)]",
      );
      app?.classList.replace("lg:ps-30", "lg:ps-8");
    }
  },

  open() {
    if (!this._isOpen) this.toggle();
  },

  close() {
    if (this._isOpen) this.toggle();
  },

  isOpen() {
    return this._isOpen;
  },
};
