# Getting Started

## Installation

::: code-group

```bash [npm]
npm install vietnamese-name-generator
```

```bash [pnpm]
pnpm add vietnamese-name-generator
```

```bash [yarn]
yarn add vietnamese-name-generator
```

```bash [bun]
bun add vietnamese-name-generator
```

:::

Zero runtime dependencies. Ships as CJS + ESM with full TypeScript declarations.

## Quick Start

### Generate a Vietnamese name

```typescript
import { generate } from 'vietnamese-name-generator';

const name = generate({ seed: 42 });
// {
//   surname: 'Phan',
//   middleName: 'Ngoc',
//   givenName: 'Kim Trang',
//   fullName: 'Phan Ngoc Kim Trang',
//   romanized: { ... },
//   gender: 'female',
//   region: 'south',
//   era: 'modern',
//   formatted: { ... },
// }
```

### Parse a name into parts

```typescript
import { parseName } from 'vietnamese-name-generator';

parseName('Nguyen Van An');
// { surname: 'Nguyen', middleName: 'Van', givenName: 'An', fullName: 'Nguyen Van An' }
```

### Detect gender

```typescript
import { detectGender } from 'vietnamese-name-generator';

detectGender('Nguyen Thi Mai');
// { gender: 'female', confidence: 'high', signals: { middleName: { gender: 'female', value: 'Thi' }, ... } }
```

### Vietnamese address and honorifics

```typescript
import { addressCalculate, pronounPairGet, EGender, ERegion } from 'vietnamese-name-generator';

// Age-based addressing
addressCalculate('Nguyen Van Nam', { speakerAge: 25, addresseeAge: 60 });
// { honorific: 'Ong', addressTerm: 'Ong Nam', pronounPair: { self: 'con', addressee: 'ong' }, ... }

// Professional title
addressCalculate('Tran Thi Lan', { role: 'doctor' });
// { honorific: 'Bac si', addressTerm: 'Bac si Lan', category: 'professional', ... }

// Pronoun pair for any age relationship
pronounPairGet(25, 45, { gender: EGender.Male, region: ERegion.North });
// { self: 'em', addressee: 'anh' }
```

### Cross-cultural GenZ names

```typescript
import { generate, generateGenZNickname } from 'vietnamese-name-generator';

// Japanese-influenced name
generate({ style: 'japanese', seed: 1 });
// { surname: 'Nguyen', middleName: 'Minh', givenName: 'Sakura', ... }

// GenZ nickname
generateGenZNickname({ name: 'Tran Thao Linh', style: 'jp-suffix', seed: 5 });
// { nickname: 'Linh-chan', style: 'jp-suffix', culturalNote: '...' }
```

## CLI Usage

```bash
# Generate names
npx vietnamese-name-generator --count 10 --gender female --region south
npx vietnamese-name-generator --seed 42 --format slug --json

# Parse, validate, detect gender
npx vietnamese-name-generator --parse "Nguyen Van An"
npx vietnamese-name-generator --validate "Nguyen Van An"
npx vietnamese-name-generator --detect "Nguyen Thi Mai"

# Export batch data
npx vietnamese-name-generator --export csv --count 100 --seed 42
npx vietnamese-name-generator --export json --count 50
```
