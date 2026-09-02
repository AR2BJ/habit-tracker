export const ModalManager = {
  _toggleModal: null,

  /**
   * Set modal toggle callback
   */
  setToggleCallback(callback) {
    this._toggleModal = callback;
  },

  /**
   * Default modal toggle (fallback)
   */
  _defaultToggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    if (show) {
      modal.classList.replace("hidden", "flex");
      document.body.classList.add("overflow-hidden");
    } else {
      modal.classList.replace("flex", "hidden");
      document.body.classList.remove("overflow-hidden");
    }
  },

  /**
   * Toggle modal (uses injected callback or default)
   */
  toggle(modalId, show) {
    if (this._toggleModal) {
      this._toggleModal(modalId, show);
    } else {
      this._defaultToggleModal(modalId, show);
    }
  },

  /**
   * Close all modals
   */
  closeAll() {
    const modalIds = [
      "help-modal",
      "habit-modal",
      "delete-modal",
      "reset-modal",
      "edit-modal",
    ];

    modalIds.forEach((id) => {
      const modal = document.getElementById(id);
      if (modal && !modal.classList.contains("hidden")) {
        this.toggle(id, false);
      }
    });

    document.body.classList.remove("overflow-hidden");
  },

  /**
   * Check if any modal is open
   */
  isAnyOpen() {
    const modalIds = [
      "help-modal",
      "habit-modal",
      "delete-modal",
      "reset-modal",
      "edit-modal",
    ];

    return modalIds.some((id) => {
      const modal = document.getElementById(id);
      return modal && !modal.classList.contains("hidden");
    });
  },
};
