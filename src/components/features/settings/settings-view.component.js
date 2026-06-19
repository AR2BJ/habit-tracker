import { SettingsResetComponent } from "@/components/modals/settings-reset-modal.component";

export const SettingsViewComponent = {
  render() {
    const isDark =
      document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark";

    return `
      <div
        class="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full animate-fade-in"
      >
        <div class="flex flex-col gap-1">
          <h1 class="text-2xl font-bold text-primary">Application Settings</h1>
          <p class="text-sm text-secondary">
            Configure and manage your V4 habit tracking workspace environment.
          </p>
        </div>

        <div
          class="bg-surface rounded-2xl p-6 flex flex-col gap-4 shadow-sm border border-border"
        >
          <div class="flex items-center gap-3 border-b border-border pb-3">
            <div
              class="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand"
            >
              <i class="fa-regular fa-palette text-sm"></i>
            </div>
            <div>
              <h3 class="font-semibold text-primary">Appearance Theme</h3>
              <p class="text-xs text-secondary">
                Customize how the interface looks on your device.
              </p>
            </div>
          </div>

          <div
            class="relative flex w-full bg-surface-2 rounded-2xl p-1 border border-border mt-2"
          >
            <div
              id="theme-tab-indicator"
              class="absolute top-1 left-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-xl bg-brand transition-all duration-300 ${
                isDark ? "translate-x-full" : "translate-x-0"
              }"
            ></div>

            <button
              id="sett-theme-light"
              data-theme="light"
              class="relative z-10 w-1/2 py-3 text-sm font-medium rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                !isDark ? "text-(--color-btn-primary-text)" : "text-secondary"
              }"
            >
              <i class="fa-regular fa-sun text-lg"></i>
              <span>Light Mode</span>
            </button>

            <button
              id="sett-theme-dark"
              data-theme="dark"
              class="relative z-10 w-1/2 py-3 text-sm font-medium rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                isDark ? "text-(--color-btn-primary-text)" : "text-secondary"
              }"
            >
              <i class="fa-regular fa-moon text-lg"></i>
              <span>Dark Mode</span>
            </button>
          </div>
        </div>

        <div
          class="bg-surface rounded-2xl p-6 flex flex-col gap-4 shadow-sm border border-border"
        >
          <div class="flex items-center gap-3 border-b border-border pb-3">
            <div
              class="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center"
            >
              <i class="fa-regular fa-database text-sm"></i>
            </div>
            <div>
              <h3 class="font-semibold text-primary">
                Storage & Factory Reset
              </h3>
              <p class="text-xs text-secondary">
                Clear localized database structures and cache records.
              </p>
            </div>
          </div>

          <div
            class="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between bg-red-500/5 border border-red-500/20 rounded-xl p-4 gap-4 mt-1"
          >
            <div class="w-full sm:w-3/4 flex flex-col gap-0.5">
              <span class="text-sm font-semibold text-red-600 dark:text-red-400"
                >Reset All Database Records</span
              >
              <span class="text-xs text-secondary"
                >This action will wipe out all tracking histories and custom
                habits permanently.</span
              >
            </div>

            <button
              id="trigger-reset-btn"
              class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-800 text-white font-medium text-sm transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <i class="fa-regular fa-trash-can text-xs"></i>
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </div>

      ${SettingsResetComponent.render()}
    `;
  },
};
