import { describe, it, expect } from "vitest";
import { pickRandom, pickWeighted } from "../src/random";

describe("pickRandom", () => {
  it("returns an element from the array", () => {
    const list = ["a", "b", "c"];
    const result = pickRandom(list);
    expect(list).toContain(result);
  });

  it("throws on empty array", () => {
    expect(() => pickRandom([])).toThrow("Cannot pick from empty array");
  });
});

describe("pickWeighted", () => {
  it("returns an element from weighted entries", () => {
    const list = [
      { value: "Nguyen", weight: 38 },
      { value: "Tran", weight: 11 },
      { value: "Le", weight: 10 },
    ];
    const result = pickWeighted(list);
    expect(["Nguyen", "Tran", "Le"]).toContain(result);
  });

  it("throws on empty array", () => {
    expect(() => pickWeighted([])).toThrow("Cannot pick from empty array");
  });

  it("respects weight distribution over many picks", () => {
    const list = [
      { value: "A", weight: 90 },
      { value: "B", weight: 10 },
    ];
    const counts: Record<string, number> = { A: 0, B: 0 };
    for (let i = 0; i < 10000; i += 1) {
      counts[pickWeighted(list)] += 1;
    }
    expect(counts.A).toBeGreaterThan(8000);
    expect(counts.B).toBeGreaterThan(500);
  });
});
