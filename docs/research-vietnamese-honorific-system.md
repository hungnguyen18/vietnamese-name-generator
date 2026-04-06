# Vietnamese Honorific & Address System: Consolidated Research

> Consolidated from 4 parallel research streams for `vietnamese-name-generator` library.
> This document serves as the single source of truth for implementing the honorific/title system.

---

## Research Coverage

| Document | File | Scope |
|----------|------|-------|
| Feudal Honorifics | `research-vietnamese-feudal-honorifics.md` | Royal court, Cửu phẩm, khoa cử, commoner terms |
| Kinship & Age-Based | `research-vietnamese-naming-culture.md` (Sections 9-11) | Family terms, pronoun system, regional variants |
| Modern & Religious | `research-vietnamese-modern-titles-and-religious-honorifics.md` | Colonial, military, academic, religious titles |
| Address Pragmatics | `research-vietnamese-address-pragmatics.md` | Decision algorithm, pronoun pairs, formality levels |
| GenZ/Gen Alpha | `research-vietnamese-genz-address-terms.md` | MXH, teencode, English borrowings, LGBTQ+, gender-neutral |
| Regional Variations | `research-vietnamese-regional-address-variations.md` | Hà Nội, Huế, Nghệ Tĩnh, Sài Gòn, Tây Nam Bộ, Tây Nguyên |

---

## System Architecture Summary

### 7 Categories of Vietnamese Titles/Honorifics

#### 1. Royal/Imperial (Hoàng tộc) — Feudal era
- **Emperor**: Hoàng đế, Quốc vương, Thiên tử, Vua
- **Consorts**: Hoàng hậu → Hoàng Quý phi → 9-rank Phi/Tần system (Phi, Tần, Tiếp dư, Quý nhân, Mỹ nhân, Tài nhân)
- **Princes**: Thái tử, Hoàng tử, Thân vương, Quận vương
- **Princesses**: Công chúa, Quận chúa, Huyện chúa
- **Nobility**: Vương > Công > Hầu > Bá > Tử > Nam

#### 2. Mandarin/Official (Quan lại) — Feudal era
- **Cửu phẩm**: 9 ranks × 2 grades (Chánh/Tòng) = 18 grades
- **Key positions**: Thượng thư (2nd), Tổng đốc (2nd-3rd), Tuần phủ (3rd-4th), Tham tri (3rd), Tri phủ (5th), Tri huyện (6th)
- **Civil vs Military** parallel hierarchy
- **Address**: Quan + title, self-deprecate as "dân" or "tiểu nhân"

#### 3. Scholar (Khoa cử) — Feudal era
- **Examination ladder**: Tú tài → Cử nhân → Tiến sĩ → Tam Khôi (Trạng nguyên, Bảng nhãn, Thám hoa)
- **Address**: Thầy (for scholars), Quan Trạng (for Trạng nguyên)

#### 4. Family/Kinship (Thân tộc) — All eras
- **Paternal (nội)**: Ông nội, Bà nội, Bác/Chú (age-split), Bác gái/Thím, Cô/Dượng
- **Maternal (ngoại)**: Ông ngoại, Bà ngoại, Cậu/Mợ (no age-split), Dì/Dượng
- **Immediate**: Cha/Ba/Bố/Tía (regional), Mẹ/Má/Mạ (regional), Anh/Chị/Em (strict birth-order)
- **Extended**: Kỵ (+4) → Cụ (+3) → Ông/Bà (+2) → Cha/Mẹ (+1) → Ego → Con (-1) → Cháu (-2) → Chắt (-3) → Chút (-4)
- **Spouse**: Chồng/Vợ (reference), Anh/Em (address), Ông xã/Bà xã (colloquial)

#### 5. Age-Based Pronouns (Xưng hô) — All eras
- **Pronoun pairs are dyadic**: choosing "I" constrains "you"
- **18+ documented pairs**: Con-Mẹ, Cháu-Bác, Em-Anh, Tôi-Ông, Mình-Mình, Tao-Mày, etc.
- **"Nâng" principle**: When age is ambiguous, default to older-status term
- **Regional split**: North more formal (Tớ/Cậu), South more relaxed (Tui/Mày)

#### 6. Modern Professional/Political — Post-1945
- **Academic**: GS, PGS, TS, ThS (stacking convention: GS.TS)
- **Medical**: Bác sĩ, Dược sĩ, Nha sĩ
- **Legal**: Luật sư, Thẩm phán
- **Military**: Đại tướng → Thượng tướng → Trung tướng → Thiếu tướng → Đại tá → ... → Binh nhì (same for Police)
- **Political**: Tổng Bí thư, Chủ tịch, Thủ tướng, Bộ trưởng, Bí thư
- **"Đồng chí"**: Party-context only, failed as universal term
- **Thầy/Cô**: Extends beyond school to any mentor/master relationship

