# Vietnamese Naming Culture

This page covers the cultural context behind Vietnamese names -- the history, rules, and traditions that this library encodes.

## Name Structure

Vietnamese names follow **surname - middle name - given name** order, the reverse of Western convention. In daily life, people are addressed by their **given name** (the last word), not their surname.

| Part | Vietnamese | Example | Role |
|------|-----------|---------|------|
| Surname (Ho) | Ho | Nguyen | Family lineage |
| Middle name (Ten dem) | Ten dem / Ten lot | Van, Thi | Gender marker, generational marker |
| Given name (Ten) | Ten goi | An, Mai | Personal identity -- this is "the name" |

::: tip
When addressing a Vietnamese person, use their **given name** (last part), not their surname. "Ong An" is correct, not "Ong Nguyen" (since ~40% of the country shares the Nguyen surname).
:::

## Why ~40% of Vietnam is Named Nguyen

Vietnamese surname concentration is extreme by world standards. Approximately 38-40% of the population carries the surname Nguyen, a direct consequence of **forced surname changes during dynasty transitions**:

- **1232 (Ly -> Tran):** The Tran dynasty forced Ly families to change their surname to avoid the former emperor's name (ky huy), pushing many to adopt Nguyen
- **1400-1407 (Tran -> Ho):** Ho Quy Ly seized power; when the Ho dynasty fell, Ho descendants changed to Nguyen for safety
- **1592 (Mac -> Le restoration):** Mac families adopted Nguyen to avoid persecution
- **1802 (Nguyen dynasty):** The Nguyen lords unified Vietnam; many adopted the ruling surname for favor or protection

The top 14 Vietnamese surnames cover **90%+** of the population: Nguyen (~38-40%), Tran (~11%), Le (~9.5%), Pham (~7.1%), Hoang/Huynh (~5.1%), Vu/Vo (~3.9%).

This library weights surname generation according to these census frequencies via `generate()`.

## The Middle Name Encodes Gender

The middle name (ten dem/ten lot) has traditionally served as a **gender marker**:

- **Van** (literature) -- marks male names. Usage declining in modern naming
- **Thi** (clan) -- marks female names. Usage declining in modern naming
- **Modern alternatives:** Minh, Gia, Bao, Duc (male); Ngoc, Khanh, Bao (female); An, Minh (unisex)

Middle names also function as **generation markers** -- siblings and cousins of the same generation share the same middle name, enabling family tree identification.

The `detectGender()` function uses middle name signals (Van, Thi, etc.) as a high-confidence gender indicator.

## Regional Surname Variants

The same Chinese character is read differently by regional dialect:

| North | South | Chinese Origin |
|-------|-------|---------------|
| Hoang | Huynh | (yellow) |
| Vu | Vo | (martial) |

These splits originate from the ky huy (naming taboo) laws of the Nguyen Lords, where the imperial name could not be spoken and regional pronunciations diverged permanently.

Use `getRegionalVariant(surname, region)` to convert between variants.

## Sino-Vietnamese (Han Viet) Origins

Nearly all Vietnamese given names derive from Chinese characters (Han tu), read in Sino-Vietnamese pronunciation. A single romanized name can map to multiple characters with different meanings:

| Name | Character | Meaning | Alternate | Meaning |
|------|-----------|---------|-----------|---------|
| Minh | 明 | Bright/intelligent | 銘 | Inscribe/remember |
| An | 安 | Peace | 晏 | Calm |
| Thanh | 清 | Pure | 青 | Blue/green |
| Long | 龍 | Dragon | 隆 | Prosperous |

This library includes Han Viet character data for 80+ common names via `getHanViet()`.

## Five Elements (Ngu Hanh) Naming

Vietnamese parents traditionally choose names based on the **Five Elements** to balance a child's destiny:

| Element | Vietnamese | Chinese | Associated Names |
|---------|-----------|---------|-----------------|
| Metal | Kim | 金 | Kim, Ngan, Bao, Chau |
| Wood | Moc | 木 | Lam, Phong, Xuan, Truc, Mai |
| Water | Thuy | 水 | Thuy, Ha, Hai, Giang, Linh |
| Fire | Hoa | 火 | Quang, Huy, Minh, Hong |
| Earth | Tho | 土 | Son, Binh, An, Thanh, Long |

