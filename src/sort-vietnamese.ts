import { parseName } from './parse-name';

export type TSortField = 'givenName' | 'surname' | 'fullName';

export interface ISortOptions {
  field?: TSortField;
  order?: 'asc' | 'desc';
}

const collator = new Intl.Collator('vi', { sensitivity: 'variant' });

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

export function sortVietnamese(names: string[], options?: ISortOptions): string[] {
  return [...names].sort(vietnameseNameComparator(options));
}
