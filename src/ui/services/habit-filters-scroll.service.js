/**
 * HabitFiltersScrollService - Manages scroll behavior for habit filter buttons
 * This is a UI service that handles DOM manipulation for filter scrolling
 */
export const HabitFiltersScrollService = {
  _initialized: false,
  _observers: [],

  /**
   * Initialize the scroll service
   */
  init() {
    if (this._initialized) return;
    this._initialized = true;

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      this._setup();
    });
  },

  _setup() {
    const scrollContainer = document.getElementById("habit-filter-scroll");
    const btnLeft = document.getElementById("btn-scroll-left");
    const btnRight = document.getElementById("btn-scroll-right");

    if (!scrollContainer || !btnLeft || !btnRight) return;

    const scrollStep = 180;

    btnLeft.addEventListener("click", (e) => {
      e.stopPropagation();
      scrollContainer.scrollBy({ left: -scrollStep, behavior: "smooth" });
    });

    btnRight.addEventListener("click", (e) => {
      e.stopPropagation();
      scrollContainer.scrollBy({ left: scrollStep, behavior: "smooth" });
    });

    const checkOverflowState = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
      const hasOverflow = scrollWidth > clientWidth + 2;

      if (
        scrollContainer.offsetParent === null ||
        scrollContainer.clientWidth === 0
      ) {
        btnLeft.classList.add("hidden");
        btnLeft.classList.remove("flex");
        btnRight.classList.add("hidden");
        btnRight.classList.remove("flex");
        scrollContainer.style.maskImage = "none";
        return;
      }

      if (!hasOverflow) {
        btnLeft.classList.add("hidden");
        btnLeft.classList.remove("flex");
        btnRight.classList.add("hidden");
        btnRight.classList.remove("flex");
        scrollContainer.style.maskImage = "none";
        return;
      }

      const atStart = Math.ceil(scrollLeft) <= 2;
      const atEnd = Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 2;

      btnLeft.classList.toggle("hidden", atStart);
      btnLeft.classList.toggle("flex", !atStart);

      btnRight.classList.toggle("hidden", atEnd);
      btnRight.classList.toggle("flex", !atEnd);

      const fadeWidth = "80px";

      if (atStart) {
        scrollContainer.style.maskImage = `linear-gradient(to right, black 0%, black calc(100% - ${fadeWidth}), transparent 100%)`;
      } else if (atEnd) {
        scrollContainer.style.maskImage = `linear-gradient(to right, transparent 0%, black ${fadeWidth}, black 100%)`;
      } else {
        scrollContainer.style.maskImage = `linear-gradient(to right, transparent 0%, black ${fadeWidth}, black calc(100% - ${fadeWidth}), transparent 100%)`;
      }
    };

    const triggerCheck = () => {
      requestAnimationFrame(() => {
        setTimeout(checkOverflowState, 100);
      });
    };

    scrollContainer.addEventListener("scroll", checkOverflowState);

    // Setup observers
    const mutationObserver = new MutationObserver(() => {
      triggerCheck();
    });
    mutationObserver.observe(scrollContainer, {
      childList: true,
      subtree: true,
    });
    this._observers.push(mutationObserver);

    const viewSection = document.getElementById("habits-view");
    if (viewSection) {
      const sectionObserver = new MutationObserver(() => {
        if (!viewSection.classList.contains("hidden")) {
          triggerCheck();
        }
      });
      sectionObserver.observe(viewSection, {
        attributes: true,
        attributeFilter: ["class"],
      });
      this._observers.push(sectionObserver);
    }

    const resizeObserver = new ResizeObserver(() => {
      triggerCheck();
    });
    resizeObserver.observe(scrollContainer);
    if (viewSection) {
      resizeObserver.observe(viewSection);
    }
    this._observers.push(resizeObserver);

    window.addEventListener("resize", triggerCheck);
    window.addEventListener("load", triggerCheck);

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => triggerCheck());
    }

    triggerCheck();
  },

  /**
   * Destroy all observers and cleanup
   */
  destroy() {
    this._observers.forEach((observer) => {
      if (observer.disconnect) {
        observer.disconnect();
      }
    });
    this._observers = [];
    this._initialized = false;
  },

  /**
   * Re-initialize (useful after DOM changes)
   */
  reinit() {
    this.destroy();
    this.init();
  },
};
