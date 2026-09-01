export const STORAGE_KEY = "habit_tracker";
export const STORAGE_VERSION = 1;

export const LocalStorageAdapter = {
  getItem(key) {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  },

  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  removeItem(key) {
    localStorage.removeItem(key);
  },
};
