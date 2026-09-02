import { STORAGE_KEY } from "@/infrastructure/persistence/local-storage.adapter";
import { Store } from "@/infrastructure/store/store";

export const StorageService = {
  _isInitialized: false,
  _syncInProgress: false,
  _pollingInterval: null,
  _pollingIntervalMs: 3000,
  _lastKnownData: null,

  init() {
    if (this._isInitialized) return;

    this._isInitialized = true;

    // 1. Storage event
    window.addEventListener("storage", this._handleStorageChange.bind(this));

    // 2. Local update event
    window.addEventListener(
      "local-storage-update",
      this._handleLocalUpdate.bind(this),
    );

    // 3. Start polling
    this._startPolling();

    // 4. Store initial data
    this._lastKnownData = this._getCurrentStorageData();

    // 5. Expose for debugging
    if (typeof window !== "undefined") {
      window.__storageSync = {
        force: () => this.forceSync(),
        status: () => this._getCurrentStorageData(),
        poll: () => this._checkForChanges(),
        listeners: () => Store._listeners.length,
      };
    }
  },

  _getCurrentStorageData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw;
    } catch (e) {
      console.error("Failed to read storage:", e);
      return null;
    }
  },

  _startPolling() {
    if (this._pollingInterval) {
      clearInterval(this._pollingInterval);
    }

    this._pollingInterval = setInterval(() => {
      this._checkForChanges();
    }, this._pollingIntervalMs);

    // Store reference for debugging
    if (typeof window !== "undefined") {
      window._pollingInterval = this._pollingInterval;
    }
  },

  _checkForChanges() {
    if (this._syncInProgress) return;

    const currentData = this._getCurrentStorageData();

    // If data hasn't changed, skip
    if (currentData === this._lastKnownData) return;

    try {
      // Handle deletion
      if (currentData === null) {
        this._lastKnownData = null;
        this._syncFromStorage(null);
        return;
      }

      // Parse and sync new data
      const parsedData = JSON.parse(currentData);
      this._lastKnownData = currentData;
      this._syncFromStorage(parsedData);
    } catch (error) {
      console.error("Polling parse error:", error);
    }
  },

  _handleStorageChange(event) {
    if (event.key !== STORAGE_KEY) return;

    if (this._syncInProgress) return;

    this._lastKnownData = event.newValue;

    if (event.newValue === null) {
      this._syncFromStorage(null);
      return;
    }

    try {
      const newData = JSON.parse(event.newValue);
      this._syncFromStorage(newData);
    } catch (error) {
      console.error("Failed to parse storage data:", error);
    }
  },

  _handleLocalUpdate(event) {
    if (event.detail?.key !== STORAGE_KEY) return;

    if (this._syncInProgress) return;

    this._lastKnownData = this._getCurrentStorageData();

    const currentHabits = Store.getHabits();
    const newHabits = event.detail?.habits || [];

    if (JSON.stringify(currentHabits) !== JSON.stringify(newHabits)) {
      console.warn("⚠️ Store and storage out of sync, syncing...");
      this._syncFromStorage({ habits: newHabits });
    }
  },

  _syncFromStorage(storageData) {
    if (this._syncInProgress) return;

    this._syncInProgress = true;

    try {
      const newHabits = storageData?.habits || [];
      const currentHabits = Store.getHabits();

      const hasChanged = this._hasDataChanged(currentHabits, newHabits);

      if (!hasChanged) return;

      // Update Store WITHOUT saving to storage
      Store.setHabits(newHabits);

      // Dispatch event for UI
      window.dispatchEvent(
        new CustomEvent("storage-sync", {
          detail: {
            oldCount: currentHabits.length,
            newCount: newHabits.length,
            timestamp: Date.now(),
            habits: newHabits,
          },
        }),
      );
    } catch (error) {
      console.error("Storage sync failed:", error);
    } finally {
      this._syncInProgress = false;
    }
  },

  _hasDataChanged(oldHabits, newHabits) {
    if (oldHabits.length !== newHabits.length) return true;
    const oldJson = JSON.stringify(oldHabits);
    const newJson = JSON.stringify(newHabits);
    return oldJson !== newJson;
  },

  forceSync() {
    this._lastKnownData = null; // Force re-check
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
    window.removeEventListener("local-storage-update", this._handleLocalUpdate);
    this._isInitialized = false;
  },
};
