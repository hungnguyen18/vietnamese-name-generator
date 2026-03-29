export interface IRawNameEntry {
  value: string;
  type: "surname" | "middleName" | "givenName" | "compoundGivenName";
  gender?: "male" | "female" | "unisex";
  source: string;
  meaning?: string;
  sinoVietnamese?: string;
  frequency?: number;
  region?: "north" | "central" | "south";
  era?: "traditional" | "modern";
  category?: string;
}

export interface ISourceResult {
  sourceName: string;
  entries: IRawNameEntry[];
  errors: string[];
}
