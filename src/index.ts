export {
  generate,
  generateFullName,
  generateMany,
  generateManyFullNames,
} from "./generator";

export { romanize } from "./romanize";

export { formatName } from "./format";

export { parseName } from "./parse-name";

export { validateName } from "./validate-name";

export { detectGender } from "./detect-gender";

export {
  EGender,
  ERegion,
  EEra,
  EMeaningCategory,
  ENameFormat,
  type TGenerateOptions,
  type INameResult,
  type INameParts,
  type IRomanizedName,
  type IParsedName,
  type IValidationResult,
  type IGenderResult,
  type TWeightedEntry,
  type TGivenNameEntry,
} from "./types";
