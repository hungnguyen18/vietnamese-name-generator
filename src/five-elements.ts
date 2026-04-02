import { givenNameIndex } from './data/given-name-compact';

export enum EElement {
  Kim = 'kim',
  Moc = 'moc',
  Thuy = 'thuy',
  Hoa = 'hoa',
  Tho = 'tho',
}

export interface IElementInfo {
  element: EElement;
  hanViet: string;
  meaning: string;
  generating: EElement;
  destroying: EElement;
}

// Generating (Tuong Sinh): Kim -> Thuy -> Moc -> Hoa -> Tho -> Kim
// Destroying (Tuong Khac): Kim -> Moc -> Tho -> Thuy -> Hoa -> Kim
const MAP_ELEMENT_INFO: Record<EElement, IElementInfo> = {
  [EElement.Kim]: {
    element: EElement.Kim,
    hanViet: '金',
    meaning: 'Metal',
    generating: EElement.Thuy,
    destroying: EElement.Moc,
  },
  [EElement.Moc]: {
    element: EElement.Moc,
    hanViet: '木',
    meaning: 'Wood',
    generating: EElement.Hoa,
    destroying: EElement.Tho,
  },
  [EElement.Thuy]: {
    element: EElement.Thuy,
    hanViet: '水',
    meaning: 'Water',
    generating: EElement.Moc,
    destroying: EElement.Hoa,
  },
  [EElement.Hoa]: {
    element: EElement.Hoa,
    hanViet: '火',
    meaning: 'Fire',
    generating: EElement.Tho,
    destroying: EElement.Kim,
  },
  [EElement.Tho]: {
    element: EElement.Tho,
    hanViet: '土',
    meaning: 'Earth',
    generating: EElement.Kim,
    destroying: EElement.Thuy,
  },
};

// ~120 common Vietnamese given names mapped to their primary element
const MAP_NAME_ELEMENT: Record<string, EElement> = {
  // Kim (Metal)
  'Kim': EElement.Kim,
  'Ngân': EElement.Kim,
  'Bảo': EElement.Kim,
  'Châu': EElement.Kim,
  'Ngọc': EElement.Kim,
  'Sắc': EElement.Kim,
  'Quý': EElement.Kim,
  'Đồng': EElement.Kim,
  'Thiết': EElement.Kim,
  'Phúc': EElement.Kim,
  'Lộc': EElement.Kim,
  'Tài': EElement.Kim,
  'Thịnh': EElement.Kim,
  'Vàng': EElement.Kim,

  // Moc (Wood)
  'Lâm': EElement.Moc,
  'Phong': EElement.Moc,
  'Xuân': EElement.Moc,
  'Liễu': EElement.Moc,
  'Tùng': EElement.Moc,
  'Mai': EElement.Moc,
  'Lan': EElement.Moc,
  'Trúc': EElement.Moc,
  'Cúc': EElement.Moc,
  'Hoa': EElement.Moc,
  'Sen': EElement.Moc,
  'Đào': EElement.Moc,
  'Bách': EElement.Moc,
  'Dương': EElement.Moc,
  'Thảo': EElement.Moc,
  'Lá': EElement.Moc,
  'Cỏ': EElement.Moc,
  'Huệ': EElement.Moc,
  'Lựu': EElement.Moc,

  // Thuy (Water)
  'Thủy': EElement.Thuy,
  'Hà': EElement.Thuy,
  'Hải': EElement.Thuy,
  'Sông': EElement.Thuy,
  'Lưu': EElement.Thuy,
  'Bích': EElement.Thuy,
  'Giang': EElement.Thuy,
  'Linh': EElement.Thuy,
  'Thanh': EElement.Thuy,
  'Tuyết': EElement.Thuy,
  'Sương': EElement.Thuy,
  'Mưa': EElement.Thuy,
  'Hồ': EElement.Thuy,
  'Suối': EElement.Thuy,
  'Nước': EElement.Thuy,
  'Băng': EElement.Thuy,
  'Phương': EElement.Thuy,

  // Hoa (Fire)
  'Quang': EElement.Hoa,
  'Huy': EElement.Hoa,
  'Minh': EElement.Hoa,
  'Hùng': EElement.Hoa,
  'Vinh': EElement.Hoa,
  'Sáng': EElement.Hoa,
  'Đăng': EElement.Hoa,
  'Hồng': EElement.Hoa,
  'Nhiệt': EElement.Hoa,
  'Nóng': EElement.Hoa,
  'Lửa': EElement.Hoa,
  'Ánh': EElement.Hoa,
  'Quốc': EElement.Hoa,
  'Hưng': EElement.Hoa,

  // Tho (Earth)
  'Sơn': EElement.Tho,
  'Bình': EElement.Tho,
  'An': EElement.Tho,
  'Thành': EElement.Tho,
  'Đại': EElement.Tho,
  'Long': EElement.Tho,
  'Nguyên': EElement.Tho,
  'Trung': EElement.Tho,
  'Đức': EElement.Tho,
  'Nghĩa': EElement.Tho,
  'Tín': EElement.Tho,
  'Chính': EElement.Tho,
  'Công': EElement.Tho,
  'Lực': EElement.Tho,
  'Cường': EElement.Tho,
  'Vĩnh': EElement.Tho,
  'Hậu': EElement.Tho,
};

