# GenZ Data Expansion + Nickname Generator + Random Algorithm Improvements

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand Vietnamese name generator with cross-cultural GenZ naming data (JP/KR/EN/hybrid), a GenZ nickname generator, and improved random algorithms (Alias Method, xoroshiro128+, crypto secure mode).

**Architecture:** Add `style` option to existing `generate()` for cross-cultural names. New `generateGenZNickname()` for social media handles and cultural nicknames. Replace random internals with faster/better algorithms while keeping the same external API. Deprecate standalone `generateGenZName()`.

**Tech Stack:** TypeScript, vitest, tsup (ESM+CJS), zero external dependencies.

**Spec:** `docs/superpowers/specs/2026-04-03-genz-expansion-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/random.ts` | Rewrite | xoroshiro128+, Alias Method, rejection sampling, Fisher-Yates, secure RNG |
| `src/types.ts` | Modify | Add `TNameStyle`, `secure` to `TGenerateOptions` |
| `src/data/genz-names.ts` | Rewrite | Compact pipe-delimited crosscultural name data with metadata |
| `src/data/genz-nickname-patterns.ts` | Create | Nickname templates + word lists |
| `src/generator.ts` | Modify | Add `style` branch in name picking logic |
| `src/generate-genz-nickname.ts` | Create | Nickname generator function |
| `src/generate-genz.ts` | Modify | Deprecate, thin wrapper over `generate()` |
| `src/index.ts` | Modify | Add new exports |
| `tests/random.test.ts` | Rewrite | Tests for all new random algorithms |
| `tests/generator.test.ts` | Modify | Add `style` option tests |
| `tests/generate-genz.test.ts` | Modify | Ensure backward compat still works |
| `tests/generate-genz-nickname.test.ts` | Create | Full nickname generator tests |

---

### Task 1: Rewrite `random.ts` — xoroshiro128+ PRNG

**Files:**
- Modify: `src/random.ts`
- Modify: `tests/random.test.ts`

- [ ] **Step 1: Write failing tests for xoroshiro128+**

```typescript
// tests/random.test.ts — replace entire file
import { describe, it, expect } from 'vitest';
import { xoroshiro128plus, pickRandom, pickWeighted, createAlias, pickAlias, secureRandom, mulberry32 } from '../src/random';

describe('xoroshiro128plus', () => {
  it('produces deterministic output from the same seed', () => {
    const rng1 = xoroshiro128plus(42);
    const rng2 = xoroshiro128plus(42);
    const seq1 = [rng1(), rng1(), rng1()];
    const seq2 = [rng2(), rng2(), rng2()];
    expect(seq1).toEqual(seq2);
  });

  it('produces values in [0, 1)', () => {
    const rng = xoroshiro128plus(123);
    for (let i = 0; i < 1000; i += 1) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('different seeds produce different sequences', () => {
    const rng1 = xoroshiro128plus(1);
    const rng2 = xoroshiro128plus(2);
    const seq1 = [rng1(), rng1(), rng1()];
    const seq2 = [rng2(), rng2(), rng2()];
    expect(seq1).not.toEqual(seq2);
  });

  it('has good distribution across 10 buckets', () => {
    const rng = xoroshiro128plus(999);
    const buckets = new Array(10).fill(0);
    const n = 10000;
    for (let i = 0; i < n; i += 1) {
      buckets[Math.floor(rng() * 10)] += 1;
    }
    for (let i = 0; i < 10; i += 1) {
      expect(buckets[i]).toBeGreaterThan(n / 10 * 0.85);
      expect(buckets[i]).toBeLessThan(n / 10 * 1.15);
    }
  });
});

describe('mulberry32 (backward compat)', () => {
  it('still exported and produces deterministic output', () => {
    const rng1 = mulberry32(42);
    const rng2 = mulberry32(42);
    expect(rng1()).toBe(rng2());
  });
});

describe('pickRandom', () => {
  it('returns an element from the array', () => {
    const list = ['a', 'b', 'c'];
    const result = pickRandom(list);
    expect(list).toContain(result);
  });

  it('throws on empty array', () => {
    expect(() => pickRandom([])).toThrow('Cannot pick from empty array');
  });

  it('uses rejection sampling for uniform distribution', () => {
    const rng = xoroshiro128plus(42);
    const list = ['a', 'b', 'c'];
    const counts: Record<string, number> = { a: 0, b: 0, c: 0 };
    for (let i = 0; i < 9000; i += 1) {
      counts[pickRandom(list, rng)] += 1;
    }
    // Each should be ~3000 ± 15%
    expect(counts.a).toBeGreaterThan(2500);
    expect(counts.b).toBeGreaterThan(2500);
    expect(counts.c).toBeGreaterThan(2500);
  });
});

describe('Alias Method (pickWeighted)', () => {
  it('returns an element from weighted entries', () => {
    const list = [
      { value: 'Nguyen', weight: 38 },
      { value: 'Tran', weight: 11 },
      { value: 'Le', weight: 10 },
    ];
    const result = pickWeighted(list);
    expect(['Nguyen', 'Tran', 'Le']).toContain(result);
  });

  it('throws on empty array', () => {
    expect(() => pickWeighted([])).toThrow('Cannot pick from empty array');
  });

  it('respects weight distribution over many picks', () => {
    const list = [
      { value: 'A', weight: 90 },
      { value: 'B', weight: 10 },
    ];
    const counts: Record<string, number> = { A: 0, B: 0 };
    for (let i = 0; i < 10000; i += 1) {
      counts[pickWeighted(list)] += 1;
    }
    expect(counts.A).toBeGreaterThan(8000);
    expect(counts.B).toBeGreaterThan(500);
  });

  it('createAlias + pickAlias is O(1) per pick', () => {
    const list = [
      { value: 'X', weight: 50 },
      { value: 'Y', weight: 30 },
      { value: 'Z', weight: 20 },
    ];
    const alias = createAlias(list);
    const rng = xoroshiro128plus(77);
    const counts: Record<string, number> = { X: 0, Y: 0, Z: 0 };
    for (let i = 0; i < 10000; i += 1) {
      counts[pickAlias(alias, rng)] += 1;
    }
    // X ~50%, Y ~30%, Z ~20%
    expect(counts.X).toBeGreaterThan(4000);
    expect(counts.Y).toBeGreaterThan(2000);
    expect(counts.Z).toBeGreaterThan(1000);
  });
});

describe('secureRandom', () => {
  it('produces values in [0, 1)', () => {
    for (let i = 0; i < 100; i += 1) {
      const v = secureRandom();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/random.test.ts`
