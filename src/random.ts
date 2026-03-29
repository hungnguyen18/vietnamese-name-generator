import type { TWeightedEntry } from "./types";

export function pickRandom<T>(list: T[]): T {
  if (list.length === 0) {
    throw new Error("Cannot pick from empty array");
  }
  return list[Math.floor(Math.random() * list.length)];
}

export function pickWeighted(list: TWeightedEntry[]): string {
  if (list.length === 0) {
    throw new Error("Cannot pick from empty array");
  }
  let totalWeight = 0;
  for (let i = 0; i < list.length; i += 1) {
    totalWeight += list[i].weight;
  }
  let roll = Math.random() * totalWeight;
  for (let i = 0; i < list.length; i += 1) {
    roll -= list[i].weight;
    if (roll <= 0) {
      return list[i].value;
    }
  }
  return list[list.length - 1].value;
}
