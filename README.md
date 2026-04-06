# vietnamese-name-generator

[![npm version](https://img.shields.io/npm/v/vietnamese-name-generator)](https://www.npmjs.com/package/vietnamese-name-generator)
[![npm downloads](https://img.shields.io/npm/dm/vietnamese-name-generator)](https://www.npmjs.com/package/vietnamese-name-generator)
[![bundle size](https://deno.bundlejs.com/badge?q=vietnamese-name-generator)](https://bundlejs.com/?q=vietnamese-name-generator)
[![CI](https://github.com/hungnguyen18/vietnamese-name-generator/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/hungnguyen18/vietnamese-name-generator/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue)](https://www.typescriptlang.org/)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](https://www.npmjs.com/package/vietnamese-name-generator)
[![license](https://img.shields.io/github/license/hungnguyen18/vietnamese-name-generator)](./LICENSE)

**[Documentation](https://hungnguyen18.github.io/vietnamese-name-generator/)** | **[Try on StackBlitz](https://stackblitz.com/edit/vietnamese-name-generator-demo?file=index.ts)** | **[API Reference](https://hungnguyen18.github.io/vietnamese-name-generator/api/)**

The most comprehensive Vietnamese name toolkit for JavaScript/TypeScript. Generate, parse, validate, format, and analyze Vietnamese names — plus a full **Vietnamese honorific & address system** (xưng hô) with age-based pronouns, 30+ professional/military/political titles, regional dialects, and formality levels.

Zero runtime dependencies. Ships as CJS + ESM with full TypeScript declarations.

> **Disclaimer:** This library generates fictional data for testing, development, and educational purposes only. Do not use generated data for identity fraud, impersonation, phishing, social engineering, or any activity that violates applicable laws. Generated names are synthetic and any resemblance to real individuals is coincidental. The authors bear no responsibility for misuse.

## Why this library?

- **No npm alternative** for Vietnamese name parsing, gender detection, or validation
- **Census-weighted** surname distribution (Nguyễn ~40%, Trần ~11%, Lê ~9%...)
- **Culturally correct** -- regional variants (Hoang/Huynh), gender-encoded middle names, proper honorifics
- **Vietnamese address system (xưng hô)** -- age-based pronoun pairs (con/ông, cháu/chú, em/anh...), the nâng principle, regional dialect variants (Central "o" vs "cô"), and 5 formality levels from "Kính gửi" to "ơi"
- **30+ professional titles** -- academic (Giáo sư, Tiến sĩ), medical (Bác sĩ, Dược sĩ), legal (Luật sư), military (12 ranks from Đại tướng to Thiếu úy), political (Tổng Bí thư, Chủ tịch, Đồng chí), education (Thầy/Cô)
- **i18n-ready** -- NFC normalization, accent-insensitive search, Vietnamese sort order
- **Cultural depth** -- Five Elements (Ngu Hanh), Han Viet characters, protective nicknames, pet names
- **AI/testing-friendly** -- deterministic seed, batch generation, CSV/JSON export

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
  addressCalculate,
  pronounPairGet,
  salutation,
  romanize,
  getHanViet,
  getBirthYearElement,
  generatePetName,
  generateNickname,
  generateGenZNickname,
} from 'vietnamese-name-generator';

// Generate a realistic Vietnamese name
const name = generate({ seed: 42 });
// { surname: 'Phan', middleName: 'Ngoc', givenName: 'Kim Trang', ... }

// Cross-cultural GenZ name (Japanese/Korean/Western influenced)
generate({ style: 'japanese', seed: 1 });
// { surname: 'Nguyễn', middleName: 'Minh', givenName: 'Sakura', ... }

// GenZ nickname from a Vietnamese name
generateGenZNickname({ name: 'Trần Thảo Linh', style: 'jp-suffix', seed: 5 });
// { nickname: 'Linh-chan', style: 'jp-suffix', culturalNote: '...' }

// Vietnamese address & honorific system (age-based pronouns)
addressCalculate('Nguyễn Văn Nam', { speakerAge: 25, addresseeAge: 60 });
// { honorific: 'Ông', addressTerm: 'Ông Nam', pronounPair: { self: 'con', addressee: 'ông' }, ... }

// Professional title addressing
addressCalculate('Trần Thị Lan', { role: 'doctor' });
// { honorific: 'Bác sĩ', addressTerm: 'Bác sĩ Lan', category: 'professional', ... }

// Get pronoun pair for any age relationship
pronounPairGet(25, 45, { gender: EGender.Male, region: ERegion.North });
// { self: 'em', addressee: 'anh' }

// Parse any Vietnamese name into structured parts
parseName('Nguyen Van An');
// { surname: 'Nguyen', middleName: 'Van', givenName: 'An' }

// Detect gender from name
detectGender('Nguyen Thi Mai');
// { gender: 'female', confidence: 'high' }

// Culturally correct salutation ("Ong Nam", not "Mr. Nguyen")
salutation('Nguyen Van Nam', { formality: 'formal' });
// { honorific: 'Ong', addressName: 'Nam', fullSalutation: 'Kinh gui Ong Nam' }

// Han Viet character lookup
getHanViet('Minh');
// { character: '明', meaning: 'bright/intelligent', alternates: [{character: '銘', meaning: 'inscribe'}] }

// Five Elements from birth year
getBirthYearElement(1990);
// 'kim' (Metal)

// Vietnamese pet name
generatePetName({ category: 'byFood' });
// { name: 'Pho', meaning: 'pho noodle soup', category: 'byFood' }

// Protective baby nickname (ten xau de nuoi)
generateNickname({ category: 'animal' });
// { nickname: 'Coc', meaning: 'toad', culturalNote: '...' }
```

## CLI

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
| `generateNickname(options?)` | `INicknameResult` | Traditional protective nickname |
| `generatePetName(options?)` | `IPetNameResult` | Vietnamese pet name |
| `generateManyPetNames(count, options?)` | `IPetNameResult[]` | Batch pet names |
| `generateGenZNickname(options?)` | `IGenZNicknameResult` | GenZ nickname (JP/KR/EN influenced) |

### Parsing & Validation

| Function | Returns | Description |
|----------|---------|-------------|
| `parseName(input)` | `IParsedName` | Split full name into surname/middle/given |
| `validateName(input)` | `IValidationResult` | Validate Vietnamese name with specific failure reasons |
| `detectGender(input)` | `IGenderResult` | Infer gender from middle + given name signals |

### Address & Honorifics

| Function | Returns | Description |
|----------|---------|-------------|
| `addressCalculate(name, options?)` | `IAddressResult` | Vietnamese address term with pronoun pair (age-based, professional, regional) |
| `pronounPairGet(speakerAge, addresseeAge, options?)` | `IPronounPair` | Get self/addressee pronoun pair for any age relationship |
| `salutation(name, options?)` | `ISalutationResult` | Simple Vietnamese honorific (deprecated, use `addressCalculate`) |

### Formatting & i18n

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

### Cultural Data

| Function | Returns | Description |
|----------|---------|-------------|
| `getHanViet(name)` | `THanVietEntry \| null` | Chinese character origin + meaning |
| `getElementInfo(element)` | `IElementInfo` | Five Elements relationships |
| `getNameElement(name)` | `EElement \| null` | Which element a name belongs to |
| `getNamesByElement(element, options?)` | `string[]` | Names belonging to an element |
| `getBirthYearElement(year)` | `EElement` | Element from Heavenly Stems cycle |
| `getMeaning(name)` | `INameMeaning` | Meaning category, gender/region/era distribution |
| `getSurnameInfo(surname)` | `ISurnameInfo` | Frequency, rank, regional variants |
| `getRegionalVariant(surname, region)` | `string` | Convert Hoang<->Huynh, Vu<->Vo |
| `nameSimilarity(name1, name2)` | `ISimilarityResult` | Compare names with diacritics/variant tolerance |
| `getStatistics()` | `IStatisticsResult` | Dataset overview counts |
| `getTopSurnames(options?)` | `IRankedName[]` | Top N surnames by frequency |

### Faker.js Compatible

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

### Cross-Cultural GenZ Names

Generate Vietnamese names influenced by Japanese, Korean, and Western naming trends:

```typescript
import { generate } from 'vietnamese-name-generator';

// Japanese-influenced name
generate({ style: 'japanese', seed: 1 });
// { surname: 'Nguyễn', middleName: 'Minh', givenName: 'Sakura', ... }

// Korean-influenced name
generate({ style: 'korean', seed: 2 });
// { surname: 'Trần', middleName: 'Bảo', givenName: 'Ha-eun', ... }

// Western-influenced name
generate({ style: 'western', seed: 3 });
// { surname: 'Lê', middleName: 'Gia', givenName: 'Leo', ... }

// Hybrid (names that work across VN + foreign contexts)
generate({ style: 'hybrid', seed: 4 });
// { surname: 'Phạm', middleName: 'An', givenName: 'Kai', ... }
```

Each crosscultural name entry includes rich metadata: origin culture, native script (kanji/hangul), meaning, Vietnamese phonetic adaptation, and popularity score.

### GenZ Nickname Generator

Generate Vietnamese GenZ-style nicknames with 6 cultural styles:

```typescript
import { generateGenZNickname } from 'vietnamese-name-generator';

// From an existing Vietnamese name
generateGenZNickname({ name: 'Nguyễn Minh Anh', style: 'jp-suffix', seed: 1 });
// { nickname: 'Anh-chan', style: 'jp-suffix', origin: 'japanese-honorific', culturalNote: '...' }

generateGenZNickname({ name: 'Trần Văn Nam', style: 'english-viet', seed: 2 });
// { nickname: 'Kevin Tran', style: 'english-viet', origin: 'viet-diaspora-english', ... }

// Random mode (no input name)
generateGenZNickname({ style: 'cute', seed: 3 });
// { nickname: 'Bé Xoài', style: 'cute', origin: 'vietnamese-cute-tradition', ... }

generateGenZNickname({ style: 'social-handle', seed: 4 });
// { nickname: 'dreamy.linh', style: 'social-handle', ... }
```

**Nickname styles:**

| Style | Description | Examples |
|-------|-------------|---------|
| `social-handle` | TikTok/Instagram handles | `minh.03`, `itz.linh`, `_an_` |
| `jp-suffix` | Japanese honorific suffixes | `Linh-chan`, `Minh-kun`, `An-sama` |
| `kr-suffix` | Korean honorifics | `Minh oppa`, `Linh unnie`, `An-ah` |
| `cute` | Vietnamese cute nicknames | `Bé An`, `Mimi`, `Gấu`, `Xoài` |
| `meme` | Vietnamese internet memes | `Kevin Nguyễn`, `Phở Mai Que` |
| `english-viet` | English + VN surname | `Jenny Phạm`, `Ryan Trần` |

### Vietnamese Address & Honorific System

Vietnamese has no universal "you" or "I" — pronouns encode **age, gender, social status, and emotional distance**. This system implements the full decision tree:

```typescript
import { addressCalculate, pronounPairGet, EFormality, EGender, ERegion } from 'vietnamese-name-generator';

// Age-based addressing: 25-year-old speaking to 60-year-old
addressCalculate('Nguyễn Văn Nam', {
  speakerAge: 25,
  addresseeAge: 60,
  region: ERegion.North,
});
// {
//   honorific: 'Ông',
//   addressTerm: 'Ông Nam',
//   fullAddress: 'Ông Nam',
//   pronounPair: { self: 'con', addressee: 'ông' },
//   category: 'age-based',
// }

// Professional title takes priority over age
addressCalculate('Trần Thị Lan', {
  role: 'professor',
  speakerAge: 30,
  addresseeAge: 55,
});
// { honorific: 'Giáo sư', addressTerm: 'Giáo sư Lan', ... }

// Formality levels
addressCalculate('Lê Minh Tuấn', {
  speakerAge: 30,
  addresseeAge: 50,
  formality: EFormality.WrittenFormal,
});
// { fullAddress: 'Kính gửi Chú Tuấn', ... }

addressCalculate('Phạm Thảo', {
  formality: EFormality.Intimate,
});
// { fullAddress: 'Thảo ơi', ... }

// Regional variants (Central Vietnam uses 'o' instead of 'cô')
pronounPairGet(25, 40, { gender: EGender.Female, region: ERegion.Central });
// { self: 'em', addressee: 'chị' }
```

**Age gap → Pronoun mapping:**

| Age Gap (addressee - speaker) | Addressee Term | Self Term | Relationship |
|-------------------------------|---------------|-----------|-------------|
| +20 or more | Ông/Bà | con | Grandparent generation |
| +10 to +19 | Chú/Cô | cháu | Parent generation |
| +3 to +9 | Anh/Chị | em | Older sibling |
| -2 to +2 | Anh/Chị | em | Same age (nâng principle) |
| -9 to -3 | Em | anh/chị | Younger sibling |
| -19 to -10 | Cháu | chú/cô | Child generation |
| -20 or less | Con | ông/bà | Grandchild generation |

**Professional titles (30+ roles across 6 categories):**

| Category | Example Roles |
|----------|--------------|
| Academic | `professor` (Giáo sư), `phd` (Tiến sĩ), `master` (Thạc sĩ) |
| Medical | `doctor` (Bác sĩ), `pharmacist` (Dược sĩ), `dentist` (Nha sĩ) |
| Legal | `lawyer` (Luật sư), `judge` (Thẩm phán) |
| Military | `general` (Đại tướng) through `second-lieutenant` (Thiếu úy) — 12 ranks |
| Political | `general-secretary` (Tổng Bí thư), `president` (Chủ tịch), `comrade` (Đồng chí) |
| Education | `teacher-male` (Thầy), `teacher-female` (Cô) |

### Enums & Types

| Enum/Type | Values |
|-----------|--------|
| `EGender` | `male`, `female`, `unisex` |
| `ERegion` | `north`, `central`, `south` |
| `EEra` | `traditional`, `modern` |
| `TNameStyle` | `japanese`, `korean`, `western`, `hybrid` |
| `EMeaningCategory` | `strength`, `virtue`, `nature`, `precious`, `beauty`, `celestial`, `season`, `intellect`, `prosperity` |
| `ENameFormat` | `full`, `abbreviated`, `reversed`, `slug` |
| `EElement` | `kim` (Metal), `moc` (Wood), `thuy` (Water), `hoa` (Fire), `tho` (Earth) |
| `EFormality` | `written-formal`, `spoken-formal`, `professional`, `casual`, `intimate` |
| `EHonorificCategory` | `royal`, `mandarin`, `scholar`, `family`, `age-based`, `professional`, `religious`, `genz`, `regional` |
| `EReligion` | `buddhism`, `catholicism`, `cao-dai`, `hoa-hao`, `folk` |
| `EFeudalRank` | `emperor`, `consort`, `prince`, `princess`, `nobility`, `mandarin`, `scholar` |

---

## Vietnamese Naming Culture

### Name Structure

Vietnamese names follow **surname - middle name - given name** order, the reverse of Western convention. In daily life, people are addressed by their **given name** (the last word), not their surname.

| Part | Vietnamese | Example | Role |
|------|-----------|---------|------|
| Surname (Họ) | Họ | Nguyễn | Family lineage |
| Middle name (Tên đệm) | Tên đệm / Tên lót | Văn, Thị | Gender marker, generational marker |
| Given name (Tên) | Tên gọi | An, Mai | Personal identity -- this is "the name" |

### Why ~40% of Vietnam is Named Nguyễn

Vietnamese surname concentration is extreme by world standards. Approximately 38-40% of the population carries the surname Nguyễn ([Atlas Obscura](https://www.atlasobscura.com/articles/pronounce-nguyen-common-vietnam), [Wikipedia](https://en.wikipedia.org/wiki/Nguyen)), a direct consequence of **forced surname changes during dynasty transitions** ([Nguyễn, V.K., 2024, *Genealogy*](https://www.mdpi.com/2313-5778/8/1/16)):

- **1232 (Lý -> Trần):** The Trần dynasty forced Lý families to change their surname to avoid the former emperor's name (kỵ húy), pushing many to adopt Nguyễn
- **1400-1407 (Trần -> Hồ):** Hồ Quý Ly seized power from the Trần dynasty in 1400; when the Hồ dynasty fell in 1407, Hồ descendants changed to Nguyễn for safety
- **1592 (Mạc -> Lê restoration):** Mạc families adopted Nguyễn to avoid persecution
- **1802 (Nguyễn dynasty):** The Nguyễn lords unified Vietnam; many adopted the ruling surname for favor or protection

The top 14 Vietnamese surnames cover **90%+** of the population ([Wikipedia: Vietnamese name](https://en.wikipedia.org/wiki/Vietnamese_name)): Nguyễn (~38-40%), Trần (~11%), Lê (~9.5%), Phạm (~7.1%), Hoàng/Huỳnh (~5.1%), Vũ/Võ (~3.9%)...

### The Middle Name Encodes Gender

The middle name (ten dem/ten lot) has traditionally served as a **gender marker** ([Vietcetera: Why "Van" and "Thi" are popular](https://vietcetera.com/en/why-are-middle-names-van-and-thi-popular-in-vietnam)):

- **Văn** (文, literature) -- marks male names. Usage declining in modern naming
- **Thị** (氏, clan) -- marks female names. Usage declining in modern naming
- **Modern alternatives:** Minh, Gia, Bảo, Đức (male); Ngọc, Khánh, Bảo (female); An, Minh (unisex)

Middle names also function as **generation markers** ([Wikipedia: Generation name](https://en.wikipedia.org/wiki/Generation_name)) -- siblings and cousins of the same generation share the same middle name, enabling family tree identification.

### Regional Surname Variants

The same Chinese character is read differently by regional dialect ([Cultural Atlas: Vietnamese Naming](https://culturalatlas.sbs.com.au/vietnamese-culture/vietnamese-culture-naming)):

| North | South | Chinese Origin |
|-------|-------|---------------|
| Hoàng | Huỳnh | 黄 (yellow) |
| Vũ | Võ | 武 (martial) |

These splits originate from the kỵ húy (naming taboo) laws of the Nguyễn Lords ([Wikipedia: Vietnamese name](https://en.wikipedia.org/wiki/Vietnamese_name)), where the imperial name could not be spoken and regional pronunciations diverged permanently.

### Sino-Vietnamese (Han Viet) Origins

Nearly all Vietnamese given names derive from Chinese characters (Han tu), read in Sino-Vietnamese pronunciation. A single romanized name can map to multiple characters with different meanings:

| Name | Character | Meaning | Alternate | Meaning |
|------|-----------|---------|-----------|---------|
| Minh | 明 | Bright/intelligent | 銘 | Inscribe/remember |
| An | 安 | Peace | 晏 | Calm |
| Thanh | 清 | Pure | 青 | Blue/green |
| Long | 龍 | Dragon | 隆 | Prosperous |

This library includes Han Viet character data for 80+ common names via `getHanViet()`.

### Five Elements (Ngũ Hành) Naming

Vietnamese parents traditionally choose names based on the **Five Elements** ([Feng Shui Master Academy: Baby Names Using Bazi](https://fengshuimasteryacademy.com/how-to-choose-chinese-baby-names-using-bazi-analysis/)) to balance a child's destiny:

| Element | Vietnamese | Chinese | Associated Names |
|---------|-----------|---------|-----------------|
| Metal | Kim | 金 | Kim, Ngân, Bảo, Châu |
| Wood | Mộc | 木 | Lâm, Phong, Xuân, Trúc, Mai |
| Water | Thủy | 水 | Thủy, Hà, Hải, Giang, Linh |
| Fire | Hỏa | 火 | Quang, Huy, Minh, Hồng |
| Earth | Thổ | 土 | Sơn, Bình, An, Thành, Long |

The birth year determines the child's element via the **Heavenly Stems (Thiên Can)** cycle. Parents select names from the **generating element** (tương sinh) to support the child's destiny.

### Name Taboos (Kỵ Húy)

Under feudal dynasties, using the emperor's personal name or a near-homophone was forbidden ([Wikipedia: Naming taboo](https://en.wikipedia.org/wiki/Naming_taboo#Vietnam)). This practice permanently altered the Vietnamese name pool:

- Emperor's name banned -> families respelled similar names
- Children were never named after living parents or grandparents
- Some families gave babies **"ugly names" (tên xấu để nuôi)** -- Cóc (toad), Tý (mouse), Chí (louse) -- to deceive evil spirits who might harm a beautiful child

This library includes a protective nickname generator (`generateNickname()`) honoring this tradition.

### Cross-Cultural Naming Trends (GenZ/Gen Alpha)

Vietnamese naming culture is evolving rapidly under Japanese, Korean, and Western influences:

- **Japanese influence (anime/manga):** Names like Sakura (桜), Hana (花), Ren (蓮), Akira (明) are increasingly used by Vietnamese parents. Many Japanese names have phonetic compatibility with Vietnamese (e.g., Mei ≈ Mai, Akira's kanji 明 = Minh in Han Viet).
- **Korean influence (K-pop/K-drama):** Names like Jimin, Ha-eun, Min-jun are adapted via Han-Viet phonetic mapping (e.g., Ha-eun → Hà Ân, Min-jun → Min Tuấn). Korean naming sites report Vietnamese parents as a significant international audience.
- **Western influence:** Short, internationally pronounceable names (Leo, Mia, Kai) are popular. The "Kevin Nguyen" meme (from Subtle Asian Traits, 2018) reflects the Viet diaspora naming pattern.
- **GenZ nickname culture:** Vietnamese GenZ creates nicknames by mixing languages — Japanese suffixes (-chan, -kun), Korean honorifics (oppa, unnie), syllable doubling (Mimi, Nana), cute food/animal names (Xoài, Gấu), and social media handle patterns.

Sources: [Kilala.vn](https://kilala.vn), [Huggies.com.vn](https://www.huggies.com.vn), [Vietcetera](https://vietcetera.com/en/how-vietnamese-choose-their-english-names), [korean-name.com](https://korean-name.com)

### The Pronoun System (Xưng Hô)

Vietnamese is one of the world's most complex pronoun systems. There is no universal "I" or "you" — speakers must choose from dozens of pronoun pairs based on relative age, social status, gender, and emotional closeness ([Wikipedia: Vietnamese pronouns](https://en.wikipedia.org/wiki/Vietnamese_pronouns), [Vietcetera](https://vietcetera.com)):

| Self (Xưng) | Addressee (Hô) | When to use |
|-------------|----------------|-------------|
| con | ông/bà | Speaking to grandparent-age person |
| cháu | chú/cô/bác | Speaking to parent-age person |
| em | anh/chị | Speaking to someone older (sibling generation) |
| tôi | anh/chị/ông/bà | Formal/neutral contexts |
| anh/chị | em | Speaking to someone younger |
| mình | bạn | Close friends of same age |

Key cultural principles:

- **Nâng principle (nâng người đối diện):** When ages are similar, Vietnamese speakers default to treating the addressee as older — using "em" (self) and "anh/chị" (addressee) — as a sign of politeness and respect
- **Professional override:** Professional titles (Bác sĩ, Giáo sư, Thầy/Cô) always take precedence over age-based pronouns in professional contexts
- **Regional variation:** Central Vietnam uses distinct terms — "o" replaces "cô" (aunt), "mệ" replaces "bà" (grandmother) in some dialects
- **Formality markers:** "Kính gửi" (written formal), "Thưa" (spoken formal), "ơi" (intimate) modify the address term

This library implements the full decision tree via `addressCalculate()` and `pronounPairGet()`.

### Compound Names (Tên Kép)

Two-syllable given names like Bảo Châu, Minh Khôi, or Thanh Hà became popular from the late 20th century. With so few surnames in circulation, compound names reduce ambiguity while adding poetic meaning. Modern compound names often combine two auspicious characters.

### Pet Naming Culture

Vietnamese pet naming is a rich cultural practice ([PetMart.vn](https://www.petmart.vn/dat-ten-cho-cho-bang-tieng-viet)):

- **By appearance**: Vàng (gold), Mực (ink), Bông (cotton), Đốm (spotted) ([PetChoice.vn](https://petchoice.vn/blogs/news/dat-ten-meo-theo-mau-long))
- **By food**: Phở, Bún, Bánh Mì, Xôi -- a uniquely Vietnamese trend
- **By luck**: Tài (wealth), Lộc (fortune), Phúc (blessing) -- feng shui influence
- **By humor**: Đại Ca (big boss for tiny dogs), Cậu Vàng (Mr. Gold, from Nam Cao's literary classic "Lão Hạc", 1943)
- **Modern trends**: anime names (Luna, Totoro), K-drama influence, English names

This library includes 150+ pet names across 7 categories via `generatePetName()`.

---

## Data Sources

### Name Data (Crawl Pipeline)

Names are collected from 6 web sources via an automated crawl pipeline, then merged, deduplicated, tagged, and validated:

| Source | Type | URL |
|--------|------|-----|
| Vietnamese Name DB | 6,284 given names by gender | [github.com/duyet/vietnamese-namedb](https://github.com/duyet/vietnamese-namedb) |
| faker-vi | Vietnamese faker library data | Internal extraction |
| Wiktionary | Vietnamese name entries with etymology | [en.wiktionary.org](https://en.wiktionary.org) |
| Wikipedia | Vietnamese surname pages | [en.wikipedia.org/wiki/Vietnamese_name](https://en.wikipedia.org/wiki/Vietnamese_name) |
| surnam.es | Genealogy surname database | [surnam.es](https://surnam.es) |
| DrPapie | Vietnamese baby names with meanings | [drpapie.com](https://drpapie.com) |

### Cultural Data

| Data | Source |
|------|--------|
| Han Viet characters | Sino-Vietnamese dictionaries, [hvdic.thivien.net](https://hvdic.thivien.net) |
| Five Elements | Traditional Vietnamese metaphysics, feng shui references |
| Surname frequency | Vietnamese census data, demographic studies |
| Regional variants | [MDPI: Onomastic Account of Vietnamese Surnames](https://www.mdpi.com/2313-5778/8/1/16) |
| Gender detection | [ArXiv: Gender Prediction Based on Vietnamese Names](https://arxiv.org/abs/2010.10852) |
| Naming taboos | [Wikipedia: Vietnamese name](https://en.wikipedia.org/wiki/Vietnamese_name), historical dynasty records |

### Pet Name Data

| Source | Coverage |
|--------|----------|
| [PetMart.vn](https://www.petmart.vn) | 8 naming categories, feng shui names |
| [PetChoice.vn](https://petchoice.vn) | Names by fur color |
| [CatHouse.vn](https://cathouse.vn) | 500+ cat names |
| [PetPress.net](https://petpress.net/vietnamese-dog-names/) | 60 Vietnamese dog names with English meanings |
| [WeReAllAboutPets.com](https://wereallaboutpets.com/pet-names/dog/vietnamese) | 90 names with meanings |

### GenZ/Cross-Cultural Data

| Source | Coverage |
|--------|----------|
| [Kilala.vn](https://kilala.vn) | Top Japanese names for Vietnamese parents, annual rankings |
| [Huggies.com.vn](https://www.huggies.com.vn) | 500+ Japanese names, Korean names, English names for Vietnamese babies |
| [korean-name.com](https://korean-name.com) | Korean name rankings 2024-2025, meaning data |
| [Vietcetera](https://vietcetera.com) | How Vietnamese choose English names, GenZ internet slang |
| [Colosmulti.com.vn](https://colosmulti.com.vn) | 440+ Korean names for Vietnamese children |
| [Kenh14](https://kenh14.vn) | GenZ Instagram naming formulas |
| [Know Your Meme](https://knowyourmeme.com/memes/kevin-nguyen) | Kevin Nguyen meme origin and cultural context |

### Honorific & Address Data

| Source | Coverage |
|--------|----------|
| [Wikipedia: Vietnamese pronouns](https://en.wikipedia.org/wiki/Vietnamese_pronouns) | Pronoun pair rules, age-based addressing system |
| [Vietcetera](https://vietcetera.com) | Modern usage patterns, formality levels |
| [Cultural Atlas](https://culturalatlas.sbs.com.au/vietnamese-culture) | Regional variants, kinship terminology |
| Vietnamese military/political nomenclature | 30+ professional titles across 6 categories |

### Academic References

- Nguyen, V.K. (2024). "Toward an Onomastic Account of Vietnamese Surnames." *Genealogy*, 8(1), 16. [doi:10.3390/genealogy8010016](https://www.mdpi.com/2313-5778/8/1/16)
- To, H.Q., Nguyen, K.V., Nguyen, N.L.T., Nguyen, A.G.T. (2020). "Gender Prediction Based on Vietnamese Names with Machine Learning Techniques." *ArXiv*. [arxiv.org/abs/2010.10852](https://arxiv.org/abs/2010.10852)
- Cultural Atlas. "Vietnamese Culture - Naming." [culturalatlas.sbs.com.au](https://culturalatlas.sbs.com.au/vietnamese-culture/vietnamese-culture-naming)

---

## Disclaimer

This library is intended for:
- Software testing and development (mock data, seed databases, unit tests)
- Educational purposes (learning about Vietnamese naming culture)
- Creative applications (fiction writing, game character generation)
- i18n development (building applications that correctly handle Vietnamese names)

**This library must NOT be used for:**
- Identity fraud or impersonation
- Phishing, social engineering, or scam operations
- Creating fake accounts on platforms that prohibit synthetic identities
- Any activity that violates applicable laws in your jurisdiction

All generated data is synthetic. The authors provide this tool in good faith and bear no responsibility for misuse.

## License

MIT
