# vietnamese-name-generator

[![npm version](https://img.shields.io/npm/v/vietnamese-name-generator)](https://www.npmjs.com/package/vietnamese-name-generator)
[![npm downloads](https://img.shields.io/npm/dm/vietnamese-name-generator)](https://www.npmjs.com/package/vietnamese-name-generator)
[![CI](https://github.com/hungnguyen18/vietnamese-name-generator/actions/workflows/ci.yml/badge.svg)](https://github.com/hungnguyen18/vietnamese-name-generator/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/vietnamese-name-generator)](./LICENSE)

Generate realistic Vietnamese names with gender, region, era, and meaning filtering.

Surnames are weighted by census frequency. Regional dialects are respected (Hoàng/Huỳnh, Vũ/Võ). Names carry real semantic meaning across 9 categories. Zero runtime dependencies. Ships as CJS + ESM with full TypeScript declarations.

## Installation

**npm**

```bash
npm install vietnamese-name-generator
```

**pnpm**

```bash
pnpm add vietnamese-name-generator
```

**yarn**

```bash
yarn add vietnamese-name-generator
```

**bun**

```bash
bun add vietnamese-name-generator
```

## Usage

```typescript
import {
  generate,
  generateMany,
  generateFullName,
  generateManyFullNames,
  EGender,
  ERegion,
  EEra,
  EMeaningCategory,
} from "vietnamese-name-generator";

// Single name — full metadata
const name = generate();
console.log(name.fullName); // 'Nguyễn Thị Lan'
console.log(name.surname); // 'Nguyễn'
console.log(name.givenName); // 'Lan'

// Filter by gender and region
const north = generate({ gender: EGender.Male, region: ERegion.North });
console.log(north.fullName); // 'Hoàng Văn Minh'  (not Huỳnh — North variant)

const south = generate({ gender: EGender.Male, region: ERegion.South });
console.log(south.fullName); // 'Huỳnh Văn Minh'  (not Hoàng — South variant)

// Modern compound name (tên kép)
const modern = generateFullName({ era: EEra.Modern, compoundName: true });
console.log(modern); // 'Lê Thị Bảo Châu'

// Filter by meaning
const nature = generateFullName({ meaningCategory: EMeaningCategory.Nature });
console.log(nature); // 'Trần Thị Hà'  (Hà = river)

// Batch generation — uniqueness guaranteed
const names = generateManyFullNames(5, { gender: EGender.Female });
// ['Phạm Thị Hoa', 'Võ Ngọc Mai', 'Đặng Thị Linh', ...]

// Full result objects in batch
const results = generateMany(3, { region: ERegion.South });
results.forEach((r) => console.log(r.fullName, r.era, r.gender));
```

## API

### Functions

| Function                                 | Returns         | Description                        |
| ---------------------------------------- | --------------- | ---------------------------------- |
| `generate(options?)`                     | `INameResult`   | Single name with full metadata     |
| `generateMany(count, options?)`          | `INameResult[]` | `count` unique names with metadata |
| `generateFullName(options?)`             | `string`        | Single full name string            |
| `generateManyFullNames(count, options?)` | `string[]`      | `count` unique full name strings   |

### Options

All functions accept an optional `TGenerateOptions`:

| Option            | Type               | Default | Description                       |
| ----------------- | ------------------ | ------- | --------------------------------- |
| `gender`          | `EGender`          | random  | `male`, `female`, or `unisex`     |
| `region`          | `ERegion`          | random  | `north`, `central`, or `south`    |
| `era`             | `EEra`             | random  | `traditional` or `modern`         |
| `compoundName`    | `boolean`          | random  | Two-syllable given name (tên kép) |
| `meaningCategory` | `EMeaningCategory` | any     | Filter by semantic category       |
| `withMiddleName`  | `boolean`          | `true`  | Include the middle name (đệm)     |

### Result

```typescript
interface INameResult {
  surname: string;
  middleName: string;
  givenName: string;
  fullName: string; // surname + middleName + givenName
  gender: EGender;
  region: ERegion;
  era: EEra;
}
```

### Enums

**`EGender`**

| Value    | Description  |
| -------- | ------------ |
| `male`   | Male names   |
| `female` | Female names |
| `unisex` | Unisex names |

**`ERegion`**

| Value     | Description                       |
| --------- | --------------------------------- |
| `north`   | Northern Vietnam (e.g. Hoàng, Vũ) |
| `central` | Central Vietnam                   |
| `south`   | Southern Vietnam (e.g. Huỳnh, Võ) |

**`EEra`**

| Value         | Description                     |
| ------------- | ------------------------------- |
| `traditional` | Classical Sino-Vietnamese names |
| `modern`      | Contemporary Vietnamese names   |

**`EMeaningCategory`**

| Value        | Description             |
| ------------ | ----------------------- |
| `strength`   | Power and fortitude     |
| `virtue`     | Moral excellence        |
| `nature`     | Natural world           |
| `precious`   | Gems and valuables      |
| `beauty`     | Aesthetic qualities     |
| `celestial`  | Sky, stars, cosmos      |
| `season`     | Seasons and weather     |
| `intellect`  | Wisdom and knowledge    |
| `prosperity` | Wealth and good fortune |

## Vietnamese Naming

Vietnamese names are written **surname → middle name → given name** — the reverse of Western order. In daily life, people are addressed by their given name only; using a full name is formal or distant.

**Surname concentration is extreme.** About 40% of Vietnamese people carry the surname Nguyễn — a direct consequence of mass surname assignments during dynastic census policies. The top 14 surnames cover over 90% of the population, which is why the middle name and given name are the true differentiators.

**The middle name (đệm) encodes gender.** Văn (文) has historically marked male names; Thị (氏) marks female names. Both are fading in modern usage but remain common. Other middle names like Hữu, Đức, Công (male) or Thùy, Ngọc, Kim (female) add meaning and style.

**Region determines which surname form you use.** The same Chinese character is read differently by dialect: Hoàng in the North becomes Huỳnh in the South; Vũ becomes Võ. Names are regionally self-consistent — a southern name will use Huỳnh, Võ, Trương, and so on throughout.

**Every given name carries meaning.** Vietnamese parents deliberately choose names for semantic content drawn from Sino-Vietnamese vocabulary: Lan (orchid), Hà (river), Minh (bright/intelligent), Phúc (blessing), Nguyệt (moon). This library's meaning filter maps directly to these categories.

**Compound names (tên kép) emerged as a workaround.** With so few surnames in circulation, two-syllable given names like Bảo Châu, Minh Khôi, or Thanh Hà became popular from the late 20th century onward — both for beauty and to reduce ambiguity.

**Imperial name taboos left lasting marks.** Under feudal dynasties, using the emperor's personal name (or a near-homophone) was forbidden — a practice called kỵ húy. Banned names became rare and some were respelled entirely, which partly explains unusual character choices still visible in the modern name pool.

## License

MIT
