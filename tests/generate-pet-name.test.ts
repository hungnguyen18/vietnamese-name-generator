import { describe, it, expect } from 'vitest';
import {
  generatePetName,
  generateManyPetNames,
  type TPetNameCategory,
} from '../src/generate-pet-name';

describe('generatePetName', () => {
  it('returns a name with all fields populated', () => {
    const result = generatePetName({ seed: 42 });
    expect(result.name).toBeTruthy();
    expect(result.meaning).toBeTruthy();
    expect(result.category).toBeTruthy();
  });

  it('filters by category for each category', () => {
    const listCategory: TPetNameCategory[] = [
      'byColor', 'byFood', 'byNature', 'byLuck', 'byHumor', 'byPopCulture', 'endearment',
    ];
    for (let i = 0; i < listCategory.length; i += 1) {
      const category = listCategory[i];
      const result = generatePetName({ category, seed: 100 + i });
      expect(result.category).toBe(category);
    }
  });

  it('petType filter: dog-only names for dog', () => {
    const listResult: string[] = [];
    for (let i = 0; i < 20; i += 1) {
      const result = generatePetName({ petType: 'dog', category: 'byColor', seed: i });
      listResult.push(result.name);
      // Should never return cat-only names
      expect(result.petType).not.toBe('cat');
    }
  });

  it('petType filter: cat-only names for cat', () => {
    for (let i = 0; i < 20; i += 1) {
      const result = generatePetName({ petType: 'cat', category: 'byColor', seed: i });
      // Should never return dog-only names
      expect(result.petType).not.toBe('dog');
    }
  });

  it('furColor filter: black returns dark-colored names', () => {
    for (let i = 0; i < 10; i += 1) {
      const result = generatePetName({ furColor: 'black', seed: i });
      expect(result.furColor).toBe('black');
    }
  });

  it('is deterministic with seed', () => {
    const first = generatePetName({ seed: 42 });
    const second = generatePetName({ seed: 42 });
    expect(first).toEqual(second);
  });

  it('produces different results with different seeds', () => {
    const first = generatePetName({ seed: 1 });
    const second = generatePetName({ seed: 9999 });
    const isDifferent = first.name !== second.name || first.category !== second.category;
    expect(isDifferent).toBe(true);
  });
});

describe('generateManyPetNames', () => {
  it('returns correct count', () => {
    const listResult = generateManyPetNames(5, { seed: 42 });
    expect(listResult).toHaveLength(5);
  });

  it('returns unique names when count is within pool size', () => {
    const listResult = generateManyPetNames(10, { seed: 42 });
    const setName = new Set(listResult.map((r) => r.name));
    expect(setName.size).toBe(10);
  });

  it('handles count larger than pool size by recycling', () => {
    const listResult = generateManyPetNames(5, { category: 'byLuck', seed: 42 });
    expect(listResult).toHaveLength(5);
    for (let i = 0; i < listResult.length; i += 1) {
      expect(listResult[i].category).toBe('byLuck');
    }
  });

  it('is deterministic with seed', () => {
    const first = generateManyPetNames(5, { seed: 42 });
    const second = generateManyPetNames(5, { seed: 42 });
    expect(first).toEqual(second);
  });
});
