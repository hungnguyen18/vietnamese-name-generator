import {
  EEra,
  EGender,
  EMeaningCategory,
  ERegion,
  type TGivenNameEntry,
} from "../types";

export const INDEX_GIVEN_NAME: Record<
  EGender,
  Record<ERegion, Record<EEra, TGivenNameEntry[]>>
> = {
  [EGender.Male]: {
    [ERegion.North]: {
      [EEra.Traditional]: [
        { value: "Duc", meaning: "Virtue", category: EMeaningCategory.Virtue },
        {
          value: "Hung",
          meaning: "Strength",
          category: EMeaningCategory.Strength,
        },
        {
          value: "Trung",
          meaning: "Virtue",
          category: EMeaningCategory.Virtue,
        },
        { value: "Son", meaning: "Nature", category: EMeaningCategory.Nature },
        {
          value: "Tuan",
          meaning: "Intellect",
          category: EMeaningCategory.Intellect,
        },
      ],
      [EEra.Modern]: [
        {
          value: "Huy",
          meaning: "Strength",
          category: EMeaningCategory.Strength,
        },
        {
          value: "Khang",
          meaning: "Strength",
          category: EMeaningCategory.Strength,
        },
        {
          value: "Bao",
          meaning: "Precious",
          category: EMeaningCategory.Precious,
        },
        {
          value: "Khoi",
          meaning: "Intellect",
          category: EMeaningCategory.Intellect,
        },
        {
          value: "Phuc",
          meaning: "Prosperity",
          category: EMeaningCategory.Prosperity,
        },
      ],
    },
    [ERegion.Central]: {
      [EEra.Traditional]: [
        {
          value: "Vinh",
          meaning: "Prosperity",
          category: EMeaningCategory.Prosperity,
        },
        {
          value: "Nhat",
          meaning: "Celestial",
          category: EMeaningCategory.Celestial,
        },
        {
          value: "Tan",
          meaning: "Prosperity",
          category: EMeaningCategory.Prosperity,
        },
        {
          value: "Nghia",
          meaning: "Virtue",
          category: EMeaningCategory.Virtue,
        },
        {
          value: "Kien",
          meaning: "Strength",
          category: EMeaningCategory.Strength,
        },
      ],
      [EEra.Modern]: [
        {
          value: "Dat",
          meaning: "Intellect",
          category: EMeaningCategory.Intellect,
        },
        {
          value: "Khoa",
          meaning: "Intellect",
          category: EMeaningCategory.Intellect,
        },
        {
          value: "Phong",
          meaning: "Nature",
          category: EMeaningCategory.Nature,
        },
        { value: "Long", meaning: "Nature", category: EMeaningCategory.Nature },
        {
          value: "Duy",
          meaning: "Intellect",
          category: EMeaningCategory.Intellect,
        },
      ],
    },
    [ERegion.South]: {
      [EEra.Traditional]: [
        { value: "Hai", meaning: "Nature", category: EMeaningCategory.Nature },
        {
          value: "Dung",
          meaning: "Strength",
          category: EMeaningCategory.Strength,
        },
        {
          value: "Manh",
          meaning: "Strength",
          category: EMeaningCategory.Strength,
        },
        {
          value: "Thanh",
          meaning: "Prosperity",
          category: EMeaningCategory.Prosperity,
        },
        {
          value: "Quang",
          meaning: "Celestial",
          category: EMeaningCategory.Celestial,
        },
      ],
      [EEra.Modern]: [
        {
          value: "Phat",
          meaning: "Prosperity",
          category: EMeaningCategory.Prosperity,
        },
        { value: "Nam", meaning: "Nature", category: EMeaningCategory.Nature },
        {
          value: "Tai",
          meaning: "Intellect",
          category: EMeaningCategory.Intellect,
        },
        {
          value: "Loc",
          meaning: "Prosperity",
          category: EMeaningCategory.Prosperity,
        },
        {
          value: "Thinh",
          meaning: "Prosperity",
          category: EMeaningCategory.Prosperity,
        },
      ],
    },
  },
  [EGender.Female]: {
    [ERegion.North]: {
      [EEra.Traditional]: [
        { value: "Lan", meaning: "Nature", category: EMeaningCategory.Nature },
        {
          value: "Huong",
          meaning: "Nature",
          category: EMeaningCategory.Nature,
        },
        { value: "Thao", meaning: "Virtue", category: EMeaningCategory.Virtue },
        { value: "Mai", meaning: "Nature", category: EMeaningCategory.Nature },
        { value: "Lien", meaning: "Nature", category: EMeaningCategory.Nature },
      ],
      [EEra.Modern]: [
        {
          value: "Anh",
          meaning: "Celestial",
          category: EMeaningCategory.Celestial,
        },
        { value: "Vy", meaning: "Beauty", category: EMeaningCategory.Beauty },
        {
          value: "Ngoc",
          meaning: "Precious",
          category: EMeaningCategory.Precious,
        },
        { value: "Chi", meaning: "Nature", category: EMeaningCategory.Nature },
        { value: "Ha", meaning: "Nature", category: EMeaningCategory.Nature },
      ],
    },
    [ERegion.Central]: {
      [EEra.Traditional]: [
        { value: "Hien", meaning: "Virtue", category: EMeaningCategory.Virtue },
        { value: "Hoa", meaning: "Nature", category: EMeaningCategory.Nature },
        { value: "Cuc", meaning: "Nature", category: EMeaningCategory.Nature },
        {
          value: "Loan",
          meaning: "Celestial",
          category: EMeaningCategory.Celestial,
        },
        {
          value: "Trinh",
          meaning: "Virtue",
          category: EMeaningCategory.Virtue,
        },
      ],
      [EEra.Modern]: [
        {
          value: "Trang",
          meaning: "Beauty",
          category: EMeaningCategory.Beauty,
        },
        { value: "Nhi", meaning: "Beauty", category: EMeaningCategory.Beauty },
        { value: "Nhu", meaning: "Beauty", category: EMeaningCategory.Beauty },
        {
          value: "Quynh",
          meaning: "Precious",
          category: EMeaningCategory.Precious,
        },
        {
          value: "Tram",
          meaning: "Precious",
          category: EMeaningCategory.Precious,
        },
      ],
    },
    [ERegion.South]: {
      [EEra.Traditional]: [
        { value: "Hong", meaning: "Beauty", category: EMeaningCategory.Beauty },
        { value: "Diem", meaning: "Beauty", category: EMeaningCategory.Beauty },
        { value: "Kieu", meaning: "Beauty", category: EMeaningCategory.Beauty },
        { value: "Thuy", meaning: "Nature", category: EMeaningCategory.Nature },
        {
          value: "Nguyet",
          meaning: "Celestial",
          category: EMeaningCategory.Celestial,
        },
      ],
      [EEra.Modern]: [
        {
          value: "Chau",
          meaning: "Precious",
          category: EMeaningCategory.Precious,
        },
        { value: "Thu", meaning: "Season", category: EMeaningCategory.Season },
        { value: "Uyen", meaning: "Beauty", category: EMeaningCategory.Beauty },
        {
          value: "Han",
          meaning: "Prosperity",
          category: EMeaningCategory.Prosperity,
        },
        { value: "Yen", meaning: "Nature", category: EMeaningCategory.Nature },
      ],
    },
  },
  [EGender.Unisex]: {
    [ERegion.North]: {
      [EEra.Traditional]: [
        { value: "An", meaning: "Virtue", category: EMeaningCategory.Virtue },
        {
          value: "Minh",
          meaning: "Intellect",
          category: EMeaningCategory.Intellect,
        },
      ],
      [EEra.Modern]: [
        {
          value: "Linh",
          meaning: "Celestial",
          category: EMeaningCategory.Celestial,
        },
        {
          value: "Phuong",
          meaning: "Nature",
          category: EMeaningCategory.Nature,
        },
      ],
    },
    [ERegion.Central]: {
      [EEra.Traditional]: [
        {
          value: "Thanh",
          meaning: "Virtue",
          category: EMeaningCategory.Virtue,
        },
        { value: "Lam", meaning: "Nature", category: EMeaningCategory.Nature },
      ],
      [EEra.Modern]: [
        {
          value: "Khanh",
          meaning: "Precious",
          category: EMeaningCategory.Precious,
        },
        { value: "Tam", meaning: "Virtue", category: EMeaningCategory.Virtue },
      ],
    },
    [ERegion.South]: {
      [EEra.Traditional]: [
        {
          value: "Giang",
          meaning: "Nature",
          category: EMeaningCategory.Nature,
        },
        { value: "Xuan", meaning: "Season", category: EMeaningCategory.Season },
      ],
      [EEra.Modern]: [
        {
          value: "Bao",
          meaning: "Precious",
          category: EMeaningCategory.Precious,
        },
        {
          value: "Duong",
          meaning: "Nature",
          category: EMeaningCategory.Nature,
        },
      ],
    },
  },
};
