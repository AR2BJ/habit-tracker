import { generateId as generateIdShared } from "@/shared/utils/id.utils";

/**
 * Generate a UUID v4 compatible ID
 * This is a facade that ensures browser compatibility
 */
export function generateId() {
  return generateIdShared();
}

/**
 * Generate a short ID (for display purposes)
 */
export function generateShortId(length = 8) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