#### 7. Religious — All eras
- **Buddhism**: Hòa thượng (40+ years) > Thượng tọa (25+) > Đại đức (20+) > Tỳ kheo > Sa di. Female: Ni sư > Sư cô > Tỳ kheo ni > Sa di ni. Lay address: "Bạch" + title or "Thầy"
- **Catholicism**: Giáo hoàng > Hồng y > Tổng Giám mục > Giám mục ("Đức Cha") > Linh mục ("Cha") > Phó tế ("Thầy"). Nữ tu ("Sơ"/"Dì")
- **Cao Đài**: Giáo tông > Chưởng pháp > Đầu sư > Phối sư > Giáo sư > Giáo hữu > Lễ sanh. Plus Hộ pháp/Thượng phẩm/Thượng sanh (Legislative)
- **Hòa Hảo**: Deliberately non-hierarchical — Ông/Bác only
- **Folk**: Thầy cúng, Thầy pháp, Bà đồng, Thầy bói

---

## The Address Algorithm (5 Formality Levels)

| Level | Pattern | Example | Context |
|-------|---------|---------|---------|
| 1. Written Formal | Kính gửi + title + full name | Kính gửi Ông Nguyễn Văn Minh | Letters, legal docs |
| 2. Spoken Formal | Thưa + title + given name | Thưa Thầy Minh | Ceremonies, first meetings |
| 3. Professional | Title + given name | Giám đốc Minh, Bác sĩ Lan | Workplace |
| 4. Casual | Kinship term + given name | Anh Minh, Chị Lan | Daily conversation (DEFAULT) |
| 5. Intimate | Given name / nickname | Minh ơi!, Bé | Family, lovers, close friends |

### Decision Priority
1. Family relationship (if exists, use exact kinship term)
2. Institutional role (teacher, doctor, monk → use role title)
3. Age difference (estimate gap → select kinship-metaphor term)
4. Formality modifier (apply prefix: Kính gửi / Thưa / none)

---

## Key Cultural Rules for Implementation

1. **Address by given name, NOT surname** — "Anh Minh", never "Ông Nguyễn"
2. **Pronoun pairs are asymmetric** — if A="anh", B must be "em"
3. **"Nâng" (elevate)** — when uncertain, use the older-status term
4. **Regional variants matter** — Bố/Mẹ (North) vs Ba/Má (South)
5. **Thầy/Cô extends beyond school** — any mentor/master relationship
6. **"Đồng chí" is Party-only** — not daily conversation
7. **Professional titles used as address** — "Bác sĩ Lan", not "Cô Lan" in clinical settings
8. **Age > job title in casual settings** — a 50-year-old janitor calls 25-year-old CEO "em"
9. **"Tôi" sounds cold in family** — use kinship self-reference instead
10. **Title stacking is Vietnamese convention** — GS.TS.BS is normal

---

## 8. GenZ / Gen Alpha Address (Xưng hô thế hệ mới)

### Social Media Pronouns
- **mình/bạn** — safest default online (teencode: mk/mik, bn)
- **cậu-tớ** — revived Hà Nội pair, close friends, symmetric
- **mày-tao** — normalized online among Gen Z peers (was considered rude)
- **tui** — Southern origin, adopted nationwide online for its "cute" tone

### New Innovations (2024-2026)
- **"mày ní"** — "you guys" affectionate, from Threads 2024
- **"bánh"** — first-person pronoun from meme (Khá Bảnh), 2024
- **"bồ"** — Saigon slang for boyfriend/girlfriend
- **"nè"** — Southern particle, doubles as soft address marker

### English Borrowings
- **bestie, bro, sis** — peer address (bestie ơi!)
- **babe/bae, crush** — romantic address
- **idol, senpai** — fan-to-creator address

### Ironic/Playful Elevation
- **ông/bà** among same-age friends — mock-elevation tease
- **thím** (auntie) — meme culture self-reference
- **chế** — Southern, cross-gender playful address

### Gender-Neutral & LGBTQ+
- **chanh** (chị + anh = lemon) — non-binary pronoun, diaspora origin
- **cam, quýt** — related non-binary coinages
- **chị** used by gay men among themselves (camp culture)
- **anh/em** in same-sex couples follows age, not gender
- Name-only strategy to avoid gendered pronouns

### Generational Shift Patterns
- **"Xưng tên"** trend — girls use own name as "I" (Linh muốn ăn cơm)
- **Code-switching**: formal (parents) → casual Vietnamese (peers) → online-hybrid (MXH)
- **Formality survives** with: parents, teachers, job interviews, government
- **TikTok convergence** — regional slang spreads nationally within days

### Teencode Address Forms

