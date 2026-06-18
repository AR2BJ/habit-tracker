// ========================================================
// DESKTOP SIDEBAR NAVIGATION COMPONENT - V4
// ========================================================

export const DesktopNavComponent = {
  render() {
    return `
      <div
        id="desktop-nav"
        class="hidden lg:flex fixed left-5 top-5 bottom-5 w-20 flex-col justify-between items-center bg-surface-2 backdrop-blur-xl border border-border rounded-3xl py-4 z-50 transition-all duration-300 -translate-x-[calc(100%+2rem)]"
      >
        <div class="flex flex-col gap-6 w-full px-3">
          <button
            id="nav-habits"
            class="nav-item justify-center"
            title="Habits"
          >
            <i class="fa-regular fa-list text-xl"></i>
          </button>

          <button
            id="nav-analytics"
            class="nav-item justify-center"
            title="Analytics"
          >
            <i class="fa-regular fa-chart-line text-xl"></i>
          </button>
        </div>

        <div class="w-full px-3">
          <button
            id="nav-settings"
            class="nav-item justify-center"
            title="Settings"
          >
            <i class="fa-regular fa-gear text-xl"></i>
          </button>
        </div>
      </div>
    `;
  },
};
