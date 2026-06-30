export const HeaderComponent = {
  render() {
    return `
      <header class="mb-8 flex flex-row gap-4 sm:mb-12 justify-between">
        <div class="flex min-w-0 items-center gap-3">
          <button
            id="menu-toggle"
            class="hidden h-10 w-10 flex-row items-center justify-center rounded-xl border border-border bg-surface text-primary transition cursor-pointer hover:bg-slate-600/10 lg:flex"
          >
            <i class="fa-regular fa-bars"></i>
          </button>

          <h1 class="truncate text-xl font-bold tracking-tight text-primary sm:text-2xl lg:text-3xl">
            Habit Tracker
          </h1>
        </div>

        <div class="flex items-center justify-end gap-2 sm:justify-center">
          <button
            id="help-toggle"
            class="flex h-9 w-9 flex-row items-center justify-center rounded-xl border border-border bg-surface text-brand/80 transition cursor-pointer hover:bg-brand/10 sm:h-10 sm:w-10"
            title="App Guide & Tips"
          >
            <i class="fa-regular fa-circle-question text-lg"></i>
          </button>

          <button
            id="theme-toggle"
            class="flex h-9 w-9 flex-row items-center justify-center rounded-xl border border-border bg-surface text-primary transition cursor-pointer hover:bg-yellow-600/10 sm:h-10 sm:w-10"
          >
            <i class="fa-regular fa-sun text-yellow-500/80"></i>
          </button>
        </div>
      </header>
    `;
  },
};
