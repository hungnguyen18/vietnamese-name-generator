import { EGender } from './types';
import { generate } from './generator';
import { generateEmail } from './generate-email';
import { generateUsername } from './generate-username';

type TGenderOption = 'male' | 'female';

const LIST_PREFIX_MALE = ['Ong', 'Anh'];
const LIST_PREFIX_FEMALE = ['Ba', 'Chi'];

function genderMap(gender?: TGenderOption): EGender | undefined {
  if (gender === 'male') {
    return EGender.Male;
  }
  if (gender === 'female') {
    return EGender.Female;
  }
  return undefined;
}

function randomPick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

export const fakerVi = {
  person: {
    firstName(gender?: TGenderOption): string {
      const result = generate({ gender: genderMap(gender) });
      return result.romanized.givenName;
    },

    lastName(): string {
      const result = generate();
      return result.romanized.surname;
    },

    middleName(gender?: TGenderOption): string {
      const result = generate({ gender: genderMap(gender), withMiddleName: true });
      return result.romanized.middleName;
    },

    fullName(options?: { gender?: TGenderOption }): string {
      const result = generate({ gender: genderMap(options?.gender) });
      return result.fullName;
    },

    sex(): TGenderOption {
      return Math.random() < 0.5 ? 'male' : 'female';
    },

    prefix(gender?: TGenderOption): string {
      const resolved = gender ?? (Math.random() < 0.5 ? 'male' : 'female');
      if (resolved === 'male') {
        return randomPick(LIST_PREFIX_MALE);
      }
      return randomPick(LIST_PREFIX_FEMALE);
    },
  },

  internet: {
    email(options?: { firstName?: string; lastName?: string }): string {
      if (options?.firstName || options?.lastName) {
        const first = (options.firstName ?? 'user').toLowerCase().replace(/\s+/g, '');
        const last = (options.lastName ?? '').toLowerCase().replace(/\s+/g, '');
        const listDomain = ['gmail.com', 'yahoo.com', 'outlook.com'];
        const domain = randomPick(listDomain);
        const localPart = last ? `${first}.${last}` : first;
        return `${localPart}@${domain}`;
      }
      return generateEmail().email;
    },

    username(options?: { firstName?: string; lastName?: string }): string {
      if (options?.firstName || options?.lastName) {
        const first = (options.firstName ?? 'user').toLowerCase().replace(/\s+/g, '');
        const last = (options.lastName ?? '').toLowerCase().replace(/\s+/g, '');
        return last ? `${first}_${last}` : first;
      }
      return generateUsername().username;
    },
  },
};
