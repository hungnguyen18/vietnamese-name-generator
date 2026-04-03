# GenZ Data Expansion + Nickname Generator + Random Algorithm Improvements

> Spec date: 2026-04-03
> Status: Approved

---

## 1. Overview

Expand the Vietnamese name generator with:
1. Cross-cultural GenZ naming data (Japanese, Korean, Western, Hybrid influences)
2. GenZ nickname/handle generator with social media patterns
3. Random algorithm improvements (speed, quality, security)

All changes integrate into the existing `generate()` API via a new `style` option. No new top-level API for name generation.

---

## 2. API Changes

### 2.1 New `style` option on `TGenerateOptions`

```typescript
export type TNameStyle = 'japanese' | 'korean' | 'western' | 'hybrid';

export type TGenerateOptions = {
  gender?: EGender;
  region?: ERegion;
  era?: EEra;
  compoundName?: boolean;
  meaningCategory?: EMeaningCategory;
  withMiddleName?: boolean;
  seed?: number;
  format?: ENameFormat | ENameFormat[];
  style?: TNameStyle;   // NEW
  secure?: boolean;     // NEW — use crypto.getRandomValues()
};
```

When `style` is set:
- `era` is forced to `EEra.Modern` (cross-cultural names are modern by nature)
- Given name picked from GenZ crosscultural data filtered by `style` + `gender`
- Middle name picked from GenZ middle names
- Surname uses existing `INDEX_SURNAME` (weighted by region)
- Return type is still `INameResult` — no new types needed

When `style` is not set:
- Zero behavior change. Existing code path untouched.

### 2.2 Deprecate `generateGenZName()`

```typescript
/** @deprecated Use generate({ style: 'japanese' | 'korean' | 'western' | 'hybrid' }) */
export function generateGenZName(options?: IGenZOptions): IGenZResult {
  // Thin wrapper calling generate() + mapping result to IGenZResult shape
}
```

Keep for backward compatibility. Remove in next major version.

### 2.3 New `generateGenZNickname()`

```typescript
export type TGenZNicknameStyle =
  | 'social-handle'   // minh.2003, linh_chan99, dreamylinh
  | 'jp-suffix'       // Linh-chan, Minh-kun, Crush-sama
  | 'kr-suffix'       // Minh oppa, Linh-ah, maknae
  | 'cute'            // Be An, Mimi, Gau, Xoai
  | 'meme'            // Kevin Nguyen, Pho Mai Que
  | 'english-viet';   // Jenny Pham, Ryan Tran

export interface IGenZNicknameOptions {
  name?: string;                // Input VN name — if omitted, generate random
  style?: TGenZNicknameStyle;   // Random if not specified
  gender?: 'male' | 'female' | 'unisex';
  seed?: number;
  secure?: boolean;
}

export interface IGenZNicknameResult {
  nickname: string;
  style: TGenZNicknameStyle;
  origin: string;              // e.g. "japanese-suffix", "korean-honorific"
  culturalNote: string;
}
```

---

## 3. Data Design

### 3.1 GenZ crosscultural names — compact pipe-delimited format

File: `src/data/genz-names.ts` (expand existing)

Format per entry: `"name|origin|script|meaning|vietnamized|popularity"`
- origin: `j`=japanese, `k`=korean, `w`=western, `v`=vietnamese, `h`=hybrid
- popularity: 1-10 scale
- script: native script (kanji/hangul) or empty
- vietnamized: Vietnamese phonetic adaptation or empty if already fits

```typescript
// Compact dictionary — parsed lazily, cached after first access
const GENZ_DICT_MALE = "Ren|j|蓮|lotus|Ren|9,Haruto|j|大翔|great soaring|Ha-ru-to|8,...";
const GENZ_DICT_FEMALE = "Sakura|j|桜|cherry blossom|Sa-ku-ra|9,Hana|j|花|flower|Ha-na|10,...";
const GENZ_DICT_UNISEX = "Kai|j|海|sea|Kai|8,An|h||peace|An|10,...";
```

Indexed by `[gender]` only (no region/era indexing — GenZ names are region-agnostic).
Style filtering done at runtime from the `origin` field.
`hybrid` maps to entries that work in both VN and foreign contexts.

