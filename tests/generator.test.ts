import { describe, it, expect } from "vitest";
import { generate, generateFullName } from "../src/generator";
import { EGender, ERegion, EEra } from "../src/types";

describe("generate", () => {
  it("returns a valid INameResult", () => {
    const result = generate();
    expect(result).toHaveProperty("surname");
    expect(result).toHaveProperty("middleName");
    expect(result).toHaveProperty("givenName");
    expect(result).toHaveProperty("fullName");
    expect(result).toHaveProperty("gender");
    expect(result).toHaveProperty("region");
    expect(result).toHaveProperty("era");
    expect(result.surname.length).toBeGreaterThan(0);
    expect(result.givenName.length).toBeGreaterThan(0);
    expect(result.fullName.length).toBeGreaterThan(0);
  });

  it("fullName is constructed from parts", () => {
    const result = generate();
    if (result.middleName) {
      expect(result.fullName).toBe(
        `${result.surname} ${result.middleName} ${result.givenName}`,
      );
    } else {
      expect(result.fullName).toBe(`${result.surname} ${result.givenName}`);
    }
  });

  it("respects gender option", () => {
    const result = generate({ gender: EGender.Female });
    expect(result.gender).toBe(EGender.Female);
  });

  it("respects region option", () => {
    const result = generate({ region: ERegion.South });
    expect(result.region).toBe(ERegion.South);
  });

  it("respects era option", () => {
    const result = generate({ era: EEra.Modern });
    expect(result.era).toBe(EEra.Modern);
  });

  it("defaults gender to male or female (not unisex)", () => {
    const genders = new Set<string>();
    for (let i = 0; i < 100; i += 1) {
      genders.add(generate().gender);
    }
    expect(genders.has(EGender.Male) || genders.has(EGender.Female)).toBe(true);
    expect(genders.has(EGender.Unisex)).toBe(false);
  });

  it("generates with withMiddleName=false", () => {
    const result = generate({ withMiddleName: false });
    expect(result.middleName).toBe("");
    expect(result.fullName).toBe(`${result.surname} ${result.givenName}`);
  });
});

describe("generateFullName", () => {
  it("returns a string", () => {
    const result = generateFullName();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('generate with style option', () => {
  it('style=japanese returns a name', () => {
    const result = generate({ style: 'japanese', seed: 1 });
    expect(result.fullName).toBeTruthy();
    expect(result.era).toBe(EEra.Modern);
  });

  it('style=korean returns a name', () => {
    const result = generate({ style: 'korean', seed: 2 });
    expect(result.fullName).toBeTruthy();
    expect(result.era).toBe(EEra.Modern);
  });

  it('style=western returns a name', () => {
    const result = generate({ style: 'western', seed: 3 });
    expect(result.fullName).toBeTruthy();
    expect(result.era).toBe(EEra.Modern);
  });

  it('style=hybrid returns a name', () => {
    const result = generate({ style: 'hybrid', seed: 4 });
    expect(result.fullName).toBeTruthy();
    expect(result.era).toBe(EEra.Modern);
  });

  it('without style, behavior unchanged', () => {
    const result = generate({ gender: EGender.Male, region: ERegion.North, era: EEra.Traditional, seed: 100 });
    expect(result.era).toBe(EEra.Traditional);
    expect(result.region).toBe(ERegion.North);
  });

  it('style deterministic with seed', () => {
    const a = generate({ style: 'japanese', seed: 55 });
    const b = generate({ style: 'japanese', seed: 55 });
    expect(a.fullName).toBe(b.fullName);
  });

  it('style generates variety across seeds', () => {
    const names = new Set<string>();
    for (let i = 0; i < 50; i += 1) {
      names.add(generate({ style: 'japanese', seed: i }).givenName);
    }
    expect(names.size).toBeGreaterThan(5);
  });

  it('secure option does not crash', () => {
    const result = generate({ secure: true });
    expect(result.fullName).toBeTruthy();
  });
});
