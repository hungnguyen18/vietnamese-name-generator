import { romanize } from './romanize';

/**
 * Regular expression that matches strings containing only Unicode letters and whitespace.
 * Used to validate that a Vietnamese name contains no digits, punctuation, or special characters.
 *
 * @example
 * ```typescript
 * VIETNAMESE_NAME_REGEX.test('Nguyễn Văn An'); // true
 * VIETNAMESE_NAME_REGEX.test('Nguyen123');      // false
 * ```
 */
export const VIETNAMESE_NAME_REGEX = /^[\p{L}\s]+$/u;

/**
 * Normalize a Vietnamese string to NFC (canonical composition) form.
 * Ensures consistent Unicode representation for comparison and storage.
 *
 * @param input - Vietnamese string to normalize
 * @returns {string} NFC-normalized string
 * @example
 * ```typescript
 * normalize('Nguyễn'); // 'Nguyễn' (NFC form)
 * ```
 */
export function normalize(input: string): string {
  return input.normalize('NFC');
}

/**
 * Check whether a query string appears within a text, ignoring Vietnamese diacritics and tone marks.
 * Both strings are romanized and lowercased before comparison.
 *
 * @param text - The text to search within
 * @param query - The substring to search for
 * @returns {boolean} True if the romanized query is found within the romanized text
 * @example
 * ```typescript
 * accentInsensitiveMatch('Nguyễn Văn An', 'nguyen'); // true
 * accentInsensitiveMatch('Trần Thị Mai', 'thi');     // true
 * ```
 */
export function accentInsensitiveMatch(text: string, query: string): boolean {
  return romanize(text).toLowerCase().includes(romanize(query).toLowerCase());
}

/**
 * Check whether two strings are equal when ignoring Vietnamese diacritics and tone marks.
 * Both strings are romanized and lowercased before comparison.
 *
 * @param a - First string to compare
 * @param b - Second string to compare
 * @returns {boolean} True if both strings are identical after romanization and lowercasing
 * @example
 * ```typescript
 * accentInsensitiveEqual('Nguyễn', 'Nguyen'); // true
 * accentInsensitiveEqual('Đặng', 'Dang');     // true
 * ```
 */
export function accentInsensitiveEqual(a: string, b: string): boolean {
  return romanize(a).toLowerCase() === romanize(b).toLowerCase();
}
