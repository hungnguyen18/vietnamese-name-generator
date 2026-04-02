import { describe, it, expect } from 'vitest';
import {
  getStatistics,
  getTopSurnames,
  getGivenNameCount,
  getUniqueGivenNames,
} from '../src/name-statistics';

describe('getStatistics', () => {
  it('returns positive counts for all fields', () => {
    const stats = getStatistics();
    expect(stats.totalSurnames).toBeGreaterThan(0);
    expect(stats.totalGivenNames).toBeGreaterThan(0);
    expect(stats.totalCompoundNames).toBeGreaterThan(0);
    expect(stats.totalMiddleNames).toBeGreaterThan(0);
  });
});

describe('getTopSurnames', () => {
  it('returns Nguyen as #1 overall', () => {
    const listTop = getTopSurnames();
    expect(listTop.length).toBeGreaterThan(0);
    expect(listTop[0].name).toBe('Nguyễn');
  });

  it('returns region-specific results for south', () => {
    const listSouth = getTopSurnames({ region: 'south' });
    expect(listSouth.length).toBeGreaterThan(0);
    expect(listSouth[0].name).toBe('Nguyễn');
    // Verify all entries have weights
    for (let i = 0; i < listSouth.length; i += 1) {
      expect(listSouth[i].weight).toBeDefined();
      expect(listSouth[i].weight).toBeGreaterThan(0);
    }
  });

  it('returns exactly 5 when limit is 5', () => {
    const listTop = getTopSurnames({ limit: 5 });
    expect(listTop).toHaveLength(5);
  });

  it('returns empty array for unknown region', () => {
    const listResult = getTopSurnames({ region: 'unknown' });
    expect(listResult).toHaveLength(0);
  });
});

describe('getGivenNameCount', () => {
  it('returns positive number for male/north/modern', () => {
    const count = getGivenNameCount({ gender: 'male', region: 'north', era: 'modern' });
    expect(count).toBeGreaterThan(0);
  });

  it('returns positive number when filtering by gender only', () => {
    const count = getGivenNameCount({ gender: 'female' });
    expect(count).toBeGreaterThan(0);
  });

  it('returns 0 for unknown gender', () => {
    const count = getGivenNameCount({ gender: 'unknown' });
    expect(count).toBe(0);
  });
});

describe('getUniqueGivenNames', () => {
  it('returns 10 names when limit is 10 for female', () => {
    const listName = getUniqueGivenNames({ gender: 'female', limit: 10 });
    expect(listName).toHaveLength(10);
  });

  it('returns sorted unique names', () => {
    const listName = getUniqueGivenNames({ gender: 'male', limit: 20 });
    const listSorted = [...listName].sort();
    expect(listName).toEqual(listSorted);
  });

  it('returns all unique names without limit', () => {
    const listName = getUniqueGivenNames({ gender: 'unisex' });
    expect(listName.length).toBeGreaterThan(0);
    // Verify uniqueness
    const setName = new Set(listName);
    expect(setName.size).toBe(listName.length);
  });
});
