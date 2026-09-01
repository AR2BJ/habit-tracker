/**
 * KeyboardShortcutService - Manages keyboard shortcuts
 * This is a UI service that handles keyboard event delegation
 */
export const KeyboardShortcutService = {
  _handlers: [],
  _isInitialized: false,

  /**
   * Initialize keyboard shortcut service
   */
  init() {
    if (this._isInitialized) return;
    this._isInitialized = true;

    window.addEventListener("keydown", this._handleKeydown.bind(this));
  },

  /**
   * Register a shortcut handler
   */
  register(handler) {
    this._handlers.push(handler);
    return () => {
      this._handlers = this._handlers.filter((h) => h !== handler);
    };
  },

  /**
   * Unregister all handlers
   */
  clear() {
    this._handlers = [];
  },

  /**
   * Handle keydown event
   */
  _handleKeydown(event) {
    // Check if focus is in input/textarea
    const activeEl = document.activeElement;
    if (
      activeEl &&
      (activeEl.tagName === "INPUT" ||
        activeEl.tagName === "TEXTAREA" ||
        activeEl.isContentEditable)
    ) {
      // Special case: Escape to blur
      if (event.key === "Escape") {
        activeEl.blur();
        this._triggerHandlers("escape", event);
      }
      return;
    }

    // Let handlers process the event
    let handled = false;
    for (const handler of this._handlers) {
      if (handler(event)) {
        handled = true;
        break;
      }
    }

    if (handled) {
      event.preventDefault();
    }
  },

  /**
   * Trigger handlers for a specific event type
   */
  _triggerHandlers(type, event) {
    for (const handler of this._handlers) {
      if (handler({ type, event })) break;
    }
  },

  /**
   * Clean up
   */
  destroy() {
    window.removeEventListener("keydown", this._handleKeydown);
    this._handlers = [];
    this._isInitialized = false;
  },
};
