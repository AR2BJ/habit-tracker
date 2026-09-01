/**
 * Tooltip Service - Manages tooltip creation, positioning, and cleanup
 * This is a UI service that handles DOM manipulation for tooltips
 */
const TOOLTIP_ID = "habit-mobile-tooltip";

export const TooltipService = {
  _tooltip: null,
  _timeoutId: null,

  /**
   * Create a tooltip element
   */
  create(text) {
    this.remove();

    const tooltip = document.createElement("div");
    tooltip.id = TOOLTIP_ID;
    tooltip.className =
      "max-w-70 fixed z-50 flex justify-center items-center rounded-lg border border-white/10 bg-slate-900/95 px-2.5 py-1.5 text-[11px] font-medium leading-5 text-white shadow-xl pointer-events-none";
    tooltip.innerHTML = `<span class="max-w-full wrap-break-word">${text}</span>`;

    document.body.appendChild(tooltip);
    this._tooltip = tooltip;
    return tooltip;
  },

  /**
   * Position tooltip relative to target element
   */
  position(target, tooltip) {
    const rect = target.getBoundingClientRect();
    const width = tooltip.offsetWidth || 180;
    let left = Math.min(rect.left, window.innerWidth - width - 12);
    left = Math.max(12, left);

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${rect.bottom + 8}px`;
  },

  /**
   * Remove tooltip from DOM
   */
  remove() {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }

    if (this._tooltip) {
      this._tooltip.remove();
      this._tooltip = null;
    }

    const existing = document.getElementById(TOOLTIP_ID);
    if (existing) existing.remove();
  },

  /**
   * Show tooltip for a target element
   */
  show(target, duration = 3000) {
    const title = target?.dataset?.tooltipTitle;
    if (!title) return;

    this.remove();

    const tooltip = this.create(title);
    this.position(target, tooltip);

    // Auto-hide after duration
    this._timeoutId = setTimeout(() => {
      this.remove();
      this._timeoutId = null;
    }, duration);

    // Hide on scroll
    const onScroll = () => {
      this.remove();
      window.removeEventListener("scroll", onScroll, { passive: true });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
  },

  /**
   * Check if a tooltip is currently visible
   */
  isVisible() {
    return this._tooltip !== null;
  },

  /**
   * Get the current tooltip element
   */
  getElement() {
    return this._tooltip;
  },
};
