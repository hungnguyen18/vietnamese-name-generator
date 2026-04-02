import type { TWeightedEntry } from "./types";

export function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickRandom<T>(list: T[], rng?: () => number): T {
  if (list.length === 0) {
    throw new Error("Cannot pick from empty array");
  }
  const rand = rng ?? Math.random;
  return list[Math.floor(rand() * list.length)];
}

export function pickWeighted(list: TWeightedEntry[], rng?: () => number): string {
  if (list.length === 0) {
    throw new Error("Cannot pick from empty array");
  }
  const rand = rng ?? Math.random;
  let totalWeight = 0;
  for (let i = 0; i < list.length; i += 1) {
    totalWeight += list[i].weight;
  }
  let roll = rand() * totalWeight;
  for (let i = 0; i < list.length; i += 1) {
    roll -= list[i].weight;
    if (roll <= 0) {
      return list[i].value;
    }
  }
  return list[list.length - 1].value;
}
