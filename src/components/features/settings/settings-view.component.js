export const SettingsViewComponent = {
  render() {
    const isDark =
      document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark";

    return `
      <section
        id="settings-view"
        class="hidden"
      >
        <div
          class="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full animate-fade-in"
        >
          <div class="flex flex-col gap-1">
            <h1 class="text-2xl font-bold text-primary">
              Application Settings
            </h1>
            <p class="text-sm text-secondary">
              Configure and manage your V4 habit tracking workspace environment.
            </p>
          </div>

          <div
            class="bg-surface border border-default rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
          >
            <div class="flex items-center gap-3 border-b border-default pb-3">
              <div
                class="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand"
              >
                <i class="fa-solid fa-palette text-sm"></i>
              </div>
              <div>
                <h3 class="font-semibold text-primary">Appearance Theme</h3>
                <p class="text-xs text-secondary">
                  Customize how the interface looks on your device.
                </p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 mt-1">
              <label
                class="flex items-center justify-between p-4 rounded-xl border border-default bg-surface-2 cursor-pointer hover:border-brand transition-all"
              >
                <div class="flex items-center gap-3">
                  <i class="fa-solid fa-sun text-amber-500 text-lg"></i>
                  <span class="text-sm font-medium text-primary"
                    >Light Mode</span
                  >
                </div>
                <input
                  type="radio"
                  name="theme-toggle"
                  value="light"
                  ${!isDark ? "checked" : ""}
                  class="w-4 h-4 text-brand border-gray-300 focus:ring-brand"
                />
              </label>

              <label
                class="flex items-center justify-between p-4 rounded-xl border border-default bg-surface-2 cursor-pointer hover:border-brand transition-all"
              >
                <div class="flex items-center gap-3">
                  <i class="fa-solid fa-moon text-indigo-400 text-lg"></i>
                  <span class="text-sm font-medium text-primary"
                    >Dark Mode</span
                  >
                </div>
                <input
                  type="radio"
                  name="theme-toggle"
                  value="dark"
                  ${isDark ? "checked" : ""}
                  class="w-4 h-4 text-brand border-gray-300 focus:ring-brand"
                />
              </label>
            </div>
          </div>

          <div
            class="bg-surface border border-default rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
          >
            <div class="flex items-center gap-3 border-b border-default pb-3">
              <div
                class="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500"
              >
                <i class="fa-solid fa-database text-sm"></i>
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
              class="flex items-center justify-between bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 mt-1"
            >
              <div class="flex flex-col gap-0.5">
                <span
                  class="text-sm font-semibold text-rose-600 dark:text-rose-400"
                  >Reset All Database Records</span
                >
                <span class="text-xs text-secondary"
                  >This action will wipe out all tracking histories and custom
                  habits permanently.</span
                >
              </div>
              <button
                id="trigger-reset-btn"
                class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm transition-all shadow-sm flex items-center gap-2"
              >
                <i class="fa-solid fa-trash-can text-xs"></i>
                <span>Reset Data</span>
              </button>
            </div>
          </div>
        </div>

        <div
          id="settings-reset-modal"
          class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
        >
          <div
            class="bg-surface rounded-2xl p-6 max-w-sm w-full shadow-xl flex flex-col gap-4"
          >
            <div
              class="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center text-xl mx-auto"
            >
              <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div class="text-center flex flex-col gap-1">
              <h3 class="text-lg font-bold text-primary">
                Are you absolutely sure?
              </h3>
              <p class="text-sm text-secondary">
                This operations cannot be undone. All your progress will vanish
                instantly.
              </p>
            </div>
            <div class="grid grid-cols-2 gap-3 mt-2">
              <button
                id="cancel-settings-reset"
                class="px-4 py-2.5 rounded-xl bg-surface-3 hover:bg-surface-4 text-secondary font-medium text-sm transition-all border border-default"
              >
                Cancel
              </button>
              <button
                id="confirm-settings-reset"
                class="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm transition-all shadow-sm"
              >
                Yes, Wipe Out
              </button>
            </div>
          </div>
        </div>
      </section>
    `;
  },
};
