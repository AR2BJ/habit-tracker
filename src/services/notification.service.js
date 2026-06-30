export const NotificationService = {
  show({
    type,
    message,
    duration = 4000,
    undoAction = null,
    icon = null,
    iconColor = "text-emerald-500",
  }) {
    const container = document.getElementById("notification-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className =
      "animate-slide-up bg-surface/95 backdrop-blur-md border border-border rounded-2xl px-5 py-3.5 shadow-2xl flex flex-row justify-between items-center gap-4 transition-all duration-300 transform w-full";

    const countdownId = `toast-cd-${Math.random().toString(36).substr(2, 9)}`;

    const iconHTML = icon
      ? `<i class="fa-regular ${icon} ${iconColor} text-lg"></i>`
      : "";

    toast.innerHTML = `
      <div class="flex items-center gap-3 text-secondary">
        ${
          undoAction
            ? `<span id="${countdownId}" class="text-xs font-mono bg-(--color-surface-3) px-1.5 py-0.5 rounded text-primary">${duration / 1000}s</span>`
            : iconHTML
        }
        <span class="text-primary text-sm font-medium">${message}</span>
      </div>
    `;

    if (undoAction) {
      const undoBtn = document.createElement("button");
      undoBtn.className =
        "h-8 px-3 transition flex items-center text-brand/80 hover:text-(--color-brand-hover) justify-center gap-1 cursor-pointer rounded-lg bg-surface-2 hover:bg-(--color-(--color-surface-3)) text-sm font-medium";
      undoBtn.innerHTML = `<i class="fa-regular fa-rotate-left text-xs"></i><span class="text-xs font-semibold">Undo</span>`;

      undoBtn.addEventListener("click", () => {
        undoAction();
        this.removeToast(toast);
      });
      toast.appendChild(undoBtn);
    }

    container.appendChild(toast);

    let remainingTime = duration;
    let countdownInterval = null;
    let autoDeleteTimer = null;

    const triggerClear = () => {
      if (countdownInterval) clearInterval(countdownInterval);
      if (autoDeleteTimer) clearTimeout(autoDeleteTimer);
      this.removeToast(toast);
    };

    if (undoAction) {
      const countdownEl = toast.querySelector(`#${countdownId}`);
      countdownInterval = setInterval(() => {
        remainingTime -= 1000;

        if (remainingTime <= 0) {
          triggerClear();
          return;
        }

        if (countdownEl) {
          countdownEl.textContent = `${remainingTime / 1000}s`;
        }
      }, 1000);
    }

    autoDeleteTimer = setTimeout(() => {
      triggerClear();
    }, duration);

    toast.dataset.timerId = autoDeleteTimer;
  },

  removeToast(toast) {
    toast.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 300);
  },
};