The birth year determines the child's element via the **Heavenly Stems (Thien Can)** cycle. Parents select names from the **generating element** (tuong sinh) to support the child's destiny.

Use `getBirthYearElement(year)` and `getNamesByElement(element)` for Five Elements lookups.

## Name Taboos (Ky Huy)

Under feudal dynasties, using the emperor's personal name or a near-homophone was forbidden. This practice permanently altered the Vietnamese name pool:

- Emperor's name banned -- families respelled similar names
- Children were never named after living parents or grandparents
- Some families gave babies **"ugly names" (ten xau de nuoi)** -- Coc (toad), Ty (mouse), Chi (louse) -- to deceive evil spirits who might harm a beautiful child

This library includes a protective nickname generator honoring this tradition via `generateNickname()`.

## The Pronoun System (Xung Ho)

Vietnamese is one of the world's most complex pronoun systems. There is no universal "I" or "you" -- speakers must choose from dozens of pronoun pairs based on relative age, social status, gender, and emotional closeness:

| Self (Xung) | Addressee (Ho) | When to use |
|-------------|----------------|-------------|
| con | ong/ba | Speaking to grandparent-age person |
| chau | chu/co/bac | Speaking to parent-age person |
| em | anh/chi | Speaking to someone older (sibling generation) |
| toi | anh/chi/ong/ba | Formal/neutral contexts |
| anh/chi | em | Speaking to someone younger |
| minh | ban | Close friends of same age |

### Key cultural principles

- **Nang principle (nang nguoi doi dien):** When ages are similar, Vietnamese speakers default to treating the addressee as older -- using "em" (self) and "anh/chi" (addressee) -- as a sign of politeness and respect
- **Professional override:** Professional titles (Bac si, Giao su, Thay/Co) always take precedence over age-based pronouns in professional contexts
- **Regional variation:** Central Vietnam uses distinct terms -- "o" replaces "co" (aunt), "me" replaces "ba" (grandmother) in some dialects
- **Formality markers:** "Kinh gui" (written formal), "Thua" (spoken formal), "oi" (intimate) modify the address term

See the full [Address & Honorifics API](/api/address) for the complete implementation.

## Compound Names (Ten Kep)

Two-syllable given names like Bao Chau, Minh Khoi, or Thanh Ha became popular from the late 20th century. With so few surnames in circulation, compound names reduce ambiguity while adding poetic meaning. Modern compound names often combine two auspicious characters.

Use `generate({ compoundName: true })` to generate compound given names.

## Cross-Cultural Naming Trends (GenZ/Gen Alpha)

Vietnamese naming culture is evolving rapidly under Japanese, Korean, and Western influences:

- **Japanese influence (anime/manga):** Names like Sakura, Hana, Ren, Akira are increasingly used by Vietnamese parents. Many Japanese names have phonetic compatibility with Vietnamese (e.g., Mei ~ Mai, Akira's kanji 明 = Minh in Han Viet)
- **Korean influence (K-pop/K-drama):** Names like Jimin, Ha-eun, Min-jun are adapted via Han-Viet phonetic mapping (e.g., Ha-eun -> Ha An, Min-jun -> Min Tuan)
- **Western influence:** Short, internationally pronounceable names (Leo, Mia, Kai) are popular. The "Kevin Nguyen" meme reflects the Viet diaspora naming pattern
- **GenZ nickname culture:** Vietnamese GenZ creates nicknames by mixing languages -- Japanese suffixes (-chan, -kun), Korean honorifics (oppa, unnie), syllable doubling (Mimi, Nana), cute food/animal names (Xoai, Gau), and social media handle patterns

Use `generate({ style: 'japanese' })` for cross-cultural names, or `generateGenZNickname()` for GenZ nicknames.

## Pet Naming Culture

Vietnamese pet naming is a rich cultural practice:

- **By appearance**: Vang (gold), Muc (ink), Bong (cotton), Dom (spotted)
- **By food**: Pho, Bun, Banh Mi, Xoi -- a uniquely Vietnamese trend
- **By luck**: Tai (wealth), Loc (fortune), Phuc (blessing) -- feng shui influence
- **By humor**: Dai Ca (big boss for tiny dogs), Cau Vang (Mr. Gold, from Nam Cao's literary classic "Lao Hac", 1943)
- **Modern trends**: anime names (Luna, Totoro), K-drama influence, English names

This library includes 150+ pet names across 7 categories via `generatePetName()`.
