# Vietnamese Naming Culture: Deep Research

> Research conducted for `vietnamese-name-generator` library.
> This document informs data design, feature priorities, and cultural accuracy.

---

## 1. Historical Roots of Vietnamese Surnames

### Chinese Origins (111 BCE onward)

Practically all Vietnamese surnames (ho) are Sino-Vietnamese words that were once written in Chinese characters. The surname system was introduced during the period of Chinese domination (111 BCE - 938 CE). The character for Nguyen (阮) originally referred to an ancient string instrument, Ruan in Mandarin / Yuen in Cantonese. Chinese migrants from the 4th century AD carried this name, and it adapted into Vietnamese as "Nguyen."

### Why Nguyen Accounts for ~40% of the Population

The dominance of Nguyen is the result of multiple forced surname changes across dynasties:

| Period | Event | Surname Change |
|--------|-------|---------------|
| 1232 | Tran Thu Do overthrows Ly dynasty | Ly descendants **forced to become Nguyen** (to erase the name due to taboo around Tran Ly, grandfather of Emperor Tran Canh) |
| ~1400 | Ho Quy Ly overturns Tran dynasty | When Ho dynasty collapsed (1407), Ho descendants changed to **Nguyen** fearing retribution |
| 1592 | Mac dynasty falls | Mac descendants changed to **Nguyen** |
| 1802 | Nguyen dynasty takes power | Trinh Lords' descendants changed to **Nguyen** fearing retribution; commoners without surnames adopted **Nguyen** for favor with officials |
| 1802-1945 | Nguyen dynasty rule | Name awarded to loyalists; many commoners adopted it voluntarily |
| Post-1945 | End of dynastic rule | No more political motivation to change; Nguyen proliferation frozen at ~39% |

**Key nuance:** Contrary to popular belief, it was actually a serious taboo to assume the imperial surname without legitimate lineage. Individuals who improperly adopted the imperial surname could face forced name changes, removal from office, exile, or capital punishment. The surname changes were driven by both coercion (threat of violence) and voluntary adoption (for jobs, privileges, political affiliation).

### Major Surname Frequencies (2022 data)

| Surname | Frequency |
|---------|-----------|
| Nguyen | 31.5% |
| Tran | 10.9% |
| Le | 8.9% |
| Pham | 5.9% |
| Hoang/Huynh | 5.1% |
| Vu/Vo | 4.9% |
| Phan | 2.8% |
| Truong | 2.2% |
| Bui | 2.1% |
| Dang | 1.9% |

### Library Implications

- The library already captures regional surname weights in `INDEX_SURNAME` -- this is correct
- Consider adding: `origin` field with Sino-Vietnamese character (e.g., "Nguyen" -> "阮")
- Consider adding: historical dynasty association metadata
- The weight distribution in the library accurately reflects real-world frequency

### Sources

