# vietnamese-name-generator

Generate realistic Vietnamese names with gender, region, era, and meaning filtering.

[![npm version](https://img.shields.io/npm/v/vietnamese-name-generator)](https://www.npmjs.com/package/vietnamese-name-generator)
[![license](https://img.shields.io/npm/l/vietnamese-name-generator)](./LICENSE)

## Install

```bash
npm install vietnamese-name-generator
```

## Quick Start

```typescript
import {
  generate,
  generateMany,
  generateFullName,
  generateManyFullNames,
  EGender,
  ERegion,
  EEra,
} from "vietnamese-name-generator";

// Generate a single name result
const name = generate();
console.log(name.fullName); // e.g. "Nguyễn Thị Lan"

// Generate with options
const maleName = generate({ gender: EGender.Male, region: ERegion.North });
console.log(maleName.fullName); // e.g. "Trần Văn Minh"

// Generate just the full name string
const fullName = generateFullName({ era: EEra.Modern, compoundName: true });
console.log(fullName); // e.g. "Lê Thị Bảo Châu"

// Generate a batch of 5 unique full name strings
const names = generateManyFullNames(5, { gender: EGender.Female });
console.log(names); // ["Phạm Thị Hoa", "Võ Thị Mai", ...]
```

## API Reference

### `generate(options?): INameResult`

Generates a single name. Returns a full `INameResult` object with all name components and metadata.

### `generateMany(count, options?): INameResult[]`

Generates `count` unique names. Returns an array of `INameResult` objects.

### `generateFullName(options?): string`

Generates a single name and returns only the full name string.

### `generateManyFullNames(count, options?): string[]`

Generates `count` unique full name strings.

---

### `TGenerateOptions`

| Option            | Type               | Default | Description                                  |
| ----------------- | ------------------ | ------- | -------------------------------------------- |
| `gender`          | `EGender`          | random  | Filter by gender                             |
| `region`          | `ERegion`          | random  | Filter by regional variant                   |
| `era`             | `EEra`             | random  | Filter by naming era (traditional or modern) |
| `compoundName`    | `boolean`          | random  | Generate a compound given name (tên kép)     |
| `meaningCategory` | `EMeaningCategory` | any     | Filter given names by semantic category      |
| `withMiddleName`  | `boolean`          | `true`  | Include a middle name                        |

### `INameResult`

```typescript
interface INameResult {
  surname: string;
  middleName: string;
  givenName: string;
  fullName: string;
  gender: EGender;
  region: ERegion;
  era: EEra;
}
```

## Enums

### `EGender`

| Value    | Description  |
| -------- | ------------ |
| `male`   | Male names   |
| `female` | Female names |
| `unisex` | Unisex names |

### `ERegion`

| Value     | Description                       |
| --------- | --------------------------------- |
| `north`   | Northern Vietnam (e.g. Hoàng, Vũ) |
| `central` | Central Vietnam                   |
| `south`   | Southern Vietnam (e.g. Huỳnh, Võ) |

### `EEra`

| Value         | Description                     |
| ------------- | ------------------------------- |
| `traditional` | Classical Sino-Vietnamese names |
| `modern`      | Contemporary Vietnamese names   |

### `EMeaningCategory`

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

## Features

- Zero runtime dependencies
- Weighted surname distribution matching Vietnamese census data
- Regional variants (Hoàng/Huỳnh, Vũ/Võ)
- Traditional and modern naming patterns
- Compound given names (tên kép)
- Meaning-based filtering across 9 semantic categories
- Batch generation with uniqueness guarantee
- CJS + ESM + TypeScript declarations

## Data Sources

- [duyet/vietnamese-namedb](https://github.com/duyet/vietnamese-namedb) — MIT
- [faker-js/faker](https://github.com/faker-js/faker) vi locale — MIT
- [Wiktionary Vietnamese Names](https://en.wiktionary.org/wiki/Appendix:Vietnamese_given_names) — CC BY-SA
- [Wikipedia: Vietnamese Name](https://en.wikipedia.org/wiki/Vietnamese_name) — CC BY-SA
- [surnam.es/vietnam](https://surnam.es/vietnam) — surname frequency data
- [Dr.Papie](https://drpapie.com.vn) — naming meaning references

## License

MIT
