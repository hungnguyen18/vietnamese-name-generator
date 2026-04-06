/**
 * Convert Vietnamese text with diacritics to plain ASCII (romanized form).
 * Removes all tone marks and accent characters while preserving the base letters.
 * Handles the special Vietnamese characters Đ/đ.
 *
 * @param input - Vietnamese string with diacritics (e.g. "Nguyễn Văn Ân")
 * @returns {string} ASCII string with all diacritics and tone marks removed
 * @example
 * ```typescript
 * romanize('Nguyễn Văn Ân');
 * // 'Nguyen Van An'
 *
 * romanize('Đặng Thị Hồng');
 * // 'Dang Thi Hong'
 * ```
 */
export function romanize(input: string): string {
  if (input.length === 0) {
    return "";
  }
  return input
    .replace(/[\u0110\u00D0]/g, "D")
    .replace(/[\u0111\u00F0]/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
