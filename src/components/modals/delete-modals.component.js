export const DeleteModalsComponent = {
  render() {
    return `
      <div
        id="delete-modal"
        class="min-h-screen fixed inset-0 z-50 hidden items-center justify-center"
      >
        <!-- backdrop -->

        <div
          id="delete-modal-backdrop"
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
        ></div>

        <!-- modal -->

        <div
          class="relative w-full max-w-md mx-4 bg-surface border border-border rounded-3xl p-6 shadow-2xl"
        >
          <h2 class="text-xl font-bold text-primary">Delete Habit</h2>

          <p class="mt-3 text-secondary">
            Are you sure you want to delete this habit?
          </p>

          <div class="flex justify-end gap-2 mt-6">
            <button
              id="cancel-delete"
              class="px-4 py-2 rounded-xl bg-surface-2 hover:bg-(--color-surface-3) text-primary transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              id="confirm-delete"
              class="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-(--color-btn-primary-text) transition cursor-pointer font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    `;
  },
};
