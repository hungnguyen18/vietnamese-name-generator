import { HAN_VIET_MAP } from './data/han-viet';
export type { THanVietEntry } from './data/han-viet';
import type { THanVietEntry } from './data/han-viet';
import { romanize } from './romanize';

/**
 * Look up Han Viet (Sino-Vietnamese) character origin and meaning for a Vietnamese name.
 * Supports both diacritical and romanized (ASCII) input.
 *
 * @param name - Vietnamese given name to look up (e.g. "Minh", "Thanh")
 * @returns Han Viet entry with Chinese character and meaning, or null if not found
 * @example
 * ```typescript
 * getHanViet('Minh');
 * // { character: '明', meaning: 'bright, intelligent', ... }
 * getHanViet('xyz'); // null
 * ```
 */
export function getHanViet(name: string): THanVietEntry | null {
  if (!name || name.trim().length === 0) {
    return null;
  }

  const trimmed = name.trim();

  // Exact match first
  if (HAN_VIET_MAP[trimmed]) {
    return HAN_VIET_MAP[trimmed];
  }

  // Romanized (ASCII) match
  const romanized = romanize(trimmed).toLowerCase();
  const listKey = Object.keys(HAN_VIET_MAP);
  for (let i = 0; i < listKey.length; i += 1) {
    const key = listKey[i];
    if (romanize(key).toLowerCase() === romanized) {
      return HAN_VIET_MAP[key];
    }
  }

  return null;
}
