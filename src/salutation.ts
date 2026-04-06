import { parseName } from './parse-name';
import { detectGender } from './detect-gender';
import { EGender } from './types';

export type TFormality = 'formal' | 'casual' | 'professional';

export interface ISalutationOptions {
  gender?: 'male' | 'female';
  formality?: TFormality;
}

export interface ISalutationResult {
  salutation: string;
  honorific: string;
  addressName: string;
  fullSalutation: string;
}

function honorificSelect(gender: 'male' | 'female' | 'unknown', formality: TFormality): string {
  if (gender === 'unknown') {
    if (formality === 'casual') {
      return 'Bạn';
    }
    return 'Quý khách';
  }

  if (formality === 'formal' || formality === 'professional') {
    return gender === 'male' ? 'Ông' : 'Bà';
  }

  // casual
  return gender === 'male' ? 'Anh' : 'Chị';
}

function fullSalutationBuild(honorific: string, addressName: string, formality: TFormality): string {
  const base = `${honorific} ${addressName}`;

  if (formality === 'formal') {
    return `Kính gửi ${base}`;
  }
  if (formality === 'professional') {
    return `Thưa ${base}`;
  }
  return base;
}

/**
 * Generate a Vietnamese salutation/honorific for a person based on their name,
 * gender, and formality level. Automatically detects gender from the name if not provided.
 *
 * @deprecated Use addressCalculate() for the full honorific system with age-based pronouns, professional titles, and regional variants.
 * @param fullName - Vietnamese full name (e.g. "Nguyen Van Minh")
 * @param options - Optional settings: gender ('male'|'female') and formality ('formal'|'casual'|'professional')
 * @returns Salutation result with honorific, address name, and full salutation string
 * @example
 * ```typescript
 * salutation('Nguyen Van Minh', { formality: 'formal' });
 * // { salutation: 'Ong Minh', honorific: 'Ong', addressName: 'Minh', fullSalutation: 'Kinh gui Ong Minh' }
 * salutation('Tran Thi Lan', { formality: 'casual' });
 * // { salutation: 'Chi Lan', honorific: 'Chi', addressName: 'Lan', fullSalutation: 'Chi Lan' }
 * ```
 */
export function salutation(fullName: string, options?: ISalutationOptions): ISalutationResult {
  const formality: TFormality = options?.formality ?? 'casual';
  const parsed = parseName(fullName);

  // Determine gender
  let gender: 'male' | 'female' | 'unknown';
  if (options?.gender) {
    gender = options.gender;
  } else {
    const detected = detectGender(fullName);
    if (detected.gender === EGender.Male) {
      gender = 'male';
    } else if (detected.gender === EGender.Female) {
      gender = 'female';
    } else {
      gender = 'unknown';
    }
  }

  // Address name is the given name (last part); fall back to full name if no given name parsed
  const addressName = parsed.givenName || parsed.fullName;
  const honorific = honorificSelect(gender, formality);
  const salutationStr = `${honorific} ${addressName}`;
  const fullSalutationStr = fullSalutationBuild(honorific, addressName, formality);

  return {
    salutation: salutationStr,
    honorific,
    addressName,
    fullSalutation: fullSalutationStr,
  };
}
