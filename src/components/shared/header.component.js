// ========================================================
// REUSABLE HEADER COMPONENT - V4 ENTERPRISE
// ========================================================

export const HeaderComponent = {
  render() {
    return `
      <header class="mb-12 flex justify-between items-center">
        <div class="flex flex-row justify-start items-center gap-4">
          <button
            id="menu-toggle"
            class="w-10 h-10 hidden lg:flex bg-surface text-primary border border-border rounded-xl hover:bg-slate-600/10 transition cursor-pointer flex-row justify-center items-center"
          >
            <i class="fa-regular fa-bars"></i>
          </button>
          <h1 class="text-4xl font-bold tracking-tight text-primary">
            Habit Tracker
          </h1>
        </div>

        <div class="flex items-center gap-2">
          <button
            id="help-toggle"
            class="w-10 h-10 bg-surface text-brand border border-border rounded-xl hover:bg-brand/10 transition cursor-pointer flex flex-row justify-center items-center"
            title="App Guide & Tips"
          >
            <i class="fa-regular fa-circle-question text-lg"></i>
          </button>

          <button
            id="theme-toggle"
            class="w-10 h-10 bg-surface text-primary border border-border rounded-xl hover:bg-yellow-600/10 transition cursor-pointer flex flex-row justify-center items-center"
          >
            <i class="fa-regular fa-sun text-yellow-500"></i>
          </button>
        </div>
      </header>
    `;
  },
};