Target: **20-30 entries per gender per origin** = ~300-400 entries total.

Estimated size: **3-4 KB** (pipe-delimited compresses well).

### 3.2 Nickname patterns — template-based

File: `src/data/genz-nickname-patterns.ts` (new)

```typescript
// Templates use {surname}, {middle}, {given}, {initial} placeholders
// Small word lists for prefixes/suffixes

export const NICKNAME_TEMPLATES: Record<TGenZNicknameStyle, string[]> = {
  'social-handle': [
    '{given_lower}.{year}',
    '{given_lower}_{given_lower}{rand2}',
    '_{given_lower}_',
    '{given_lower}.official',
    'dreamy{given_lower}',
    'soft{given_lower}',
    'baby.{given_lower}',
    'itz.{given_lower}',
  ],
  'jp-suffix': ['{given}-chan', '{given}-kun', '{given}-san', '{given}-sama', '{given}-senpai'],
  'kr-suffix': ['{given} oppa', '{given} unnie', '{given}-ah', '{given}-ya'],
  'cute': ['Be {given}', '{syl}{syl}', '{animal}', '{food}', 'Mini {given}', 'Mochi {given}'],
  'meme': ['{western_name} {surname}', '{food_meme}', '{funny_title}'],
  'english-viet': ['{western_name} {surname}', '{western_name} {middle} {surname}'],
};

// Small word lists (~0.5 KB each)
export const CUTE_ANIMALS = ['Gau', 'Cun', 'Miu', 'Tho', 'Soc', 'Nhim', 'Nai', 'Heo', 'Nemo', 'Panda'];
export const CUTE_FOODS = ['Xoai', 'Mit', 'Dau', 'Cherry', 'Kem', 'Bap', 'Keo', 'Na', 'Chanh', 'Tao', 'Matcha'];
export const MEME_FOODS = ['Pho Mai Que', 'Cong Chua Hot Vit Lon', 'Hoang Tu Banh Trang Tron', 'Banh Beo Ngo Ngac'];
export const FUNNY_TITLES = ['Thanh Bua', 'Giao Su Cuoi', 'Shipper Khong Ten', 'Boss Dai Nhan', 'Bad Boy Co Gu'];
export const WESTERN_MALE = ['Kevin', 'Ryan', 'Leo', 'Max', 'Daniel', 'Alex', 'Jack', 'Tony', 'Danny', 'Andy'];
export const WESTERN_FEMALE = ['Jenny', 'Emma', 'Mia', 'Lisa', 'Luna', 'Bella', 'Amy', 'Sunny', 'Rosie', 'Anna'];
```

Estimated size: **1-2 KB**.

### 3.3 Bundle impact

| Component | Size |
|-----------|------|
| GenZ crosscultural dict | +3-4 KB |
| Nickname patterns + word lists | +1-2 KB |
| Random algo improvements | +0.5 KB |
| Remove GenZ duplicate code | -1 KB |
| **Net increase** | **+3.5-5.5 KB** |

Current total: 492 KB → ~497 KB (+1%). Gzip: ~35 KB → ~35.5 KB.

---

## 4. Random Algorithm Improvements

### 4.1 Replace `pickWeighted()` — Vose's Alias Method

**Current**: O(n) linear scan per pick. 241 surnames = ~120 iterations avg.

**New**: O(1) per pick after O(n) preprocessing.

```
Algorithm:
1. Build phase (once per dataset):
   - Normalize weights to sum = n
   - Create probability[n] and alias[n] arrays
   - Use two-stack method: small items (< 1.0) and large items (>= 1.0)
   - Pair each small item with a large item to fill the alias table
2. Pick phase (per call):
   - Roll random index i in [0, n)
   - Roll random float u in [0, 1)
   - If u < probability[i]: return item[i]
   - Else: return item[alias[i]]
```

- **Preprocessing**: O(n) time, O(n) space — computed lazily on first call, cached
- **Per pick**: O(1) — 1 random index + 1 random float + 1 comparison + 1 lookup
- **generateMany(1000)**: ~120K iterations → ~2K operations (60x faster)
- **Cache invalidation**: Not needed — surname data is static

