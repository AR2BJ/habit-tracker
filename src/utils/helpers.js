// =============================
// HELPERS START
// =============================

export function generateId() {
  return crypto.randomUUID();
}

export function formatDate(date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function todayISO() {
  return formatDate(new Date());
}

// =============================
// STREAK CALCULATION START
// =============================

export function calculateStreak(dates) {
  if (!dates.length) return { current: 0, best: 0 };

  const sorted = [...dates].sort();
  const today = todayISO();

  let current = 0;
  let best = 0;
  let temp = 0;

  const dateSet = new Set(sorted);

  // =============================
  // CURRENT STREAK WITH GRACE DAY START
  // =============================

  let cursor;

  if (dateSet.has(today)) {
    cursor = new Date(today);
  } else {
    cursor = new Date(today);
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const iso = formatDate(cursor);

    if (dateSet.has(iso)) {
      current++;

      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  // =============================
  // CURRENT STREAK WITH GRACE DAY END
  // =============================

  // ---- Best Streak ----
  for (let i = 0; i < sorted.length; i++) {
    const currentDate = new Date(sorted[i]);
    temp = 1;

    let nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);

    while (dateSet.has(formatDate(nextDate))) {
      temp++;
      nextDate.setDate(nextDate.getDate() + 1);
    }

    if (temp > best) best = temp;
  }

  return { current, best };
}

// =============================
// STREAK CALCULATION END
// =============================

// =============================
// SUCCESS RATE START
// =============================

export function calculateSuccessRate(habit) {
  const createdAt = new Date(habit.createdAt);

  const today = new Date();

  const diffDays = Math.floor((today - createdAt) / (1000 * 60 * 60 * 24)) + 1;

  if (diffDays <= 0) return 0;

  return Math.round((habit.completedDates.length / diffDays) * 100);
}

// =============================
// SUCCESS RATE END
// =============================

// =============================
// HELPERS END
// =============================
