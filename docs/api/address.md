# Address & Honorifics (Xung Ho)

Vietnamese has no universal "you" or "I" -- pronouns encode **age, gender, social status, and emotional distance**. This module implements the full decision tree.

```typescript
import { addressCalculate, pronounPairGet, EFormality, EGender, ERegion } from 'vietnamese-name-generator';
```

---

## `addressCalculate(fullName, options?)`

Calculate the appropriate Vietnamese address term, honorific, and pronoun pair for a person.

Uses a priority-based decision tree:
1. **Professional role** (if provided) takes highest priority
2. **Age-based lookup** (if both ages provided) uses the pronoun pair table
3. **Gender + formality fallback** when no age or role is given

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `fullName` | `string` | Full Vietnamese name (e.g. `'Nguyen Van An'`) |
| `options` | `IAddressOptions` | See options table below |

**Options (`IAddressOptions`):**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `role` | `string` | -- | Professional role key (e.g. `'doctor'`, `'professor'`, `'general'`) |
| `speakerAge` | `number` | -- | Age of the person speaking |
| `addresseeAge` | `number` | -- | Age of the person being addressed |
| `gender` | `EGender` | auto-detected | Override gender detection |
| `formality` | `EFormality` | `'casual'` | Formality level |
| `region` | `ERegion` | `'north'` | Regional dialect |

**Returns:** `IAddressResult`

```typescript
interface IAddressResult {
  honorific: string;           // e.g. 'Ong', 'Ba si', 'Giao su'
  addressTerm: string;         // e.g. 'Ong Nam', 'Bac si Lan'
  fullAddress: string;         // e.g. 'Kinh gui Ong Nam', 'Thua Bac si Lan'
  pronounPair: IPronounPair;   // { self: 'con', addressee: 'ong' }
  category: EHonorificCategory;
  formality: EFormality;
  region: ERegion;
}
```

### Age-based addressing

```typescript
// 25-year-old speaking to 60-year-old
addressCalculate('Nguyen Van Nam', {
  speakerAge: 25,
  addresseeAge: 60,
  region: ERegion.North,
});
// {
//   honorific: 'Ong',
//   addressTerm: 'Ong Nam',
//   fullAddress: 'Ong Nam',
//   pronounPair: { self: 'con', addressee: 'ong' },
//   category: 'age-based',
//   formality: 'casual',
//   region: 'north',
// }
```

### Professional title addressing

```typescript
// Doctor -- professional title takes priority over age
addressCalculate('Tran Thi Lan', {
  role: 'doctor',
  speakerAge: 30,
  addresseeAge: 55,
});
// {
//   honorific: 'Bac si',
//   addressTerm: 'Bac si Lan',
//   pronounPair: { self: 'toi', addressee: 'Bac si' },
//   category: 'professional',
// }
```

### Formality levels

```typescript
// Written formal (letters, official documents)
addressCalculate('Le Minh Tuan', {
  speakerAge: 30,
  addresseeAge: 50,
  formality: EFormality.WrittenFormal,
});
// { fullAddress: 'Kinh gui Chu Tuan', ... }

// Spoken formal (speeches, meetings)
addressCalculate('Le Minh Tuan', {
  speakerAge: 30,
  addresseeAge: 50,
  formality: EFormality.SpokenFormal,
});
// { fullAddress: 'Thua Chu Tuan', ... }

// Intimate (close friends, family)
addressCalculate('Pham Thao', {
  formality: EFormality.Intimate,
});
// { fullAddress: 'Thao oi', ... }
```

### Formality reference

| `EFormality` value | Vietnamese | Usage |
|-------------------|------------|-------|
| `'written-formal'` | Kinh gui + honorific + name | Letters, official documents |
| `'spoken-formal'` | Thua + honorific + name | Speeches, ceremonies, meetings |
| `'professional'` | Honorific + name | Workplace, business contexts |
| `'casual'` | Honorific + name | Daily conversation |
| `'intimate'` | Name + oi | Close friends, family |

---

## `pronounPairGet(speakerAge, addresseeAge, options?)`

Get the Vietnamese pronoun pair (self/addressee) based on relative ages.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `speakerAge` | `number` | Age of the person speaking |
| `addresseeAge` | `number` | Age of the person being addressed |
| `options.gender` | `EGender` | Gender of the addressee |
| `options.region` | `ERegion` | Regional dialect |

**Returns:** `IPronounPair`

```typescript
interface IPronounPair {
  self: string;      // First-person pronoun (how speaker refers to self)
  addressee: string; // Second-person pronoun (how speaker addresses the other)
}
```

### Examples

