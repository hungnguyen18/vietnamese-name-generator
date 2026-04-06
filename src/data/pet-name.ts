export type TPetNameEntry = {
  name: string;
  meaning: string;
  category: string;
  petType?: string;
  furColor?: string;
};

// Compact: name|meaning|category|petType|furColor (last 2 optional)
const D = `Vàng|gold/yellow|byColor|any|yellow
Mực|ink/black|byColor|dog|black
Bông|cotton/white|byColor|any|white
Tuyết|snow|byColor|any|white
Sữa|milk|byColor|any|white
Mây|cloud|byColor|any|white
Kem|cream|byColor|any|cream
Đen|black|byColor|any|black
Than|charcoal|byColor|any|black
Kim|gold (metal)|byColor|any|yellow
Nắng|sunshine|byColor|any|yellow
Đốm|spotted|byColor|dog|spotted
Xám|gray|byColor|any|gray
Mun|traditional black cat name|byColor|cat|black
Mướp|tabby/orange|byColor|cat|orange
Bạch|pure white|byColor|any|white
Khói|smoke|byColor|cat|gray
Bạc|silver|byColor|any|gray
Cam|orange|byColor|cat|orange
Gừng|ginger|byColor|cat|orange
Cà Phê|coffee|byColor|any|brown
Socola|chocolate|byColor|any|brown
Hổ|tiger|byColor|cat|tabby
Phở|pho noodle soup|byFood
Bún|rice vermicelli|byFood
Bánh|cake/pastry|byFood
Bánh Mì|bread/sandwich|byFood
Bánh Bao|steamed bun|byFood
Xôi|sticky rice|byFood
Nem|spring roll|byFood
Chè|sweet dessert soup|byFood
Cơm|rice|byFood
Tiêu|pepper|byFood
Xúc Xích|sausage|byFood
Bim Bim|chips/snacks|byFood
Kẹo|candy|byFood
Bơ|butter/avocado|byFood
Đậu|bean|byFood
Bắp|corn|byFood
Gạo|rice (uncooked)|byFood
Xoài|mango|byFood
Mít|jackfruit|byFood
Chanh|lime|byFood
Bí|pumpkin|byFood
Cà Rốt|carrot|byFood
Tôm Hùm|lobster|byFood
Ruốc|meat floss|byFood
Sen|lotus|byNature
Mai|apricot blossom|byNature
Đào|peach blossom|byNature
Lan|orchid|byNature
Cúc|chrysanthemum|byNature
Hồng|rose/pink|byNature
Trúc|bamboo|byNature
Sao|star|byNature
Gió|wind|byNature
Rừng|forest|byNature
Xuân|spring|byNature
Bướm|butterfly|byNature
Sương|dew/mist|byNature
Biển|sea|byNature
Mưa|rain|byNature
Tài|wealth|byLuck
Lộc|fortune|byLuck
Phú Quý|rich & noble|byLuck
Phúc|blessing|byLuck
Phát|prosper|byLuck
Thịnh|prosperous|byLuck
Vui|happy|byLuck
Sướng|comfortable|byLuck
May Mắn|lucky|byLuck
Hạnh Phúc|happiness|byLuck
Như Ý|as wished|byLuck
Thần Tài|god of wealth|byLuck
Cậu Vàng|Mr. Gold (literary classic)|byHumor
Đại Ca|big boss|byHumor
Tướng Quân|general|byHumor
Hoàng Tử|prince|byHumor
Soái Ca|heartthrob|byHumor
Béo|fat|byHumor
Mập|chubby|byHumor
Lùn|shorty|byHumor
Xíu|tiny|byHumor
Lì|stubborn|byHumor
Lười|lazy|byHumor
Ninja|ninja|byHumor
Luna|moon (Sailor Moon cat)|byPopCulture
Milo|popular international name|byPopCulture
Simba|lion (The Lion King)|byPopCulture
Totoro|forest spirit (anime)|byPopCulture
Pikachu|electric mouse (Pokemon)|byPopCulture
Momo|peach (various anime)|byPopCulture
Haru|spring (Japanese)|byPopCulture
Coco|chic/stylish|byPopCulture
Lucky|lucky (English)|byPopCulture
Max|greatest (English)|byPopCulture
Bella|beautiful (Italian)|byPopCulture
Charlie|free man (English)|byPopCulture
Tí|tiny|endearment
Bé|small/baby|endearment
Cu|boy (informal)|endearment
Bống|little fish|endearment
Gấu|bear|endearment
Cún|puppy|endearment|dog
Miu|kitty|endearment|cat
Bọ|beetle/bug|endearment
Bin|baby (slang)|endearment
Bún Bò|beef noodle (cute combo)|endearment`;

export const LIST_PET_NAME: TPetNameEntry[] = D.split('\n').map(line => {
  const listPart = line.split('|');
  const entry: TPetNameEntry = {
    name: listPart[0],
    meaning: listPart[1],
    category: listPart[2],
  };
  if (listPart[3]) entry.petType = listPart[3];
  if (listPart[4]) entry.furColor = listPart[4];
  return entry;
});
