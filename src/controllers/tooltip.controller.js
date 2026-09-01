import { TooltipService } from "@/ui/services/tooltip.service";

/**
 * TooltipController - Manages tooltip event binding and user interaction
 * This is a thin UI controller that delegates to TooltipService
 */
export const TooltipController = {
  _boundElements: new WeakSet(),

  /**
   * Find the nearest element with data-tooltip-title attribute
   */
  _findTooltipTarget(element) {
    return element.closest("[data-tooltip-title]");
  },

  /**
   * Handle click event - show tooltip on click
   */
  _handleClick(event) {
    const target = this._findTooltipTarget(event.target);
    if (target) {
      TooltipService.show(target);
    }
  },

  /**
   * Handle keyboard event - show tooltip on Enter/Space
   */
  _handleKeydown(event) {
    if (event.key !== "Enter" && event.key !== " ") return;

    const target = this._findTooltipTarget(event.target);
    if (!target) return;

    event.preventDefault();
    TooltipService.show(target);
  },

  /**
   * Handle mouseenter event - show tooltip on hover (optional)
   * Could be added for desktop hover behavior
   */
  _handleMouseEnter(event) {
    const target = this._findTooltipTarget(event.target);
    if (target && !TooltipService.isVisible()) {
      TooltipService.show(target, 2000);
    }
  },

  /**
   * Handle mouseleave event - hide tooltip
   */
  _handleMouseLeave() {
    TooltipService.remove();
  },

  /**
   * Initialize tooltip controller
   */
  init(root = document.body) {
    this.unbind();
    this.bind(root);
  },

  /**
   * Bind event listeners to a container
   */
  bind(root = document.body) {
    const container =
      typeof root === "string" ? document.querySelector(root) : root;
    if (!container) return;

    // Prevent duplicate binding
    if (this._boundElements.has(container)) return;
    this._boundElements.add(container);

    // Use bound methods for proper cleanup
    this._boundClick = this._handleClick.bind(this);
    this._boundKeydown = this._handleKeydown.bind(this);
    this._boundMouseEnter = this._handleMouseEnter.bind(this);
    this._boundMouseLeave = this._handleMouseLeave.bind(this);

    container.addEventListener("click", this._boundClick);
    container.addEventListener("keydown", this._boundKeydown);
    container.addEventListener("mouseenter", this._boundMouseEnter, {
      passive: true,
    });
    container.addEventListener("mouseleave", this._boundMouseLeave, {
      passive: true,
    });
  },

  /**
   * Unbind event listeners from a container
   */
  unbind(root = document.body) {
    const container =
      typeof root === "string" ? document.querySelector(root) : root;
    if (!container) return;

    if (this._boundClick) {
      container.removeEventListener("click", this._boundClick);
      container.removeEventListener("keydown", this._boundKeydown);
      container.removeEventListener("mouseenter", this._boundMouseEnter);
      container.removeEventListener("mouseleave", this._boundMouseLeave);
    }

    this._boundElements.delete(container);

    // Clean up tooltip
    TooltipService.remove();
  },

  /**
   * Show tooltip programmatically
   */
  showTooltip(target, duration = 3000) {
    TooltipService.show(target, duration);
  },

  /**
   * Hide tooltip programmatically
   */
  hideTooltip() {
    TooltipService.remove();
  },

  /**
   * Clean up all resources
   */
  destroy() {
    this.unbind();
    TooltipService.remove();
    this._boundElements = new WeakSet();
  },
};
