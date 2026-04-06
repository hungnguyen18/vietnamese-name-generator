# Vietnamese Address Pragmatics: The Logic of Honorific Selection

> Research for `vietnamese-name-generator` library -- algorithm design reference.
> This document defines the decision tree for programmatic honorific/pronoun selection.

---

## 1. The Address Calculation Algorithm

Vietnamese speakers perform an implicit multi-factor calculation before every utterance. There is no fixed "I" or "you" -- both are selected simultaneously based on the speaker-listener relationship.

### Decision Factors (in priority order)

| Priority | Factor | Weight | Description |
|----------|--------|--------|-------------|
| 1 | **Family relationship** | Highest | Blood/marriage relation overrides all other factors |
| 2 | **Age difference** | Very high | Estimated age gap determines kinship-metaphor term |
| 3 | **Gender of addressee** | High | Male/female distinction embedded in most terms |
| 4 | **Formality context** | High | Formal writing, professional speech, casual chat |
| 5 | **Social status** | Medium | Teacher, official, doctor, monk -- title overrides age |
| 6 | **Regional convention** | Medium | Northern speakers use kinship terms more rigidly |
| 7 | **Emotional stance** | Low | Anger, affection, sarcasm can shift term selection |
| 8 | **Relationship history** | Low | Long acquaintance may "freeze" an earlier term |

### The Core Decision Tree

```
START: Speaker (S) addresses Listener (L)

1. Is L a family member?
   YES -> Use exact kinship term (see kinship map)
   NO  -> Continue

2. Is L in a formal/institutional role?
   (teacher, doctor, official, monk, customer)
   YES -> Use role title: Thay/Co (teacher), Bac si (doctor),
          Sua (monk), Quý khách (customer)
   NO  -> Continue

3. Estimate age difference (S vs L):
   L is ~20+ years older (grandparent gen)
      -> S="con/cháu", L="ông/bà" (male/female)
   L is ~7-20 years older (parent gen)
      -> L male: S="em/cháu", L="chú/bác"
      -> L female: S="em/cháu", L="cô/dì"
   L is ~2-7 years older (sibling gen)
      -> L male: S="em", L="anh"
      -> L female: S="em", L="chị"
   L is roughly same age (±2 years)
      -> L male: S="tôi/mình", L="anh/bạn"
      -> L female: S="tôi/mình", L="chị/bạn"
   L is younger
      -> S="anh/chị", L="em"
   L is much younger (child)
      -> S="cô/chú/bác", L="con/cháu"

4. Apply formality modifier:
   Formal written   -> Prefix "Kính gửi" or "Kính thưa"
   Formal spoken    -> Prefix "Thưa"
   Professional     -> Title + given name
   Casual           -> Kinship term + given name
   Intimate         -> Given name only or nickname
```

### Context-Dependent Address: One Person, Five Ways

Consider a 35-year-old man named Nguyen Van Minh:

| Context | Speaker | Addresses Minh as | Self-reference |
|---------|---------|-------------------|----------------|
| His mother (60) | Mother | "Con Minh" (child Minh) | "Me" (mom) |
| His employee (28, female) | Employee | "Anh Minh" (older brother Minh) | "Em" |
| His boss (50, male) | Boss | "Minh" or "Em Minh" | "Anh" |
| A stranger (70, male) | Stranger | "Anh" or "Chú" | "Tôi" or "Cháu" |
| Official letter | Bureaucrat | "Ông Nguyễn Văn Minh" | "Chúng tôi" (we) |

This demonstrates a fundamental principle: **the same person is never addressed one fixed way**. The term shifts with every new interlocutor and context.

### Sources

