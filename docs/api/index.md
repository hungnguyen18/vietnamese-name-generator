# API Reference

All functions are named exports from `vietnamese-name-generator`.

```typescript
import { generate, parseName, addressCalculate } from 'vietnamese-name-generator';
```

A default namespace export is also available:

```typescript
import vn from 'vietnamese-name-generator';
vn.generate({ seed: 42 });
```

---

## Generation

| Function | Returns | Description |
|----------|---------|-------------|
| `generate(options?)` | `INameResult` | Single name with full metadata |
| `generateMany(count, options?)` | `INameResult[]` | Batch unique names |
| `generateFullName(options?)` | `string` | Single full name string |
| `generateManyFullNames(count, options?)` | `string[]` | Batch full name strings |
| `generateEmail(options?)` | `IEmailResult` | Email from generated name |
| `generateUsername(options?)` | `IUsernameResult` | Username from generated name |
| `generateNickname(options?)` | `INicknameResult` | Traditional protective nickname |
| `generatePetName(options?)` | `IPetNameResult` | Vietnamese pet name |
| `generateManyPetNames(count, options?)` | `IPetNameResult[]` | Batch pet names |
| `generateGenZNickname(options?)` | `IGenZNicknameResult` | GenZ nickname (JP/KR/EN influenced) |

### `generate(options?)`

Generate a single realistic Vietnamese name with full metadata.

**Parameters:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `gender` | `EGender` | random | `'male'`, `'female'`, or `'unisex'` |
| `region` | `ERegion` | random | `'north'`, `'central'`, or `'south'` |
| `era` | `EEra` | random | `'traditional'` or `'modern'` |
| `compoundName` | `boolean` | `false` | Use two-syllable given name |
| `meaningCategory` | `EMeaningCategory` | — | Filter by meaning category |
| `withMiddleName` | `boolean` | `true` | Include middle name |
| `seed` | `number` | — | Deterministic output |
| `format` | `ENameFormat \| ENameFormat[]` | — | Format variants to include |
| `style` | `TNameStyle` | — | Cross-cultural style: `'japanese'`, `'korean'`, `'western'`, `'hybrid'` |
| `secure` | `boolean` | `false` | Use crypto-secure RNG |

**Returns:** `INameResult`

```typescript
interface INameResult {
  surname: string;
  middleName: string;
  givenName: string;
  fullName: string;
  romanized: IRomanizedName;
  gender: EGender;
  region: ERegion;
  era: EEra;
  formatted: Partial<Record<ENameFormat, string>>;
}
```

**Example:**

```typescript
import { generate, EGender, ERegion } from 'vietnamese-name-generator';

// Basic usage
generate();

// With options
generate({ gender: EGender.Female, region: ERegion.South, seed: 42 });

// Cross-cultural
generate({ style: 'japanese', seed: 1 });
// { surname: 'Nguyen', middleName: 'Minh', givenName: 'Sakura', ... }
```

### `generateMany(count, options?)`

Generate multiple unique names. Takes the same options as `generate()`.

```typescript
import { generateMany, EGender } from 'vietnamese-name-generator';

const listName = generateMany(10, { gender: EGender.Male, seed: 1 });
```

### `generateNickname(options?)`

Generate a traditional Vietnamese protective nickname (ten xau de nuoi).

```typescript
import { generateNickname } from 'vietnamese-name-generator';

generateNickname({ category: 'animal' });
// { nickname: 'Coc', meaning: 'toad', culturalNote: '...' }
```

### `generatePetName(options?)`

Generate a Vietnamese pet name from 150+ names across 7 categories.

```typescript
import { generatePetName } from 'vietnamese-name-generator';

generatePetName({ category: 'byFood' });
// { name: 'Pho', meaning: 'pho noodle soup', category: 'byFood' }
```

### `generateGenZNickname(options?)`

Generate a GenZ-style nickname with 6 cultural styles.

**Parameters:**

| Option | Type | Description |
|--------|------|-------------|
| `name` | `string` | Optional input Vietnamese name |
| `style` | `TGenZNicknameStyle` | `'social-handle'`, `'jp-suffix'`, `'kr-suffix'`, `'cute'`, `'meme'`, `'english-viet'` |
| `seed` | `number` | Deterministic output |

