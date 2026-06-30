export const InfoModalComponent = {
  render() {
    return `
      <div
        id="help-modal"
        class="min-h-screen fixed inset-0 z-50 hidden items-center justify-center animate-fade-in"
      >
        <div
          id="help-modal-backdrop"
          class="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
        ></div>

        <div
          class="relative w-full max-w-lg mx-4 bg-surface border border-border rounded-3xl p-6 shadow-2xl transition-all scale-95"
        >
          <div
            class="flex justify-between items-center mb-4 border-b border-border pb-3"
          >
            <div class="flex items-center gap-2">
              <i class="fa-regular fa-shield-halved text-amber-500/80 text-lg"></i>
              <h2 class="text-lg font-bold text-primary">
                Streak Safeguard Guide
              </h2>
            </div>
            <button
              id="close-help-modal"
              class="w-8 h-8 rounded-lg bg-surface-2 hover:bg-red-600/10 border border-border text-secondary hover:text-primary flex items-center justify-center transition cursor-pointer"
            >
              <i class="fa-regular fa-xmark text-sm"></i>
            </button>
          </div>

          <div class="space-y-3">
            <div
              class="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl"
            >
              <h4
                class="text-sm font-bold text-amber-500/80 uppercase tracking-wide"
              >
                <i class="fa-regular fa-lightbulb"></i> Core Feature: Skip Day
              </h4>
              <p class="text-base text-secondary mt-1 leading-relaxed">
                <strong>Double-click</strong> on today or yesterday inside any
                calendar cell to toggle a
                <span class="text-amber-500/80 font-semibold"
                  >Skip Day (Leave)</span
                >. This colorizes the cell in amber and locks your streak state.
              </p>
            </div>

            <div
              class="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl"
            >
              <h4
                class="text-sm font-bold text-emerald-500/80 uppercase tracking-wide"
              >
                <i class="fa-regular fa-bullseye-arrow"></i> Normal Check-In
              </h4>
              <p class="text-base text-secondary mt-1 leading-relaxed">
                A single <strong>Left-Click</strong> handles a standard success
                check-in, keeping the interface fluid and incredibly native.
              </p>
            </div>
          </div>

          <div class="flex justify-end mt-5">
            <button
              id="btn-close-help"
              class="px-5 py-2 text-sm rounded-xl bg-brand/80 text-white font-semibold hover:bg-(--color-brand-hover) transition cursor-pointer"
            >
              Got it, Thanks!
            </button>
          </div>
        </div>
      </div>
    `;
  },
};
