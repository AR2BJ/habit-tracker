export const HabitSelectors = {
  getActive(habits) {
    return habits.filter((h) => !h.archived);
  },

  getArchived(habits) {
    return habits.filter((h) => h.archived);
  },

  getFiltered(habits, { tab, category, searchQuery }) {
    let list = habits;

    if (tab === "active") {
      list = this.getActive(list);
    } else {
      list = this.getArchived(list);
    }

    if (category && category !== "all") {
      list = list.filter((h) => h.category === category);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter((h) => {
        const name = (h.name || "").toLowerCase();
        const categoryMatch = (h.category || "").toLowerCase();
        return name.includes(query) || categoryMatch.includes(query);
      });
    }

    return list;
  },

  getById(habits, id) {
    return habits.find((h) => h.id === id);
  },
};
