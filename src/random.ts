import type { TWeightedEntry } from './types';

// --- xoroshiro128+ PRNG (128-bit state, period ~3.4×10³⁸) ---

function splitmix32(seed: number): [number, number, number, number] {
  let s = seed | 0;
  const out: number[] = [];
  for (let i = 0; i < 4; i += 1) {
    s = (s + 0x9e3779b9) | 0;
    let z = s;
    z = Math.imul(z ^ (z >>> 16), 0x85ebca6b);
    z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35);
    out.push((z ^ (z >>> 16)) >>> 0);
  }
  return out as [number, number, number, number];
}

export function xoroshiro128plus(seed: number): () => number {
  const init = splitmix32(seed);
  let s0h = init[0], s0l = init[1], s1h = init[2], s1l = init[3];

  return () => {
    const resultL = (s0l + s1l) >>> 0;

    let t1h = s1h ^ s0h;
    let t1l = s1l ^ s0l;

    const r24h = (s0h << 24) | (s0l >>> 8);
    const r24l = (s0l << 24) | (s0h >>> 8);
    const sl16h = (t1h << 16) | (t1l >>> 16);
    const sl16l = t1l << 16;
    s0h = r24h ^ t1h ^ sl16h;
    s0l = r24l ^ t1l ^ sl16l;

    const r37h = (t1l << 5) | (t1h >>> 27);
    const r37l = (t1h << 5) | (t1l >>> 27);
    s1h = r37h;
    s1l = r37l;

    return (resultL >>> 0) / 4294967296;
  };
}

// --- Legacy PRNG (kept for backward compat) ---

export function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- Secure random (crypto.getRandomValues) ---

export function secureRandom(): number {
  const buf = new Uint32Array(1);
  globalThis.crypto.getRandomValues(buf);
  return buf[0] / 4294967296;
}

// --- Pick functions ---

export function pickRandom<T>(list: T[], rng?: () => number): T {
  if (list.length === 0) {
    throw new Error('Cannot pick from empty array');
  }
  const rand = rng ?? Math.random;
  return list[Math.floor(rand() * list.length)];
}

// --- Vose's Alias Method for O(1) weighted selection ---

export type TAliasTable = {
  probability: Float64Array;
  alias: Int32Array;
  values: string[];
};

export function createAlias(list: TWeightedEntry[]): TAliasTable {
  const n = list.length;
  const probability = new Float64Array(n);
  const alias = new Int32Array(n);
  const values: string[] = [];

  let totalWeight = 0;
  for (let i = 0; i < n; i += 1) {
    totalWeight += list[i].weight;
    values.push(list[i].value);
  }

  const norm = new Float64Array(n);
  for (let i = 0; i < n; i += 1) {
    norm[i] = (list[i].weight / totalWeight) * n;
  }

  const small: number[] = [];
  const large: number[] = [];
  for (let i = 0; i < n; i += 1) {
    if (norm[i] < 1.0) {
      small.push(i);
    } else {
      large.push(i);
    }
  }

  while (small.length > 0 && large.length > 0) {
    const s = small.pop()!;
    const l = large.pop()!;
    probability[s] = norm[s];
    alias[s] = l;
    norm[l] = (norm[l] + norm[s]) - 1.0;
    if (norm[l] < 1.0) {
      small.push(l);
    } else {
      large.push(l);
    }
  }

  while (large.length > 0) {
    probability[large.pop()!] = 1.0;
  }
  while (small.length > 0) {
    probability[small.pop()!] = 1.0;
  }

  return { probability, alias, values };
}

export function pickAlias(table: TAliasTable, rng?: () => number): string {
  const rand = rng ?? Math.random;
  const i = Math.floor(rand() * table.values.length);
  if (rand() < table.probability[i]) {
    return table.values[i];
  }
  return table.values[table.alias[i]];
}

// --- pickWeighted with auto-cached Alias Method ---

const aliasCache = new WeakMap<TWeightedEntry[], TAliasTable>();

export function pickWeighted(list: TWeightedEntry[], rng?: () => number): string {
  if (list.length === 0) {
    throw new Error('Cannot pick from empty array');
  }
  let table = aliasCache.get(list);
  if (!table) {
    table = createAlias(list);
    aliasCache.set(list, table);
  }
  return pickAlias(table, rng);
}

// --- Fisher-Yates partial shuffle ---

export function shufflePartial<T>(list: T[], count: number, rng?: () => number): T[] {
  const rand = rng ?? Math.random;
  const arr = list.slice();
  const n = Math.min(count, arr.length);
  for (let i = 0; i < n; i += 1) {
    const j = i + Math.floor(rand() * (arr.length - i));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr.slice(0, n);
}
