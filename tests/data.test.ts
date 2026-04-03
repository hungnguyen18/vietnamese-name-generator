import { describe, it, expect } from "vitest";
import { INDEX_SURNAME } from "../src/data/surname";
import { INDEX_MIDDLE_NAME } from "../src/data/middle-name";
import { givenNameIndex } from "../src/data/given-name-compact";
import { INDEX_COMPOUND_GIVEN_NAME } from "../src/data/compound-given-name";
import { EGender, ERegion, EEra } from "../src/types";

const REGIONS = [ERegion.North, ERegion.Central, ERegion.South];
const GENDERS = [EGender.Male, EGender.Female, EGender.Unisex];
const ERAS = [EEra.Traditional, EEra.Modern];

describe("INDEX_SURNAME", () => {
  it("has entries for every region", () => {
    for (const region of REGIONS) {
      expect(INDEX_SURNAME[region]).toBeDefined();
      expect(INDEX_SURNAME[region].length).toBeGreaterThan(0);
    }
  });

  it("all entries have non-empty values and non-negative weights", () => {
    for (const region of REGIONS) {
      for (const entry of INDEX_SURNAME[region]) {
        expect(entry.value.length).toBeGreaterThan(0);
        expect(entry.weight).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("each region has at least some entries with positive weight", () => {
    for (const region of REGIONS) {
      const withPositiveWeight = INDEX_SURNAME[region].filter(
        (e) => e.weight > 0,
      );
      expect(withPositiveWeight.length).toBeGreaterThan(0);
    }
  });

  it("all values are NFC-normalized", () => {
    for (const region of REGIONS) {
      for (const entry of INDEX_SURNAME[region]) {
        expect(entry.value).toBe(entry.value.normalize("NFC"));
      }
    }
  });

  it("south region contains Huỳnh and Võ (southern variants)", () => {
    const southValues = INDEX_SURNAME[ERegion.South].map((e) => e.value);
    expect(southValues).toContain("Huỳnh");
    expect(southValues).toContain("Võ");
  });

  it("south region does not contain Hoàng or Vũ as dominant surnames (weight >= 1)", () => {
    const southDominant = INDEX_SURNAME[ERegion.South]
      .filter((e) => e.weight >= 1)
      .map((e) => e.value);
    expect(southDominant).not.toContain("Hoàng");
    expect(southDominant).not.toContain("Vũ");
  });

  it("north region contains Hoàng and Vũ (northern variants)", () => {
    const northValues = INDEX_SURNAME[ERegion.North].map((e) => e.value);
    expect(northValues).toContain("Hoàng");
    expect(northValues).toContain("Vũ");
  });

  it("north region does not contain Huỳnh or Võ as dominant surnames (weight >= 1)", () => {
    const northDominant = INDEX_SURNAME[ERegion.North]
      .filter((e) => e.weight >= 1)
      .map((e) => e.value);
    expect(northDominant).not.toContain("Huỳnh");
    expect(northDominant).not.toContain("Võ");
  });
});

describe("INDEX_MIDDLE_NAME", () => {
  it("has entries for every gender × region × era combination", () => {
    for (const gender of GENDERS) {
      for (const region of REGIONS) {
        for (const era of ERAS) {
          const entries = INDEX_MIDDLE_NAME[gender]?.[region]?.[era];
          expect(entries).toBeDefined();
          expect(entries.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('traditional male combinations include "Văn"', () => {
    for (const region of REGIONS) {
      const entries = INDEX_MIDDLE_NAME[EGender.Male][region][EEra.Traditional];
      expect(entries).toContain("Văn");
    }
  });

  it('traditional female combinations include "Thị"', () => {
    for (const region of REGIONS) {
      const entries =
        INDEX_MIDDLE_NAME[EGender.Female][region][EEra.Traditional];
      expect(entries).toContain("Thị");
    }
  });

  it("all middle name values are NFC-normalized", () => {
    for (const gender of GENDERS) {
      for (const region of REGIONS) {
        for (const era of ERAS) {
          const entries = INDEX_MIDDLE_NAME[gender]?.[region]?.[era] ?? [];
          for (const name of entries) {
            expect(name).toBe(name.normalize("NFC"));
          }
        }
      }
    }
  });
});

describe("givenNameIndex()", () => {
  it("has entries for every gender × region × era combination", () => {
    for (const gender of GENDERS) {
      for (const region of REGIONS) {
        for (const era of ERAS) {
          const entries = givenNameIndex()[gender]?.[region]?.[era];
          expect(entries).toBeDefined();
          expect(entries.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("all given name values are NFC-normalized", () => {
    for (const gender of GENDERS) {
      for (const region of REGIONS) {
        for (const era of ERAS) {
          const entries = givenNameIndex()[gender]?.[region]?.[era] ?? [];
          for (const entry of entries) {
            expect(entry.value).toBe(entry.value.normalize("NFC"));
          }
        }
      }
    }
  });

  it("all given name values are non-empty strings", { timeout: 30000 }, () => {
    for (const gender of GENDERS) {
      for (const region of REGIONS) {
        for (const era of ERAS) {
          const entries = givenNameIndex()[gender]?.[region]?.[era] ?? [];
          for (const entry of entries) {
            expect(typeof entry.value).toBe("string");
            expect(entry.value.length).toBeGreaterThan(0);
          }
        }
      }
    }
  });
});

describe("INDEX_COMPOUND_GIVEN_NAME", () => {
  it("has entries for every gender × era combination", () => {
    for (const gender of GENDERS) {
      for (const era of ERAS) {
        const entries = INDEX_COMPOUND_GIVEN_NAME[gender]?.[era];
        expect(entries).toBeDefined();
        expect(entries.length).toBeGreaterThan(0);
      }
    }
  });

  it("all compound given names contain a space", () => {
    for (const gender of GENDERS) {
      for (const era of ERAS) {
        const entries = INDEX_COMPOUND_GIVEN_NAME[gender]?.[era] ?? [];
        for (const name of entries) {
          expect(name).toContain(" ");
        }
      }
    }
  });

  it("all compound given name values are NFC-normalized", () => {
    for (const gender of GENDERS) {
      for (const era of ERAS) {
        const entries = INDEX_COMPOUND_GIVEN_NAME[gender]?.[era] ?? [];
        for (const name of entries) {
          expect(name).toBe(name.normalize("NFC"));
        }
      }
    }
  });

  it("all compound given name values are non-empty strings", () => {
    for (const gender of GENDERS) {
      for (const era of ERAS) {
        const entries = INDEX_COMPOUND_GIVEN_NAME[gender]?.[era] ?? [];
        for (const name of entries) {
          expect(typeof name).toBe("string");
          expect(name.length).toBeGreaterThan(0);
        }
      }
    }
  });
});
