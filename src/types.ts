export enum EGender {
  Male = "male",
  Female = "female",
  Unisex = "unisex",
}

export enum ERegion {
  North = "north",
  Central = "central",
  South = "south",
}

export enum EEra {
  Traditional = "traditional",
  Modern = "modern",
}

export enum EMeaningCategory {
  Strength = "strength",
  Virtue = "virtue",
  Nature = "nature",
  Precious = "precious",
  Beauty = "beauty",
  Celestial = "celestial",
  Season = "season",
  Intellect = "intellect",
  Prosperity = "prosperity",
}

export type TWeightedEntry = {
  value: string;
  weight: number;
};

export type TGivenNameEntry = {
  value: string;
  meaning?: string;
  sinoVietnamese?: string;
  category?: EMeaningCategory;
};

export enum ENameFormat {
  Full = "full",
  Abbreviated = "abbreviated",
  Reversed = "reversed",
  Slug = "slug",
}

export type TNameStyle = 'japanese' | 'korean' | 'western' | 'hybrid';

export enum EFormality {
  WrittenFormal = 'written-formal',
  SpokenFormal = 'spoken-formal',
  Professional = 'professional',
  Casual = 'casual',
  Intimate = 'intimate',
}

export enum EHonorificCategory {
  Royal = 'royal',
  Mandarin = 'mandarin',
  Scholar = 'scholar',
  Family = 'family',
  AgeBased = 'age-based',
  Professional = 'professional',
  Religious = 'religious',
  GenZ = 'genz',
  Regional = 'regional',
}

export enum EReligion {
  Buddhism = 'buddhism',
  Catholicism = 'catholicism',
  CaoDai = 'cao-dai',
  HoaHao = 'hoa-hao',
  Folk = 'folk',
}

export enum EFeudalRank {
  Emperor = 'emperor',
  Consort = 'consort',
  Prince = 'prince',
  Princess = 'princess',
  Nobility = 'nobility',
  Mandarin = 'mandarin',
  Scholar = 'scholar',
}

export interface IPronounPair {
  self: string;
  addressee: string;
}

export interface IAddressOptions {
  familyRelation?: string;
  role?: string;
  speakerAge?: number;
  addresseeAge?: number;
  gender?: EGender;
  formality?: EFormality;
  region?: ERegion;
  era?: EEra;
  religion?: EReligion;
  seed?: number;
}

export interface IAddressResult {
  honorific: string;
  addressTerm: string;
  fullAddress: string;
  pronounPair: IPronounPair;
  category: EHonorificCategory;
  formality: EFormality;
  region: ERegion;
}

export interface ITitleEntry {
  title: string;
  sinoVietnamese?: string;
  era: EEra | 'all';
  gender?: EGender | 'any';
  description?: string;
}

export interface IKinshipTerm {
  term: string;
  relation: string;
  generation: number;
  side?: 'paternal' | 'maternal';
  gender: EGender | 'any';
  regionVariants?: Partial<Record<ERegion, string>>;
}

export type TGenerateOptions = {
  gender?: EGender;
  region?: ERegion;
  era?: EEra;
  compoundName?: boolean;
  meaningCategory?: EMeaningCategory;
  withMiddleName?: boolean;
  seed?: number;
  format?: ENameFormat | ENameFormat[];
  style?: TNameStyle;
  secure?: boolean;
};

export interface IRomanizedName {
  surname: string;
  middleName: string;
  givenName: string;
  fullName: string;
}

export interface INameParts {
  surname: string;
  middleName: string;
  givenName: string;
  fullName: string;
  romanized: IRomanizedName;
}

export interface IParsedName {
  surname: string;
  middleName: string;
  givenName: string;
  fullName: string;
}

export interface IValidationResult {
  valid: boolean;
  reasons: string[];
}

export interface IGenderResult {
  gender: EGender | "unknown";
  confidence: "high" | "medium" | "low";
  signals: {
    middleName?: { gender: EGender | "unknown"; value: string };
    givenName?: { gender: EGender | "unknown"; value: string };
  };
}

export interface INameResult extends INameParts {
  gender: EGender;
  region: ERegion;
  era: EEra;
  formatted: Partial<Record<ENameFormat, string>>;
}
