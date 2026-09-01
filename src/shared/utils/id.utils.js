/**
 * Generate a random hex string of given length
 */
function getRandomHex(length) {
  let result = "";
  const chars = "0123456789abcdef";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * 16)];
  }
  return result;
}

/**
 * Generate a UUID v4 compatible ID
 * Falls back to crypto.randomUUID() if available
 */
export function generateId() {
  // Try native crypto API first (browser environment)
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  // Fallback implementation
  const timeLow = getRandomHex(8);
  const timeMid = getRandomHex(4);
  const timeHiAndVersion = "4" + getRandomHex(3);
  const clockSeqHiAndReserved = getRandomHex(3);
  const node = getRandomHex(6) + getRandomHex(6);

  return `${timeLow}-${timeMid}-${timeHiAndVersion}-${clockSeqHiAndReserved}-${node}`;
}
