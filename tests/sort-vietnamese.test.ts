import { describe, it, expect } from 'vitest';
import { sortVietnamese, vietnameseNameComparator } from '../src/sort-vietnamese';

describe('sortVietnamese', () => {
  it('sorts by given name by default (Vietnamese convention)', () => {
    const names = ['Trần Thị Bình', 'Nguyễn Văn An'];
    const result = sortVietnamese(names);
    expect(result).toEqual(['Nguyễn Văn An', 'Trần Thị Bình']);
  });

  it('sorts by surname when specified', () => {
    const names = ['Trần Thị Bình', 'Nguyễn Văn An', 'Lê Minh Châu'];
    const result = sortVietnamese(names, { field: 'surname' });
    expect(result).toEqual(['Lê Minh Châu', 'Nguyễn Văn An', 'Trần Thị Bình']);
  });

  it('sorts in descending order', () => {
    const names = ['Nguyễn Văn An', 'Trần Thị Bình'];
    const result = sortVietnamese(names, { order: 'desc' });
    expect(result).toEqual(['Trần Thị Bình', 'Nguyễn Văn An']);
  });

  it('handles Vietnamese collation with diacritics', () => {
    // In Vietnamese: a < ă < â
    const names = ['Nguyễn Văn Ân', 'Trần Thị Ăn', 'Lê Minh An'];
    const result = sortVietnamese(names);
    expect(result[0]).toBe('Lê Minh An');
    // ă and â ordering depends on Intl.Collator('vi'), but both should come after plain 'a'
    expect(result.indexOf('Lê Minh An')).toBe(0);
  });

  it('uses surname as tiebreaker when given names are equal', () => {
    const names = ['Trần Văn An', 'Nguyễn Văn An'];
    const result = sortVietnamese(names);
    // Both have givenName 'An', so sort by surname: Nguyễn < Trần
    expect(result).toEqual(['Nguyễn Văn An', 'Trần Văn An']);
  });

  it('returns new array without mutating input', () => {
    const names = ['Trần Thị Bình', 'Nguyễn Văn An'];
    const original = [...names];
    const result = sortVietnamese(names);
    expect(names).toEqual(original);
    expect(result).not.toBe(names);
  });

  it('returns empty array for empty input', () => {
    const result = sortVietnamese([]);
    expect(result).toEqual([]);
  });

  it('sorts by fullName when specified', () => {
    const names = ['Trần Thị Bình', 'Nguyễn Văn An'];
    const result = sortVietnamese(names, { field: 'fullName' });
    expect(result).toEqual(['Nguyễn Văn An', 'Trần Thị Bình']);
  });
});

describe('vietnameseNameComparator', () => {
  it('works as comparator with Array.sort()', () => {
    const names = ['Trần Thị Bình', 'Nguyễn Văn An', 'Lê Minh Châu'];
    const comparator = vietnameseNameComparator();
    const result = [...names].sort(comparator);
    expect(result).toEqual(['Nguyễn Văn An', 'Trần Thị Bình', 'Lê Minh Châu']);
  });

  it('accepts options for custom sorting', () => {
    const names = ['Trần Thị Bình', 'Nguyễn Văn An'];
    const comparator = vietnameseNameComparator({ field: 'surname', order: 'desc' });
    const result = [...names].sort(comparator);
    expect(result).toEqual(['Trần Thị Bình', 'Nguyễn Văn An']);
  });
});
