import { EEra, EGender, ERegion } from "../types";

export const INDEX_MIDDLE_NAME: Record<
  EGender,
  Record<ERegion, Record<EEra, string[]>>
> = {
  [EGender.Male]: {
    [ERegion.North]: {
      [EEra.Traditional]: ["Van", "Duc", "Huu"],
      [EEra.Modern]: ["Minh", "Quoc", "Gia"],
    },
    [ERegion.Central]: {
      [EEra.Traditional]: ["Van", "Duc", "Cong"],
      [EEra.Modern]: ["Minh", "Quoc", "Bao"],
    },
    [ERegion.South]: {
      [EEra.Traditional]: ["Van", "Thanh", "Huu"],
      [EEra.Modern]: ["Minh", "Hoang", "Gia"],
    },
  },
  [EGender.Female]: {
    [ERegion.North]: {
      [EEra.Traditional]: ["Thi", "Ngoc", "Dieu"],
      [EEra.Modern]: ["Ngoc", "Minh", "Khanh"],
    },
    [ERegion.Central]: {
      [EEra.Traditional]: ["Thi", "Ngoc", "My"],
      [EEra.Modern]: ["Ngoc", "Bao", "An"],
    },
    [ERegion.South]: {
      [EEra.Traditional]: ["Thi", "Ngoc", "Kim"],
      [EEra.Modern]: ["Ngoc", "Bao", "Gia"],
    },
  },
  [EGender.Unisex]: {
    [ERegion.North]: {
      [EEra.Traditional]: ["Minh", "Thanh"],
      [EEra.Modern]: ["An", "Bao"],
    },
    [ERegion.Central]: {
      [EEra.Traditional]: ["Minh", "Thanh"],
      [EEra.Modern]: ["An", "Bao"],
    },
    [ERegion.South]: {
      [EEra.Traditional]: ["Minh", "Kim"],
      [EEra.Modern]: ["An", "Gia"],
    },
  },
};
