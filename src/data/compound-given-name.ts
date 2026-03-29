import { EEra, EGender } from "../types";

export const INDEX_COMPOUND_GIVEN_NAME: Record<
  EGender,
  Record<EEra, string[]>
> = {
  [EGender.Male]: {
    [EEra.Traditional]: ["Quoc Tuan", "Duc Trung", "Hai Dang"],
    [EEra.Modern]: ["Bao Long", "Minh Khang", "Gia Huy", "Duc Anh", "Quoc Bao"],
  },
  [EGender.Female]: {
    [EEra.Traditional]: ["Ngoc Lan", "Thuy Hang", "Minh Nguyet"],
    [EEra.Modern]: ["Bao Ngoc", "Minh Chau", "Gia Han", "Khanh Vy", "An Nhien"],
  },
  [EGender.Unisex]: {
    [EEra.Traditional]: ["Minh An", "Thanh Binh"],
    [EEra.Modern]: ["Bao An", "Minh Anh", "Gia Bao"],
  },
};
