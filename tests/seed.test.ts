import { describe, it, expect } from "vitest";
import { mulberry32, pickRandom, pickWeighted } from "../src/random";

describe("mulberry32", () => {
  it("returns a function that produces numbers between 0 and 1", () => {
    const rng = mulberry32(42);
    for (let i = 0; i < 100; i += 1) {
      const n = rng();
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(1);
    }
  });

  it("same seed produces same sequence", () => {
    const rng1 = mulberry32(42);
    const rng2 = mulberry32(42);
    for (let i = 0; i < 50; i += 1) {
      expect(rng1()).toBe(rng2());
    }
  });

  it("different seeds produce different sequences", () => {
    const rng1 = mulberry32(42);
    const rng2 = mulberry32(99);
    const results1: number[] = [];
    const results2: number[] = [];
    for (let i = 0; i < 10; i += 1) {
      results1.push(rng1());
      results2.push(rng2());
    }
    expect(results1).not.toEqual(results2);
  });
});

describe("pickRandom with rng", () => {
  it("uses provided rng instead of Math.random", () => {
    const list = ["a", "b", "c", "d", "e"];
    const rng = mulberry32(42);
    const result1 = pickRandom(list, rng);
    const rng2 = mulberry32(42);
    const result2 = pickRandom(list, rng2);
    expect(result1).toBe(result2);
  });

  it("still works without rng (backward compat)", () => {
    const list = ["a", "b", "c"];
    const result = pickRandom(list);
    expect(list).toContain(result);
  });
});

describe("pickWeighted with rng", () => {
  it("uses provided rng instead of Math.random", () => {
    const list = [
      { value: "A", weight: 50 },
      { value: "B", weight: 30 },
      { value: "C", weight: 20 },
    ];
    const rng = mulberry32(42);
    const result1 = pickWeighted(list, rng);
    const rng2 = mulberry32(42);
    const result2 = pickWeighted(list, rng2);
    expect(result1).toBe(result2);
  });

  it("still works without rng (backward compat)", () => {
    const list = [
      { value: "A", weight: 90 },
      { value: "B", weight: 10 },
    ];
    const result = pickWeighted(list);
    expect(["A", "B"]).toContain(result);
  });
});
