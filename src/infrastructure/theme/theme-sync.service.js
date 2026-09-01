import { ThemeApplication } from "./theme.application";

const THEME_KEY = "theme";

export const ThemeSyncService = {
  _isInitialized: false,
  _pollingInterval: null,
  _pollingIntervalMs: 3000,
  _lastKnownTheme: null,

  init() {
    if (this._isInitialized) return;
    this._isInitialized = true;

    // 1. Storage event (cross-tab)
    window.addEventListener("storage", this._handleStorageChange.bind(this));

    // 2. Local update event (same-tab)
    window.addEventListener(
      "theme-storage-update",
      this._handleThemeUpdate.bind(this),
    );

    // 3. Start polling
    this._startPolling();

    // 4. Store initial theme
    this._lastKnownTheme = this._getCurrentTheme();

    // 5. Expose for debugging
    if (typeof window !== "undefined") {
      window.__themeSync = {
        force: () => this.forceSync(),
        status: () => this._getCurrentTheme(),
        key: THEME_KEY,
        poll: () => this._checkForChanges(),
      };
    }
  },

  _getCurrentTheme() {
    try {
      return localStorage.getItem(THEME_KEY) || "dark";
    } catch (e) {
      console.error("Failed to read theme:", e);
      return "dark";
    }
  },

  _startPolling() {
    if (this._pollingInterval) {
      clearInterval(this._pollingInterval);
    }

    this._pollingInterval = setInterval(() => {
      this._checkForChanges();
    }, this._pollingIntervalMs);
  },

  _checkForChanges() {
    if (this._syncInProgress) return;

    const currentTheme = this._getCurrentTheme();

    if (currentTheme === this._lastKnownTheme) return;

    this._lastKnownTheme = currentTheme;
    this._syncTheme(currentTheme);
  },

  _handleStorageChange(event) {
    if (event.key !== THEME_KEY) return;
    if (this._syncInProgress) return;

    this._lastKnownTheme = event.newValue;
    this._syncTheme(event.newValue || "dark");
  },

  _handleThemeUpdate(event) {
    if (event.detail?.key !== THEME_KEY) return;
    if (this._syncInProgress) return;

    this._lastKnownTheme = event.detail?.theme || "dark";
    this._syncTheme(this._lastKnownTheme);
  },

  _syncTheme(theme) {
    if (this._syncInProgress) return;
    this._syncInProgress = true;

    try {
      // Update ThemeApplication without saving again
      ThemeApplication.applyTheme(theme);

      // Update icon in UI
      import("@/controllers/theme.controller").then(
        ({ ThemeController }) => {
          ThemeController.updateIcon(theme);
        },
      );

      // Dispatch event for other components
      window.dispatchEvent(
        new CustomEvent("theme-sync-complete", {
          detail: {
            theme: theme,
            timestamp: Date.now(),
          },
        }),
      );

    } catch (error) {
      console.error("Theme sync failed:", error);
    } finally {
      this._syncInProgress = false;
    }
  },

  forceSync() {
    this._lastKnownTheme = null;
    this._checkForChanges();
  },

  setPollingInterval(ms) {
    this._pollingIntervalMs = ms;
    if (this._isInitialized) {
      this._startPolling();
    }
  },

  destroy() {
    if (this._pollingInterval) {
      clearInterval(this._pollingInterval);
      this._pollingInterval = null;
    }
    window.removeEventListener("storage", this._handleStorageChange);
    window.removeEventListener("theme-storage-update", this._handleThemeUpdate);
    this._isInitialized = false;
  },
};
