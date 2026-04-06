// Professional titles data
// Compact: key|title|abbreviation|gender (any=both, male, female)

const ACADEMIC = `professor|Giáo sư|GS|any
associate-professor|Phó Giáo sư|PGS|any
phd|Tiến sĩ|TS|any
master|Thạc sĩ|ThS|any
bachelor|Cử nhân||any`;

const MEDICAL = `doctor|Bác sĩ|BS|any
pharmacist|Dược sĩ||any
dentist|Nha sĩ||any
nurse|Y tá||any`;

const LEGAL = `lawyer|Luật sư||any
judge|Thẩm phán||any
prosecutor|Công tố viên||any`;

const MILITARY = `general|Đại tướng||any
colonel-general|Thượng tướng||any
lieutenant-general|Trung tướng||any
major-general|Thiếu tướng||any
colonel|Đại tá||any
senior-lieutenant-colonel|Thượng tá||any
lieutenant-colonel|Trung tá||any
major|Thiếu tá||any
captain|Đại úy||any
senior-lieutenant|Thượng úy||any
lieutenant|Trung úy||any
second-lieutenant|Thiếu úy||any`;

const POLITICAL = `general-secretary|Tổng Bí thư||any
president|Chủ tịch||any
prime-minister|Thủ tướng||any
minister|Bộ trưởng||any
deputy-minister|Thứ trưởng||any
party-secretary|Bí thư||any
comrade|Đồng chí||any`;

const EDUCATION = `teacher-male|Thầy||male
teacher-female|Cô||female`;

export interface IProfessionalTitle {
  key: string;
  title: string;
  abbreviation: string;
  gender: string;
}

export interface IProfessionalCategory {
  category: string;
  listTitle: IProfessionalTitle[];
}

function categoryParse(name: string, raw: string): IProfessionalCategory {
  return {
    category: name,
    listTitle: raw.split('\n').map(line => {
      const listPart = line.split('|');
      return {
        key: listPart[0],
        title: listPart[1],
        abbreviation: listPart[2] || '',
        gender: listPart[3] || 'any',
      };
    }),
  };
}

let cache: IProfessionalCategory[] | null = null;

export function professionalTitleIndex(): IProfessionalCategory[] {
  if (cache) return cache;
  cache = [
    categoryParse('academic', ACADEMIC),
    categoryParse('medical', MEDICAL),
    categoryParse('legal', LEGAL),
    categoryParse('military', MILITARY),
    categoryParse('political', POLITICAL),
    categoryParse('education', EDUCATION),
  ];
  return cache;
}

export function professionalTitleLookup(role: string): IProfessionalTitle | undefined {
  const listCategory = professionalTitleIndex();
  for (let i = 0; i < listCategory.length; i += 1) {
    const listTitle = listCategory[i].listTitle;
    for (let j = 0; j < listTitle.length; j += 1) {
      if (listTitle[j].key === role) return listTitle[j];
    }
  }
  return undefined;
}
