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

export { fakerVi } from "./faker-adapter";

export { nameSimilarity, type ISimilarityResult } from "./name-similarity";

export { getMeaning, type INameMeaning } from "./get-meaning";

export {
  getStatistics,
  getTopSurnames,
  getGivenNameCount,
  getUniqueGivenNames,
  type IStatisticsResult,
  type IRankedName,
} from "./name-statistics";

export {
  normalize,
  accentInsensitiveMatch,
  accentInsensitiveEqual,
  VIETNAMESE_NAME_REGEX,
} from "./normalize";

export { salutation } from "./salutation";

export { sortVietnamese, vietnameseNameComparator } from "./sort-vietnamese";

export {
  EElement,
  getElementInfo,
  getNameElement,
  getNamesByElement,
  getBirthYearElement,
} from "./five-elements";

export { getHanViet, type THanVietEntry } from "./get-han-viet";

export { generateNickname, type INicknameResult, type TNicknameCategory } from "./generate-nickname";

export { generatePetName, generateManyPetNames, type IPetNameResult, type IPetNameOptions, type TPetNameCategory } from "./generate-pet-name";

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
