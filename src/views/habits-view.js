export const HabitsView = {
  render() {
    return `
      <section
        id="habits-view"
        class="flex flex-col"
      >
        <div
          class="relative flex w-fit bg-surface-2 rounded-2xl p-1 mb-6 border border-border"
        >
          <div
            id="tab-indicator"
            class="absolute top-1 left-1 h-[calc(100%-8px)] w-27.5 rounded-xl bg-brand transition-all duration-300 translate-x-0"
          ></div>

          <button
            id="tab-active"
            class="relative z-10 w-27.5 py-2 text-sm font-medium rounded-l-xl text-(--color-btn-primary-text) transition cursor-pointer"
          >
            Active
          </button>

          <button
            id="tab-archived"
            class="relative z-10 w-27.5 py-2 text-sm font-medium rounded-r-xl text-secondary transition cursor-pointer"
          >
            Archived
          </button>
        </div>
        <div
          id="habits"
          class="w-full"
        >
          <div
            class="mb-10 p-6 bg-surface-2 border border-border rounded-3xl flex flex-col gap-4"
          >
            <h3
              class="text-xs font-bold uppercase tracking-widest text-secondary"
            >
              Create New Habit Flow
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
              <div class="md:col-span-2">
                <input
                  id="habit-input"
                  type="text"
                  placeholder="What habit do you want to build?..."
                  class="w-full h-12 bg-surface border border-border rounded-xl px-4 text-sm focus:outline-none focus:border-brand transition"
                />
              </div>

              <div class="relative">
                <label
                  for="habit-category-select"
                  class="absolute left-2 -top-7"
                  >Category</label
                >
                <select
                  id="habit-category-select"
                  class="w-full h-12 bg-surface border border-border rounded-xl px-3 text-sm text-secondary focus:outline-none focus:border-brand cursor-pointer"
                >
                  <option value="General">General</option>
                  <option value="Health">Health & Fitness</option>
                  <option value="Work">Work & Dev</option>
                  <option value="Finance">Finance</option>
                  <option value="Mind">Mind & Soul</option>
                  <option value="Harmful">Harmful</option>
                </select>
              </div>

              <div class="relative">
                <label
                  for="habit-category-select"
                  class="absolute left-2 -top-7"
                  >Days per week
                </label>
                <select
                  id="habit-frequency-select"
                  class="w-full h-12 bg-surface border border-border rounded-xl px-3 text-sm text-secondary focus:outline-none focus:border-brand cursor-pointer"
                >
                  <option value="7">Everyday (7 days/wk)</option>
                  <option value="5">Standard (5 days/wk)</option>
                  <option value="3">Flexible (3 days/wk)</option>
                  <option value="1">Minimal (1 day/wk)</option>
                </select>
              </div>
            </div>

            <div
              class="flex flex-col sm:flex-row justify-between items-start gap-4 pt-4 border-t border-border"
            >
              <p class="text-xs text-secondary flex items-center gap-1.5">
                <i class="fa-regular fa-circle-info text-brand"></i>
                Categorization isolates metrics inside your dashboard.
              </p>
              <button
                id="add-habit-btn"
                class="w-full sm:w-auto h-11 bg-brand text-white px-4 rounded-xl text-sm font-semibold hover:bg-(--color-brand-hover) transition cursor-pointer flex flex-row items-center justify-center gap-2 shadow-lg shadow-brand/10"
              >
                <i class="fa-regular fa-plus"></i> Add Habit
              </button>
            </div>
          </div>

          <div
            class="mb-6 flex flex-wrap items-center gap-2 border-b border-border pb-4"
          >
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider mr-2"
              >Filter by:</span
            >
            <button
              data-category="all"
              class="category-filter-btn h-8 px-4 text-xs font-semibold rounded-lg bg-brand text-white cursor-pointer transition"
            >
              All
            </button>
            <button
              data-category="General"
              class="category-filter-btn h-8 px-4 text-xs font-medium rounded-lg bg-surface-2 hover:bg-surface-3 text-secondary hover:text-primary cursor-pointer transition flex flex-row justify-center items-center gap-1.5"
            >
              <i class="fa-regular fa-folders text-amber-500"></i>
              <span>General</span>
            </button>
            <button
              data-category="Health"
              class="category-filter-btn h-8 px-4 text-xs font-medium rounded-lg bg-surface-2 hover:bg-surface-3 text-secondary hover:text-primary cursor-pointer transition flex flex-row justify-center items-center gap-1.5"
            >
              <i class="fa-regular fa-apple-whole text-emerald-500"></i>
              <span>Health</span>
            </button>
            <button
              data-category="Work"
              class="category-filter-btn h-8 px-4 text-xs font-medium rounded-lg bg-surface-2 hover:bg-surface-3 text-secondary hover:text-primary cursor-pointer transition flex flex-row justify-center items-center gap-1.5"
            >
              <i class="fa-regular fa-laptop text-sky-500"></i>
              <span>Work</span>
            </button>
            <button
              data-category="Finance"
              class="category-filter-btn h-8 px-4 text-xs font-medium rounded-lg bg-surface-2 hover:bg-surface-3 text-secondary hover:text-primary cursor-pointer transition flex flex-row justify-center items-center gap-1.5"
            >
              <i class="fa-regular fa-dollar-sign text-violet-500"></i>
              <span>Finance</span>
            </button>
            <button
              data-category="Mind"
              class="category-filter-btn h-8 px-4 text-xs font-medium rounded-lg bg-surface-2 hover:bg-surface-3 text-secondary hover:text-primary cursor-pointer transition flex flex-row justify-center items-center gap-1.5"
            >
              <i class="fa-regular fa-spa text-rose-500"></i>
              <span>Mind</span>
            </button>
            <button
              data-category="Harmful"
              class="category-filter-btn h-8 px-4 text-xs font-medium rounded-lg bg-surface-2 hover:bg-surface-3 text-secondary hover:text-primary cursor-pointer transition flex flex-row justify-center items-center gap-1.5"
            >
              <i class="fa-regular fa-ban-smoking text-mauve-500"></i>
              <span>Harmful</span>
            </button>
          </div>
          <div
            id="habit-list"
            class="space-y-4 mt-6"
          ></div>
        </div>
      </section>
    `;
  },
};
