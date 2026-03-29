import { describe, it, expect } from "vitest";
import { EGender, ERegion, EEra, EMeaningCategory } from "../src/types";

describe("Enums", () => {
  it("EGender has correct values", () => {
    expect(EGender.Male).toBe("male");
    expect(EGender.Female).toBe("female");
    expect(EGender.Unisex).toBe("unisex");
  });

  it("ERegion has correct values", () => {
    expect(ERegion.North).toBe("north");
    expect(ERegion.Central).toBe("central");
    expect(ERegion.South).toBe("south");
  });

  it("EEra has correct values", () => {
    expect(EEra.Traditional).toBe("traditional");
    expect(EEra.Modern).toBe("modern");
  });

  it("EMeaningCategory has correct values", () => {
    expect(EMeaningCategory.Strength).toBe("strength");
    expect(EMeaningCategory.Virtue).toBe("virtue");
    expect(EMeaningCategory.Nature).toBe("nature");
    expect(EMeaningCategory.Precious).toBe("precious");
    expect(EMeaningCategory.Beauty).toBe("beauty");
    expect(EMeaningCategory.Celestial).toBe("celestial");
    expect(EMeaningCategory.Season).toBe("season");
    expect(EMeaningCategory.Intellect).toBe("intellect");
    expect(EMeaningCategory.Prosperity).toBe("prosperity");
  });
});