```typescript
import { generateGenZNickname } from 'vietnamese-name-generator';

generateGenZNickname({ name: 'Nguyen Minh Anh', style: 'jp-suffix', seed: 1 });
// { nickname: 'Anh-chan', style: 'jp-suffix', origin: 'japanese-honorific', culturalNote: '...' }

generateGenZNickname({ style: 'social-handle', seed: 4 });
// { nickname: 'dreamy.linh', style: 'social-handle', ... }
```

| Style | Description | Examples |
|-------|-------------|---------|
| `social-handle` | TikTok/Instagram handles | `minh.03`, `itz.linh`, `_an_` |
| `jp-suffix` | Japanese honorific suffixes | `Linh-chan`, `Minh-kun`, `An-sama` |
| `kr-suffix` | Korean honorifics | `Minh oppa`, `Linh unnie`, `An-ah` |
| `cute` | Vietnamese cute nicknames | `Be An`, `Mimi`, `Gau`, `Xoai` |
| `meme` | Vietnamese internet memes | `Kevin Nguyen`, `Pho Mai Que` |
| `english-viet` | English + VN surname | `Jenny Pham`, `Ryan Tran` |

---

## Parsing & Validation

| Function | Returns | Description |
|----------|---------|-------------|
| `parseName(input)` | `IParsedName` | Split full name into surname/middle/given |
| `validateName(input)` | `IValidationResult` | Validate Vietnamese name with specific failure reasons |
| `detectGender(input)` | `IGenderResult` | Infer gender from middle + given name signals |

### `parseName(input)`

```typescript
import { parseName } from 'vietnamese-name-generator';

parseName('Nguyen Van An');
// { surname: 'Nguyen', middleName: 'Van', givenName: 'An', fullName: 'Nguyen Van An' }
```

### `validateName(input)`

```typescript
import { validateName } from 'vietnamese-name-generator';

validateName('Nguyen Van An');
// { valid: true, reasons: [] }

validateName('X');
// { valid: false, reasons: ['...'] }
```

### `detectGender(input)`

```typescript
import { detectGender } from 'vietnamese-name-generator';

detectGender('Nguyen Thi Mai');
// { gender: 'female', confidence: 'high', signals: { middleName: { gender: 'female', value: 'Thi' }, givenName: { gender: 'female', value: 'Mai' } } }
```

---

## Address & Honorifics

See the dedicated [Address & Honorifics](/api/address) page for the full deep dive.

| Function | Returns | Description |
|----------|---------|-------------|
| `addressCalculate(name, options?)` | `IAddressResult` | Vietnamese address term with pronoun pair |
| `pronounPairGet(speakerAge, addresseeAge, options?)` | `IPronounPair` | Get self/addressee pronoun pair |
| `salutation(name, options?)` | `ISalutationResult` | Simple honorific (deprecated, use `addressCalculate`) |

---

## Formatting & i18n

| Function | Returns | Description |
|----------|---------|-------------|
| `romanize(input)` | `string` | Remove Vietnamese diacritics |
| `formatName(parts, format)` | `string` | Format as full/abbreviated/reversed/slug |
| `normalize(input)` | `string` | NFC Unicode normalization |
| `accentInsensitiveMatch(text, query)` | `boolean` | Search ignoring diacritics |
| `accentInsensitiveEqual(a, b)` | `boolean` | Compare ignoring diacritics |
| `sortVietnamese(names, options?)` | `string[]` | Sort by given name (Vietnamese convention) |
| `vietnameseNameComparator(options?)` | `Function` | Comparator for `Array.sort()` |
| `VIETNAMESE_NAME_REGEX` | `RegExp` | Validates Vietnamese characters |

### `romanize(input)`

```typescript
import { romanize } from 'vietnamese-name-generator';

romanize('Nguyen Van An');
// 'Nguyen Van An'

romanize('Phan Ngoc Kim Trang');
// 'Phan Ngoc Kim Trang'
```

### `sortVietnamese(names, options?)`

Sorts names by given name first (Vietnamese convention), not by surname.

```typescript
import { sortVietnamese } from 'vietnamese-name-generator';

sortVietnamese(['Nguyen Van Binh', 'Tran Thi An', 'Le Van Cuong']);
// ['Tran Thi An', 'Nguyen Van Binh', 'Le Van Cuong']
```

### `accentInsensitiveMatch(text, query)`

```typescript
import { accentInsensitiveMatch } from 'vietnamese-name-generator';

accentInsensitiveMatch('Nguyen', 'Nguyen');
// true
```

