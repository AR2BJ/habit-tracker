// ========================================================
// CORE APPLICATION MODALS COMPONENT (EDIT) - V4
// ========================================================

export const EditModalsComponent = {
  render() {
    return `
      <div
        id="edit-modal"
        class="min-h-screen fixed inset-0 z-50 hidden items-center justify-center"
      >
        <div
          id="edit-modal-backdrop"
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
        ></div>

        <div
          class="relative w-full max-w-md mx-4 bg-surface border border-border rounded-3xl p-6 shadow-2xl"
        >
          <h2 class="text-xl font-bold">Edit Habit</h2>

          <input
            id="edit-habit-input"
            type="text"
            maxlength="50"
            class="w-full mt-4 px-4 py-3 rounded-xl bg-surface-2 border border-border text-primary placeholder:text-(--color-tertiary) outline-none focus:ring-2 focus:ring-brand"
          />

          <div class="flex justify-end gap-2 mt-6">
            <button
              id="cancel-edit"
              class="px-4 py-2 rounded-xl bg-surface-2 hover:bg-(--color-surface-3) text-primary transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              id="confirm-edit"
              class="px-4 py-2 rounded-xl bg-brand hover:bg-(--color-brand-hover) text-(--color-btn-primary-text) transition cursor-pointer font-medium"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    `;
  },
};
