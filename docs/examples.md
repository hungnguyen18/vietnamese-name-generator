# Examples

Practical use cases for `vietnamese-name-generator`.

## Seeding a Database

Generate deterministic test data with seeded RNG for reproducible test fixtures.

```typescript
import { generateMany, EGender, ERegion } from 'vietnamese-name-generator';

// 100 unique names, reproducible across runs
const listUser = generateMany(100, { seed: 42 });

// Insert into your database
for (let i = 0; i < listUser.length; i += 1) {
  await db.insert({
    fullName: listUser[i].fullName,
    firstName: listUser[i].givenName,
    lastName: listUser[i].surname,
    gender: listUser[i].gender,
    region: listUser[i].region,
  });
}
```

### Gender-specific test data

```typescript
const listFemale = generateMany(50, { gender: EGender.Female, seed: 1 });
const listMale = generateMany(50, { gender: EGender.Male, seed: 2 });
```

### Regional distribution

```typescript
const listNorth = generateMany(30, { region: ERegion.North, seed: 1 });
const listCentral = generateMany(30, { region: ERegion.Central, seed: 2 });
const listSouth = generateMany(30, { region: ERegion.South, seed: 3 });
```

## Testing i18n / Localization

### Accent-insensitive search

```typescript
import { accentInsensitiveMatch, accentInsensitiveEqual } from 'vietnamese-name-generator';

// User types without diacritics, matches Vietnamese text
accentInsensitiveMatch('Nguyen Van An', 'nguyen');
// true

accentInsensitiveEqual('Nguyen', 'Nguyen');
// true
```

### Vietnamese sort order

```typescript
import { sortVietnamese } from 'vietnamese-name-generator';

// Vietnamese convention: sort by given name (last part), not surname
const listName = ['Nguyen Van Binh', 'Tran Thi An', 'Le Van Cuong'];
sortVietnamese(listName);
// ['Tran Thi An', 'Nguyen Van Binh', 'Le Van Cuong']
```

### Name formatting for different contexts

```typescript
import { generate, ENameFormat } from 'vietnamese-name-generator';

const name = generate({
  seed: 42,
  format: [ENameFormat.Full, ENameFormat.Abbreviated, ENameFormat.Reversed, ENameFormat.Slug],
});

// name.formatted = {
//   full: 'Phan Ngoc Kim Trang',
//   abbreviated: 'P. N. Kim Trang',
//   reversed: 'Kim Trang Ngoc Phan',
//   slug: 'phan-ngoc-kim-trang',
// }
```

## Generating Realistic Characters for Fiction

### Character with full cultural context

```typescript
import {
  generate,
  getHanViet,
  getBirthYearElement,
  getElementInfo,
  EGender,
  ERegion,
  EEra,
} from 'vietnamese-name-generator';

const character = generate({
  gender: EGender.Female,
  region: ERegion.South,
  era: EEra.Traditional,
  compoundName: true,
  seed: 7,
});

// Look up the cultural meaning
const hanViet = getHanViet(character.givenName.split(' ')[0]);
// { character: '...', meaning: '...', ... }

// Determine their Five Elements destiny
const element = getBirthYearElement(1990);
const elementInfo = getElementInfo(element);
// { element: 'kim', meaning: 'Metal', generating: 'tho', ... }
```

### Addressing characters correctly

```typescript
import { addressCalculate, EFormality } from 'vietnamese-name-generator';

// Formal letter from young character to elder
const formal = addressCalculate(character.fullName, {
  speakerAge: 22,
  addresseeAge: 65,
  formality: EFormality.WrittenFormal,
});
// { fullAddress: 'Kinh gui Ong ...', pronounPair: { self: 'con', addressee: 'ong' } }

// Casual conversation between peers
const casual = addressCalculate(character.fullName, {
  speakerAge: 25,
  addresseeAge: 27,
  formality: EFormality.Casual,
});
// { pronounPair: { self: 'em', addressee: 'chi' } }
```

### GenZ character with cross-cultural name

```typescript
import { generate, generateGenZNickname } from 'vietnamese-name-generator';

const modernChar = generate({ style: 'korean', seed: 5 });
// A Vietnamese name with Korean influence

const nickname = generateGenZNickname({
  name: modernChar.fullName,
  style: 'social-handle',
  seed: 5,
});
// Their social media handle
```

## Using with Faker.js

Drop-in replacement for Vietnamese locale data.

```typescript
import { fakerVi } from 'vietnamese-name-generator';

// Same API shape as faker.js
const user = {
  firstName: fakerVi.person.firstName(),
  lastName: fakerVi.person.lastName(),
  fullName: fakerVi.person.fullName(),
  sex: fakerVi.person.sex(),
  prefix: fakerVi.person.prefix(),
  email: fakerVi.internet.email(),
  username: fakerVi.internet.username(),
};
```

## Batch Export (CLI)

Export large datasets for external tools.

```bash
# CSV export for spreadsheet tools
npx vietnamese-name-generator --export csv --count 1000 --seed 42 > names.csv

# JSON export for API mocking
npx vietnamese-name-generator --export json --count 500 --seed 42 > names.json

# Female names from southern Vietnam
npx vietnamese-name-generator --export csv --count 200 --gender female --region south --seed 1
```

## Building a Name Picker / Randomizer

```typescript
import { generate, generateFullName } from 'vietnamese-name-generator';

// Quick random name string
const name = generateFullName();
// 'Nguyen Van An'

// With full metadata for a picker UI
function nameRandomPick() {
  const result = generate();
  return {
    display: result.fullName,
    gender: result.gender,
    region: result.region,
    slug: result.formatted?.slug,
  };
}
```

## Validating User Input

```typescript
import { validateName, parseName, detectGender } from 'vietnamese-name-generator';

function userInputProcess(input: string) {
  const validation = validateName(input);
  if (!validation.valid) {
    return { error: validation.reasons.join(', ') };
  }

  const parsed = parseName(input);
  const gender = detectGender(input);

  return {
    ...parsed,
    detectedGender: gender.gender,
    genderConfidence: gender.confidence,
  };
}

userInputProcess('Nguyen Thi Mai');
// {
//   surname: 'Nguyen', middleName: 'Thi', givenName: 'Mai',
//   fullName: 'Nguyen Thi Mai',
//   detectedGender: 'female', genderConfidence: 'high',
// }
```
