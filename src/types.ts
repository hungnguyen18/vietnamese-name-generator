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