```typescript
import { pronounPairGet, EGender, ERegion } from 'vietnamese-name-generator';

// Speaking to someone much older (grandparent generation)
pronounPairGet(25, 65, { gender: EGender.Male });
// { self: 'con', addressee: 'ong' }

// Speaking to someone in parent generation
pronounPairGet(25, 45, { gender: EGender.Female, region: ERegion.North });
// { self: 'chau', addressee: 'co' }

// Central Vietnam uses 'o' instead of 'co'
pronounPairGet(25, 45, { gender: EGender.Female, region: ERegion.Central });
// { self: 'chau', addressee: 'o' }

// Same age -- nang principle (treat addressee as older)
pronounPairGet(30, 30, { gender: EGender.Male });
// { self: 'em', addressee: 'anh' }

// Speaking to someone younger
pronounPairGet(40, 25, { gender: EGender.Female });
// { self: 'chi', addressee: 'em' }
```

---

## Age Gap Pronoun Mapping

The age gap is calculated as `addresseeAge - speakerAge`. Positive means the addressee is older.

| Age Gap | Addressee (male) | Addressee (female) | Self | Relationship |
|---------|------------------|---------------------|------|-------------|
| +20 or more | ong | ba | con | Grandparent generation |
| +10 to +19 | chu | co (North/South) / o (Central) | chau | Parent generation |
| +3 to +9 | anh | chi | em | Older sibling |
| -2 to +2 | anh | chi | em | Same age (nang principle) |
| -3 to -9 | em | em | anh / chi | Younger sibling |
| -10 to -19 | chau | chau | chu / co (or o) | Child generation |
| -20 or less | con | con | ong / ba | Grandchild generation |

::: tip The Nang Principle
When ages are similar (-2 to +2 gap), Vietnamese speakers default to treating the addressee as older -- using "em" (self) and "anh/chi" (addressee) -- as a sign of politeness and respect. This is called **nang nguoi doi dien** (elevating the other person).
:::

::: info Regional Variants
Central Vietnam uses distinct terms in some cases:
- **"o"** replaces **"co"** (aunt/older woman in parent generation)
- **"me"** replaces **"ba"** (grandmother) in some dialects
:::

---

## Professional Titles

30+ professional titles across 6 categories. Pass the `role` key to `addressCalculate()`.

### Academic

| Role Key | Vietnamese Title | Abbreviation |
|----------|-----------------|-------------|
| `professor` | Giao su | GS |
| `associate-professor` | Pho Giao su | PGS |
| `phd` | Tien si | TS |
| `master` | Thac si | ThS |
| `bachelor` | Cu nhan | -- |

### Medical

| Role Key | Vietnamese Title |
|----------|-----------------|
| `doctor` | Bac si |
| `pharmacist` | Duoc si |
| `dentist` | Nha si |
| `nurse` | Y ta |

### Legal

| Role Key | Vietnamese Title |
|----------|-----------------|
| `lawyer` | Luat su |
| `judge` | Tham phan |
| `prosecutor` | Cong to vien |

### Military (12 ranks)

| Role Key | Vietnamese Title |
|----------|-----------------|
| `general` | Dai tuong |
| `colonel-general` | Thuong tuong |
| `lieutenant-general` | Trung tuong |
| `major-general` | Thieu tuong |
| `colonel` | Dai ta |
| `senior-lieutenant-colonel` | Thuong ta |
| `lieutenant-colonel` | Trung ta |
| `major` | Thieu ta |
| `captain` | Dai uy |
| `senior-lieutenant` | Thuong uy |
| `lieutenant` | Trung uy |
| `second-lieutenant` | Thieu uy |

### Political

| Role Key | Vietnamese Title |
|----------|-----------------|
| `general-secretary` | Tong Bi thu |
| `president` | Chu tich |
| `prime-minister` | Thu tuong |
| `minister` | Bo truong |
| `deputy-minister` | Thu truong |
| `party-secretary` | Bi thu |
| `comrade` | Dong chi |

### Education

| Role Key | Vietnamese Title | Gender |
|----------|-----------------|--------|
| `teacher-male` | Thay | Male |
| `teacher-female` | Co | Female |

---

## `salutation(name, options?)` (Deprecated)

::: warning Deprecated
Use `addressCalculate()` instead. `salutation()` provides a simplified honorific without age-based pronouns, professional titles, or regional variants.
:::

```typescript
import { salutation } from 'vietnamese-name-generator';

salutation('Nguyen Van Nam', { formality: 'formal' });
// { salutation: 'Ong Nam', honorific: 'Ong', addressName: 'Nam', fullSalutation: 'Kinh gui Ong Nam' }

salutation('Tran Thi Lan', { formality: 'casual' });
// { salutation: 'Chi Lan', honorific: 'Chi', addressName: 'Lan', fullSalutation: 'Chi Lan' }
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `gender` | `'male' \| 'female'` | auto-detected | Override gender |
| `formality` | `'formal' \| 'casual' \| 'professional'` | `'casual'` | Formality level |
