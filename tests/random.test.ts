import { describe, it, expect } from 'vitest';
import { xoroshiro128plus, pickRandom, pickWeighted, createAlias, pickAlias, secureRandom, mulberry32, shufflePartial } from '../src/random';

describe('xoroshiro128plus', () => {
  it('produces deterministic output from the same seed', () => {
    const rng1 = xoroshiro128plus(42);
    const rng2 = xoroshiro128plus(42);
    const seq1 = [rng1(), rng1(), rng1()];
    const seq2 = [rng2(), rng2(), rng2()];
    expect(seq1).toEqual(seq2);
  });

  it('produces values in [0, 1)', () => {
    const rng = xoroshiro128plus(123);
    for (let i = 0; i < 1000; i += 1) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('different seeds produce different sequences', () => {
    const rng1 = xoroshiro128plus(1);
    const rng2 = xoroshiro128plus(2);
    const seq1 = [rng1(), rng1(), rng1()];
    const seq2 = [rng2(), rng2(), rng2()];
    expect(seq1).not.toEqual(seq2);
  });

  it('has good distribution across 10 buckets', () => {
    const rng = xoroshiro128plus(999);
    const buckets = new Array(10).fill(0);
    const n = 10000;
    for (let i = 0; i < n; i += 1) {
      buckets[Math.floor(rng() * 10)] += 1;
    }
    for (let i = 0; i < 10; i += 1) {
      expect(buckets[i]).toBeGreaterThan(n / 10 * 0.85);
      expect(buckets[i]).toBeLessThan(n / 10 * 1.15);
    }
  });
});

describe('mulberry32 (backward compat)', () => {
  it('still exported and produces deterministic output', () => {
    const rng1 = mulberry32(42);
    const rng2 = mulberry32(42);
    expect(rng1()).toBe(rng2());
  });
});

describe('pickRandom', () => {
  it('returns an element from the array', () => {
    const list = ['a', 'b', 'c'];
    const result = pickRandom(list);
    expect(list).toContain(result);
  });
  it('throws on empty array', () => {
    expect(() => pickRandom([])).toThrow('Cannot pick from empty array');
  });
  it('uses good distribution', () => {
    const rng = xoroshiro128plus(42);
    const list = ['a', 'b', 'c'];
    const counts: Record<string, number> = { a: 0, b: 0, c: 0 };
    for (let i = 0; i < 9000; i += 1) {
      counts[pickRandom(list, rng)] += 1;
    }
    expect(counts.a).toBeGreaterThan(2500);
    expect(counts.b).toBeGreaterThan(2500);
    expect(counts.c).toBeGreaterThan(2500);
  });
});

describe('Alias Method (pickWeighted)', () => {
  it('returns an element from weighted entries', () => {
    const list = [
      { value: 'Nguyen', weight: 38 },
      { value: 'Tran', weight: 11 },
      { value: 'Le', weight: 10 },
    ];
    const result = pickWeighted(list);
    expect(['Nguyen', 'Tran', 'Le']).toContain(result);
  });
  it('throws on empty array', () => {
    expect(() => pickWeighted([])).toThrow('Cannot pick from empty array');
  });
  it('respects weight distribution over many picks', () => {
    const list = [
      { value: 'A', weight: 90 },
      { value: 'B', weight: 10 },
    ];
    const counts: Record<string, number> = { A: 0, B: 0 };
    for (let i = 0; i < 10000; i += 1) {
      counts[pickWeighted(list)] += 1;
    }
    expect(counts.A).toBeGreaterThan(8000);
    expect(counts.B).toBeGreaterThan(500);
  });
  it('createAlias + pickAlias is O(1) per pick', () => {
    const list = [
      { value: 'X', weight: 50 },
      { value: 'Y', weight: 30 },
      { value: 'Z', weight: 20 },
    ];
    const alias = createAlias(list);
    const rng = xoroshiro128plus(77);
    const counts: Record<string, number> = { X: 0, Y: 0, Z: 0 };
    for (let i = 0; i < 10000; i += 1) {
      counts[pickAlias(alias, rng)] += 1;
    }
    expect(counts.X).toBeGreaterThan(4000);
    expect(counts.Y).toBeGreaterThan(2000);
    expect(counts.Z).toBeGreaterThan(1000);
  });
});

describe('secureRandom', () => {
  it('produces values in [0, 1)', () => {
    for (let i = 0; i < 100; i += 1) {
      const v = secureRandom();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('shufflePartial', () => {
  it('returns requested number of elements', () => {
    const list = [1, 2, 3, 4, 5];
    const result = shufflePartial(list, 3);
    expect(result.length).toBe(3);
  });

  it('returns all elements from original list', () => {
    const list = ['a', 'b', 'c', 'd', 'e'];
    const result = shufflePartial(list, 5);
    expect(result.sort()).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  it('does not modify original array', () => {
    const list = [1, 2, 3, 4, 5];
    const copy = [...list];
    shufflePartial(list, 3);
    expect(list).toEqual(copy);
  });

  it('is deterministic with seeded rng', () => {
    const rng1 = xoroshiro128plus(42);
    const rng2 = xoroshiro128plus(42);
    const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(shufflePartial(list, 5, rng1)).toEqual(shufflePartial(list, 5, rng2));
  });

  it('handles count larger than list', () => {
    const list = [1, 2, 3];
    const result = shufflePartial(list, 10);
    expect(result.length).toBe(3);
    expect(result.sort()).toEqual([1, 2, 3]);
  });
});