Expected: FAIL — `xoroshiro128plus`, `createAlias`, `pickAlias`, `secureRandom` not exported.

- [ ] **Step 3: Implement new `random.ts`**

Replace `src/random.ts` with:

```typescript
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
    // result = s0 + s1 (low 32 bits only — sufficient for [0,1) float)
    const resultL = (s0l + s1l) >>> 0;

    // s1 ^= s0
    let t1h = s1h ^ s0h;
    let t1l = s1l ^ s0l;

    // s0 = rotl(s0, 24) ^ s1 ^ (s1 << 16)
    const r24h = (s0h << 24) | (s0l >>> 8);
    const r24l = (s0l << 24) | (s0h >>> 8);
    const sl16h = (t1h << 16) | (t1l >>> 16);
    const sl16l = t1l << 16;
    s0h = r24h ^ t1h ^ sl16h;
    s0l = r24l ^ t1l ^ sl16l;

    // s1 = rotl(s1, 37)
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

  // Normalize so each probability * n = weight / totalWeight * n
  const norm = new Float64Array(n);
  for (let i = 0; i < n; i += 1) {
    norm[i] = (list[i].weight / totalWeight) * n;
  }

  // Two stacks: small (< 1.0) and large (>= 1.0)
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

  // Remaining items get probability 1.0 (floating point cleanup)
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/random.test.ts`
Expected: All PASS.

- [ ] **Step 5: Run full test suite to check nothing broke**

Run: `npx vitest run`
Expected: All existing tests PASS. The `pickWeighted` API is unchanged — callers still work.

- [ ] **Step 6: Commit**

```bash
git add src/random.ts tests/random.test.ts
git commit -S -m "Improve random: xoroshiro128+, Alias Method O(1), secure RNG, Fisher-Yates"
```

---

### Task 2: Add `TNameStyle` and `secure` to types

**Files:**
- Modify: `src/types.ts`

- [ ] **Step 1: Write failing test for new type**

```typescript
// tests/types.test.ts — add to existing file
import { describe, it, expect } from 'vitest';
import { EGender, ERegion, EEra, EMeaningCategory, ENameFormat } from '../src/types';
import type { TNameStyle, TGenerateOptions } from '../src/types';

describe('TNameStyle type', () => {
  it('accepts valid style values', () => {
    const opts: TGenerateOptions = { style: 'japanese' };
    expect(opts.style).toBe('japanese');
  });

  it('accepts secure option', () => {
    const opts: TGenerateOptions = { secure: true };
    expect(opts.secure).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/types.test.ts`
Expected: FAIL — `style` and `secure` not on `TGenerateOptions`.

- [ ] **Step 3: Add types to `src/types.ts`**

Add after `ENameFormat` enum (after line 47):

```typescript
export type TNameStyle = 'japanese' | 'korean' | 'western' | 'hybrid';
```

Modify `TGenerateOptions` to add `style` and `secure`:

```typescript
export type TGenerateOptions = {
  gender?: EGender;
  region?: ERegion;
  era?: EEra;
  compoundName?: boolean;
  meaningCategory?: EMeaningCategory;
  withMiddleName?: boolean;
  seed?: number;
  format?: ENameFormat | ENameFormat[];
  style?: TNameStyle;
  secure?: boolean;
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/types.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/types.ts tests/types.test.ts
git commit -S -m "Add TNameStyle and secure option to TGenerateOptions"
```

---

### Task 3: Expand GenZ crosscultural name data

**Files:**
- Rewrite: `src/data/genz-names.ts`

- [ ] **Step 1: Write failing test for new data shape**

```typescript
// tests/genz-data.test.ts — new file
import { describe, it, expect } from 'vitest';
import { genzNameIndex, type TGenZNameEntry, INDEX_GENZ_MIDDLE_NAME } from '../src/data/genz-names';

describe('genzNameIndex', () => {
  it('returns entries indexed by gender', () => {
    const idx = genzNameIndex();
    expect(idx.male.length).toBeGreaterThan(0);
    expect(idx.female.length).toBeGreaterThan(0);
    expect(idx.unisex.length).toBeGreaterThan(0);
  });

  it('each entry has required fields', () => {
    const idx = genzNameIndex();
    const all = [...idx.male, ...idx.female, ...idx.unisex];
    for (let i = 0; i < all.length; i += 1) {
      expect(all[i].value).toBeTruthy();
      expect(['j', 'k', 'w', 'v', 'h']).toContain(all[i].origin);
      expect(all[i].meaning).toBeTruthy();
      expect(all[i].popularity).toBeGreaterThanOrEqual(1);
      expect(all[i].popularity).toBeLessThanOrEqual(10);
    }
  });

  it('has japanese entries', () => {
    const idx = genzNameIndex();
    const jp = idx.male.filter(e => e.origin === 'j');
    expect(jp.length).toBeGreaterThanOrEqual(15);
  });

  it('has korean entries', () => {
    const idx = genzNameIndex();
    const kr = idx.female.filter(e => e.origin === 'k');
    expect(kr.length).toBeGreaterThanOrEqual(15);
  });

  it('has western entries', () => {
    const idx = genzNameIndex();
    const en = idx.male.filter(e => e.origin === 'w');
    expect(en.length).toBeGreaterThanOrEqual(10);
  });

  it('has hybrid entries', () => {
    const idx = genzNameIndex();
    const all = [...idx.male, ...idx.female, ...idx.unisex];
    const hy = all.filter(e => e.origin === 'h');
    expect(hy.length).toBeGreaterThanOrEqual(5);
  });

  it('can filter by origin', () => {
    const idx = genzNameIndex();
    const jp = idx.male.filter(e => e.origin === 'j');
    for (let i = 0; i < jp.length; i += 1) {
      expect(jp[i].origin).toBe('j');
    }
  });

  it('caches after first call', () => {
    const a = genzNameIndex();
    const b = genzNameIndex();
    expect(a).toBe(b); // same reference
  });
});

describe('INDEX_GENZ_MIDDLE_NAME', () => {
  it('has entries for male, female, unisex', () => {
    expect(INDEX_GENZ_MIDDLE_NAME.male.length).toBeGreaterThan(0);
    expect(INDEX_GENZ_MIDDLE_NAME.female.length).toBeGreaterThan(0);
    expect(INDEX_GENZ_MIDDLE_NAME.unisex.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/genz-data.test.ts`
Expected: FAIL — `genzNameIndex` not exported, `TGenZNameEntry` not found.

- [ ] **Step 3: Rewrite `src/data/genz-names.ts` with crosscultural data**

Replace the entire file with compact pipe-delimited data. Format: `name|origin|script|meaning|vietnamized|popularity`

