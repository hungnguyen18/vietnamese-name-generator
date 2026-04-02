# vietnamese-name-generator

[![npm version](https://img.shields.io/npm/v/vietnamese-name-generator)](https://www.npmjs.com/package/vietnamese-name-generator)
[![npm downloads](https://img.shields.io/npm/dm/vietnamese-name-generator)](https://www.npmjs.com/package/vietnamese-name-generator)
[![CI](https://github.com/hungnguyen18/vietnamese-name-generator/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/hungnguyen18/vietnamese-name-generator/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/hungnguyen18/vietnamese-name-generator)](./LICENSE)

The most comprehensive Vietnamese name toolkit for JavaScript/TypeScript. Generate, parse, validate, format, and analyze Vietnamese names with full cultural awareness.

Zero runtime dependencies. Ships as CJS + ESM with full TypeScript declarations.

## Why this library?

- **No npm alternative** for Vietnamese name parsing, gender detection, or validation
- **Census-weighted** surname distribution (Nguyen 40%, Tran 11%, Le 9%...)
- **Culturally correct** — regional variants (Hoang/Huynh), gender-encoded middle names, proper honorifics
- **i18n-ready** — NFC normalization, accent-insensitive search, Vietnamese sort order
- **AI/testing-friendly** — deterministic seed, batch generation, CSV/JSON export

## Installation

```bash
npm install vietnamese-name-generator
```

Also works with pnpm, yarn, and bun.

## Quick Start

```typescript
import {
  generate,
  parseName,
  detectGender,
  salutation,
  romanize,
} from 'vietnamese-name-generator';

// Generate a realistic Vietnamese name
const name = generate({ seed: 42 });
// { surname: 'Phan', middleName: 'Ngoc', givenName: 'Kim Trang',
//   fullName: 'Phan Ngoc Kim Trang', gender: 'female', region: 'central',
//   era: 'modern', romanized: {...}, formatted: {...} }

// Parse any Vietnamese name into structured parts
parseName('Nguyen Van An');
// { surname: 'Nguyen', middleName: 'Van', givenName: 'An' }

// Detect gender from name
detectGender('Nguyen Thi Mai');
// { gender: 'female', confidence: 'high', signals: { middleName: { gender: 'female', value: 'Thi' } } }

// Generate culturally correct salutation
salutation('Nguyen Van Nam', { formality: 'formal' });
// { honorific: 'Ong', addressName: 'Nam', fullSalutation: 'Kinh gui Ong Nam' }

// Romanize (remove diacritics)
romanize('Nguyen Van An');
// 'Nguyen Van An'
```

## CLI

```bash
# Generate names
npx vietnamese-name-generator --count 10 --gender female --region south
npx vietnamese-name-generator --seed 42 --format slug --json

# Parse, validate, detect
npx vietnamese-name-generator --parse "Nguyen Van An"
npx vietnamese-name-generator --validate "Nguyen Van An"
npx vietnamese-name-generator --detect "Nguyen Thi Mai"

# Export batch data
npx vietnamese-name-generator --export csv --count 100 --seed 42
npx vietnamese-name-generator --export json --count 50
```

## API Reference

### Generation

| Function | Returns | Description |
|----------|---------|-------------|
| `generate(options?)` | `INameResult` | Single name with full metadata |
| `generateMany(count, options?)` | `INameResult[]` | Batch unique names |
| `generateFullName(options?)` | `string` | Single full name string |
| `generateManyFullNames(count, options?)` | `string[]` | Batch full name strings |
| `generateEmail(options?)` | `IEmailResult` | Email from generated name |
| `generateUsername(options?)` | `IUsernameResult` | Username from generated name |

#### Options

```typescript
type TGenerateOptions = {
  gender?: EGender;          // 'male' | 'female' | 'unisex'
  region?: ERegion;          // 'north' | 'central' | 'south'
  era?: EEra;                // 'traditional' | 'modern'
  compoundName?: boolean;    // two-syllable given name
  meaningCategory?: EMeaningCategory;  // 9 semantic categories
  withMiddleName?: boolean;  // default: true
  seed?: number;             // deterministic output
  format?: ENameFormat | ENameFormat[];  // output formats
};
```

#### Result

```typescript
interface INameResult {
  surname: string;
  middleName: string;
  givenName: string;
  fullName: string;
  gender: EGender;
  region: ERegion;
  era: EEra;
  romanized: IRomanizedName;   // ASCII versions of all parts
  formatted: Partial<Record<ENameFormat, string>>;  // requested formats
}
```

### Parsing & Validation

| Function | Returns | Description |
|----------|---------|-------------|
| `parseName(input)` | `IParsedName` | Split full name into surname/middle/given |
| `validateName(input)` | `IValidationResult` | Check if string is a valid Vietnamese name |
| `detectGender(input)` | `IGenderResult` | Infer gender from middle + given name signals |

```typescript
// Parse — handles compound surnames (Ton That), romanized input (Nguyen)
parseName('Ton That Minh An');
// { surname: 'Ton That', middleName: 'Minh', givenName: 'An' }

// Validate — returns specific failure reasons
validateName('xyz van an');
// { valid: false, reasons: ['Each part must start with uppercase', 'Unknown surname: xyz'] }

// Detect gender — confidence levels based on signal strength
detectGender('Tran Van An');
// { gender: 'male', confidence: 'high', signals: { middleName: { gender: 'male', value: 'Van' } } }
```

### Formatting & i18n

| Function | Returns | Description |
|----------|---------|-------------|
| `romanize(input)` | `string` | Remove Vietnamese diacritics |
| `formatName(parts, format)` | `string` | Format name as full/abbreviated/reversed/slug |
| `salutation(name, options?)` | `ISalutationResult` | Culturally correct Vietnamese honorific |
| `normalize(input)` | `string` | NFC Unicode normalization |
| `accentInsensitiveMatch(text, query)` | `boolean` | Search ignoring diacritics |
| `accentInsensitiveEqual(a, b)` | `boolean` | Compare ignoring diacritics |
| `sortVietnamese(names, options?)` | `string[]` | Sort by given name (Vietnamese convention) |
| `vietnameseNameComparator(options?)` | `Function` | Comparator for `Array.sort()` |
| `VIETNAMESE_NAME_REGEX` | `RegExp` | Validates Vietnamese characters |

```typescript
// Format — 4 built-in formats, request multiple at once
generate({ format: ['full', 'slug', 'abbreviated'] });
// result.formatted = { full: 'Nguyen Van An', slug: 'nguyen-van-an', abbreviated: 'N.V. An' }

// Salutation — "Ong Nam" not "Mr. Nguyen"
salutation('Nguyen Van Nam', { formality: 'formal' });
// { honorific: 'Ong', addressName: 'Nam', fullSalutation: 'Kinh gui Ong Nam' }

// Accent-insensitive search
accentInsensitiveMatch('Nguyen Van An', 'nguyen');  // true

// Sort by given name (Vietnamese convention)
sortVietnamese(['Tran Thi Binh', 'Nguyen Van An']);
// ['Nguyen Van An', 'Tran Thi Binh']  (An < Binh)
```

### Data & Lookup

| Function | Returns | Description |
|----------|---------|-------------|
| `getMeaning(name)` | `INameMeaning` | Meaning category, gender/region/era distribution |
| `getSurnameInfo(surname)` | `ISurnameInfo` | Frequency, rank, regional variants |
| `getRegionalVariant(surname, region)` | `string` | Convert Hoang<->Huynh, Vu<->Vo |
| `nameSimilarity(name1, name2)` | `ISimilarityResult` | Compare names accounting for diacritics/variants |
| `getStatistics()` | `IStatisticsResult` | Dataset overview counts |
| `getTopSurnames(options?)` | `IRankedName[]` | Top N surnames by frequency |
| `getGivenNameCount(options?)` | `number` | Count given names by gender/region/era |
| `getUniqueGivenNames(options?)` | `string[]` | List unique given names |

```typescript
// Name meaning
getMeaning('Hung');
// { found: true, category: 'strength', genders: ['male'], regions: ['north','central','south'], ... }

// Surname info
getSurnameInfo('Nguyen');
// { found: true, frequency: { north: 31.5, central: 30.2, south: 28.5 }, rank: { north: 1, ... } }

// Regional variant
getRegionalVariant('Hoang', 'south');  // 'Huynh'
getRegionalVariant('Vo', 'north');     // 'Vu'

// Name similarity (handles diacritics, variants)
nameSimilarity('Nguyen Van An', 'Nguyen Van An');
// { score: 0.9, romanizedMatch: true, ... }
```

### Faker.js Compatible

```typescript
import { fakerVi } from 'vietnamese-name-generator';

fakerVi.person.firstName();          // 'An'
fakerVi.person.lastName();           // 'Nguyen'
fakerVi.person.fullName();           // 'Nguyen Van An'
fakerVi.person.sex();                // 'male'
fakerVi.person.prefix('female');     // 'Ba'
fakerVi.internet.email();            // 'an.nguyen@gmail.com'
fakerVi.internet.username();         // 'annguyen'
```

### Enums

| Enum | Values |
|------|--------|
| `EGender` | `male`, `female`, `unisex` |
| `ERegion` | `north`, `central`, `south` |
| `EEra` | `traditional`, `modern` |
| `EMeaningCategory` | `strength`, `virtue`, `nature`, `precious`, `beauty`, `celestial`, `season`, `intellect`, `prosperity` |
| `ENameFormat` | `full`, `abbreviated`, `reversed`, `slug` |

## Data Sources

Names are collected from 6 web sources via an automated crawl pipeline:

- [duyet/vietnamese-namedb](https://github.com/duyet/vietnamese-namedb) (GitHub)
- faker-vi (Vietnamese faker library)
- Wiktionary Vietnamese entries
- Wikipedia Vietnamese surname pages
- [surnam.es](https://surnam.es) genealogy database
- DrPapie Vietnamese name database

Surnames are weighted by census frequency. Given names are tagged by gender, region, era, and meaning category.

## Vietnamese Naming Context

Vietnamese names are written **surname - middle name - given name** (reverse of Western order). In daily life, people are addressed by their **given name**, not surname.

**Surname concentration is extreme.** About 40% of Vietnamese carry the surname Nguyen. The top 14 surnames cover 90%+ of the population.

**The middle name encodes gender.** Van marks male, Thi marks female (traditional). Modern names use varied middle names like Minh, Bao, Ngoc.

**Region determines surname form.** Hoang (North) = Huynh (South). Vu (North) = Vo (South).

**Every given name carries meaning.** Lan = orchid, Ha = river, Minh = bright, Phuc = blessing, Nguyet = moon.

## License

MIT
