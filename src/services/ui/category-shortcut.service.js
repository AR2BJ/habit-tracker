/**
 * CategoryShortcutService - Manages category shortcut key buffering
 */
export const CategoryShortcutService = {
  _buffer: "",
  _timeoutId: null,
  _timeout: 200,

  /**
   * Queue a digit key for category shortcut
   */
  queueDigit(digit, onComplete) {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
    }

    if (this._buffer.length >= 2) {
      this._buffer = digit;
    } else {
      this._buffer += digit;
    }

    this._timeoutId = setTimeout(() => {
      this._process(onComplete);
    }, this._timeout);
  },

  /**
   * Process the buffered digits
   */
  _process(onComplete) {
    const index = parseInt(this._buffer, 10);
    this._buffer = "";
    this._timeoutId = null;

    if (isNaN(index)) return;

    // Find category filter buttons
    const categoryButtons = Array.from(
      document.querySelectorAll(
        "#category-filters button, .category-filter-btn",
      ),
    ).filter((btn) => {
      const style = window.getComputedStyle(btn);
      return (
        !btn.disabled &&
        style.display !== "none" &&
        style.visibility !== "hidden"
      );
    });

    const targetButton = categoryButtons[index];
    if (targetButton && onComplete) {
      onComplete(targetButton);
    }
  },

  /**
   * Reset buffer
   */
  reset() {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
    this._buffer = "";
  },

  /**
   * Set timeout duration
   */
  setTimeout(ms) {
    this._timeout = ms;
  },
};
