export const HabitsView = {
  render() {
    return `
      <section
        id="habits-view"
        class="flex w-full min-w-0 flex-col"
      >
        <div
          class="relative mb-6 flex w-full justify-center rounded-2xl border border-border bg-surface-2 p-1 sm:w-fit sm:justify-start"
        >
          <div
            id="tab-indicator"
            class="absolute top-1 left-1 h-[calc(100%-8px)] w-27 rounded-xl bg-brand/80 transition-all duration-300 translate-x-0 sm:w-27.5"
          ></div>

          <button
            id="tab-active"
            class="relative z-10 flex-1 w-27 rounded-l-xl py-2 text-sm font-medium text-(--color-btn-primary-text) transition cursor-pointer sm:w-27.5 sm:flex-none"
          >
            Active
          </button>

          <button
            id="tab-archived"
            class="relative z-10 flex-1 w-27 rounded-r-xl py-2 text-sm font-medium text-secondary transition cursor-pointer sm:w-27.5 sm:flex-none"
          >
            Archived
          </button>
        </div>

        <div
          id="habits"
          class="w-full min-w-0"
        >
          <div
            class="mb-10 flex flex-col gap-4 rounded-3xl border border-border bg-surface-2 p-4 sm:p-6"
          >
            <h3
              class="mb-2 text-sm font-bold uppercase tracking-widest text-secondary sm:mb-4"
            >
              Create New Habit Flow
            </h3>

            <div
              class="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
            >
              <div class="w-full min-w-0 sm:col-span-2 xl:col-span-2">
                <label
                  for="habit-input"
                  class="mb-2 block ps-2 text-sm font-semibold text-secondary sm:text-xs"
                >
                  Habit name
                </label>
                <input
                  id="habit-input"
                  type="text"
                  placeholder="What habit do you want to build?..."
                  class="h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm text-primary placeholder:text-secondary/70 transition focus:border-brand/80 focus:outline-none"
                />
              </div>

              <div class="w-full min-w-0">
                <label
                  for="habit-category-select"
                  class="mb-2 block ps-2 text-sm font-semibold text-secondary sm:text-xs"
                >
                  Category
                </label>
                <div class="relative w-full min-w-0">
                  <select
                    id="habit-category-select"
                    class="form-select h-12 w-full cursor-pointer rounded-xl border border-border bg-surface px-3 pr-10 text-sm text-primary focus:border-brand/80 focus:outline-none"
                  >
                    <option value="General">General</option>
                    <option value="Health">Health & Fitness</option>
                    <option value="Work">Work & Dev</option>
                    <option value="Finance">Finance</option>
                    <option value="Mind">Mind & Soul</option>
                    <option value="Harmful">Harmful</option>
                  </select>
                </div>
              </div>

              <div class="w-full min-w-0">
                <label
                  for="habit-frequency-select"
                  class="mb-2 block ps-2 text-sm font-semibold text-secondary sm:text-xs"
                >
                  Days per week
                </label>
                <div class="relative w-full min-w-0">
                  <select
                    id="habit-frequency-select"
                    class="form-select h-12 w-full cursor-pointer rounded-xl border border-border bg-surface px-3 pr-10 text-sm text-primary focus:border-brand/80 focus:outline-none"
                  >
                    <option value="7">Everyday (7 days/wk)</option>
                    <option value="5">Standard (5 days/wk)</option>
                    <option value="3">Flexible (3 days/wk)</option>
                    <option value="1">Minimal (1 day/wk)</option>
                  </select>
                </div>
              </div>
            </div>

            <div
              class="flex flex-col gap-4 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <p class="flex items-center gap-1.5 text-xs text-secondary">
                <i class="fa-regular fa-circle-info text-brand/80"></i>
                Categorization isolates metrics inside your dashboard.
              </p>
              <button
                id="add-habit-btn"
                class="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand/80 px-4 text-sm font-semibold text-white shadow-lg shadow-brand/10 transition hover:bg-(--color-brand-hover) cursor-pointer sm:w-auto"
              >
                <i class="fa-regular fa-plus"></i> Add Habit
              </button>
            </div>
          </div>

          <div
            class="mb-6 flex flex-row flex-nowrap gap-2 overflow-x-auto border-b border-border pb-4 sm:flex-wrap sm:overflow-visible"
          >
            <p
              class="mr-2 text-xs font-bold uppercase tracking-wider text-secondary flex flex-row justify-center items-center"
            >
              <span class="w-20 flex flex-row justify-center items-center">
                Filter by:
              </span>
            </p>

            <button
              data-category="all"
              class="category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg bg-brand/80 shadow-brand/10 px-4 text-xs font-semibold text-white transition cursor-pointer"
            >
              All
            </button>

            <button
              data-category="General"
              class="category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg bg-surface-2 px-4 text-xs font-medium text-secondary transition hover:bg-(--color-surface-3) flex flex-row justify-center items-center gap-2 hover:text-secondary cursor-pointer"
            >
              <i class="category-icon fa-regular fa-folders text-amber-500"></i>
              <span>General</span>
            </button>

            <button
              data-category="Health"
              class="category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg bg-surface-2 px-4 text-xs font-medium text-secondary transition hover:bg-(--color-surface-3) flex flex-row justify-center items-center gap-2 hover:text-secondary cursor-pointer"
            >
              <i class="category-icon fa-regular fa-apple-whole text-emerald-500"></i>
              <span>Health</span>
            </button>

            <button
              data-category="Work"
              class="category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg bg-surface-2 px-4 text-xs font-medium text-secondary transition hover:bg-(--color-surface-3) flex flex-row justify-center items-center gap-2 hover:text-secondary cursor-pointer"
            >
              <i class="category-icon fa-regular fa-laptop text-sky-500"></i>
              <span>Work</span>
            </button>

            <button
              data-category="Finance"
              class="category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg bg-surface-2 px-4 text-xs font-medium text-secondary transition hover:bg-(--color-surface-3) flex flex-row justify-center items-center gap-2 hover:text-secondary cursor-pointer"
            >
              <i class="category-icon fa-regular fa-dollar-sign text-violet-500"></i>
              <span>Finance</span>
            </button>

            <button
              data-category="Mind"
              class="category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg bg-surface-2 px-4 text-xs font-medium text-secondary transition hover:bg-(--color-surface-3) flex flex-row justify-center items-center gap-2 hover:text-secondary cursor-pointer"
            >
              <i class="category-icon fa-regular fa-spa text-rose-500"></i>
              <span>Mind</span>
            </button>

            <button
              data-category="Harmful"
              class="category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg bg-surface-2 px-4 text-xs font-medium text-secondary transition hover:bg-(--color-surface-3) flex flex-row justify-center items-center gap-2 hover:text-secondary cursor-pointer"
            >
              <i class="category-icon fa-regular fa-ban-smoking text-mauve-500"></i>
              <span>Harmful</span>
            </button>
          </div>

          <div
            id="habit-list"
            class="mt-6 w-full space-y-4"
          ></div>
        </div>
      </section>
    `;
  },
};
