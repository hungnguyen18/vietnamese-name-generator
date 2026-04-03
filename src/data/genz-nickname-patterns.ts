export type TGenZNicknameStyle =
  | 'social-handle'
  | 'jp-suffix'
  | 'kr-suffix'
  | 'cute'
  | 'meme'
  | 'english-viet';

export const NICKNAME_TEMPLATES: Record<TGenZNicknameStyle, string[]> = {
  'social-handle': [
    '{given_lower}.{year}',
    '{given_lower}_{rand2}',
    '_{given_lower}_',
    '{given_lower}.official',
    '{prefix}{given_lower}',
    'itz.{given_lower}',
    '{given_lower}.{given_lower}{rand2}',
    '{given_lower}x{rand2}',
  ],
  'jp-suffix': [
    '{given}-chan',
    '{given}-kun',
    '{given}-san',
    '{given}-sama',
    '{given}-senpai',
  ],
  'kr-suffix': [
    '{given} oppa',
    '{given} unnie',
    '{given}-ah',
    '{given}-ya',
  ],
  'cute': [
    'Bé {given}',
    '{syl}{syl}',
    '{animal}',
    '{food}',
    'Mini {given}',
    'Mochi {given}',
    'Baby {given}',
  ],
  'meme': [
    '{western} {surname}',
    '{meme_phrase}',
    '{funny_title}',
  ],
  'english-viet': [
    '{western} {surname}',
    '{western} {given}',
  ],
};

export const CUTE_ANIMALS = [
  'Gấu', 'Cún', 'Miu', 'Thỏ', 'Sóc', 'Nhím', 'Nai', 'Heo', 'Nemo', 'Panda',
  'Hamster', 'Mèo', 'Gấu Trúc', 'Heo Sữa', 'Thỏ Non',
];

export const CUTE_FOODS = [
  'Xoài', 'Mít', 'Dâu', 'Cherry', 'Kem', 'Bắp', 'Kẹo', 'Na', 'Chanh', 'Táo',
  'Matcha', 'Trà Sữa', 'Mochi', 'Pudding', 'Bánh Bao',
];

export const MEME_PHRASES = [
  'Phở Mai Que', 'Công Chúa Hột Vịt Lộn', 'Hoàng Tử Bánh Tráng Trộn',
  'Bánh Bèo Ngơ Ngác', 'Heo Con Bông', 'Cún Yêu Dễ Thương',
  'Cô Nàng Mup Mup', 'Tiểu Thư 3m Bé Đời', 'Mèo Mèo Mèo Mèo',
];

export const FUNNY_TITLES = [
  'Thanh Bựa', 'Giáo Sư Cười', 'Shipper Không Tên', 'Boss Đại Nhân', 'Bad Boy Có Gu',
  'Sát Thủ Mắt Híp', 'Đại Ca Phố Đông', 'Bá Vương Phá Game', 'Chiến Binh Bất Bại',
];

export const WESTERN_MALE = [
  'Kevin', 'Ryan', 'Leo', 'Max', 'Daniel', 'Alex', 'Jack', 'Tony', 'Danny', 'Andy',
  'Bryan', 'Jason', 'Eric', 'Vincent', 'Lucas',
];

export const WESTERN_FEMALE = [
  'Jenny', 'Emma', 'Mia', 'Lisa', 'Luna', 'Bella', 'Amy', 'Sunny', 'Rosie', 'Anna',
  'Ella', 'Zoe', 'Nora', 'Lucy', 'Elsa',
];

export const JP_SUFFIXES = ['-chan', '-kun', '-san', '-sama', '-senpai', '-sensei'];

export const KR_SUFFIXES = ['oppa', 'unnie', '-ah', '-ya', 'hyung', 'noona'];

export const HANDLE_PREFIXES = ['dreamy', 'soft', 'baby', 'little', 'mini', 'sweet', 'sunny', 'moon'];

export const CULTURAL_NOTES: Record<TGenZNicknameStyle, string> = {
  'social-handle': 'Vietnamese GenZ social media handle patterns — dots, underscores, birth year, aesthetic prefixes',
  'jp-suffix': 'Japanese honorific suffixes adopted by Vietnamese anime/manga fans — -chan (cute), -kun (casual male), -sama (admiration)',
  'kr-suffix': 'Korean honorifics from K-pop/K-drama fan culture — oppa (older male), unnie (older female), -ah/-ya (casual)',
  'cute': 'Vietnamese cute nickname tradition — animal names, food names, syllable doubling, "bé" prefix (baby/little)',
  'meme': 'Vietnamese internet meme nicknames — humorous food titles, exaggerated personas, self-deprecating humor',
  'english-viet': 'English first name + Vietnamese surname pattern — the "Kevin Nguyen" phenomenon from Viet diaspora culture',
};
