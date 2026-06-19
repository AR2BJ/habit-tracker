import { SettingsResetComponent } from "@/components/modals/settings-reset-modal.component.js";

export const SettingsViewComponent = {
  render() {
    const isDark =
      document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark";

    const autoArchive = localStorage.getItem("sett_auto_archive") === "true";

    return `
      <section id="settings-view" class="hidden">
        <div class="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full animate-fade-in pb-16">
          
          <div class="flex flex-col gap-1">
            <h1 class="text-2xl font-bold text-primary">Application Settings</h1>
            <p class="text-sm text-secondary">Configure and manage your V4 habit tracking workspace environment.</p>
          </div>

          <div class="bg-surface rounded-2xl p-6 flex flex-col gap-4 shadow-sm border border-border">
            <div class="flex items-center gap-3 border-b border-border pb-3">
              <div class="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-400">
                <i class="fa-regular fa-palette text-sm"></i>
              </div>
              <div>
                <h3 class="font-semibold text-primary">Appearance Theme</h3>
                <p class="text-xs text-secondary">Customize how the interface looks on your device.</p>
              </div>
            </div>

            <div class="relative flex w-full bg-surface-2 rounded-2xl p-1 border border-border mt-2">
              <div
                id="theme-tab-indicator"
                class="absolute top-1 left-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-xl bg-brand transition-all duration-300 ${isDark ? "translate-x-full" : "translate-x-0"}"
              ></div>

              <button
                id="sett-theme-light"
                class="relative z-10 w-1/2 py-3 text-sm font-medium rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${!isDark ? "text-(--color-btn-primary-text)" : "text-secondary"}"
              >
                <i class="fa-regular fa-sun text-lg"></i>
                <span>Light Mode</span>
              </button>

              <button
                id="sett-theme-dark"
                class="relative z-10 w-1/2 py-3 text-sm font-medium rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${isDark ? "text-(--color-btn-primary-text)" : "text-secondary"}"
              >
                <i class="fa-regular fa-moon text-lg"></i>
                <span>Dark Mode</span>
              </button>
            </div>
          </div>

          <div class="bg-surface rounded-2xl p-6 flex flex-col gap-4 shadow-sm border border-border">
            <div class="flex items-center gap-3 border-b border-border pb-3">
              <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <i class="fa-regular fa-share text-sm"></i>
              </div>
              <div>
                <h3 class="font-semibold text-primary">Data Backup & Sandbox</h3>
                <p class="text-xs text-secondary">Export your tracking ledger, import backups, or seed mock data.</p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
              <button
                id="sett-export-btn"
                class="px-4 py-3 bg-surface-2 hover:bg-surface-3 border border-border rounded-xl text-primary text-sm font-medium flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <i class="fa-regular fa-download text-emerald-500"></i>
                <span>Export Backup (JSON)</span>
              </button>

              <button
                id="sett-seed-btn"
                class="px-4 py-3 bg-brand/5 hover:bg-brand/10 border border-brand/20 rounded-xl text-brand text-sm font-medium flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <i class="fa-regular fa-flask text-xs"></i>
                <span>Seed Mock Data (Sandbox)</span>
              </button>
            </div>

            <div class="flex flex-col gap-2 mt-2">
              <label class="text-xs font-semibold text-secondary">Import Database File</label>
              <div
                id="sett-dropzone"
                class="border-2 border-dashed border-border hover:border-brand rounded-xl p-5 flex flex-col items-center justify-center gap-2 bg-surface-2/50 transition cursor-pointer group text-center"
              >
                <i class="fa-regular fa-cloud-arrow-up text-xl text-secondary group-hover:text-brand transition animate-pulse"></i>
                <span class="text-xs font-medium text-primary">Drag & drop your backup file here or <span class="text-brand">browse</span></span>
                <span class="text-[10px] text-secondary">Supports only validated .json structural backups</span>
                <input type="file" id="sett-import-file" accept=".json" class="hidden" />
              </div>
            </div>
          </div>

          <div class="bg-surface rounded-2xl p-6 flex flex-col gap-4 shadow-sm border border-border">
            <div class="flex items-center gap-3 border-b border-border pb-3">
              <div class="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <i class="fa-regular fa-brain-circuit text-sm"></i>
              </div>
              <div>
                <h3 class="font-semibold text-primary">Automation Rules</h3>
                <p class="text-xs text-secondary">Configure autonomous pipeline structures for habits archiving.</p>
              </div>
            </div>

            <div class="flex items-center justify-between p-1 mt-1">
              <div class="flex flex-col gap-0.5 w-3/4">
                <span class="text-sm font-medium text-primary">Auto-Archive Inactive Habits</span>
                <span class="text-xs text-secondary">Automatically shift habit profiles to the archived tab if zero commit logs are registered within the last 30 days.</span>
              </div>
              
              <button
                id="sett-auto-archive-toggle"
                class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${autoArchive ? "bg-brand" : "bg-neutral-300 dark:bg-neutral-700"}"
              >
                <span
                  id="sett-auto-archive-dot"
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${autoArchive ? "translate-x-5" : "translate-x-0"}"
                ></span>
              </button>
            </div>
          </div>

          <div class="bg-surface rounded-2xl p-6 flex flex-col gap-4 shadow-sm border border-border">
            <div class="flex items-center gap-3 border-b border-border pb-3">
              <div class="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
                <i class="fa-regular fa-database text-sm"></i>
              </div>
              <div>
                <h3 class="font-semibold text-primary">Storage & Factory Reset</h3>
                <p class="text-xs text-secondary">Clear localized database structures and cache records.</p>
              </div>
            </div>

            <div class="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between bg-red-500/5 border border-red-500/20 rounded-xl p-4 gap-4 mt-1">
              <div class="w-full sm:w-3/4 flex flex-col gap-0.5">
                <span class="text-sm font-semibold text-red-600 dark:text-red-400">Reset All Database Records</span>
                <span class="text-xs text-secondary">This action will wipe out all tracking histories and custom habits permanently.</span>
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
      </section>
    `;
  },
};
