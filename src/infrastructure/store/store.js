export const Store = {
  _state: {
    habits: [],
    // domain state
    ui: {
      activeTab: "active",
      currentView: "habits",
      currentCategory: "all",
      searchQuery: "",
    },
    session: {
      lastDeletedHabit: null,
    },
  },
  _listeners: [],

  getState() {
    return this._state;
  },

  getHabits() {
    return this._state.habits;
  },

  setHabits(habits) {
    this._state.habits = habits;
    this._notify();
  },

  // UI state getters/setters
  getUI() {
    return this._state.ui;
  },

  setActiveTab(tab) {
    this._state.ui.activeTab = tab;
    this._notify();
  },

  setView(view) {
    this._state.ui.currentView = view;
    this._notify();
  },

  setCategory(category) {
    this._state.ui.currentCategory = category;
    this._notify();
  },

  setSearchQuery(query) {
    this._state.ui.searchQuery = query;
    this._notify();
  },

  // Session state
  getSession() {
    return this._state.session;
  },

  setLastDeleted(habit) {
    this._state.session.lastDeletedHabit = habit;
    this._notify();
  },

  subscribe(listener) {
    this._listeners.push(listener);
    return () => {
      this._listeners = this._listeners.filter((l) => l !== listener);
    };
  },

  _notify() {
    this._listeners.forEach((listener) => {
      try {
        listener(this._state);
      } catch (e) {
        console.error("Listener error:", e);
      }
    });
  },
};
