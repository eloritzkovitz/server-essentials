import { DEFAULT_MINOR_WORDS } from "./constants";

/**
 * Capitalizes the first letter of a string.
 * @param str - The input string.
 * @returns The capitalized string.
 */
export function capitalize(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Capitalizes the first letter of every significant word in a string,
 * but leaves minor words (like "and", "the", "of") in lowercase unless
 * they are the first or last word.
 * @param str - The input string.
 * @returns The smart title-cased string.
 */
export function titleCase(str: string, minorWords = DEFAULT_MINOR_WORDS) {
  if (!str) return "";
  const words = str.toLowerCase().split(" ");
  return words
    .map((word, i) => {
      if (i === 0 || i === words.length - 1 || !minorWords.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(" ");
}

/**
 * Converts a string to a URL-friendly slug.
 * @param str - The input string.
 * @param separator - The separator to use (default: "-").
 * @returns The slugified string.
 */
export function slugify(str: string, separator = "-") {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, separator)
    .replace(new RegExp(`^${separator}+|${separator}+$`, "g"), "");
}

/**
 * Truncates a string to a specified length and adds ellipsis if needed.
 * @param str - The input string.
 * @param length - The maximum length.
 * @param ellipsis - The string to append (default: "...").
 * @returns The truncated string.
 */
export function truncate(str: string, length: number, ellipsis = "...") {
  if (length < 0) return "";
  return str.length > length ? str.slice(0, length) + ellipsis : str;
}
