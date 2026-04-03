import { describe, it, expect } from 'vitest';
import { genzNameIndex, type TGenZNameEntry, INDEX_GENZ_MIDDLE_NAME } from '../src/data/genz-names';

describe('genzNameIndex', () => {
  it('returns entries indexed by gender', () => {
    const idx = genzNameIndex();
    expect(idx.male.length).toBeGreaterThan(0);
    expect(idx.female.length).toBeGreaterThan(0);
    expect(idx.unisex.length).toBeGreaterThan(0);
  });

  it('each entry has required fields', () => {
    const idx = genzNameIndex();
    const all = [...idx.male, ...idx.female, ...idx.unisex];
    for (let i = 0; i < all.length; i += 1) {
      expect(all[i].value).toBeTruthy();
      expect(['j', 'k', 'w', 'v', 'h']).toContain(all[i].origin);
      expect(all[i].meaning).toBeTruthy();
      expect(all[i].popularity).toBeGreaterThanOrEqual(1);
      expect(all[i].popularity).toBeLessThanOrEqual(10);
    }
  });

  it('has japanese entries', () => {
    const idx = genzNameIndex();
    const jp = idx.male.filter(e => e.origin === 'j');
    expect(jp.length).toBeGreaterThanOrEqual(15);
  });

  it('has korean entries', () => {
    const idx = genzNameIndex();
    const kr = idx.female.filter(e => e.origin === 'k');
    expect(kr.length).toBeGreaterThanOrEqual(15);
  });

  it('has western entries', () => {
    const idx = genzNameIndex();
    const en = idx.male.filter(e => e.origin === 'w');
    expect(en.length).toBeGreaterThanOrEqual(10);
  });

  it('has hybrid entries', () => {
    const idx = genzNameIndex();
    const all = [...idx.male, ...idx.female, ...idx.unisex];
    const hy = all.filter(e => e.origin === 'h');
    expect(hy.length).toBeGreaterThanOrEqual(5);
  });

  it('can filter by origin', () => {
    const idx = genzNameIndex();
    const jp = idx.male.filter(e => e.origin === 'j');
    for (let i = 0; i < jp.length; i += 1) {
      expect(jp[i].origin).toBe('j');
    }
  });

  it('caches after first call', () => {
    const a = genzNameIndex();
    const b = genzNameIndex();
    expect(a).toBe(b);
  });
});

describe('INDEX_GENZ_MIDDLE_NAME', () => {
  it('has entries for male, female, unisex', () => {
    expect(INDEX_GENZ_MIDDLE_NAME.male.length).toBeGreaterThan(0);
    expect(INDEX_GENZ_MIDDLE_NAME.female.length).toBeGreaterThan(0);
    expect(INDEX_GENZ_MIDDLE_NAME.unisex.length).toBeGreaterThan(0);
  });
});