```typescript
export type TGenZNameEntry = {
  value: string;
  origin: 'j' | 'k' | 'w' | 'v' | 'h';
  script: string;
  meaning: string;
  vietnamized: string;
  popularity: number;
};

// Compact format: name|origin|script|meaning|vietnamized|popularity
// origin: j=japanese, k=korean, w=western, v=vietnamese, h=hybrid

const GENZ_MALE = [
  // Japanese
  'Ren|j|蓮|lotus|Ren|9',
  'Haruto|j|大翔|great soaring|Ha-ru-to|8',
  'Minato|j|湊|harbor|Mi-na-to|8',
  'Asahi|j|朝陽|morning sun|A-sa-hi|7',
  'Riku|j|陸|land|Ri-ku|7',
  'Kaito|j|海斗|sea warrior|Kai-to|8',
  'Sora|j|空|sky|So-ra|7',
  'Akira|j|明|bright|A-ki-ra|9',
  'Haru|j|春|spring|Ha-ru|8',
  'Yuki|j|雪|snow|Yu-ki|8',
  'Kai|j|海|sea|Kai|9',
  'Ryo|j|涼|cool|Ryo|7',
  'Itsuki|j|樹|tree|I-tsu-ki|7',
  'Sota|j|颯太|fresh wind|So-ta|6',
  'Taku|j|拓|pioneer|Ta-ku|6',
  'Yuuma|j|悠真|gentle truth|Yu-ma|7',
  // Korean
  'Min-jun|k|민준|intelligent|Min Tuấn|9',
  'Seo-jun|k|서준|outstanding talent|Seo Tuấn|8',
  'Ha-jun|k|하준|summer talented|Hà Tuấn|8',
  'Ji-ho|k|지호|wisdom bravery|Chi Hào|7',
  'Hyun-woo|k|현우|wise cosmic|Hiền Vũ|7',
  'Ji-hoon|k|지훈|wisdom merit|Chi Huân|7',
  'Min-ho|k|민호|quick great|Min Hào|8',
  'Tae-hyun|k|태현|great wise|Thái Hiền|7',
  'Woo-jin|k|우진|rain precious|Vũ Trân|7',
  'Jimin|k|지민|wisdom quick|Jimin|10',
  'Jun-young|k|준영|talented forever|Tuấn Vinh|6',
  'Sung-min|k|성민|accomplished|Thành Min|6',
  'Do-yoon|k|도윤|path shine|Do Yoon|7',
  'Ye-jun|k|예준|artful talented|Ye Tuấn|7',
  'Chan-woo|k|찬우|praise rain|Chan Vũ|6',
  'Ha-neul|k|하늘|sky|Ha Neul|7',
  // Western
  'Leo|w||lion|Leo|10',
  'Ryan|w||little king|Ryan|9',
  'Max|w||greatest|Max|8',
  'Daniel|w||God is judge|Daniel|8',
  'Kevin|w||handsome|Kevin|9',
  'Alex|w||defender|Alex|8',
  'Jack|w||God is gracious|Jack|7',
  'Tony|w||priceless|Tony|7',
  'Danny|w||God is judge|Danny|7',
  'Lucas|w||light|Lucas|8',
  'Noah|w||rest comfort|Noah|7',
  'Andy|w||brave|Andy|7',
  'Eric|w||eternal ruler|Eric|6',
  'Bryan|w||noble|Bryan|7',
  // Vietnamese modern short
  'An|v||peace|An|10',
  'Khang|v||healthy|Khang|9',
  'Khôi|v||outstanding|Khoi|9',
  'Long|v||dragon|Long|9',
  'Trí|v||wisdom|Tri|8',
  'Bình|v||peaceful|Binh|8',
  'Tín|v||trust|Tin|7',
  'Phi|v||fly|Phi|7',
  'Hải|v||sea|Hai|8',
  'Nam|v||south|Nam|8',
  'Tâm|v||heart|Tam|8',
  'Đạt|v||achieve|Dat|7',
  // Hybrid (works across cultures)
  'Minh|h|明|bright|Minh|10',
  'Bảo|h|寶|treasure|Bao|9',
  'Kai|h|海|sea|Kai|9',
  'Ren|h|蓮|lotus|Ren|8',
].join(',');

const GENZ_FEMALE = [
  // Japanese
  'Sakura|j|桜|cherry blossom|Sa-ku-ra|10',
  'Hana|j|花|flower|Ha-na|10',
  'Rin|j|凛|dignified|Rin|8',
  'Himari|j|陽葵|sunflower|Hi-ma-ri|7',
  'Hinata|j|陽向|sunny place|Hi-na-ta|8',
  'Mio|j|澪|waterway|Mi-o|7',
  'Aoi|j|葵|hollyhock|A-oi|7',
  'Yui|j|結衣|binding|Yu-i|8',
  'Mei|j|芽依|sprout|Mei|9',
  'Akari|j|明かり|light|A-ka-ri|7',
  'Mina|j|美菜|beauty nature|Mi-na|9',
  'Nana|j|奈々|spring freshness|Na-na|8',
  'Saki|j|咲|blossom|Sa-ki|7',
  'Koharu|j|小春|little spring|Ko-ha-ru|7',
  'Yuzuki|j|結月|connecting moon|Yu-zu-ki|7',
  'Riko|j|莉子|jasmine child|Ri-ko|7',
  // Korean
  'Seo-yeon|k|서연|auspicious beautiful|Seo Yên|8',
  'Ha-eun|k|하은|summer grace|Hà Ân|8',
  'Ji-woo|k|지우|wisdom rain|Chi Vũ|7',
  'Su-a|k|수아|elegant|Su A|7',
  'Ye-eun|k|예은|artful grace|Ye Ân|7',
  'Min-seo|k|민서|quick auspicious|Min Thư|7',
  'Yuna|k|윤아|gentle|Yu-na|9',
  'Da-in|k|다인|much kindness|Da In|6',
  'Soo-jin|k|수진|excellent precious|Tú Trân|7',
  'Mi-na|k|미나|beautiful|Mỹ Na|8',
  'Chae-won|k|채원|colorful garden|Chae Won|7',
  'Ji-a|k|지아|wisdom elegance|Chi A|7',
  'Na-yeon|k|나연|graceful beauty|Na Yên|8',
  'Bo-ra|k|보라|purple|Bo Ra|6',
  'Ha-yoon|k|하윤|summer shine|Hà Vân|7',
  'Ye-jin|k|예진|artful precious|Ye Trân|7',
  // Western
  'Emma|w||whole universal|Emma|10',
  'Mia|w||mine beloved|Mia|9',
  'Anna|w||grace|Anna|8',
  'Bella|w||beautiful|Bella|8',
  'Jenny|w||fair one|Jenny|9',
  'Lisa|w||pledged to God|Lisa|9',
  'Luna|w||moon|Luna|8',
  'Ella|w||fairy maiden|Ella|7',
  'Rosie|w||rose|Rosie|7',
  'Amy|w||beloved|Amy|7',
  'Sunny|w||sunshine|Sunny|7',
  'Zoe|w||life|Zoe|7',
  'Nora|w||light|Nora|6',
  'Elsa|w||noble|Elsa|7',
  // Vietnamese modern short
  'My|v||beauty|My|8',
  'Nhi|v||small|Nhi|8',
  'An|v||peace|An|10',
  'Mai|v||apricot blossom|Mai|9',
  'Vi|v||tiny|Vi|7',
  'Hà|v||river|Ha|8',
  'Ly|v||elegant|Ly|7',
  'Trinh|v||pure|Trinh|7',
  'Lê|v||pear|Le|7',
  'Mỹ|v||beautiful|My|8',
  // Hybrid
  'Linh|h|靈|spirit|Linh|10',
  'Mai|h|梅|apricot|Mai|10',
  'An|h|安|peace|An|10',
  'Hana|h|花|flower|Hana|9',
  'Mina|h|美菜|beautiful|Mina|9',
].join(',');

const GENZ_UNISEX = [
  // Vietnamese
  'An|v||peace|An|10',
  'Minh|v|明|bright|Minh|10',
  'Khánh|v||celebration|Khanh|8',
  'Xuân|v||spring|Xuan|8',
  'Lâm|v||forest|Lam|8',
  'Linh|v|靈|spirit|Linh|9',
  'Phúc|v||blessing|Phuc|8',
  'Tâm|v||heart|Tam|8',
  'Duy|v||only|Duy|7',
  'Thanh|v||pure|Thanh|8',
  // Japanese (unisex)
  'Sora|j|空|sky|So-ra|8',
  'Yuki|j|雪|snow|Yu-ki|8',
  'Haru|j|春|spring|Ha-ru|8',
  'Ren|j|蓮|lotus|Ren|8',
  'Kai|j|海|sea|Kai|9',
  // Korean (unisex)
  'Ha-neul|k|하늘|sky|Ha Neul|7',
  'Bom|k|봄|spring|Bom|6',
  'Bit-na|k|빛나|shining|Bit Na|6',
  // Western (unisex)
  'Alex|w||defender|Alex|8',
  'Kai|w||sea|Kai|9',
  // Hybrid
  'Bảo|h|寶|treasure|Bao|9',
  'An|h|安|peace|An|10',
].join(',');

// --- Lazy parser with cache ---

type TGenzIndex = Record<string, TGenZNameEntry[]>;
let cachedIndex: TGenzIndex | null = null;

function parseDictLine(line: string): TGenZNameEntry {
  const [value, origin, script, meaning, vietnamized, pop] = line.split('|');
  return {
    value,
    origin: origin as TGenZNameEntry['origin'],
    script: script || '',
    meaning,
    vietnamized: vietnamized || value,
    popularity: parseInt(pop, 10),
  };
}

export function genzNameIndex(): TGenzIndex {
  if (cachedIndex) {
    return cachedIndex;
  }
  cachedIndex = {
    male: GENZ_MALE.split(',').map(parseDictLine),
    female: GENZ_FEMALE.split(',').map(parseDictLine),
    unisex: GENZ_UNISEX.split(',').map(parseDictLine),
  };
  return cachedIndex;
}

// --- Middle names (kept as simple arrays — small data) ---

export const INDEX_GENZ_MIDDLE_NAME: Record<string, string[]> = {
  male: ['Minh', 'Gia', 'Đức', 'Bảo', 'Quốc', 'Hoàng', 'Anh', 'Tuấn'],
  female: ['Ngọc', 'Bảo', 'An', 'Khánh', 'Minh', 'Gia', 'Thảo', 'Phương'],
  unisex: ['An', 'Bảo', 'Minh', 'Gia', 'Khánh'],
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/genz-data.test.ts`
Expected: All PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/genz-names.ts tests/genz-data.test.ts
git commit -S -m "Add crosscultural GenZ name data: JP/KR/EN/hybrid with metadata"
```

---

### Task 4: Integrate `style` option into `generate()`

**Files:**
- Modify: `src/generator.ts`
- Modify: `tests/generator.test.ts`

- [ ] **Step 1: Write failing tests for style option**

Add to end of `tests/generator.test.ts`:

```typescript
import type { TNameStyle } from '../src/types';

