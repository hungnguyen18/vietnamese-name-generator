import type { TGenerateOptions, INameResult } from './types';
import { EGender, ERegion } from './types';
import { generate } from './generator';
import { generateCCCD, type ICCCDResult } from './generate-cccd';
import { generatePhone, type IPhoneResult } from './generate-phone';
import { generateAddress, type IAddressResult } from './generate-address';
import { generateEmail } from './generate-email';
import { generateUsername } from './generate-username';
import { mulberry32 } from './random';
import { LIST_PROVINCE } from './data/province';

export interface IPersonOptions {
  gender?: 'male' | 'female';
  region?: 'north' | 'central' | 'south';
  province?: string;
  birthYear?: number;
  seed?: number;
}

export interface IPersonResult {
  name: INameResult;
  gender: string;
  birthYear: number;
  age: number;
  cccd: ICCCDResult;
  phone: IPhoneResult;
  email: string;
  username: string;
  address: IAddressResult;
}

function regionFromProvince(provinceName: string): ERegion {
  for (let i = 0; i < LIST_PROVINCE.length; i += 1) {
    if (LIST_PROVINCE[i].name === provinceName || LIST_PROVINCE[i].nameEn === provinceName) {
      return LIST_PROVINCE[i].region as ERegion;
    }
  }
  return ERegion.North;
}

export function generatePerson(options?: IPersonOptions): IPersonResult {
  const baseSeed = options?.seed;
  const rng = baseSeed !== undefined ? mulberry32(baseSeed) : Math.random;

  // Determine gender
  const gender = options?.gender ?? (rng() < 0.5 ? 'male' : 'female');
  const eGender = gender === 'male' ? EGender.Male : EGender.Female;

  // Determine province and region (internally consistent)
  let province = options?.province;
  let region = options?.region as ERegion | undefined;

  if (!province && region) {
    const regionProvinces = LIST_PROVINCE.filter((p) => p.region === region);
    const idx = Math.floor(rng() * regionProvinces.length);
    province = regionProvinces[idx].name;
  } else if (!province) {
    const idx = Math.floor(rng() * LIST_PROVINCE.length);
    province = LIST_PROVINCE[idx].name;
    region = LIST_PROVINCE[idx].region as ERegion;
  }

  if (!region) {
    region = regionFromProvince(province);
  }

  // Determine birth year
  const birthYear = options?.birthYear ?? (1960 + Math.floor(rng() * 46));
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;

  // Generate name (consistent with region and gender)
  const nameSeed = baseSeed !== undefined ? baseSeed + 1 : undefined;
  const nameOpts: TGenerateOptions = { gender: eGender, region, seed: nameSeed };
  const name = generate(nameOpts);

  // Generate CCCD (consistent with province, gender, birth year)
  const cccdSeed = baseSeed !== undefined ? baseSeed + 2 : undefined;
  const cccd = generateCCCD({ province, gender, birthYear, seed: cccdSeed });

  // Generate phone
  const phoneSeed = baseSeed !== undefined ? baseSeed + 3 : undefined;
  const phone = generatePhone({ seed: phoneSeed });

  // Generate email (from the name)
  const emailSeed = baseSeed !== undefined ? baseSeed + 4 : undefined;
  const emailResult = generateEmail({ ...nameOpts, seed: emailSeed });

  // Generate username (from the name)
  const usernameSeed = baseSeed !== undefined ? baseSeed + 5 : undefined;
  const usernameResult = generateUsername({ ...nameOpts, seed: usernameSeed });

  // Generate address (consistent with province)
  const addressSeed = baseSeed !== undefined ? baseSeed + 6 : undefined;
  const address = generateAddress({ province, seed: addressSeed });

  return {
    name,
    gender,
    birthYear,
    age,
    cccd,
    phone,
    email: emailResult.email,
    username: usernameResult.username,
    address,
  };
}