| Standard | Teencode | Meaning |
|----------|----------|---------|
| mình | mk, mik | I/me |
| bạn | bn | you |
| anh/chị | ac | older sibling |
| không | ko, k, khum | no (khum = cute) |

---

## 9. Regional Address Variations (Chi tiết vùng miền)

### Cross-Regional Comparison (16 terms)

| Relationship | Hà Nội | Huế | Nghệ Tĩnh | Sài Gòn | Mekong |
|-------------|--------|-----|------------|---------|--------|
| Father | Bố | **Cậu** | **Bọ** | Ba | **Tía**/Ba |
| Mother | Mẹ | **Mạ** | Mẹ/Mạ | **Má** | Má/**Bà Già** |
| Grandfather | Ông | **Ôn** | Ông | Ông | Ông/**Ngoại** |
| Grandmother | Bà | **Mệ** | Bà | Bà | Bà/**Ngoại** |
| Older brother | Anh | Anh | **Eng** | Anh | Anh/**Hai** |
| Older sister | Chị | **O** | **Ả** | Chị/**Chế** | Chị |
| Paternal aunt | Cô | **O** | **O** | Cô | Cô |
| "I" (casual) | **Tớ**/Tôi | **Tau** | Tau | **Tui** | **Qua** (older→younger) |
| "You" (intimate) | **Cậu** | **Mi** | Mi | Bạn/Mày | **Bây** (plural) |
| "Yes" (polite) | **Vâng** | Dạ/Vâng | Vâng | **Dạ** | **Dạ** |
| Birth-order first | **Cả** (eldest) | Hai | Hai | **Hai** | **Hai** |
| Formal opening | Kính thưa | Kính thưa/**Bẩm** | Kính thưa | Thưa | Thưa |
| Stranger (older) | **Bác** (default) | Ông/Bà | Ông/Bà | Anh/Chị | Anh/Chị |

### Huế Specifics
- **Cậu = cha** (NOT maternal uncle) — unique to Huế
- **Mi-tau** pair — intimate, perceived rude outside Huế
- **O** = young woman/paternal aunt
- **Mệ** = grandmother (not standard Bà)
- Most elaborate honorific layering (imperial legacy)

### Nghệ Tĩnh Specifics
- **Eng** = anh, **Ả** = chị, **Bọ** = cha (phonetic shifts, not slang)
- **Tau-mi** pair similar to Huế but different tonal realization
- Reduced tone system (4-5 vs standard 6) affects all address terms

### Tây Nam Bộ (Mekong) Specifics
- **Tía** (Teochew origin) for father, **Bà Già** (affectionate) for mother
- **Qua** = I/me (older person to younger) — Mekong-exclusive
- **Bây** = plural "you" — Mekong-exclusive
- **Birth-order system**: Hai, Ba, Tư, Năm, Sáu, Bảy, Tám, Chín, Mười (2-10)
- **Chế** (Teochew "ché") = older sister
- **Khmer influence**: lok (Mr.), neang (young woman) in border provinces

### Ethnic Minorities
- **Ê-đê**: Ama (father), Amí (mother), Aduê (younger), Ayong (older) — matrilineal
- **Hmong/Tày**: "A" prefix for familiar address (A Phủ, A Sử)
- **Tày-Nùng**: lung (uncle), pa (father) code-switched into Vietnamese

---

## Sources (Consolidated)

### Academic
- Luong, Hy Van (1990). *Discursive Practices and Linguistic Meanings*. John Benjamins.
- Thompson, Laurence C. (1987). *A Vietnamese Reference Grammar*. University of Hawaii Press.
- Pham, Andrea (2002). "Vietnamese Address Forms." *Journal of Pragmatics*.
- Marr, David (1981). *Vietnamese Tradition on Trial, 1920-1945*. UC Press.
- DeFrancis, John (1977). *Colonialism and Language Policy in Viet Nam*. Mouton.
- Cooke, Joseph R. (1968). "Vietnamese Kinship Terminology." SEAlang Library.

### Web
- Cultural Atlas: Vietnamese Culture (culturalatlas.sbs.com.au)
- Wikipedia: Vietnamese pronouns, Vietnamese nobility, Caodaism, Confucian examination system
- Vietcetera: Vietnamese Pronouns, How to Address Vietnamese People, Gen Z Internet Slang
- Vietnam Law Magazine: State structure articles
- Phat Giao: Buddhist rank explanations
- EasyPeasyVietnamese: Hottest Vietnamese Slang 2024
- Kaiwa Blog: Vietnamese Social Media Language, Gen Z Slang 2026
- Asian American Writers' Workshop: "Fruits of the Future" (chanh non-binary pronoun)
- Vietnamese Guru: Addressing People in Vietnamese
- Ling App: Vietnamese Dialects, LGBTQ+ terms
- Translation Journal: Translation of Vietnamese Terms of Address
