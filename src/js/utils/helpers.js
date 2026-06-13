// =============================
// HELPERS START
// =============================

export function generateId() {
  return crypto.randomUUID();
}

export function todayISO() {
  return new Date().toISOString().split("T")[0];
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
    const iso = cursor.toISOString().split("T")[0];

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

    while (dateSet.has(nextDate.toISOString().split("T")[0])) {
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
