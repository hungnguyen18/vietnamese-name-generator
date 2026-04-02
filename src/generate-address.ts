import { LIST_PROVINCE, type TProvince } from './data/province';
import { mulberry32, pickRandom } from './random';

export interface IAddressOptions {
  province?: string;
  seed?: number;
}

export interface IAddressResult {
  street: string;
  ward: string;
  district: string;
  province: string;
  postalCode: string;
  full: string;
}

const LIST_STREET_NAME: string[] = [
  'Nguyễn Huệ', 'Lê Lợi', 'Trần Hưng Đạo', 'Hai Bà Trưng', 'Lý Thường Kiệt',
  'Nguyễn Trãi', 'Lê Duẩn', 'Điện Biên Phủ', 'Võ Văn Tần', 'Pasteur',
  'Nam Kỳ Khởi Nghĩa', 'Cách Mạng Tháng 8', 'Phạm Văn Đồng', 'Nguyễn Văn Linh',
  'Trường Chinh', 'Lạc Long Quân', 'Hoàng Hoa Thám', 'Bà Triệu', 'Tôn Đức Thắng',
  'Nguyễn Thị Minh Khai', 'Lê Văn Sỹ', 'Phan Đình Phùng', 'Huỳnh Thúc Kháng',
  'Ngô Quyền', 'Quang Trung', 'Lê Hồng Phong', 'Trần Phú', 'Nguyễn Du',
  'Bùi Thị Xuân', 'Võ Thị Sáu',
];

const LIST_DISTRICT_NAME: string[] = [
  'Bình Chánh', 'Củ Chi', 'Hóc Môn', 'Nhà Bè', 'Thanh Trì',
  'Đông Anh', 'Gia Lâm', 'Hoài Đức', 'Mê Linh', 'Sóc Sơn',
  'Thanh Oai', 'Thường Tín', 'Phú Xuyên', 'Ba Vì', 'Chương Mỹ',
];

const LIST_RURAL_WARD_NAME: string[] = [
  'An Phú', 'Bình Hòa', 'Tân Thạnh', 'Phước Long', 'Hòa Bình',
  'Trung Hòa', 'Phú Mỹ', 'Long Thạnh', 'An Hòa', 'Tân Phú',
  'Bình Thạnh', 'Thạnh Lộc', 'Phước Thành', 'An Thạnh', 'Hòa Phú',
];

const SET_CITY_CODE = new Set<string>(['001', '079', '048', '031', '092']);

function provinceFind(query: string): TProvince | undefined {
  const lower = query.toLowerCase().trim();
  for (let i = 0; i < LIST_PROVINCE.length; i += 1) {
    const p = LIST_PROVINCE[i];
    if (
      p.cccdCode === lower
      || p.name.toLowerCase() === lower
      || p.nameEn.toLowerCase() === lower
    ) {
      return p;
    }
  }
  return undefined;
}

export function generateAddress(options?: IAddressOptions): IAddressResult {
  const rng = options?.seed !== undefined ? mulberry32(options.seed) : Math.random;

  let province: TProvince;
  if (options?.province) {
    const found = provinceFind(options.province);
    if (!found) {
      throw new Error(`Province not found: ${options.province}`);
    }
    province = found;
  } else {
    province = pickRandom(LIST_PROVINCE, rng);
  }

  const isCity = SET_CITY_CODE.has(province.cccdCode);

  const houseNumber = Math.floor(rng() * 999) + 1;
  const streetName = pickRandom(LIST_STREET_NAME, rng);
  const street = `${houseNumber} ${streetName}`;

  let ward: string;
  if (isCity) {
    const wardNumber = Math.floor(rng() * 15) + 1;
    ward = `Phường ${wardNumber}`;
  } else {
    ward = `Xã ${pickRandom(LIST_RURAL_WARD_NAME, rng)}`;
  }

  let district: string;
  if (isCity) {
    const districtNumber = Math.floor(rng() * 12) + 1;
    district = `Quận ${districtNumber}`;
  } else {
    district = `Huyện ${pickRandom(LIST_DISTRICT_NAME, rng)}`;
  }

  const full = `${street}, ${ward}, ${district}, ${province.name}`;

  return {
    street,
    ward,
    district,
    province: province.name,
    postalCode: province.postalCode,
    full,
  };
}
