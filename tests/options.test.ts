import { describe, it, expect } from "vitest";
import { generate } from "../src/generator";
import { EGender, ERegion, EEra, EMeaningCategory } from "../src/types";

describe("Option combinations", () => {
  it("compoundName=true always returns compound given name", () => {
    for (let i = 0; i < 20; i += 1) {
      const result = generate({ compoundName: true });
      expect(result.givenName).toContain(" ");
    }
  });

  it("compoundName=false uses single given name pool (not compound pool)", () => {
    for (let i = 0; i < 20; i += 1) {
      const result = generate({ compoundName: false });
      expect(result.givenName.length).toBeGreaterThan(0);
    }
  });

  it("meaningCategory filters given names", () => {
    for (let i = 0; i < 20; i += 1) {
      const result = generate({
        meaningCategory: EMeaningCategory.Season,
        compoundName: false,
      });
      expect(["Xuân", "Hạ", "Thu", "Đông"]).toContain(result.givenName);
    }
  });

  it("all option combinations produce valid results", () => {
    for (const gender of [EGender.Male, EGender.Female, EGender.Unisex]) {
      for (const region of [ERegion.North, ERegion.Central, ERegion.South]) {
        for (const era of [EEra.Traditional, EEra.Modern]) {
          const result = generate({ gender, region, era });
          expect(result.gender).toBe(gender);
          expect(result.region).toBe(region);
          expect(result.era).toBe(era);
          expect(result.fullName.length).toBeGreaterThan(0);
        }
      }
    }
  });
});
