export const INDEX_GENZ_GIVEN_NAME: Record<string, Record<string, string[]>> = {
  male: {
    short: ["An", "Khang", "Khôi", "Long", "Trí", "Bình", "Tín", "Phi", "Hải", "Nam", "Tâm", "Đạt"],
    compound: ["Minh Khang", "Anh Tuấn", "Thiên An", "Duy Phong", "Hào Nhiên", "Lâm Vũ", "Nam Khôi", "Kỳ Lâm", "Anh Dương", "Anh Khôi", "Đức Uy", "Tấn Hào"],
    international: ["An", "Nam", "Tâm", "Khang", "Long", "Minh", "Bảo", "Leo", "Max", "Ryan"],
  },
  female: {
    short: ["My", "Nhi", "Ly", "Trinh", "Mai", "An", "Lê", "Hà", "Mỹ", "Vi"],
    compound: ["Minh Anh", "Thảo Linh", "Mộc Miên", "Ngọc An", "Bảo Ngọc", "Trúc Chi", "Tường Vi", "Hạ Vũ", "Thanh Nguyệt", "Vy Lam", "An Hạ", "Diễm Quỳnh", "Hương Giang"],
    international: ["Linh", "Mai", "An", "My", "Lan", "Bảo", "Vi", "Quỳnh", "Emma", "Mia"],
  },
  unisex: {
    short: ["An", "Minh", "Khánh", "Xuân", "Lâm", "Linh", "Phúc", "Tâm", "Duy", "Thanh"],
    compound: ["An Nhiên", "Hào Nhiên", "Bảo An", "An Khang", "Phúc Lâm", "Minh Anh"],
    international: ["An", "Minh", "Linh", "Phúc", "Tâm", "Lâm", "Bảo", "Khánh"],
  },
};

export const INDEX_GENZ_MIDDLE_NAME: Record<string, string[]> = {
  male: ["Minh", "Gia", "Đức", "Bảo", "Quốc", "Hoàng", "Anh", "Tuấn"],
  female: ["Ngọc", "Bảo", "An", "Khánh", "Minh", "Gia", "Thảo", "Phương"],
  unisex: ["An", "Bảo", "Minh", "Gia", "Khánh"],
};
