import { describe, it, expect } from 'vitest';
import { generatePerson } from '../src/generate-person';

describe('generatePerson', () => {
  it('returns a complete identity object', () => {
    const person = generatePerson({ seed: 42 });
    expect(person.name).toBeDefined();
    expect(person.name.fullName.length).toBeGreaterThan(0);
    expect(person.gender).toMatch(/^(male|female)$/);
    expect(person.birthYear).toBeGreaterThanOrEqual(1960);
    expect(person.birthYear).toBeLessThanOrEqual(2005);
    expect(person.age).toBeGreaterThan(0);
    expect(person.cccd.number).toHaveLength(12);
    expect(person.phone.number.length).toBeGreaterThanOrEqual(10);
    expect(person.email).toContain('@');
    expect(person.username.length).toBeGreaterThan(0);
    expect(person.address.full.length).toBeGreaterThan(0);
  });

  it('is deterministic with seed', () => {
    const p1 = generatePerson({ seed: 42 });
    const p2 = generatePerson({ seed: 42 });
    expect(p1.name.fullName).toBe(p2.name.fullName);
    expect(p1.cccd.number).toBe(p2.cccd.number);
    expect(p1.phone.number).toBe(p2.phone.number);
    expect(p1.email).toBe(p2.email);
    expect(p1.address.full).toBe(p2.address.full);
  });

  it('gender option is respected', () => {
    const person = generatePerson({ gender: 'female', seed: 42 });
    expect(person.gender).toBe('female');
    expect(person.name.gender).toBe('female');
  });

  it('province option makes CCCD and address consistent', () => {
    const person = generatePerson({ province: 'Hà Nội', seed: 42 });
    expect(person.cccd.province.name).toBe('Hà Nội');
    expect(person.address.province).toBe('Hà Nội');
  });

  it('region option constrains name region', () => {
    const person = generatePerson({ region: 'south', seed: 42 });
    expect(person.name.region).toBe('south');
    expect(person.address.full.length).toBeGreaterThan(0);
  });

  it('birth year option is used', () => {
    const person = generatePerson({ birthYear: 1990, seed: 42 });
    expect(person.birthYear).toBe(1990);
    expect(person.cccd.birthYear).toBe(1990);
  });

  it('different seeds produce different people', () => {
    const p1 = generatePerson({ seed: 1 });
    const p2 = generatePerson({ seed: 2 });
    expect(p1.name.fullName).not.toBe(p2.name.fullName);
  });

  it('works without any options', () => {
    const person = generatePerson();
    expect(person.name.fullName.length).toBeGreaterThan(0);
    expect(person.cccd.number).toHaveLength(12);
  });
});
