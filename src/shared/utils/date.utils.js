/**
 * Format a Date object to ISO date string (YYYY-MM-DD)
 */
export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date as ISO string (YYYY-MM-DD)
 */
export function todayISO() {
  return formatDate(new Date());
}

/**
 * Parse ISO date string to Date object
 */
export function parseISODate(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Check if a date is today
 */
export function isToday(dateStr) {
  return dateStr === todayISO();
}

/**
 * Check if date1 is before date2
 */
export function isBefore(date1, date2) {
  return date1 < date2;
}

/**
 * Check if date1 is after date2
 */
export function isAfter(date1, date2) {
  return date1 > date2;
}

/**
 * Calculate days between two dates
 */
export function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = Math.abs(d2 - d1);
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Add days to a date
 */
export function addDays(dateStr, days) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return formatDate(date);
}