### 4.2 Replace `mulberry32` — xoroshiro128+

**Current**: mulberry32, 32-bit state, period ~4.2×10⁹

**New**: xoroshiro128+, 128-bit state, period ~3.4×10³⁸

```
Algorithm:
1. State: two 64-bit values (s0, s1) — stored as pairs of 32-bit ints for JS
2. Per step:
   - result = s0 + s1
   - s1 ^= s0
   - s0 = rotl(s0, 24) ^ s1 ^ (s1 << 16)
   - s1 = rotl(s1, 37)
3. Seed: splitmix64 to derive s0, s1 from single seed number
```

- Passes BigCrush statistical test suite (mulberry32 does not)
- Same speed class (~6 ops vs ~4 ops — negligible difference)
- Much longer period prevents any repeat in practice
- Better bit distribution across all output bits
- **Backward compat**: `mulberry32` kept as internal fallback; `seed` option uses xoroshiro128+

### 4.3 Crypto-grade secure mode

When `secure: true` is set and no `seed` is provided:

```
- Use crypto.getRandomValues(new Uint32Array(1))[0] / 2**32
- Available in Node.js (crypto module) and browsers (Web Crypto API)
- Unpredictable output from OS entropy pool
- ~3x slower than PRNG — acceptable for single calls, not recommended for generateMany(10000)
```

Runtime detection: check for `globalThis.crypto?.getRandomValues`, fallback to xoroshiro128+ if unavailable.

### 4.4 Fix modulo bias in `pickRandom()`

**Current**: `floor(rand() * len)` — slight bias when len doesn't evenly divide 2³².

**Fix**: Rejection sampling.

```
function pickRandom(list, rng):
  threshold = floor(MAX / len) * len
  do:
    raw = rng() * MAX
  while raw >= threshold
  return list[floor(raw) % len]
```

In practice, rejection happens < 0.01% of calls. Zero performance impact.

### 4.5 Fisher-Yates for `generateMany()` batch uniqueness

**Current**: Generate + check set + retry on collision. Worst case: many retries when pool is small.

**New**: For batch generation, pre-shuffle available combinations and take first N.

```
If requested count > 50% of possible combinations:
  1. Enumerate all possible (surname, middle, given) tuples
  2. Fisher-Yates partial shuffle: shuffle only first `count` positions
  3. Take first `count` items
  Time: O(count) instead of O(count * retries)
```

For small counts relative to pool size: keep current approach (faster than enumeration).

---

## 5. Refactoring

### 5.1 Merge GenZ into `generate()`

In `generator.ts`:
- `givenNamePick()` gets new branch: if `style` is set, pick from GenZ crosscultural dict
- Middle name selection: if `style` is set, use GenZ middle names
- Everything else (surname, romanize, format) stays the same

### 5.2 Deprecate `generateGenZName()`

Keep as thin wrapper for backward compat. Mark `@deprecated`. Remove in next major.

### 5.3 File changes

| File | Action |
|------|--------|
| `src/random.ts` | Rewrite: xoroshiro128+, alias method, rejection sampling, Fisher-Yates, secure mode |
| `src/types.ts` | Add `TNameStyle`, `secure` option |
| `src/generator.ts` | Add `style` branch in `givenNamePick()` + `optionResolve()` |
| `src/data/genz-names.ts` | Expand: add JP/KR/EN/hybrid entries with compact encoding |
| `src/data/genz-nickname-patterns.ts` | New: template patterns + word lists |
| `src/generate-genz-nickname.ts` | New: nickname generator function |
| `src/generate-genz.ts` | Deprecate: thin wrapper around `generate()` |
| `src/index.ts` | Add new exports |
| `tests/` | New + updated tests |

---

## 6. Research Sources

Data sourced from crawled Vietnamese parenting sites (Huggies.com.vn, Kilala.vn, Colosmulti.com.vn), cultural analysis (Vietcetera, Vice), Korean naming rankings (korean-name.com), Japanese naming rankings (Kilala.vn), and Vietnamese social media patterns (Kenh14, Phong Vu, Saymee, 24hstore). Full source list in research agent outputs.
