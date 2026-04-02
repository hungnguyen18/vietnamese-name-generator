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

export { generateEmail, type IEmailResult, type TEmailOptions } from "./generate-email";

export { generateUsername, type IUsernameResult } from "./generate-username";

export { getSurnameInfo, type ISurnameInfo } from "./surname-info";

export { getRegionalVariant } from "./regional-variant";

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