// Reverse index: element -> list of names
const MAP_ELEMENT_NAME: Record<EElement, string[]> = {
  [EElement.Kim]: [],
  [EElement.Moc]: [],
  [EElement.Thuy]: [],
  [EElement.Hoa]: [],
  [EElement.Tho]: [],
};

const LIST_NAME_KEY = Object.keys(MAP_NAME_ELEMENT);
for (let i = 0; i < LIST_NAME_KEY.length; i += 1) {
  const name = LIST_NAME_KEY[i];
  MAP_ELEMENT_NAME[MAP_NAME_ELEMENT[name]].push(name);
}

export function getElementInfo(element: EElement): IElementInfo {
  return MAP_ELEMENT_INFO[element];
}

export function getNameElement(name: string): EElement | null {
  if (!name || name.trim().length === 0) {
    return null;
  }
  const trimmed = name.trim();
  return MAP_NAME_ELEMENT[trimmed] ?? null;
}

export function getNamesByElement(
  element: EElement,
  options?: { gender?: string; limit?: number },
): string[] {
  let listName = MAP_ELEMENT_NAME[element];

  if (!listName || listName.length === 0) {
    return [];
  }

  if (options?.gender) {
    const index = givenNameIndex();
    const genderData = index[options.gender];
    if (!genderData) {
      return [];
    }

    // Collect all given name values for this gender
    const setGenderName = new Set<string>();
    const listRegionKey = Object.keys(genderData);
    for (let i = 0; i < listRegionKey.length; i += 1) {
      const regionData = genderData[listRegionKey[i]];
      const listEraKey = Object.keys(regionData);
      for (let j = 0; j < listEraKey.length; j += 1) {
        const listEntry = regionData[listEraKey[j]];
        for (let k = 0; k < listEntry.length; k += 1) {
          setGenderName.add(listEntry[k].value);
        }
      }
    }

    listName = listName.filter((n) => setGenderName.has(n));
  }

  if (options?.limit !== undefined && options.limit > 0) {
    listName = listName.slice(0, options.limit);
  }

  return listName;
}

export function getBirthYearElement(year: number): EElement {
  const lastDigit = Math.abs(year) % 10;

  if (lastDigit === 0 || lastDigit === 1) {
    return EElement.Kim;
  }
  if (lastDigit === 2 || lastDigit === 3) {
    return EElement.Thuy;
  }
  if (lastDigit === 4 || lastDigit === 5) {
    return EElement.Moc;
  }
  if (lastDigit === 6 || lastDigit === 7) {
    return EElement.Hoa;
  }
  // lastDigit === 8 || lastDigit === 9
  return EElement.Tho;
}
