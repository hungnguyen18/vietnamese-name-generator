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
