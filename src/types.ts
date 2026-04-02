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

export type TGenerateOptions = {
  gender?: EGender;
  region?: ERegion;
  era?: EEra;
  compoundName?: boolean;
  meaningCategory?: EMeaningCategory;
  withMiddleName?: boolean;
  seed?: number;
};

export interface INameResult {
  surname: string;
  middleName: string;
  givenName: string;
  fullName: string;
  gender: EGender;
  region: ERegion;
  era: EEra;
}