---

## Cultural Data

| Function | Returns | Description |
|----------|---------|-------------|
| `getHanViet(name)` | `THanVietEntry \| null` | Chinese character origin + meaning |
| `getElementInfo(element)` | `IElementInfo` | Five Elements relationships |
| `getNameElement(name)` | `EElement \| null` | Which element a name belongs to |
| `getNamesByElement(element, options?)` | `string[]` | Names belonging to an element |
| `getBirthYearElement(year)` | `EElement` | Element from Heavenly Stems cycle |
| `getMeaning(name)` | `INameMeaning` | Meaning category, gender/region/era distribution |
| `getSurnameInfo(surname)` | `ISurnameInfo` | Frequency, rank, regional variants |
| `getRegionalVariant(surname, region)` | `string` | Convert Hoang/Huynh, Vu/Vo |
| `nameSimilarity(name1, name2)` | `ISimilarityResult` | Compare names with diacritics/variant tolerance |
| `getStatistics()` | `IStatisticsResult` | Dataset overview counts |
| `getTopSurnames(options?)` | `IRankedName[]` | Top N surnames by frequency |

### `getHanViet(name)`

Look up the Sino-Vietnamese (Han Viet) character origin and meaning of a name.

```typescript
import { getHanViet } from 'vietnamese-name-generator';

getHanViet('Minh');
// { character: '明', meaning: 'bright/intelligent', alternates: [{ character: '銘', meaning: 'inscribe' }] }
```

### `getBirthYearElement(year)`

Determine the Five Element from a birth year using the Heavenly Stems cycle.

```typescript
import { getBirthYearElement } from 'vietnamese-name-generator';

getBirthYearElement(1990);
// 'kim' (Metal)
```

### `getNamesByElement(element, options?)`

```typescript
import { getNamesByElement, EElement } from 'vietnamese-name-generator';

getNamesByElement(EElement.Thuy);
// ['Thuy', 'Ha', 'Hai', 'Giang', 'Linh', ...]
```

### `getSurnameInfo(surname)`

```typescript
import { getSurnameInfo } from 'vietnamese-name-generator';

getSurnameInfo('Nguyen');
// { surname: 'Nguyen', frequency: 0.38, rank: 1, regionalVariants: { north: 'Nguyen', south: 'Nguyen' } }
```

---

## Faker.js Compatible

A drop-in adapter for faker.js-style usage.

```typescript
import { fakerVi } from 'vietnamese-name-generator';

fakerVi.person.firstName();        // 'An'
fakerVi.person.lastName();         // 'Nguyen'
fakerVi.person.fullName();         // 'Nguyen Van An'
fakerVi.person.sex();              // 'male'
fakerVi.person.prefix('female');   // 'Ba'
fakerVi.internet.email();          // 'an.nguyen@gmail.com'
fakerVi.internet.username();       // 'annguyen'
```

---

## Enums & Types

| Enum/Type | Values |
|-----------|--------|
| `EGender` | `'male'`, `'female'`, `'unisex'` |
| `ERegion` | `'north'`, `'central'`, `'south'` |
| `EEra` | `'traditional'`, `'modern'` |
| `TNameStyle` | `'japanese'`, `'korean'`, `'western'`, `'hybrid'` |
| `EMeaningCategory` | `'strength'`, `'virtue'`, `'nature'`, `'precious'`, `'beauty'`, `'celestial'`, `'season'`, `'intellect'`, `'prosperity'` |
| `ENameFormat` | `'full'`, `'abbreviated'`, `'reversed'`, `'slug'` |
| `EElement` | `'kim'` (Metal), `'moc'` (Wood), `'thuy'` (Water), `'hoa'` (Fire), `'tho'` (Earth) |
| `EFormality` | `'written-formal'`, `'spoken-formal'`, `'professional'`, `'casual'`, `'intimate'` |
| `EHonorificCategory` | `'royal'`, `'mandarin'`, `'scholar'`, `'family'`, `'age-based'`, `'professional'`, `'religious'`, `'genz'`, `'regional'` |
| `EReligion` | `'buddhism'`, `'catholicism'`, `'cao-dai'`, `'hoa-hao'`, `'folk'` |
| `EFeudalRank` | `'emperor'`, `'consort'`, `'prince'`, `'princess'`, `'nobility'`, `'mandarin'`, `'scholar'` |