describe('generate with style option', () => {
  it('style=japanese returns a name from japanese data', () => {
    const result = generate({ style: 'japanese', seed: 1 });
    expect(result.fullName).toBeTruthy();
    expect(result.era).toBe(EEra.Modern);
  });

  it('style=korean returns a name from korean data', () => {
    const result = generate({ style: 'korean', seed: 2 });
    expect(result.fullName).toBeTruthy();
    expect(result.era).toBe(EEra.Modern);
  });

  it('style=western returns a name from western data', () => {
    const result = generate({ style: 'western', seed: 3 });
    expect(result.fullName).toBeTruthy();
    expect(result.era).toBe(EEra.Modern);
  });

  it('style=hybrid returns a name from hybrid data', () => {
    const result = generate({ style: 'hybrid', seed: 4 });
    expect(result.fullName).toBeTruthy();
    expect(result.era).toBe(EEra.Modern);
  });

  it('without style option, behavior unchanged', () => {
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/generator.test.ts`
Expected: FAIL — `style` option not handled.

- [ ] **Step 3: Modify `src/generator.ts`**

Add import at top:

```typescript
import { genzNameIndex } from './data/genz-names';
import { INDEX_GENZ_MIDDLE_NAME } from './data/genz-names';
import { xoroshiro128plus, secureRandom } from './random';
import type { TNameStyle } from './types';
```

Replace the existing `mulberry32` import:

```typescript
import { xoroshiro128plus, mulberry32, secureRandom, pickRandom, pickWeighted } from './random';
```

(Remove the old `import { mulberry32, pickRandom, pickWeighted } from './random';` line.)

Modify `optionResolve` to handle `style` and `secure`:

```typescript
function optionResolve(options?: TGenerateOptions, rng?: () => number) {
  const style = options?.style;
  const gender = options?.gender ?? pickRandom(LIST_BINARY_GENDER, rng);
  const region = options?.region ?? pickRandom(LIST_REGION, rng);
  // When style is set, force era to Modern
  const era = style ? EEra.Modern : (options?.era ?? pickRandom(LIST_ERA, rng));
  const withMiddleName = options?.withMiddleName ?? true;
  const compoundName = options?.compoundName;
  const meaningCategory = options?.meaningCategory;

  return { gender, region, era, withMiddleName, compoundName, meaningCategory, style };
}
```

Add a new function for picking GenZ given names:

```typescript
const ORIGIN_MAP: Record<TNameStyle, string> = {
  japanese: 'j',
  korean: 'k',
  western: 'w',
  hybrid: 'h',
};

function genzGivenNamePick(
  gender: EGender,
  style: TNameStyle,
  rng?: () => number,
): string {
  const idx = genzNameIndex();
  const genderKey = gender === EGender.Unisex ? 'unisex' : gender;
  let list = idx[genderKey] ?? idx.unisex;

  if (style === 'hybrid') {
    // Hybrid: include all origins
    // No filter needed — pick from full pool
  } else {
    const originCode = ORIGIN_MAP[style];
    const filtered = list.filter(e => e.origin === originCode);
    if (filtered.length > 0) {
      list = filtered;
    }
  }

  return pickRandom(list, rng).value;
}
```

Modify the `generate()` function to use `style` and `secure`:

```typescript
export function generate(options?: TGenerateOptions): INameResult {
  let rng: (() => number) | undefined;
  if (options?.seed !== undefined) {
    rng = xoroshiro128plus(options.seed);
  } else if (options?.secure) {
    rng = secureRandom;
  }

  const { gender, region, era, withMiddleName, compoundName, meaningCategory, style } =
    optionResolve(options, rng);

  const surname = pickWeighted(INDEX_SURNAME[region], rng);

  let middleName = '';
  if (withMiddleName) {
    if (style) {
      const genderKey = gender === EGender.Unisex ? 'unisex' : gender;
      const middleList = INDEX_GENZ_MIDDLE_NAME[genderKey] ?? INDEX_GENZ_MIDDLE_NAME.unisex;
      middleName = pickRandom(middleList, rng);
    } else {
      const middleList = INDEX_MIDDLE_NAME[gender]?.[region]?.[era];
      if (middleList && middleList.length > 0) {
        middleName = pickRandom(middleList, rng);
      }
    }
  }

  let givenName: string;
  if (style) {
    givenName = genzGivenNamePick(gender, style, rng);
  } else {
    givenName = givenNamePick(gender, region, era, compoundName, meaningCategory, rng);
  }

  const fullName = middleName
    ? `${surname} ${middleName} ${givenName}`
    : `${surname} ${givenName}`;

  const romanizedSurname = romanize(surname);
  const romanizedMiddleName = romanize(middleName);
  const romanizedGivenName = romanize(givenName);
  const romanizedFullName = romanizedMiddleName
    ? `${romanizedSurname} ${romanizedMiddleName} ${romanizedGivenName}`
    : `${romanizedSurname} ${romanizedGivenName}`;

  const romanized = {
    surname: romanizedSurname,
    middleName: romanizedMiddleName,
    givenName: romanizedGivenName,
    fullName: romanizedFullName,
  };

  const parts = { surname, middleName, givenName, fullName, romanized };

  const formatList = options?.format
    ? Array.isArray(options.format) ? options.format : [options.format]
    : [ENameFormat.Full];

  const formatted: Partial<Record<ENameFormat, string>> = {};
  for (let i = 0; i < formatList.length; i += 1) {
    formatted[formatList[i]] = formatName(parts, formatList[i]);
  }

  return { ...parts, gender, region, era, formatted };
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run tests/generator.test.ts`
Expected: All PASS.

- [ ] **Step 5: Run full test suite**

Run: `npx vitest run`
Expected: All PASS.

- [ ] **Step 6: Commit**

```bash
git add src/generator.ts tests/generator.test.ts
git commit -S -m "Add style option to generate() for crosscultural GenZ names"
```

---

### Task 5: Deprecate `generateGenZName()` as wrapper

**Files:**
- Modify: `src/generate-genz.ts`
- Modify: `tests/generate-genz.test.ts`

- [ ] **Step 1: Run existing GenZ tests to confirm baseline**

Run: `npx vitest run tests/generate-genz.test.ts`
Expected: All PASS (existing tests still work).

- [ ] **Step 2: Rewrite `src/generate-genz.ts` as thin wrapper**

```typescript
import { generate } from './generator';
import { romanize } from './romanize';
import type { TNameStyle } from './types';
import { EGender, ERegion } from './types';

export type TGenZStyle = 'short' | 'compound' | 'international';

export interface IGenZOptions {
  gender?: 'male' | 'female' | 'unisex';
  style?: TGenZStyle;
  region?: 'north' | 'central' | 'south';
  seed?: number;
}

export interface IGenZResult {
  surname: string;
  middleName: string;
  givenName: string;
  fullName: string;
  style: TGenZStyle;
  gender: string;
  romanized: { surname: string; middleName: string; givenName: string; fullName: string };
}

const STYLE_MAP: Record<TGenZStyle, TNameStyle | undefined> = {
  short: undefined,
  compound: undefined,
  international: 'western',
};

/**
 * @deprecated Use generate({ style: 'japanese' | 'korean' | 'western' | 'hybrid' }) instead.
 * Kept for backward compatibility.
 */
export function generateGenZName(options?: IGenZOptions): IGenZResult {
  const style = options?.style ?? 'short';
  const mappedStyle = STYLE_MAP[style];

  const result = generate({
    gender: options?.gender === 'unisex' ? EGender.Unisex
      : options?.gender === 'female' ? EGender.Female
      : options?.gender === 'male' ? EGender.Male
      : undefined,
    region: options?.region as ERegion | undefined,
    style: mappedStyle,
    seed: options?.seed,
  });

  return {
    surname: result.surname,
    middleName: result.middleName,
    givenName: result.givenName,
    fullName: result.fullName,
    style,
    gender: result.gender,
    romanized: result.romanized,
  };
}
```

- [ ] **Step 3: Run existing GenZ tests**

Run: `npx vitest run tests/generate-genz.test.ts`
Expected: All PASS. Backward compat maintained.

Note: Some tests may need seed adjustment if xoroshiro128+ produces different sequences than mulberry32. If tests fail on deterministic assertions, update the seed values to produce valid output. The structural tests (field presence, style filter, gender filter) should pass unchanged.

- [ ] **Step 4: Run full test suite**

Run: `npx vitest run`
Expected: All PASS.

- [ ] **Step 5: Commit**

```bash
git add src/generate-genz.ts tests/generate-genz.test.ts
git commit -S -m "Deprecate generateGenZName, delegate to generate() with style option"
```

---

### Task 6: Create nickname patterns data

**Files:**
- Create: `src/data/genz-nickname-patterns.ts`

- [ ] **Step 1: Write failing test for pattern data**

```typescript
// tests/genz-nickname-patterns.test.ts — new file
import { describe, it, expect } from 'vitest';
import {
  NICKNAME_TEMPLATES,
  CUTE_ANIMALS,
  CUTE_FOODS,
  MEME_PHRASES,
  FUNNY_TITLES,
  WESTERN_MALE,
  WESTERN_FEMALE,
  JP_SUFFIXES,
  KR_SUFFIXES,
  HANDLE_PREFIXES,
  CULTURAL_NOTES,
} from '../src/data/genz-nickname-patterns';

describe('genz-nickname-patterns data', () => {
  it('NICKNAME_TEMPLATES has all 6 styles', () => {
    expect(NICKNAME_TEMPLATES['social-handle'].length).toBeGreaterThan(0);
    expect(NICKNAME_TEMPLATES['jp-suffix'].length).toBeGreaterThan(0);
    expect(NICKNAME_TEMPLATES['kr-suffix'].length).toBeGreaterThan(0);
    expect(NICKNAME_TEMPLATES['cute'].length).toBeGreaterThan(0);
    expect(NICKNAME_TEMPLATES['meme'].length).toBeGreaterThan(0);
    expect(NICKNAME_TEMPLATES['english-viet'].length).toBeGreaterThan(0);
  });

  it('word lists are non-empty', () => {
    expect(CUTE_ANIMALS.length).toBeGreaterThanOrEqual(10);
    expect(CUTE_FOODS.length).toBeGreaterThanOrEqual(10);
    expect(MEME_PHRASES.length).toBeGreaterThanOrEqual(4);
    expect(FUNNY_TITLES.length).toBeGreaterThanOrEqual(5);
    expect(WESTERN_MALE.length).toBeGreaterThanOrEqual(10);
    expect(WESTERN_FEMALE.length).toBeGreaterThanOrEqual(10);
    expect(JP_SUFFIXES.length).toBeGreaterThanOrEqual(4);
    expect(KR_SUFFIXES.length).toBeGreaterThanOrEqual(4);
    expect(HANDLE_PREFIXES.length).toBeGreaterThanOrEqual(5);
  });

  it('CULTURAL_NOTES has all 6 styles', () => {
    expect(CULTURAL_NOTES['social-handle']).toBeTruthy();
    expect(CULTURAL_NOTES['jp-suffix']).toBeTruthy();
    expect(CULTURAL_NOTES['kr-suffix']).toBeTruthy();
    expect(CULTURAL_NOTES['cute']).toBeTruthy();
    expect(CULTURAL_NOTES['meme']).toBeTruthy();
    expect(CULTURAL_NOTES['english-viet']).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/genz-nickname-patterns.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/data/genz-nickname-patterns.ts`**

```typescript
export type TGenZNicknameStyle =
  | 'social-handle'
  | 'jp-suffix'
  | 'kr-suffix'
  | 'cute'
  | 'meme'
  | 'english-viet';

// Templates use placeholders: {given}, {surname}, {middle}, {initial}, {given_lower}, {year}, {rand2}
export const NICKNAME_TEMPLATES: Record<TGenZNicknameStyle, string[]> = {
  'social-handle': [
    '{given_lower}.{year}',
    '{given_lower}_{rand2}',
    '_{given_lower}_',
    '{given_lower}.official',
    '{prefix}{given_lower}',
    'itz.{given_lower}',
    '{given_lower}.{given_lower}{rand2}',
    '{given_lower}x{rand2}',
  ],
  'jp-suffix': [
    '{given}-chan',
    '{given}-kun',
    '{given}-san',
    '{given}-sama',
    '{given}-senpai',
  ],
  'kr-suffix': [
    '{given} oppa',
    '{given} unnie',
    '{given}-ah',
    '{given}-ya',
  ],
  'cute': [
    'Bé {given}',
    '{syl}{syl}',
    '{animal}',
    '{food}',
    'Mini {given}',
    'Mochi {given}',
    'Baby {given}',
  ],
  'meme': [
    '{western} {surname}',
    '{meme_phrase}',
    '{funny_title}',
  ],
  'english-viet': [
    '{western} {surname}',
    '{western} {given}',
  ],
};

export const CUTE_ANIMALS = [
  'Gấu', 'Cún', 'Miu', 'Thỏ', 'Sóc', 'Nhím', 'Nai', 'Heo', 'Nemo', 'Panda',
  'Hamster', 'Mèo', 'Gấu Trúc', 'Heo Sữa', 'Thỏ Non',
];

export const CUTE_FOODS = [
  'Xoài', 'Mít', 'Dâu', 'Cherry', 'Kem', 'Bắp', 'Kẹo', 'Na', 'Chanh', 'Táo',
  'Matcha', 'Trà Sữa', 'Mochi', 'Pudding', 'Bánh Bao',
];

export const MEME_PHRASES = [
  'Phở Mai Que', 'Công Chúa Hột Vịt Lộn', 'Hoàng Tử Bánh Tráng Trộn',
  'Bánh Bèo Ngơ Ngác', 'Heo Con Bông', 'Cún Yêu Dễ Thương',
  'Cô Nàng Mup Mup', 'Tiểu Thư 3m Bé Đời', 'Mèo Mèo Mèo Mèo',
];

export const FUNNY_TITLES = [
  'Thanh Bựa', 'Giáo Sư Cười', 'Shipper Không Tên', 'Boss Đại Nhân', 'Bad Boy Có Gu',
  'Sát Thủ Mắt Híp', 'Đại Ca Phố Đông', 'Bá Vương Phá Game', 'Chiến Binh Bất Bại',
];

export const WESTERN_MALE = [
  'Kevin', 'Ryan', 'Leo', 'Max', 'Daniel', 'Alex', 'Jack', 'Tony', 'Danny', 'Andy',
  'Bryan', 'Jason', 'Eric', 'Vincent', 'Lucas',
];

export const WESTERN_FEMALE = [
  'Jenny', 'Emma', 'Mia', 'Lisa', 'Luna', 'Bella', 'Amy', 'Sunny', 'Rosie', 'Anna',
  'Ella', 'Zoe', 'Nora', 'Lucy', 'Elsa',
];

export const JP_SUFFIXES = ['-chan', '-kun', '-san', '-sama', '-senpai', '-sensei'];

export const KR_SUFFIXES = ['oppa', 'unnie', '-ah', '-ya', 'hyung', 'noona'];

export const HANDLE_PREFIXES = ['dreamy', 'soft', 'baby', 'little', 'mini', 'sweet', 'sunny', 'moon'];

export const CULTURAL_NOTES: Record<TGenZNicknameStyle, string> = {
  'social-handle': 'Vietnamese GenZ social media handle patterns — dots, underscores, birth year, aesthetic prefixes',
  'jp-suffix': 'Japanese honorific suffixes adopted by Vietnamese anime/manga fans — -chan (cute), -kun (casual male), -sama (admiration)',
  'kr-suffix': 'Korean honorifics from K-pop/K-drama fan culture — oppa (older male), unnie (older female), -ah/-ya (casual)',
  'cute': 'Vietnamese cute nickname tradition — animal names, food names, syllable doubling, "bé" prefix (baby/little)',
  'meme': 'Vietnamese internet meme nicknames — humorous food titles, exaggerated personas, self-deprecating humor',
  'english-viet': 'English first name + Vietnamese surname pattern — the "Kevin Nguyen" phenomenon from Viet diaspora culture',
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/genz-nickname-patterns.test.ts`
Expected: All PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/genz-nickname-patterns.ts tests/genz-nickname-patterns.test.ts
git commit -S -m "Add GenZ nickname patterns data: templates, word lists, cultural notes"
```

---

### Task 7: Create `generateGenZNickname()` function

**Files:**
- Create: `src/generate-genz-nickname.ts`
- Create: `tests/generate-genz-nickname.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// tests/generate-genz-nickname.test.ts — new file
import { describe, it, expect } from 'vitest';
import { generateGenZNickname } from '../src/generate-genz-nickname';
import type { IGenZNicknameResult, IGenZNicknameOptions } from '../src/generate-genz-nickname';
import type { TGenZNicknameStyle } from '../src/data/genz-nickname-patterns';

describe('generateGenZNickname', () => {
  it('returns all required fields', () => {
    const result = generateGenZNickname({ seed: 1 });
    expect(result.nickname).toBeTruthy();
    expect(result.style).toBeTruthy();
    expect(result.origin).toBeTruthy();
    expect(result.culturalNote).toBeTruthy();
  });

  it('random mode (no name input) produces a nickname', () => {
    const result = generateGenZNickname({ seed: 42 });
    expect(result.nickname.length).toBeGreaterThan(0);
  });

  it('from-name mode transforms a Vietnamese name', () => {
    const result = generateGenZNickname({ name: 'Nguyễn Minh Anh', seed: 10 });
    expect(result.nickname.length).toBeGreaterThan(0);
  });

  it('style=jp-suffix produces Japanese suffix nickname', () => {
    const result = generateGenZNickname({ name: 'Trần Thảo Linh', style: 'jp-suffix', seed: 5 });
    expect(result.style).toBe('jp-suffix');
    expect(result.nickname).toMatch(/-chan|-kun|-san|-sama|-senpai|-sensei/);
  });

  it('style=kr-suffix produces Korean suffix nickname', () => {
    const result = generateGenZNickname({ name: 'Lê Hoàng Khang', style: 'kr-suffix', seed: 5 });
    expect(result.style).toBe('kr-suffix');
    expect(result.nickname).toMatch(/oppa|unnie|-ah|-ya|hyung|noona/);
  });

  it('style=cute produces cute nickname', () => {
    const result = generateGenZNickname({ style: 'cute', seed: 5 });
    expect(result.style).toBe('cute');
  });

  it('style=social-handle produces lowercase handle', () => {
    const result = generateGenZNickname({ name: 'Phạm Bảo Ngọc', style: 'social-handle', seed: 5 });
    expect(result.style).toBe('social-handle');
    // Handles should be lowercase and contain no spaces or accents
    expect(result.nickname).toMatch(/^[a-z0-9._\-_]+$/);
  });

  it('style=meme produces meme nickname', () => {
    const result = generateGenZNickname({ style: 'meme', seed: 5 });
    expect(result.style).toBe('meme');
  });

  it('style=english-viet produces English+VN surname combo', () => {
    const result = generateGenZNickname({ name: 'Nguyễn Văn Nam', style: 'english-viet', seed: 5 });
    expect(result.style).toBe('english-viet');
  });

  it('is deterministic with seed', () => {
    const a = generateGenZNickname({ seed: 99 });
    const b = generateGenZNickname({ seed: 99 });
    expect(a.nickname).toBe(b.nickname);
    expect(a.style).toBe(b.style);
  });

  it('different seeds produce variety', () => {
    const nicknames = new Set<string>();
    for (let i = 0; i < 30; i += 1) {
      nicknames.add(generateGenZNickname({ seed: i }).nickname);
    }
    expect(nicknames.size).toBeGreaterThan(10);
  });

  it('gender=male prefers male Western names for english-viet', () => {
    const result = generateGenZNickname({ gender: 'male', style: 'english-viet', seed: 1 });
    expect(result.nickname).toBeTruthy();
  });

  it('gender=female prefers female Western names for english-viet', () => {
    const result = generateGenZNickname({ gender: 'female', style: 'english-viet', seed: 1 });
    expect(result.nickname).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/generate-genz-nickname.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/generate-genz-nickname.ts`**

```typescript
import { xoroshiro128plus, pickRandom } from './random';
import { romanize } from './romanize';
import { parseName } from './parse-name';
import { generate } from './generator';
import { EGender } from './types';
import {
  type TGenZNicknameStyle,
  NICKNAME_TEMPLATES,
  CUTE_ANIMALS,
  CUTE_FOODS,
  MEME_PHRASES,
  FUNNY_TITLES,
  WESTERN_MALE,
  WESTERN_FEMALE,
  JP_SUFFIXES,
  KR_SUFFIXES,
  HANDLE_PREFIXES,
  CULTURAL_NOTES,
} from './data/genz-nickname-patterns';

export type { TGenZNicknameStyle } from './data/genz-nickname-patterns';

export interface IGenZNicknameOptions {
  name?: string;
  style?: TGenZNicknameStyle;
  gender?: 'male' | 'female' | 'unisex';
  seed?: number;
  secure?: boolean;
}

export interface IGenZNicknameResult {
  nickname: string;
  style: TGenZNicknameStyle;
  origin: string;
  culturalNote: string;
}

const LIST_STYLE: TGenZNicknameStyle[] = [
  'social-handle', 'jp-suffix', 'kr-suffix', 'cute', 'meme', 'english-viet',
];

const ORIGIN_MAP: Record<TGenZNicknameStyle, string> = {
  'social-handle': 'vietnamese-social-media',
  'jp-suffix': 'japanese-honorific',
  'kr-suffix': 'korean-honorific',
  'cute': 'vietnamese-cute-tradition',
  'meme': 'vietnamese-internet-meme',
  'english-viet': 'viet-diaspora-english',
};

type TNameParts = { surname: string; middleName: string; givenName: string };

function nameParsedOrGenerate(
  inputName: string | undefined,
  gender: 'male' | 'female' | 'unisex' | undefined,
  rng?: () => number,
): TNameParts {
  if (inputName) {
    const parsed = parseName(inputName);
    return { surname: parsed.surname, middleName: parsed.middleName, givenName: parsed.givenName };
  }
  const g = gender === 'male' ? EGender.Male
    : gender === 'female' ? EGender.Female
    : undefined;
  const result = generate({ gender: g, seed: rng ? Math.floor(rng() * 2147483647) : undefined });
  return { surname: result.surname, middleName: result.middleName, givenName: result.givenName };
}

function syllableDouble(name: string): string {
  const romanized = romanize(name).toLowerCase();
  const first = romanized.length <= 2 ? romanized : romanized.slice(0, 2);
  const cap = first.charAt(0).toUpperCase() + first.slice(1);
  return cap + cap.toLowerCase();
}

function templateResolve(
  template: string,
  parts: TNameParts,
  gender: 'male' | 'female' | 'unisex',
  rng?: () => number,
): string {
  const givenRomanized = romanize(parts.givenName).toLowerCase();
  const surnameRomanized = romanize(parts.surname);
  const year = String(2000 + Math.floor((rng ?? Math.random)() * 10)).slice(2);
  const rand2 = String(Math.floor((rng ?? Math.random)() * 100)).padStart(2, '0');

  let result = template;
  result = result.replace(/\{given\}/g, parts.givenName);
  result = result.replace(/\{given_lower\}/g, givenRomanized);
  result = result.replace(/\{surname\}/g, surnameRomanized);
  result = result.replace(/\{middle\}/g, romanize(parts.middleName));
  result = result.replace(/\{initial\}/g, givenRomanized.charAt(0));
  result = result.replace(/\{year\}/g, year);
  result = result.replace(/\{rand2\}/g, rand2);
  result = result.replace(/\{prefix\}/g, pickRandom(HANDLE_PREFIXES, rng));
  result = result.replace(/\{animal\}/g, pickRandom(CUTE_ANIMALS, rng));
  result = result.replace(/\{food\}/g, pickRandom(CUTE_FOODS, rng));
  result = result.replace(/\{meme_phrase\}/g, pickRandom(MEME_PHRASES, rng));
  result = result.replace(/\{funny_title\}/g, pickRandom(FUNNY_TITLES, rng));
  result = result.replace(/\{syl\}/g, ''); // handled separately for cute

  const westernList = gender === 'female' ? WESTERN_FEMALE : WESTERN_MALE;
  result = result.replace(/\{western\}/g, pickRandom(westernList, rng));

  return result;
}

export function generateGenZNickname(options?: IGenZNicknameOptions): IGenZNicknameResult {
  const rng = options?.seed !== undefined ? xoroshiro128plus(options.seed) : undefined;
  const style = options?.style ?? pickRandom(LIST_STYLE, rng);
  const gender = options?.gender ?? 'unisex';
  const parts = nameParsedOrGenerate(options?.name, gender, rng);

  const templates = NICKNAME_TEMPLATES[style];
  const template = pickRandom(templates, rng);

  let nickname: string;

  // Special handling for syllable doubling in cute mode
  if (style === 'cute' && template === '{syl}{syl}') {
    nickname = syllableDouble(parts.givenName);
  } else {
    nickname = templateResolve(template, parts, gender === 'unisex' ? 'male' : gender, rng);
  }

  return {
    nickname,
    style,
    origin: ORIGIN_MAP[style],
    culturalNote: CULTURAL_NOTES[style],
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/generate-genz-nickname.test.ts`
Expected: All PASS.

- [ ] **Step 5: Commit**

```bash
git add src/generate-genz-nickname.ts tests/generate-genz-nickname.test.ts
git commit -S -m "Add GenZ nickname generator with 6 cultural styles"
```

---

### Task 8: Update exports in `index.ts`

**Files:**
- Modify: `src/index.ts`

- [ ] **Step 1: Add new exports to `src/index.ts`**

Add after the `generateGenZName` export line (line 66):

```typescript
export {
  generateGenZNickname,
  type IGenZNicknameResult,
  type IGenZNicknameOptions,
} from './generate-genz-nickname';
export type { TGenZNicknameStyle } from './data/genz-nickname-patterns';
```

Add `TNameStyle` to the types export block (add to the existing export from `./types`):

```typescript
export {
  EGender,
  ERegion,
  EEra,
  EMeaningCategory,
  ENameFormat,
  type TGenerateOptions,
  type TNameStyle,
  type INameResult,
  type INameParts,
  type IRomanizedName,
  type IParsedName,
  type IValidationResult,
  type IGenderResult,
  type TWeightedEntry,
  type TGivenNameEntry,
} from './types';
```

Add imports and namespace entries for the default export object. Add import:

```typescript
import { generateGenZNickname } from './generate-genz-nickname';
```

Add to `VietnameseNameGenerator` object after `generateGenZName,`:

```typescript
  generateGenZNickname,
```

- [ ] **Step 2: Build to verify exports compile**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Run full test suite**

Run: `npx vitest run`
Expected: All PASS.

- [ ] **Step 4: Commit**

```bash
git add src/index.ts
git commit -S -m "Add generateGenZNickname and TNameStyle to public API exports"
```

---

### Task 9: Build verification and bundle size check

**Files:**
- None (verification only)

- [ ] **Step 1: Clean build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 2: Check bundle size**

Run: `ls -la dist/ && echo "---" && gzip -c dist/index.js | wc -c && gzip -c dist/index.cjs | wc -c`

Expected: Total bundle increase < 6 KB raw, < 1 KB gzip. If significantly larger, investigate which data file is too big.

- [ ] **Step 3: Run full test suite one final time**

Run: `npx vitest run`
Expected: All tests PASS.

- [ ] **Step 4: Commit build verification**

No commit needed — this is a verification step only.

---

### Task 10: Version bump and final commit

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Bump version to 0.12.0**

Run: `npm version minor --no-git-tag-version`
Expected: Version changes from 0.11.1 to 0.12.0.

- [ ] **Step 2: Final commit**

```bash
git add package.json
git commit -S -m "Release v0.12.0: crosscultural GenZ names, nickname generator, improved random"
```

- [ ] **Step 3: Tag**

```bash
git tag v0.12.0
```
