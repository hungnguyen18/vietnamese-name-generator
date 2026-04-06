import { parseName } from './parse-name';

export type TSortField = 'givenName' | 'surname' | 'fullName';

export interface ISortOptions {
  field?: TSortField;
  order?: 'asc' | 'desc';
}

const collator = new Intl.Collator('vi', { sensitivity: 'variant' });

/**
 * Create a comparator function for sorting Vietnamese names with proper locale
 * awareness. By default sorts by given name (Vietnamese convention), with
 * configurable field and order.
 *
 * @param options - Optional sort settings: field ('givenName'|'surname'|'fullName') and order ('asc'|'desc')
 * @returns A comparator function compatible with Array.prototype.sort()
 * @example
 * ```typescript
 * const cmp = vietnameseNameComparator({ field: 'givenName', order: 'asc' });
 * ['Nguyen Van Binh', 'Tran Thi An'].sort(cmp);
 * // ['Tran Thi An', 'Nguyen Van Binh']
 * ```
 */
export function vietnameseNameComparator(options?: ISortOptions): (a: string, b: string) => number {
  const field = options?.field ?? 'givenName';
  const order = options?.order ?? 'asc';
  const multiplier = order === 'asc' ? 1 : -1;

  return (a: string, b: string): number => {
    const parsedA = parseName(a);
    const parsedB = parseName(b);

    // Primary sort
    let cmp = collator.compare(parsedA[field], parsedB[field]);
    if (cmp !== 0) {
      return cmp * multiplier;
    }

    // Tiebreaker: if sorting by givenName, break ties by surname; otherwise by givenName
    if (field === 'givenName') {
      cmp = collator.compare(parsedA.surname, parsedB.surname);
    } else if (field === 'surname') {
      cmp = collator.compare(parsedA.givenName, parsedB.givenName);
    }
    // For fullName, no additional tiebreaker needed (fullName is already unique enough)

    return cmp * multiplier;
  };
}

/**
 * Sort an array of Vietnamese names with proper locale awareness.
 * Returns a new sorted array without mutating the original.
 *
 * @param names - Array of Vietnamese full names to sort
 * @param options - Optional sort settings: field ('givenName'|'surname'|'fullName') and order ('asc'|'desc')
 * @returns New array of names sorted according to the specified options
 * @example
 * ```typescript
 * sortVietnamese(['Nguyen Van Binh', 'Tran Thi An', 'Le Van Cuong']);
 * // ['Tran Thi An', 'Nguyen Van Binh', 'Le Van Cuong'] (sorted by given name)
 * sortVietnamese(['Nguyen Van Binh', 'Tran Thi An'], { field: 'surname' });
 * // ['Le Van Cuong', 'Nguyen Van Binh', 'Tran Thi An']
 * ```
 */
export function sortVietnamese(names: string[], options?: ISortOptions): string[] {
  return [...names].sort(vietnameseNameComparator(options));
}