- Luong, Hy Van. "Discursive Practices and Linguistic Meanings: The Vietnamese System of Person Reference." _Amsterdam Studies in the Theory and History of Linguistic Science_, 1990.
- Cooke, Joseph R. "Pronominal Reference in Thai, Burmese, and Vietnamese." _University of California Publications in Linguistics_, 1968.
- [Cultural Atlas: Vietnamese Communication Style](https://culturalatlas.sbs.com.au/vietnamese-culture/vietnamese-culture-communication)

---

## 2. Pronoun Pairs (Cap Xung Ho)

Vietnamese pronouns are **dyadic** -- selecting "I" automatically constrains the choice of "you" and vice versa. These are not grammatical pronouns but repurposed kinship nouns.

### Complete Pair Inventory

| Self (I) | Other (You) | Relationship | Tone |
|----------|-------------|-------------|------|
| **Con** | **Me/Ma** | Child to mother | Family |
| **Con** | **Ba/Bo/Cha** | Child to father | Family |
| **Con** | **Ong/Ba** | Grandchild to grandparent | Family / respectful |
| **Chau** | **Bac** | Nephew to parent's older sibling | Family / respectful |
| **Chau** | **Chu** | Nephew to father's younger brother | Family / respectful |
| **Chau** | **Co** | Niece/nephew to father's sister | Family / respectful |
| **Chau** | **Di** | Niece/nephew to mother's sister | Family / respectful |
| **Chau** | **Cau** | Niece/nephew to mother's brother | Family / respectful |
| **Em** | **Anh** | Younger to older male (sibling/peer) | Casual-warm |
| **Em** | **Chi** | Younger to older female (sibling/peer) | Casual-warm |
| **Toi** | **Anh/Chi** | Neutral to peer | Polite-neutral |
| **Toi** | **Ong/Ba** | Formal to elder/stranger | Formal |
| **Toi** | **Quy vi** | Formal to audience | Very formal |
| **Minh** | **Minh** | Between spouses/lovers | Intimate |
| **Anh** | **Em** | Husband to wife (or older male to younger female) | Intimate/casual |
| **Tao** | **May** | Between close friends (same age) OR hostile | Intimate OR rude |
| **Ta** | **Nguoi** | Literary/archaic | Written/poetic |
| **Toa** | **Tran** | Buddhist address to monks | Religious |

### Critical Rule: Asymmetry

Most Vietnamese pronoun pairs are **asymmetric**. If A calls B "anh" (older brother), B must call A "em" (younger sibling). Symmetric pairs exist only in limited cases:

- **Minh-Minh**: Couples (both say "minh" = "darling/self")
- **Tao-May**: Close same-age friends (mutual informality)
- **Ban-Ban**: Modern neutral (both say "ban" = friend), common among youth
- **Toi-Toi**: Ultra-formal (both say "toi"), feels cold/distant

### The "Nang" Principle (Elevating Address)

Vietnamese speakers routinely **elevate** the listener's status by one notch. A person roughly your age might be called "anh/chi" (older sibling) even if you suspect they are the same age or younger. This is considered polite -- it costs nothing and flatters the listener. The reverse (addressing someone as younger when they might be older) is a serious social offense.

Programmatic rule: **when age is ambiguous, default to the older-status term**.

### Sources

- Luong, Hy Van. "Discursive Practices and Linguistic Meanings." 1990.
- [Wikipedia: Vietnamese Pronouns](https://en.wikipedia.org/wiki/Vietnamese_pronouns)
- [Vietnamese Primer: Personal Pronouns](https://www.vietnamesepod101.com/blog/2019/08/22/vietnamese-pronouns/)
- Thompson, Laurence C. _A Vietnamese Reference Grammar_. University of Hawaii Press, 1987.

---

## 3. Formality Levels in Vietnamese Address

Five distinct formality tiers, from most formal to most casual:

### Level 1: Written Formal (Thu tin / Van ban)

- Pattern: **"Kinh gui" + title + full name**
- Example: "Kinh gui Ong Nguyen Van Minh"
- Used in: official letters, legal documents, business correspondence
- Self-reference: "Toi" or institutional "Chung toi"
- The word "Kinh" (敬, reverence) marks maximum deference

### Level 2: Spoken Formal (Le nghi)

- Pattern: **"Thua" + title + given name**
- Example: "Thua Thay Minh" (Dear Teacher Minh)
- Used in: speeches, ceremonies, first meetings with elders
- Self-reference: "Toi" or "Con" (to much older person)

### Level 3: Professional (Cong so)

- Pattern: **Title + given name** (no prefix)
- Example: "Giam doc Minh" (Director Minh), "Bac si Lan" (Doctor Lan)
- Used in: workplace, meetings, professional introductions
- Self-reference: "Toi"
- Note: Vietnamese uses **given name** (not surname) with titles

### Level 4: Casual Familiar (Than mat)

- Pattern: **Kinship term + given name**
- Example: "Anh Minh", "Chi Lan", "Chu Hung"
- Used in: daily conversation, neighbors, acquaintances
- Self-reference: corresponding kinship term ("em", "chau", etc.)
- This is the **default** level for most Vietnamese social interactions

### Level 5: Intimate (Rieng tu)

- Pattern: **Given name only**, nickname, or pet name
- Example: "Minh oi!", "Be" (baby), calling by birth-order number
- Used in: family, lovers, very close friends
- Self-reference: name, "minh", or "tao" (friends)

### Formality Selection Matrix

| Context | Written | Spoken |
|---------|---------|--------|
| Government letter | Level 1 | Level 2 |
| Business email | Level 1 or 3 | Level 3 |
| Meeting a friend's parent | -- | Level 2 first, then Level 4 |
| Colleague same age | -- | Level 4 |
| Your own child | -- | Level 5 |
| Stranger on the street | -- | Level 4 (kinship term) |

### Sources

- [Cultural Atlas: Vietnamese Communication](https://culturalatlas.sbs.com.au/vietnamese-culture/vietnamese-culture-communication)
- Pham, Andrea. "Vietnamese Address Forms." _Journal of Pragmatics_, 2002.

---

## 4. Common Mistakes Foreigners Make

### Mistake 1: "Mr. Nguyen" (Surname Address)

Vietnamese people are addressed by their **given name** (last word), not their surname. Calling someone "Mr. Nguyen" is like calling 40% of the population the same thing. The correct form is the kinship term or title + given name.

- Wrong: "Mr. Nguyen", "Ms. Tran"
- Correct: "Anh Minh", "Chi Lan", "Ong Hung"

**Why:** The given name is the individual identifier. The surname identifies the clan (and with 14 surnames covering 90% of the population, it carries almost no disambiguating power).

### Mistake 2: Using "Ban" (Friend) as a Universal "You"

Textbooks often teach "ban" as "you," but native speakers rarely use it outside of (a) addressing children, (b) same-age peers in casual settings, or (c) modern youth slang. Using "ban" with an older person is condescending. Using it in formal settings sounds childish.

### Mistake 3: Ignoring Age in Professional Settings

In Western workplaces, a 25-year-old CEO is addressed as "Mr./Ms. [Name]" regardless of the listener's age. In Vietnamese workplaces, that 25-year-old CEO will still be called "em" (younger sibling) by a 50-year-old janitor in casual conversation. **Age-based kinship terms operate alongside -- and sometimes override -- professional hierarchy.**

However, in formal meetings, the title takes precedence: "Giam doc" (Director) regardless of age.

### Mistake 4: Not "Elevating" (Nang)

Foreigners tend to estimate age accurately and choose the matching term. Vietnamese speakers deliberately round up. If someone looks 30 and you are 28, call them "anh/chi" (older sibling), not "ban" (friend). The social cost of under-addressing far exceeds the cost of over-addressing.

### Mistake 5: Assuming Pronouns Are Fixed

A foreigner who learns "toi = I" may use it in all contexts. But "toi" in family settings sounds cold and distant -- like telling your mother "I" instead of using a familial term. Within family, "toi" can signal anger or emotional withdrawal.

### Sources

- [Cultural Atlas: Vietnamese Naming](https://culturalatlas.sbs.com.au/vietnamese-culture/vietnamese-culture-naming)
- [Vietcetera: How to Address Vietnamese People](https://vietcetera.com/en/addressing-vietnamese-people)
- Thompson, Laurence C. _A Vietnamese Reference Grammar_. 1987.

---

## 5. Historical Evolution of Address

### Feudal Period (pre-1858)

The address system was rigidly hierarchical, mirroring Confucian social order:
- Emperor: "Tran" (朕, royal "I"), addressed as "Bệ hạ" (Your Majesty)
- Mandarins: "Than" (臣, your servant) to emperor; title-based among peers
- Commoners: kinship terms dominated daily life
- Women: rarely addressed by name; "ba nha" (wife of the house), "me chau" (mother of [child])

### Colonial Period (1858-1945)

French colonization introduced:
- "Monsieur/Madame" calqued as "Ong/Ba" in formal settings (reinforcing existing terms)
- "Toi" (僕, servant) evolved from self-deprecating address to neutral first-person
- Catholic converts adopted "con" (child) for addressing priests, reinforcing the existing parent-child metaphor
- Written Vietnamese (Quoc Ngu romanization) standardized spelling of address terms

### Socialist Period (1945-1986)

The most dramatic attempted reform:
- **"Dong chi" (同志, comrade)** was promoted as the universal address term to eliminate class/age/gender distinctions
- The government aimed to replace the entire kinship-based system with egalitarian address
- **This failed.** Vietnamese speakers continued using kinship terms in all but the most formal party contexts
- "Dong chi" survived only in party meetings, military, and official documents
- Reason for failure: the kinship system encodes too much social information (age, gender, intimacy) to be replaced by a single term

### Doi Moi and Modern Period (1986-present)

- "Dong chi" retreated to government/military contexts only
- Workplace address became a hybrid: titles for formal, kinship for daily interaction
- English influence introduced "ban" as a more egalitarian peer term among urban youth
- Corporate culture (especially foreign companies) encouraged first-name address, creating tension with kinship norms
- Online communication created new patterns: "minh" (self/darling) used casually between strangers on social media
- Gen Z trends: playful use of "ong/ba" (grandpa/grandma) among friends as ironic elevation; "bro" borrowed from English

### Key Linguistic Insight

The Vietnamese address system has proven remarkably **resistant to top-down reform** because it is not merely a politeness convention -- it is the primary mechanism for encoding social relationships in every sentence. Unlike Indo-European languages where pronouns are grammatically fixed and politeness is expressed through other means (tone, word choice), Vietnamese **embeds the entire social relationship into the pronoun itself**. Removing or simplifying this system would require restructuring Vietnamese syntax.

### Sources

- Luong, Hy Van. "Discursive Practices and Linguistic Meanings." 1990.
- Marr, David. _Vietnamese Tradition on Trial, 1920-1945_. University of California Press, 1981.
- [Wikipedia: Vietnamese Pronouns](https://en.wikipedia.org/wiki/Vietnamese_pronouns)
- Pham, Andrea. "The Key Role of Relational Social Practice in Vietnamese Address." _Journal of Pragmatics_, 2002.
- DeFrancis, John. _Colonialism and Language Policy in Viet Nam_. Mouton, 1977.

---

## Library Implications: Algorithm Design

Based on this research, the `salutation.ts` module needs significant expansion:

### Current Gaps in the Library

The existing `salutation()` function uses only **gender + formality** to select honorifics. It lacks:
1. **Age-relative address** -- the most critical factor in real Vietnamese address
2. **Pronoun pair generation** -- both "I" and "you" terms should be output
3. **Kinship-metaphor mapping** -- non-family address uses kinship terms
4. **Context-aware formality** -- five levels, not three

### Proposed Data Model

```typescript
enum EFormality {
  WrittenFormal = 'written_formal',    // Kinh gui
  SpokenFormal = 'spoken_formal',      // Thua
  Professional = 'professional',       // Title + name
  Casual = 'casual',                   // Kinship + name
  Intimate = 'intimate',              // Name only
}

interface IAddressContext {
  speakerAge: number;
  listenerAge: number;
  listenerGender: EGender;
  formality: EFormality;
  relationship?: 'family' | 'colleague' | 'stranger' | 'friend';
  listenerTitle?: string;  // Giam doc, Bac si, Thay, etc.
}

interface IAddressPair {
  selfTerm: string;        // How speaker refers to self
  addressTerm: string;     // How speaker addresses listener
  fullAddress: string;     // Complete address form (e.g., "Thua Bac Minh")
  formalPrefix?: string;   // "Kinh gui" / "Thua" if applicable
}
```

### Core Algorithm (Pseudocode)

```
function addressCalculate(name, context):
  ageDiff = context.listenerAge - context.speakerAge

  if context.listenerTitle AND formality >= Professional:
    return { self: "Toi", address: title + givenName }

  if ageDiff >= 20:
    return { self: "Chau/Con", address: "Ong/Ba" + givenName }
  if ageDiff >= 7:
    if listenerGender == male: return { self: "Em/Chau", address: "Chu/Bac" + givenName }
    if listenerGender == female: return { self: "Em/Chau", address: "Co/Di" + givenName }
  if ageDiff >= 2:
    if listenerGender == male: return { self: "Em", address: "Anh" + givenName }
    if listenerGender == female: return { self: "Em", address: "Chi" + givenName }
  if ageDiff >= -2:
    // Apply "nang" principle: default to older-sibling term
    if listenerGender == male: return { self: "Em", address: "Anh" + givenName }
    if listenerGender == female: return { self: "Em", address: "Chi" + givenName }
  if ageDiff < -2:
    return { self: "Anh/Chi", address: "Em" + givenName }

  apply formality prefix based on EFormality level
```

This algorithm should handle ~85% of real-world Vietnamese address scenarios. Edge cases (religious titles, military rank, regional variation) can be added as extensions.
