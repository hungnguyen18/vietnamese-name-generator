# vietnamese-name-generator

[![npm version](https://img.shields.io/npm/v/vietnamese-name-generator)](https://www.npmjs.com/package/vietnamese-name-generator)
[![npm downloads](https://img.shields.io/npm/dm/vietnamese-name-generator)](https://www.npmjs.com/package/vietnamese-name-generator)
[![CI](https://github.com/hungnguyen18/vietnamese-name-generator/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/hungnguyen18/vietnamese-name-generator/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/hungnguyen18/vietnamese-name-generator)](./LICENSE)

The most comprehensive Vietnamese name toolkit for JavaScript/TypeScript. Generate, parse, validate, format, and analyze Vietnamese names with full cultural awareness.

Zero runtime dependencies. Ships as CJS + ESM with full TypeScript declarations.

> **Disclaimer:** This library generates fictional data for testing, development, and educational purposes only. Do not use generated data for identity fraud, impersonation, phishing, social engineering, or any activity that violates applicable laws. Generated names are synthetic and any resemblance to real individuals is coincidental. The authors bear no responsibility for misuse.

## Why this library?

- **No npm alternative** for Vietnamese name parsing, gender detection, or validation
- **Census-weighted** surname distribution (Nguyen 40%, Tran 11%, Le 9%...)
- **Culturally correct** -- regional variants (Hoang/Huynh), gender-encoded middle names, proper honorifics
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
  salutation,
  romanize,
  getHanViet,
  getBirthYearElement,
  generatePetName,
  generateNickname,
} from 'vietnamese-name-generator';

// Generate a realistic Vietnamese name
const name = generate({ seed: 42 });
// { surname: 'Phan', middleName: 'Ngoc', givenName: 'Kim Trang', ... }

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

### Parsing & Validation

| Function | Returns | Description |
|----------|---------|-------------|
| `parseName(input)` | `IParsedName` | Split full name into surname/middle/given |
| `validateName(input)` | `IValidationResult` | Validate Vietnamese name with specific failure reasons |
| `detectGender(input)` | `IGenderResult` | Infer gender from middle + given name signals |

### Formatting & i18n

| Function | Returns | Description |
|----------|---------|-------------|
| `romanize(input)` | `string` | Remove Vietnamese diacritics |
| `formatName(parts, format)` | `string` | Format as full/abbreviated/reversed/slug |
| `salutation(name, options?)` | `ISalutationResult` | Culturally correct Vietnamese honorific |
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

### Enums

| Enum | Values |
|------|--------|
| `EGender` | `male`, `female`, `unisex` |
| `ERegion` | `north`, `central`, `south` |
| `EEra` | `traditional`, `modern` |
| `EMeaningCategory` | `strength`, `virtue`, `nature`, `precious`, `beauty`, `celestial`, `season`, `intellect`, `prosperity` |
| `ENameFormat` | `full`, `abbreviated`, `reversed`, `slug` |
| `EElement` | `kim` (Metal), `moc` (Wood), `thuy` (Water), `hoa` (Fire), `tho` (Earth) |

---

## Vietnamese Naming Culture

### Name Structure

Vietnamese names follow **surname - middle name - given name** order, the reverse of Western convention. In daily life, people are addressed by their **given name** (the last word), not their surname.

| Part | Vietnamese | Example | Role |
|------|-----------|---------|------|
| Surname (Ho) | Ho | Nguyen | Family lineage |
| Middle name (Ten dem) | Ten dem / Ten lot | Van, Thi | Gender marker, generational marker |
| Given name (Ten) | Ten goi | An, Mai | Personal identity -- this is "the name" |

### Why 40% of Vietnam is Named Nguyen

Vietnamese surname concentration is extreme by world standards. About 39% of the population carries the surname Nguyen ([Atlas Obscura](https://www.atlasobscura.com/articles/pronounce-nguyen-common-vietnam)), a direct consequence of **forced surname changes during dynasty transitions** ([MDPI: Onomastic Account of Vietnamese Surnames](https://www.mdpi.com/2313-5778/8/1/16)):

- **1232 (Ly -> Tran):** The Tran dynasty forced Ly families to change their surname to avoid the former emperor's name (ky huy), pushing many to adopt Nguyen
- **1400 (Tran -> Ho):** Ho Quy Ly seized power; many Tran families changed to Nguyen for safety
- **1592 (Mac -> Le restoration):** Mac families adopted Nguyen to avoid persecution
- **1802 (Nguyen dynasty):** The Nguyen lords unified Vietnam; many adopted the ruling surname for favor or protection

The top 14 Vietnamese surnames cover **90%+** of the population ([Wikipedia: Vietnamese name](https://en.wikipedia.org/wiki/Vietnamese_name)): Nguyen (39%), Tran (11%), Le (9.5%), Pham (7.1%), Hoang/Huynh (5.1%), Vu/Vo (3.9%)...

### The Middle Name Encodes Gender

The middle name (ten dem/ten lot) has traditionally served as a **gender marker** ([Vietcetera: Why "Van" and "Thi" are popular](https://vietcetera.com/en/why-are-middle-names-van-and-thi-popular-in-vietnam)):

- **Van** (文, literature) -- marks male names. Usage declining in modern naming
- **Thi** (氏, clan) -- marks female names. Usage declining in modern naming
- **Modern alternatives:** Minh, Gia, Bao, Duc (male); Ngoc, Khanh, Bao (female); An, Minh (unisex)

Middle names also function as **generation markers** ([Wikipedia: Generation name](https://en.wikipedia.org/wiki/Generation_name)) -- siblings and cousins of the same generation share the same middle name, enabling family tree identification.

### Regional Surname Variants

The same Chinese character is read differently by regional dialect ([Cultural Atlas: Vietnamese Naming](https://culturalatlas.sbs.com.au/vietnamese-culture/vietnamese-culture-naming)):

| North | South | Chinese Origin |
|-------|-------|---------------|
| Hoang | Huynh | 黄 (yellow) |
| Vu | Vo | 武 (martial) |

These splits originate from the ky huy (naming taboo) laws of the Nguyen Lords ([Wikipedia: Vietnamese name](https://en.wikipedia.org/wiki/Vietnamese_name)), where the imperial name could not be spoken and regional pronunciations diverged permanently.

### Sino-Vietnamese (Han Viet) Origins

Nearly all Vietnamese given names derive from Chinese characters (Han tu), read in Sino-Vietnamese pronunciation. A single romanized name can map to multiple characters with different meanings:

| Name | Character | Meaning | Alternate | Meaning |
|------|-----------|---------|-----------|---------|
| Minh | 明 | Bright/intelligent | 銘 | Inscribe/remember |
| An | 安 | Peace | 晏 | Calm |
| Thanh | 清 | Pure | 誠 | Sincere |
| Long | 龍 | Dragon | 隆 | Prosperous |

This library includes Han Viet character data for 80+ common names via `getHanViet()`.

### Five Elements (Ngu Hanh) Naming

Vietnamese parents traditionally choose names based on the **Five Elements** ([Feng Shui Master Academy: Baby Names Using Bazi](https://fengshuimasteryacademy.com/how-to-choose-chinese-baby-names-using-bazi-analysis/)) to balance a child's destiny:

| Element | Vietnamese | Chinese | Associated Names |
|---------|-----------|---------|-----------------|
| Metal | Kim | 金 | Kim, Ngan, Bao, Chau |
| Wood | Moc | 木 | Lam, Phong, Xuan, Truc, Mai |
| Water | Thuy | 水 | Thuy, Ha, Hai, Giang, Linh |
| Fire | Hoa | 火 | Quang, Huy, Minh, Hong |
| Earth | Tho | 土 | Son, Binh, An, Thanh, Long |

The birth year determines the child's element via the **Heavenly Stems (Thien Can)** cycle. Parents select names from the **generating element** (tuong sinh) to support the child's destiny.

### Name Taboos (Ky Huy)

Under feudal dynasties, using the emperor's personal name or a near-homophone was forbidden ([Wikipedia: Naming taboo](https://en.wikipedia.org/wiki/Naming_taboo#Vietnam)). This practice permanently altered the Vietnamese name pool:

- Emperor's name banned -> families respelled similar names
- Children were never named after living parents or grandparents
- Some families gave babies **"ugly names" (ten xau de nuoi)** -- Coc (toad), Ty (mouse), Chi (louse) -- to deceive evil spirits who might harm a beautiful child

This library includes a protective nickname generator (`generateNickname()`) honoring this tradition.

### Compound Names (Ten Kep)

Two-syllable given names like Bao Chau, Minh Khoi, or Thanh Ha became popular from the late 20th century. With so few surnames in circulation, compound names reduce ambiguity while adding poetic meaning. Modern compound names often combine two auspicious characters.

### Pet Naming Culture

Vietnamese pet naming is a rich cultural practice ([PetMart.vn](https://www.petmart.vn/dat-ten-cho-cho-bang-tieng-viet)):

- **By appearance**: Vang (gold), Muc (ink), Bong (cotton), Dom (spotted) ([PetChoice.vn](https://petchoice.vn/blogs/news/dat-ten-meo-theo-mau-long))
- **By food**: Pho, Bun, Banh Mi, Xoi -- a uniquely Vietnamese trend
- **By luck**: Tai (wealth), Loc (fortune), Phuc (blessing) -- feng shui influence
- **By humor**: Dai Ca (big boss for tiny dogs), Cau Vang (Mr. Gold, from Nam Cao's literary classic "Lao Hac", 1943)
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

### Academic References

- Phan, J. (2022). "Toward an Onomastic Account of Vietnamese Surnames." *Names*, 70(1). [doi:10.3390/names8010016](https://www.mdpi.com/2313-5778/8/1/16)
- Pham, T.H. et al. (2020). "Gender Prediction Based on Vietnamese Names with Machine Learning Techniques." *ArXiv*. [arxiv.org/abs/2010.10852](https://arxiv.org/abs/2010.10852)
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
