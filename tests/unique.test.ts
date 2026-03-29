import { describe, it, expect } from "vitest";
import { generateMany, generateManyFullNames } from "../src/generator";
import { EGender, ERegion, EEra } from "../src/types";

describe("generateMany", () => {
  it("returns the requested number of results", () => {
    const results = generateMany(10);
    expect(results).toHaveLength(10);
  });

  it("all results are unique by fullName", () => {
    const results = generateMany(20);
    const fullNames = results.map((r) => r.fullName);
    const unique = new Set(fullNames);
    expect(unique.size).toBe(fullNames.length);
  });

  it("respects options", () => {
    const results = generateMany(5, {
      gender: EGender.Female,
      region: ERegion.North,
    });
    for (let i = 0; i < results.length; i += 1) {
      expect(results[i].gender).toBe(EGender.Female);
      expect(results[i].region).toBe(ERegion.North);
    }
  });

  it("throws when count is 0 or negative", () => {
    expect(() => generateMany(0)).toThrow();
    expect(() => generateMany(-1)).toThrow();
  });

  it("throws when count exceeds max possible unique names", () => {
    expect(() =>
      generateMany(1000000, {
        gender: EGender.Unisex,
        region: ERegion.North,
        era: EEra.Traditional,
      }),
    ).toThrow();
  });
});

describe("generateManyFullNames", () => {
  it("returns an array of strings", () => {
    const results = generateManyFullNames(5);
    expect(results).toHaveLength(5);
    for (let i = 0; i < results.length; i += 1) {
      expect(typeof results[i]).toBe("string");
    }
  });

  it("all results are unique", () => {
    const results = generateManyFullNames(10);
    const unique = new Set(results);
    expect(unique.size).toBe(results.length);
  });
});
