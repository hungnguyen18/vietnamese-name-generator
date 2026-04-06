import { parseName } from './parse-name';
import { detectGender } from './detect-gender';
import { pronounPairLookup } from './data/honorific-pronoun';
import { professionalTitleLookup } from './data/honorific-professional';
import {
  EGender,
  ERegion,
  EFormality,
  EHonorificCategory,
  type IAddressOptions,
  type IAddressResult,
  type IPronounPair,
} from './types';

function genderResolve(fullName: string, optionGender?: EGender): 'male' | 'female' {
  if (optionGender === EGender.Male) return 'male';
  if (optionGender === EGender.Female) return 'female';
  const detected = detectGender(fullName);
  if (detected.gender === EGender.Male) return 'male';
  if (detected.gender === EGender.Female) return 'female';
  return 'male';
}

function formalityPrefixBuild(
  honorific: string,
  addressName: string,
  formality: EFormality,
): string {
  const base = `${honorific} ${addressName}`;
  if (formality === EFormality.WrittenFormal) return `Kính gửi ${base}`;
  if (formality === EFormality.SpokenFormal) return `Thưa ${base}`;
  if (formality === EFormality.Intimate) return `${addressName} ơi`;
  return base;
}

function honorificFromGenderFormality(
  gender: 'male' | 'female',
  formality: EFormality,
): string {
  if (formality === EFormality.WrittenFormal || formality === EFormality.SpokenFormal) {
    return gender === 'male' ? 'Ông' : 'Bà';
  }
  if (formality === EFormality.Professional) {
    return gender === 'male' ? 'Ông' : 'Bà';
  }
  return gender === 'male' ? 'Anh' : 'Chị';
}

/**
 * Calculate the appropriate Vietnamese address term, honorific, and pronoun pair for a person.
 *
 * Uses a priority-based decision tree: professional role first, then age-based lookup,
 * then gender/formality fallback.
 *
 * @param fullName - The full Vietnamese name to address (e.g. "Nguyễn Văn An")
 * @param options - Address options including role, speaker/addressee ages, gender, formality, and region
 * @returns An address result with honorific, address term, full address phrase, pronoun pair, and metadata
 * @example
 * ```typescript
 * const result = addressCalculate('Nguyễn Văn An', { speakerAge: 25, addresseeAge: 50, formality: EFormality.SpokenFormal });
 * // { honorific: 'Chú', addressTerm: 'Chú An', fullAddress: 'Thưa Chú An', pronounPair: { self: 'cháu', addressee: 'chú' }, ... }
 * ```
 */
export function addressCalculate(
  fullName: string,
  options?: IAddressOptions,
): IAddressResult {
  const parsed = parseName(fullName);
  const addressName = parsed.givenName || parsed.fullName;
  const formality = options?.formality ?? EFormality.Casual;
  const region = options?.region ?? ERegion.North;
  const gender = genderResolve(fullName, options?.gender);

  // Decision tree priority 1: Professional role
  if (options?.role) {
    const title = professionalTitleLookup(options.role);
    if (title) {
      const honorific = title.title;
      const addressTerm = `${honorific} ${addressName}`;
      const pronounPair: IPronounPair = { self: 'tôi', addressee: honorific };
      return {
        honorific,
        addressTerm,
        fullAddress: formalityPrefixBuild(honorific, addressName, formality),
        pronounPair,
        category: EHonorificCategory.Professional,
        formality,
        region,
      };
    }
  }

  // Decision tree priority 2: Age-based
  if (options?.speakerAge !== undefined && options?.addresseeAge !== undefined) {
    const ageDiff = options.addresseeAge - options.speakerAge;
    const pair = pronounPairLookup(ageDiff, gender, region);

    // Capitalize first letter for honorific
    const honorific = pair.addressee.charAt(0).toUpperCase() + pair.addressee.slice(1);
    const addressTerm = `${honorific} ${addressName}`;

    return {
      honorific,
      addressTerm,
      fullAddress: formalityPrefixBuild(honorific, addressName, formality),
      pronounPair: { self: pair.self, addressee: pair.addressee },
      category: EHonorificCategory.AgeBased,
      formality,
      region,
    };
  }

  // Fallback: gender + formality
  const honorific = honorificFromGenderFormality(gender, formality);
  const addressTerm = `${honorific} ${addressName}`;
  const selfTerm = (formality === EFormality.Casual || formality === EFormality.Intimate)
    ? 'em'
    : 'tôi';

  return {
    honorific,
    addressTerm,
    fullAddress: formalityPrefixBuild(honorific, addressName, formality),
    pronounPair: {
      self: selfTerm,
      addressee: honorific.toLowerCase(),
    },
    category: EHonorificCategory.AgeBased,
    formality,
    region,
  };
}

/**
 * Get the Vietnamese pronoun pair (self/addressee) based on relative ages.
 *
 * Determines the culturally appropriate first-person and second-person pronouns
 * for a conversation between two people of known ages.
 *
 * @param speakerAge - Age of the person speaking
 * @param addresseeAge - Age of the person being addressed
 * @param options - Optional gender and region for more accurate pronoun selection
 * @returns A pronoun pair with self (first-person) and addressee (second-person) terms
 * @example
 * ```typescript
 * const pair = pronounPairGet(25, 55, { gender: EGender.Male, region: ERegion.North });
 * // { self: 'cháu', addressee: 'chú' }
 * ```
 */
export function pronounPairGet(
  speakerAge: number,
  addresseeAge: number,
  options?: {
    gender?: EGender;
    region?: ERegion;
  },
): IPronounPair {
  const ageDiff = addresseeAge - speakerAge;
  const gender = options?.gender === EGender.Female ? 'female' : 'male';
  const region = options?.region ?? ERegion.North;
  const pair = pronounPairLookup(ageDiff, gender, region);
  return { self: pair.self, addressee: pair.addressee };
}