- [Nguyen - Wikipedia](https://en.wikipedia.org/wiki/Nguyen)
- [Heritage Line Magazine: Mr Nguyen](https://heritage-line.com/magazine/nguyen-surname-in-vietnam/)
- [Ancestry: Exploring Vietnamese Surnames](https://www.ancestry.com/c/ancestry-blog/exploring-your-familys-vietnamese-origin-common-vietnamese-surnames)
- [Language Log: Two-fifths Nguyen](https://languagelog.ldc.upenn.edu/nll/?p=45819)
- [Seasia.co: Nguyen Domination](https://seasia.co/2026/01/16/the-nguyen-domination-in-viet-nam-how-do-40-of-the-population-have-the-same-surname)

---

## 2. Meaning Layers in Vietnamese Given Names

### Han Viet (Sino-Vietnamese) Readings

Vietnamese names have corresponding Han (Chinese) characters. The system called Han Viet allows Vietnamese to read Chinese characters with Vietnamese pronunciation. Nearly all Vietnamese names map to specific Chinese characters, though the same romanized Vietnamese name can correspond to multiple characters with different meanings.

### Dual-Origin System

Vietnamese given names come from two lexical sources:

1. **Sino-Vietnamese (Han Viet):** Derived from Chinese characters. Most traditional and formal names.
   - Minh (明) = bright, intelligent
   - Duc (德) = virtue, moral character
   - Huy (輝) = brightness, radiance
   - Anh (英) = flower, brave, hero, elite
   - Phuc (福) = blessing, good fortune
   - Long (龍) = dragon
   - Bao (寶) = treasure, jewel
   - Ngoc (玉) = jade, precious stone
   - Quoc (國) = nation
   - Thanh (清/誠) = brilliant / sincere

2. **Native Vietnamese (Austroasiatic/Vietic):** Pure Vietnamese vocabulary, especially nature words:
   - Lan = orchid
   - Mai = apricot blossom (spring symbol)
   - Truc = bamboo (resilience)
   - Sen = lotus
   - Hoa = flower
   - Hai = sea
   - Son = mountain
   - Giang = river
   - Van = cloud
   - Tuyet = snow

### Key Naming Characteristic: One Name, Multiple Characters

A critical feature of Vietnamese naming is that the same romanized name can map to different Han Viet characters, each carrying a distinct meaning. For example:
- **Anh** could be 英 (hero), 映 (reflection), 瑛 (crystal)
- **Thanh** could be 清 (clear/pure), 誠 (sincere), 聲 (sound), 青 (green/young)

This means the "meaning" of a Vietnamese name is often ambiguous without knowing which character was intended.

### Common Male Name Meanings

| Name | Han Viet | Meaning |
|------|----------|---------|
| Minh | 明 | Bright, intelligent |
| Duc | 德 | Virtue |
| Huy | 輝 | Radiance, brilliance |
| Hung | 雄 | Heroic |
| Dung | 勇 | Brave |
| Quoc | 國 | Nation |
| Long | 龍 | Dragon |
| Phuc | 福 | Blessing |
| Trung | 忠 | Loyal |
| Hien | 賢 | Wise, virtuous |

### Common Female Name Meanings

| Name | Han Viet | Meaning |
|------|----------|---------|
| Ngoc | 玉 | Jade |
| Lan | 蘭 | Orchid |
| Huong | 香 | Fragrance |
| Diem | 艷 | Graceful |
| Thao | 草 | Kind, gentle |
| Mai | 梅 | Apricot blossom |
| Linh | 靈 | Spirit, soul |
| Trang | 莊 | Elegant |
| Hoa | 華/花 | Flower |
| Ngan | 銀 | Silver |

### Library Implications

- The `TGivenNameEntry` type already has `sinoVietnamese` and `category` fields -- good foundation
- **Should add:** A Han Viet character field (the actual Chinese character) per name entry
- **Should add:** Multiple possible character readings for ambiguous names
- **Should add:** Distinction between Sino-Vietnamese and native Vietnamese origin
- The `EMeaningCategory` enum covers good categories but could add: "loyalty", "wisdom", "family", "water/river", "flower", "animal"

### Sources

- [Vietnamese Name - Wikipedia](https://en.wikipedia.org/wiki/Vietnamese_name)
- [Behind the Name: Vietnamese Names](https://www.behindthename.com/names/usage/vietnamese)
- [Sun Getaways: Vietnamese Names Guide](https://sungetawaystravel.com/vietnamese-names/)
- [Vietnam Airlines: Common Vietnamese Names](https://www.vietnamairlines.com/us/en/plan-book/travel/travel-guide/common-vietnam-names)

---

## 3. Geographic and Regional Naming Patterns

### North-South Surname Splits (Naming Taboo Origin)

The most famous regional difference is **Hoang (North) vs Huynh (South)**, and it is directly caused by imperial naming taboos:

- **Nguyen Hoang** (1525-1613), the first Nguyen Lord, ruled the southern territories
- His personal name "Hoang" (黃) triggered ky huy (naming taboo) laws
- All Southerners with surname Hoang were **forced to change to Huynh** (a phonetic variant of the same character)
- This split persists to this day

Similarly, **Vu (North) vs Vo (South)** split due to the naming taboo of Nguyen Phuc Mien Vu.

### Regional Naming Character

| Aspect | North | Central (Hue) | South |
|--------|-------|---------------|-------|
| **Style** | More conservative, classical Sino-Vietnamese | Poetic, imperial aesthetic influence | Flexible, modern, international |
| **Consonants** | Stronger traditional sounds | Distinctive tonal patterns | More open to new sounds |
| **Gender markers** | Stronger traditional Van/Thi use | Mixed classical/modern | Less rigid gender distinction |
| **Middle names** | Van, Huu, Duc (male); Thi, Ngoc (female) | Van, Duc, Cong (male); Thi, Ngoc, My (female) | Van, Thanh, Huu (male); Thi, Ngoc, Kim (female) |
| **Birth order ref** | Starts at 1 | Varies | Starts at 2 |
| **Addressing** | Surname use more common | Formal, title-heavy | More casual, given name |

### Central Vietnam (Hue) - Imperial Influence

Hue, the seat of the Nguyen dynasty (1802-1945), retains distinctive naming traditions:
- Stronger presence of compound surnames (Ton That, Ton Nu)
- Imperial generational naming poems still followed by descendants
- More elaborate, multi-syllable given names
- Classical literary references more common
- The "Cong Ton Nu" / "Cong Tang Ton Nu" naming system (see Section 7)

### Ethnic Minority Naming Systems

Vietnam has 54 ethnic groups. The Kinh (Viet) majority uses Sino-Vietnamese names; minorities have fundamentally different systems:

**Hmong (H'mong):**
- Clan-based naming system (not surname in the Kinh sense)
- Common clan names: Moua (meaning "horse"), Thao (陶), Vang, Ly, Yang
- Given names signify desired family qualities: "Chai" (strong), "Mai" (blossom)
- Naming strengthens clan identity and community bonds

**Tay and Thai (Northern highlands):**
- Deep connection to nature/ancestors in naming
- Non-Sinitic surname prefixes: A- (as in A Phu), Bu, Nong, Pa
- Color and natural element names: Hoang (yellow/royal), Bach (white)

**Khmer (Mekong Delta, 1M+ population):**
- Given name + father's given name (reverse of Kinh order)
- Names: Sok, Chan, Sorn, Sam
- Women given beauty-related names; men given virtue names
- Common surname: Son

**Cham (Central coast, ~125K):**
- Given name followed by father's given name
- Royal surnames: Tra, Che
- Influenced by both Hindu and Islamic traditions
- Names: Po (honorific), Katip

### Library Implications

- The library correctly separates "north", "central", "south" regions
- The `MAP_REGIONAL_VARIANT` in `surname-info.ts` captures Hoang/Huynh, Vu/Vo -- good
- **Should add:** More regional variant pairs if they exist
- **Should consider:** An ethnic minority mode (separate naming system entirely)
- **Should add:** Central Vietnam compound surname bias (higher weight for Ton That/Ton Nu in central region)

### Sources

- [Vietnamese Name - Wikipedia](https://en.wikipedia.org/wiki/Vietnamese_name)
- [Cultural Atlas: Vietnamese Naming](https://culturalatlas.sbs.com.au/vietnamese-culture/vietnamese-culture-naming)
- [Naming Taboo - Wikipedia](https://en.wikipedia.org/wiki/Naming_taboo)
- [North Vietnam: Ethnic Minorities](https://north-vietnam.com/ethnic-minorities-vietnam/)

---

## 4. Generational and Era Patterns

### Naming Trends Across Decades

**Pre-1945 (Colonial/Imperial era):**
- Heavy Sino-Vietnamese classical names
- Van/Thi middle names near-universal (estimated 80-90%)
- Names reflect Confucian ideals: Duc (virtue), Hieu (filial piety), Trung (loyalty)
- Catholic Vietnamese received saints' names: Phero (Peter), Phaolo (Paul), Maria (Mary)

**1945-1975 (War era):**
- Patriotic and revolutionary names surge
- Common names: Hoa (peace), Chien (battle), Thang (victory), Dung (brave)
- Northern naming reflected socialist ideals
- Southern naming maintained more traditional patterns

**1975-2000 (Reunification/Doi Moi era):**
- Van/Thi use begins declining
- Names start reflecting hope and renewal
- Blend of traditional and emerging modern preferences

**2000-2020s (Modern era):**
- Van/Thi declined to approximately 18% and 16% respectively
- Parents prefer names that are short, easy to pronounce internationally
- K-wave (Korean cultural) influence emerging -- soft, melodic name sounds
- Compound given names increasingly popular: Bao Ngoc, Gia Huy, Minh Khang, An Nhien
- Gender-neutral names rising: An, Bao, Minh
- Nature/aspiration themes: An Nhien (peaceful), Gia Huy (family glory)

**Modern phonetic patterns (from sociolinguistic research):**
- Male names favor strong consonants (55%) and strength-related semantics (40%)
- Female names prefer soft consonants (58%) and beauty-related meanings (55%)
- This gender distinction in sound is weakening among younger generations

### Library Implications

- The library's `EEra` enum has "traditional" and "modern" -- this is a simplification
- **Should consider:** Expanding to finer-grained eras: "classical", "colonial", "revolutionary", "modern"
- The compound given name list in `INDEX_COMPOUND_GIVEN_NAME` captures modern trends well
- **Should add:** War-era and revolutionary naming patterns as a distinct category
- **Should track:** The declining usage of Van/Thi and their modern replacements

### Sources

- [ResearchGate: Modern naming trends in Vietnam (sociolinguistic study)](https://www.researchgate.net/publication/399474567_Modern_naming_trends_in_Vietnam_a_sociolinguistic_study_of_gender_and_culture)
- [Vietcetera: Why Van and Thi Are Popular](https://vietcetera.com/en/why-are-middle-names-van-and-thi-popular-in-vietnam)
- [Sun Getaways: Vietnamese Names](https://sungetawaystravel.com/vietnamese-names/)

---

## 5. Name Taboos and Spiritual Beliefs

### Imperial Name Taboo (Ky Huy / 避諱)

Ky huy is the practice of avoiding the personal names of rulers, ancestors, and deities. It profoundly shaped Vietnamese naming and even everyday vocabulary.

**Documented taboo-induced changes:**

| Ruler | Character | Original Reading | Changed To | Impact |
|-------|-----------|-----------------|-----------|--------|
| Tran Thang | 承 | thang | thua | Pronunciation shift |
| Le Loi | 利 | loi | Variant character used | Written form modified |
| Nguyen Hoang | 黃 | hoang | huynh | **Permanent North/South surname split** |
| Nguyen Kim | 金/今 | cam | kim | Pronunciation shift |
| Nguyen Phuc Chu | 周 | chu | chau | Pronunciation shift |
| Gia Long (Nguyen Phuc Anh) | 映 | anh | yeng | Pronunciation shift |
| Tu Duc | 時 | thi | Replaced with 辰 (thin) | Character substitution |
| Duy Tan | 山 | san | son | Pronunciation shift |
| Trinh Trang | -- | banh trang | banh da | **Common food renamed** (rice paper in Northern dialect) |
| Nguyen Phuc Mien Vu | 武 | vu | vo | **North/South pronunciation split** |

**Methods of taboo avoidance:**
1. Omitting strokes from characters (e.g., Ho Thi Hoa: last stroke of 華 not written)
2. Using variant characters with similar appearance
3. Using similar characters with different readings
4. Phonetic modification (changing pronunciation)

### Not Naming After Living Relatives

Vietnamese families traditionally avoid giving a child the same name as a living elder (grandparent, parent, uncle/aunt). This is an extension of ky huy into the family domain. The belief is that using an elder's name shows disrespect and can bring bad fortune to both the child and the elder.

### "Ugly Names" to Deceive Evil Spirits (Ten Xau De Nuoi)

One of the most distinctive Vietnamese naming traditions:

- Evil spirits (ma qui) are believed to steal beautiful, healthy babies
- Parents deliberately give children ugly or repulsive nicknames to make spirits ignore them
- Common "ugly names": Toad (Coc), Mouse (Chuot), Weasel (Chon), Lice (Ran/Chan)
- The formal name is given later, after the child is deemed safe (traditionally at 1 month)
- The protective phrase "Trom via" (sneaking behind spirits) is spoken before complimenting any baby
- This practice remains common in rural areas and is known even in urban families

### Naming Ceremony (Le Dat Ten)

- Newborns are **not formally named at birth**
- Only close family visit in the first month (infant mortality concern)
- At the **one-month celebration** (day thang), the child receives its formal name
- Before this, only nicknames (often ugly/protective) are used
- A private name may be given at age 2-3
- Some families consult fortune tellers or Buddhist monks for auspicious names

### Library Implications

- **Should add:** A "taboo checker" that flags names historically banned by ky huy
- **Should add:** Cultural notes/warnings when generating names that conflict with known taboos
- The regional variant system already captures Hoang/Huynh -- this is ky huy in action
- **Should consider:** A "protective nickname" generator as a fun/cultural feature
- **Should document:** The one-month naming ceremony tradition in library docs

### Sources

- [Naming Taboo - Wikipedia](https://en.wikipedia.org/wiki/Naming_taboo)
- [Adopt Vietnam: Importance of Vietnamese Names](https://www.adoptvietnam.org/vietnamese/names-vietnamese.htm)
- [Vietnam.vn: Bad Names Are Easier to Raise](https://www.vietnam.vn/en/the-gioi-lon-tu-ho-va-ten-nguoi-viet-ten-xau-de-nuoi)
- [Medium: My Parents Call Me a Rat](https://medium.com/the-masterpiece/my-parents-call-me-a-rat-11a660c5f658)
- [VOV World: Vietnamese Naming](https://vovworld.vn/en-US/culture/vietnamese-naming-172401.vov)

---

## 6. Middle Name (Ten Dem / Ten Lot) Deep Dive

### Van and Thi: Origin and Decline

**Van (文) for males:**
- Means "literature," "culture," "civil"
- Symbolized education and scholarly success
- Originated in feudal period (475-331 BC influence)
- During French colonization, when ~95% of Vietnam was illiterate, poor families defaulted to Van as a conventional choice
- Peak usage: mid-20th century (~80-90% of males)
- Current usage: declined to ~18%

**Thi (氏) for females:**
- Originally meant "clan" or "belonging to" (in Chinese: denoted married women)
- Served as a female identifier
- Carried problematic connotations of women as possessions in the feudal system
- Current usage: declined to ~16%
- Many women named Thi actively omit it in modern usage

### Beyond Van/Thi: Full Middle Name Inventory

**Male middle names:**
| Middle Name | Han Viet | Meaning | Usage Pattern |
|------------|----------|---------|--------------|
| Van | 文 | Literature, culture | Traditional default |
| Huu | 友 | Friend, companion | Traditional |
| Duc | 德 | Virtue, moral character | Traditional/modern |
| Quoc | 國 | Nation | Modern patriotic |
| Cong | 公 | Public, duke | Traditional (Central) |
| Minh | 明 | Bright, intelligent | Modern default |
| Gia | 家 | Family, home | Modern |
| Thanh | 誠/清 | Sincere / Pure | Traditional |
| Quang | 光 | Light, radiance | Traditional |
| Bao | 寶 | Treasure | Modern |
| Hoang | 皇 | Imperial, golden | Modern (South) |

**Female middle names:**
| Middle Name | Han Viet | Meaning | Usage Pattern |
|------------|----------|---------|--------------|
| Thi | 氏 | Clan (female marker) | Traditional default (declining) |
| Ngoc | 玉 | Jade, precious | Traditional/modern |
| Dieu | 妙 | Wondrous, subtle | Traditional |
| Kim | 金 | Gold | Traditional (South) |
| My | 美 | Beautiful | Traditional (Central) |
| Minh | 明 | Bright | Modern |
| Khanh | 慶 | Celebration | Modern (North) |
| Bao | 寶 | Treasure | Modern |
| An | 安 | Peace | Modern |

### Generational Encoding in Middle Names

Middle names serve critical family functions:
1. **Generation marker:** Brothers and sisters share the same middle name, distinguishing them from the generation before and after
2. **Branch separator:** Different family branches use different middle names
3. **Birth order indicator:** Some families use specific middle names for birth order: Manh (first-born), Trong (second-born)
4. **Maternal tribute (modern):** Post-French colonial trend of using the mother's surname as a middle name

### How Middle Names Combine with Given Names

Vietnamese middle names are NOT independent (unlike Western middle names). They function as inseparable prefixes to the given name. "Van Minh" is a unit, not "Van" + "Minh" independently. This is critical for the library's name generation logic.

### Library Implications

- The library's `INDEX_MIDDLE_NAME` data structure is well-organized by gender/region/era
- **Should add:** Han Viet characters for each middle name
- **Should add:** A "generational set" mode where siblings share the same middle name
- **Should add:** Maternal surname-as-middle-name modern option
- **Should expand:** The middle name inventory (currently 3-4 per category; real variety is broader)
- **Critical:** Ensure generated names treat middle + given as a unit, not independent parts

### Sources

- [Vietcetera: Why Van and Thi](https://vietcetera.com/en/why-are-middle-names-van-and-thi-popular-in-vietnam)
- [Vietnamese Name - Wikipedia](https://en.wikipedia.org/wiki/Vietnamese_name)
- [Cultural Atlas: Vietnamese Naming](https://culturalatlas.sbs.com.au/vietnamese-culture/vietnamese-culture-naming)
- [Quora: Structure of Vietnamese Names](https://www.quora.com/What-is-the-structure-of-Vietnamese-names)

---

## 7. Compound Surnames and Royal Naming Conventions

### Nguyen Dynasty Imperial Naming System

Emperor Minh Mang (r. 1820-1841) created the most elaborate naming system in Vietnamese history:

**De He Thi (帝係詩 -- Poem of Imperial Generations):**
A 20-character poem where each character determines the middle name for successive generations:

```
Mien Huong Ung Buu Vinh
Bao Quy Dinh Long Truong
Hien Nang Kham Ke Thuat
The Thoai Quoc Gia Xuong
```

All direct imperial descendants use the surname **Nguyen Phuc** followed by the generational character + personal name. For example:
- Generation 1: Nguyen Phuc **Mien** ___
- Generation 2: Nguyen Phuc **Huong** ___
- Generation 3: Nguyen Phuc **Ung** ___
- Generation 4: Nguyen Phuc **Buu** ___
- etc.

Emperor Bao Dai (the last emperor) was Nguyen Phuc **Vinh** Thuy (5th generation character "Vinh").

Minh Mang also composed **10 additional poems (Phien He Thi)** for the descendants of his brothers, creating parallel generational naming tracks for different branches.

**This system is still followed today** by Nguyen Phuc descendants, even though the dynasty ended in 1945.

### Compound Surnames by Imperial Branch Distance

The Nguyen dynasty created a hierarchical compound surname system based on distance from the reigning emperor:

| Generation from Emperor | Male Title/Surname | Female Title/Surname |
|------------------------|-------------------|---------------------|
| Emperor's brothers | Hoang De | -- |
| 2nd generation | Cong Tu | -- |
| 3rd generation | **Cong Ton** | **Cong Ton Nu** |
| 4th generation | **Cong Tang Ton** | **Cong Tang Ton Nu** |
| 5th generation | **Cong Huyen Ton** | **Cong Huyen Ton Nu** |
| 6th+ generation | **Ton That** | **Ton Nu** |

**Key details:**
- Ton That (尊室) was originally Tong That (宗室, "clan members"), changed due to taboo when Emperor Thieu Tri (birth name Nguyen Phuc Mien **Tong**) took the throne
- Ton Nu (尊女) derives from 孫女 meaning "granddaughter"
- Writing convention: middle words often uncapitalized (e.g., "Cong tang ton Nu Hue Hue")

### Other Compound Surnames (Non-Imperial)

| Compound Surname | Origin |
|-----------------|--------|
| Hoang Phu (皇甫) | Chinese origin (Huangfu) |
| Au Duong (歐陽) | Chinese origin (Ouyang) |
| Thuong Quan (上官) | Chinese origin (Shangguan) |
| Tu Ma (司馬) | Chinese origin (Sima) |
| Gia Cat (諸葛) | Chinese origin (Zhuge) |
| Ha Hau (夏侯) | Chinese origin (Xiahou) |
| Tay Mon (西門) | Chinese origin (Ximen) |

**Administrative problem:** Because almost all Vietnamese surnames are monosyllabic, compound surnames are often incorrectly split: the first syllable treated as surname and the second as middle name. This causes identity and record-keeping issues.

### Library Implications

- The library already has `LIST_COMPOUND_SURNAME` in `surname-info.ts` with 13 entries -- good
- **Should add:** The full imperial branch hierarchy as data
- **Should add:** A `compoundSurname` option in `TGenerateOptions` for generating royal names
- **Should add:** The De He Thi generational poem as a feature (generate names from specific imperial generation)
- **Should fix:** Ensure compound surnames are never incorrectly split during parsing
- **Should add:** The full set of Phien He Thi poems (10 branch poems) if obtainable

### Sources

- [Ton-That - Wikipedia](https://en.wikipedia.org/wiki/Ton-That)
- [Vietnamese Name - Wikipedia](https://en.wikipedia.org/wiki/Vietnamese_name)
- [MDPI: Toward an Onomastic Account of Vietnamese Surnames](https://www.mdpi.com/2313-5778/8/1/16)
- [GQ Trippin: Turns Out I'm Royalty](http://gqtrippin.com/asia/vietnam/im-royalty/)
- [Behind the Name: Cong Tang Ton Nu](https://surnames.behindthename.com/name/cong00tang00ton00nu/submitted)
- [Generation Name - Wikipedia](https://en.wikipedia.org/wiki/Generation_name)

---

## 8. Name and Identity in Vietnamese Philosophy

### Five Elements (Ngu Hanh) and Naming

The Five Elements -- Kim (Metal), Moc (Wood), Thuy (Water), Hoa (Fire), Tho (Earth) -- are a fundamental framework in Vietnamese metaphysics that directly influences naming.

**The Generating Cycle (Tuong Sinh):**
Wood fuels Fire -> Fire creates Earth (ash) -> Earth produces Metal -> Metal carries Water (condensation) -> Water feeds Wood

**The Destructive Cycle (Tuong Khac):**
Wood penetrates Earth -> Earth absorbs Water -> Water extinguishes Fire -> Fire melts Metal -> Metal chops Wood

**Application to naming:**
1. A baby's birth date/time determines their elemental destiny through the **Four Pillars of Destiny (Tu Tru Bat Tu)**
2. A Bazi master analyzes the dominant and lacking elements in the birth chart
3. Names are chosen to **balance** the elemental chart:
   - If lacking Water: names with Thuy (水), Ha (河), Hai (海), Lam (藍)
   - If lacking Fire: names with Quang (光), Huy (輝), Minh (明)
   - If lacking Wood: names with Lam (林), Phong (楓), Xuan (春)
   - If lacking Metal: names with Kim (金), Ngan (銀), Bao (寶)
   - If lacking Earth: names with Son (山), Binh (平), An (安)

**Element names used directly as given names:**
- Kim (金, gold/metal) -- very common female name
- Thuy (水, water) -- common female name
- Lam (林, forest/wood) -- common male name
- Son (山, mountain/earth association) -- common male name

### Numerology in Vietnamese Naming

Numerological practices in Vietnamese naming are influenced by Chinese numerology:
- The number of strokes in the Han Viet characters can be analyzed
- Total stroke count of the full name should be auspicious
- Even/odd balance matters
- This is a specialized practice, primarily used by fortune tellers (thay boi)

### Destiny Belief: A Name Shapes the Person

Core Vietnamese belief: **"ten gi la nguoi nay"** (your name is who you are). This manifests as:
- Parents choosing aspirational names (Duc = virtue, hoping child becomes virtuous)
- Avoiding names with negative homophone associations
- Consulting fortune tellers before registering a name
- Some families changing a child's name if persistent bad luck occurs
- The practice of giving children "milk names" (ten sua) vs formal names

### Library Implications

- **Should add:** An `EElement` enum: Kim, Moc, Thuy, Hoa, Tho
- **Should add:** Element association per given name (which element(s) a name relates to)
- **Should add:** A "balanced name" generator that takes a target element and returns compatible names
- **Should add:** Name-to-element mapping data
- The `EMeaningCategory` could be extended or cross-referenced with elements
- **Should consider:** A birth-year element calculator utility function

### Sources

- [Saigon Local Tour: Vietnamese Zodiac Guide](https://www.saigonlocaltour.com/vietnamese-zodiac-guide/)
- [MoonLich: What is Can Chi?](https://moonlich.com/en/blog/what-is-can-chi)
- [INORIZA Vietnam: Vietnamese Zodiac](https://inorizavietnam.wordpress.com/2026/02/03/the-vietnamese-and-chinese-zodiacs-animals-elements-and-key-differences/)
- [Feng Shui Master Academy: Baby Names Using Bazi](https://fengshuimasteryacademy.com/how-to-choose-chinese-baby-names-using-bazi-analysis/)

---

## Summary: Prioritized Library Enhancements

Based on this research, here are the recommended enhancements ranked by cultural importance and implementation feasibility:

### High Priority (Cultural Accuracy)
1. **Han Viet character data** -- Add Chinese characters to given name entries
2. **Element associations** -- Map names to Five Elements (Ngu Hanh)
3. **Expanded middle name data** -- More options beyond the current 3-4 per category
4. **Imperial compound surname system** -- Full Ton That / Ton Nu / Cong Ton Nu hierarchy

### Medium Priority (Feature Richness)
5. **Generational poem feature** -- Generate names from Minh Mang's De He Thi
6. **Era refinement** -- Expand EEra beyond "traditional"/"modern" to include revolutionary/colonial
7. **Element-based generation** -- Input birth year, output element-compatible names
8. **Taboo awareness** -- Flag or note historically taboo names

### Lower Priority (Cultural Depth)
9. **Ethnic minority naming** -- Separate systems for Hmong, Tay, Khmer, Cham
10. **Protective nickname generator** -- Fun cultural feature (Ten xau de nuoi)
11. **Sibling generation consistency** -- Same middle name for generated "siblings"
12. **Catholic saint name integration** -- Phero, Phaolo, Maria prefixes

---

## 9. Vietnamese Kinship Terms (Xung Ho Gia Dinh)

Vietnamese has one of the most elaborate kinship terminology systems in the world. Every relative has a unique, precise term based on **side of the family** (paternal vs maternal), **gender**, **relative age**, and **generation**. There is no generic word for "uncle" or "aunt" -- each term encodes the exact relationship.

### 9.1 Paternal Side (Ben Noi -- literally "inner side")

The paternal side is traditionally considered the primary lineage.

| Term | Relationship | Notes |
|------|-------------|-------|
| **Ong noi** | Paternal grandfather | Ong = grandfather/elderly man |
| **Ba noi** | Paternal grandmother | Ba = grandmother/elderly woman |
| **Bac** (male) | Father's older brother | Must be older than father; distinguished from Chu |
| **Bac gai** | Wife of Bac | Literally "female Bac" |
| **Chu** | Father's younger brother | Must be younger than father |
| **Thim** | Wife of Chu | Unique term; not interchangeable with Bac gai |
| **Co** | Father's sister (any age) | Age relative to father does not change the term |
| **Duong** | Husband of Co | Same term used for husband of Di (maternal aunt) |
| **Anh ho** | Older male paternal cousin | Ho = "clan" marker for cousins |
| **Chi ho** | Older female paternal cousin | |
| **Em ho** | Younger cousin (either gender) | |

**Key rule:** The Bac/Chu distinction is strictly age-based relative to one's father. If father's brother is older than father, he is always Bac, never Chu, regardless of how the speaker feels about formality.

### 9.2 Maternal Side (Ben Ngoai -- literally "outer side")

The maternal side uses an entirely different set of terms, reflecting the patrilineal bias of Vietnamese kinship.

| Term | Relationship | Notes |
|------|-------------|-------|
| **Ong ngoai** | Maternal grandfather | Same Ong, qualified by ngoai |
| **Ba ngoai** | Maternal grandmother | |
| **Cau** | Mother's brother (any age) | Distinct from Bac/Chu; no age split |
| **Mo** | Wife of Cau | Unique term |
| **Di** | Mother's sister (any age) | Distinct from Co |
| **Duong** | Husband of Di | Same term as husband of Co |
| **Anh/Chi/Em ho** | Maternal cousins | Same terms as paternal cousins |

**Critical distinction:** On the paternal side, the father's brothers are split by age (Bac vs Chu). On the maternal side, the mother's brothers are all Cau regardless of age. This asymmetry reflects the greater social weight historically given to the paternal lineage.

### 9.3 Immediate Family

**Parents -- Regional variants:**

| Region | Father | Mother |
|--------|--------|--------|
| **North (Bac)** | Bo | Me |
| **Central (Trung)** | Bo / Cha / Cau (Hue) | Me / Ma / Ma (Hue) |
| **South (Nam)** | Ba / Tia (Mekong) | Ma / Ma |

- "Cha" is literary/formal, used across all regions in writing
- "Tia" is distinctly Southern, especially Mekong Delta, with Teochew Chinese influence
- "Cau" meaning "father" is specific to Hue and should not be confused with Cau meaning "maternal uncle"

**Siblings:**

| Term | Meaning | Rule |
|------|---------|------|
| **Anh** | Older brother | Speaker must be younger |
| **Chi** | Older sister | Speaker must be younger |
| **Em** | Younger sibling (any gender) | Speaker must be older |

**Strict rule:** Vietnamese has no generic word for "sibling" in everyday speech. You are always either Anh/Chi (older) or Em (younger). Twins default to birth order. This hierarchy extends beyond family into all social interactions.

**Spouse terms:**

| Term | Meaning | Usage |
|------|---------|-------|
| **Chong** | Husband | Standard |
| **Vo** | Wife | Standard |
| **Anh** | Husband (in address) | Wife calls husband Anh |
| **Em** | Wife (in address) | Husband calls wife Em |
| **Ong xa** | Husband (colloquial) | Literally "Mr. faraway" |
| **Ba xa** | Wife (colloquial) | Literally "Mrs. faraway" |

### 9.4 Extended Generations

Vietnamese tracks at least 9 generations with distinct terms:

| Generation | Term | Meaning |
|-----------|------|---------|
| +4 | **Ky** (or Cao) | Great-great-grandparent |
| +3 | **Cu** | Great-grandparent |
| +2 | **Ong/Ba** | Grandparent |
| +1 | **Cha/Me** | Parent |
| 0 | **Ego** | Self |
| -1 | **Con** | Child |
| -2 | **Chau** | Grandchild |
| -3 | **Chat** | Great-grandchild |
| -4 | **Chut** | Great-great-grandchild |

Some families extend further: **Chit** (-5), with regional variation. The term "So" is used in some Central/Southern dialects for generations +4 or +5.

### Sources

- Pham, A. (2013). *The Vietnamese Kinship System*. In *Studies in Vietnamese Linguistics*. LINCOM Europa.
- Luong, H.V. (1990). *Discursive Practices and Linguistic Meanings: The Vietnamese System of Person Reference*. John Benjamins Publishing.
- [Vietnamese Name - Wikipedia](https://en.wikipedia.org/wiki/Vietnamese_name)
- [Cultural Atlas: Vietnamese Culture - Communication](https://culturalatlas.sbs.com.au/vietnamese-culture/vietnamese-culture-communication)
- [SEAlang Library: Vietnamese Kinship](http://sealang.net/sala/archives/pdf4/cooke1968vietnamese.pdf) -- Cooke (1968), "Vietnamese Kinship Terminology"

---

## 10. Age-Based Address System (Non-Family Pronoun System)

Vietnamese has no true pronouns in the Western linguistic sense. Instead, speakers use **kinship terms as pronouns**, selecting the appropriate term based on the estimated age difference between speaker and listener. This system is called "xung ho" and is central to Vietnamese pragmatics.

### 10.1 The Social Calculation

When two Vietnamese strangers meet, they perform a rapid mental calculation:

1. **Estimate the other person's age** (by appearance)
2. **Compare to one's own age**
3. **Select the appropriate pair**: one term for self, one term for the other person

| Other person's estimated age | You call them | You call yourself |
|-----------------------------|--------------|------------------|
| ~Your parents' age or older | **Bac** (safe default), **Chu/Co** | **Chau** (grandchild) or **Con** (child) |
| ~10-20 years older, male | **Anh** | **Em** |
| ~10-20 years older, female | **Chi** | **Em** |
| ~Same age | **Ban** (friend) or **Anh/Chi** (safer) | **Minh/Toi** |
| ~Younger | **Em** | **Anh** (male) / **Chi** (female) |
| Elderly (grandparent age) | **Ong** (male) / **Ba** (female) | **Chau** or **Con** |
| Child | **Con** or **Chau** | **Co/Chu/Bac** (depending on own age) |

### 10.2 Self-Reference Pronouns

| Pronoun | Register | Usage |
|---------|----------|-------|
| **Toi** | Neutral/formal | Safe default; slightly distant |
| **Minh** | Intimate/casual | Between close friends; also means "self" |
| **Tao** | Very informal/rude | Between very close male friends; or expressing anger |
| **Ta** | Literary/royal | Used in writing, songs; archaic self-reference |
| **Anh** | Male speaker to younger | Self-reference when speaking to Em |
| **Chi** | Female speaker to younger | Self-reference when speaking to Em |
| **Em** | Younger speaker | Self-reference when speaking to Anh/Chi |
| **Con** | Child to parent/elder | Self-reference showing deference |
| **Chau** | Young person to grandparent-age | Self-reference showing deference |

### 10.3 Second-Person Address

| Pronoun | Register | Usage |
|---------|----------|-------|
| **Anh** | Respectful to older male | Default for men slightly older than you |
| **Chi** | Respectful to older female | Default for women slightly older than you |
| **Em** | Affectionate to younger person | Gender-neutral for younger people |
| **Ong** | Formal/elderly male | Also used in anger toward equals (implication: "old man") |
| **Ba** | Formal/elderly female | Also used sarcastically |
| **Chu** | Male ~father's younger brother age | Polite for middle-aged men |
| **Co** | Female ~father's sister age | Polite for young-to-middle-aged women; also "teacher" |
| **Bac** | Male/female ~parent's older sibling age | Safe, respectful default for older adults |
| **May** | Very informal/rude | Equivalent of Tao; intimate or hostile |
| **Ban** | Friend/peer | Neutral, often used with strangers of same age |

### 10.4 North vs South Differences

| Aspect | North | South |
|--------|-------|-------|
| **Default for unknown women** | Chi (if young), Co (if older) | Co (broader usage, even for young women) |
| **"You" among friends** | Cau (informal male), May (very close) | May (more common, less rude connotation) |
| **"I" among friends** | To (informal), Tao | Tui (Southern informal), Tao |
| **Children to parents** | Con (universal) | Con (universal) |
| **Spouse address** | Anh/Em (standard) | Anh/Em, but also Minh (intimate) |
| **Stranger formality** | Higher default formality | More relaxed, quicker to use casual terms |
| **"Miss/Ms."** | Co (implies younger) | Co (broader, less age-specific) |

**Southern-specific:** "Tui" (I, informal) is distinctly Southern and immediately marks the speaker's regional origin. Similarly, "Ui" as an exclamation vs Northern "Oi."

### 10.5 Professional and Formal Contexts

| Context | Address pattern |
|---------|----------------|
| **Student to teacher** | Student = Con/Em, Teacher = Thay (male) / Co (female) |
| **Employee to boss** | Employee = Em, Boss = Anh/Chi or Sap (slang) |
| **To a doctor** | Bac si (doctor) + given name |
| **In court/government** | Thua + title (Thua ong chu tich = "Honorable Mr. Chairman") |
| **Business letter** | Kinh gui Ong/Ba + full name |

### 10.6 The Pragmatic Weight

Choosing the wrong term has real social consequences:

- Calling someone **Anh** when they are clearly **Chu/Bac** age = disrespectful (making them seem young is not flattering in Vietnamese culture)
- Calling someone **Chu/Bac** when they are your age = insulting (making them seem old)
- Using **Tao/May** with non-intimate people = aggressive or vulgar
- Using **Toi** with close friends = cold, creating emotional distance
- Calling a woman **Ba** when she is young = extremely rude

### Sources

- Luong, H.V. (1990). *Discursive Practices and Linguistic Meanings: The Vietnamese System of Person Reference*. John Benjamins Publishing.
- Pham, T.H. (2002). "Vietnamese Address Pronouns and the Social Self." In *Language and Social Identity in Vietnamese*. University of Hawai'i Press.
- [Cultural Atlas: Vietnamese Communication](https://culturalatlas.sbs.com.au/vietnamese-culture/vietnamese-culture-communication)
- [Vietnamese Pronouns - Wikipedia](https://en.wikipedia.org/wiki/Vietnamese_pronouns)
- [Vietcetera: Vietnamese Pronouns Explained](https://vietcetera.com/en/the-ultimate-guide-to-vietnamese-pronouns)

---

## 11. Library Implications for Kinship and Address Systems

### For the `salutation.ts` module

The current implementation only handles Ong/Ba (formal) and Anh/Chi (casual). It should be expanded:

1. **Add age-based selection** -- Accept an `age` or `ageRelation` parameter to pick the correct honorific (Chu, Co, Bac, Em, etc.)
2. **Add regional mode** -- Southern Co vs Northern Chi defaults for unknown women
3. **Add relationship context** -- Professional (Thay/Co for teachers, Bac si for doctors)
4. **Add self-reference** -- Return the appropriate self-pronoun alongside the honorific

### New module candidates

- **`kinship.ts`** -- A kinship term resolver: given a relationship description (e.g., "father's older brother"), return the correct Vietnamese term and its regional variants
- **`address.ts`** -- An age-based address calculator: given speaker age, listener age, gender, region, and formality, return the correct pronoun pair (self-reference + address term)

### Data structure suggestion

```typescript
// In types.ts
enum EKinshipSide {
  Paternal = 'paternal',  // Ben noi
  Maternal = 'maternal',  // Ben ngoai
  Immediate = 'immediate',
}

interface IKinshipTerm {
  term: string;           // Vietnamese term (e.g., "Chu")
  relationship: string;   // English description
  side: EKinshipSide;
  gender: EGender;
  generationDiff: number; // +1 = one generation up, -1 = one down
  regionVariant?: Partial<Record<ERegion, string>>;
}

interface IAddressPair {
  selfTerm: string;       // How speaker refers to self
  addressTerm: string;    // How speaker addresses listener
  formality: TFormality;
  region: ERegion;
}
```

### Priority

- **High:** Expanding `salutation.ts` with age-based honorifics (immediate practical value)
- **Medium:** Kinship term data module (cultural reference value)
- **Lower:** Full pronoun pair calculator (complex, niche use case)
