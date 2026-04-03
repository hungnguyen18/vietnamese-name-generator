export type TGenZNameEntry = {
  value: string;
  origin: 'j' | 'k' | 'w' | 'v' | 'h';
  script: string;
  meaning: string;
  vietnamized: string;
  popularity: number;
};

// Compact: name|origin|script|meaning|vietnamized|popularity
// origin: j=japanese, k=korean, w=western, v=vietnamese, h=hybrid

const GENZ_MALE = "Ren|j|蓮|lotus|Ren|9,Haruto|j|大翔|great soaring|Ha-ru-to|8,Minato|j|湊|harbor|Mi-na-to|8,Asahi|j|朝陽|morning sun|A-sa-hi|7,Riku|j|陸|land|Ri-ku|7,Kaito|j|海斗|sea warrior|Kai-to|8,Sora|j|空|sky|So-ra|7,Akira|j|明|bright|A-ki-ra|9,Haru|j|春|spring|Ha-ru|8,Yuki|j|雪|snow|Yu-ki|8,Kai|j|海|sea|Kai|9,Ryo|j|涼|cool|Ryo|7,Itsuki|j|樹|tree|I-tsu-ki|7,Sota|j|颯太|fresh wind|So-ta|6,Taku|j|拓|pioneer|Ta-ku|6,Yuuma|j|悠真|gentle truth|Yu-ma|7,Min-jun|k|민준|intelligent|Min Tuấn|9,Seo-jun|k|서준|outstanding talent|Seo Tuấn|8,Ha-jun|k|하준|summer talented|Hà Tuấn|8,Ji-ho|k|지호|wisdom bravery|Chi Hào|7,Hyun-woo|k|현우|wise cosmic|Hiền Vũ|7,Ji-hoon|k|지훈|wisdom merit|Chi Huân|7,Min-ho|k|민호|quick great|Min Hào|8,Tae-hyun|k|태현|great wise|Thái Hiền|7,Woo-jin|k|우진|rain precious|Vũ Trân|7,Jimin|k|지민|wisdom quick|Jimin|10,Jun-young|k|준영|talented forever|Tuấn Vinh|6,Sung-min|k|성민|accomplished|Thành Min|6,Do-yoon|k|도윤|path shine|Do Yoon|7,Ye-jun|k|예준|artful talented|Ye Tuấn|7,Chan-woo|k|찬우|praise rain|Chan Vũ|6,Ha-neul|k|하늘|sky|Ha Neul|7,Leo|w||lion|Leo|10,Ryan|w||little king|Ryan|9,Max|w||greatest|Max|8,Daniel|w||God is judge|Daniel|8,Kevin|w||handsome|Kevin|9,Alex|w||defender|Alex|8,Jack|w||God is gracious|Jack|7,Tony|w||priceless|Tony|7,Danny|w||God is judge|Danny|7,Lucas|w||light|Lucas|8,Noah|w||rest comfort|Noah|7,Andy|w||brave|Andy|7,Eric|w||eternal ruler|Eric|6,Bryan|w||noble|Bryan|7,An|v||peace|An|10,Khang|v||healthy|Khang|9,Khôi|v||outstanding|Khoi|9,Long|v||dragon|Long|9,Trí|v||wisdom|Tri|8,Bình|v||peaceful|Binh|8,Tín|v||trust|Tin|7,Phi|v||fly|Phi|7,Hải|v||sea|Hai|8,Nam|v||south|Nam|8,Tâm|v||heart|Tam|8,Đạt|v||achieve|Dat|7,Minh|h|明|bright|Minh|10,Bảo|h|寶|treasure|Bao|9,Kai|h|海|sea|Kai|9,Ren|h|蓮|lotus|Ren|8";

const GENZ_FEMALE = "Sakura|j|桜|cherry blossom|Sa-ku-ra|10,Hana|j|花|flower|Ha-na|10,Rin|j|凛|dignified|Rin|8,Himari|j|陽葵|sunflower|Hi-ma-ri|7,Hinata|j|陽向|sunny place|Hi-na-ta|8,Mio|j|澪|waterway|Mi-o|7,Aoi|j|葵|hollyhock|A-oi|7,Yui|j|結衣|binding|Yu-i|8,Mei|j|芽依|sprout|Mei|9,Akari|j|明かり|light|A-ka-ri|7,Mina|j|美菜|beauty nature|Mi-na|9,Nana|j|奈々|spring freshness|Na-na|8,Saki|j|咲|blossom|Sa-ki|7,Koharu|j|小春|little spring|Ko-ha-ru|7,Yuzuki|j|結月|connecting moon|Yu-zu-ki|7,Riko|j|莉子|jasmine child|Ri-ko|7,Seo-yeon|k|서연|auspicious beautiful|Seo Yên|8,Ha-eun|k|하은|summer grace|Hà Ân|8,Ji-woo|k|지우|wisdom rain|Chi Vũ|7,Su-a|k|수아|elegant|Su A|7,Ye-eun|k|예은|artful grace|Ye Ân|7,Min-seo|k|민서|quick auspicious|Min Thư|7,Yuna|k|윤아|gentle|Yu-na|9,Da-in|k|다인|much kindness|Da In|6,Soo-jin|k|수진|excellent precious|Tú Trân|7,Mi-na|k|미나|beautiful|Mỹ Na|8,Chae-won|k|채원|colorful garden|Chae Won|7,Ji-a|k|지아|wisdom elegance|Chi A|7,Na-yeon|k|나연|graceful beauty|Na Yên|8,Bo-ra|k|보라|purple|Bo Ra|6,Ha-yoon|k|하윤|summer shine|Hà Vân|7,Ye-jin|k|예진|artful precious|Ye Trân|7,Emma|w||whole universal|Emma|10,Mia|w||mine beloved|Mia|9,Anna|w||grace|Anna|8,Bella|w||beautiful|Bella|8,Jenny|w||fair one|Jenny|9,Lisa|w||pledged to God|Lisa|9,Luna|w||moon|Luna|8,Ella|w||fairy maiden|Ella|7,Rosie|w||rose|Rosie|7,Amy|w||beloved|Amy|7,Sunny|w||sunshine|Sunny|7,Zoe|w||life|Zoe|7,Nora|w||light|Nora|6,Elsa|w||noble|Elsa|7,My|v||beauty|My|8,Nhi|v||small|Nhi|8,An|v||peace|An|10,Mai|v||apricot blossom|Mai|9,Vi|v||tiny|Vi|7,Hà|v||river|Ha|8,Ly|v||elegant|Ly|7,Trinh|v||pure|Trinh|7,Lê|v||pear|Le|7,Mỹ|v||beautiful|My|8,Linh|h|靈|spirit|Linh|10,Mai|h|梅|apricot|Mai|10,An|h|安|peace|An|10,Hana|h|花|flower|Hana|9,Mina|h|美菜|beautiful|Mina|9";

const GENZ_UNISEX = "An|v||peace|An|10,Minh|v|明|bright|Minh|10,Khánh|v||celebration|Khanh|8,Xuân|v||spring|Xuan|8,Lâm|v||forest|Lam|8,Linh|v|靈|spirit|Linh|9,Phúc|v||blessing|Phuc|8,Tâm|v||heart|Tam|8,Duy|v||only|Duy|7,Thanh|v||pure|Thanh|8,Sora|j|空|sky|So-ra|8,Yuki|j|雪|snow|Yu-ki|8,Haru|j|春|spring|Ha-ru|8,Ren|j|蓮|lotus|Ren|8,Kai|j|海|sea|Kai|9,Ha-neul|k|하늘|sky|Ha Neul|7,Bom|k|봄|spring|Bom|6,Bit-na|k|빛나|shining|Bit Na|6,Alex|w||defender|Alex|8,Kai|w||sea|Kai|9,Bảo|h|寶|treasure|Bao|9,An|h|安|peace|An|10";

// --- Lazy parser with cache ---

type TGenzIndex = Record<string, TGenZNameEntry[]>;
let cachedIndex: TGenzIndex | null = null;

function parseDictLine(line: string): TGenZNameEntry {
  const [value, origin, script, meaning, vietnamized, pop] = line.split('|');
  return {
    value,
    origin: origin as TGenZNameEntry['origin'],
    script: script || '',
    meaning,
    vietnamized: vietnamized || value,
    popularity: parseInt(pop, 10),
  };
}

export function genzNameIndex(): TGenzIndex {
  if (cachedIndex) {
    return cachedIndex;
  }
  cachedIndex = {
    male: GENZ_MALE.split(',').map(parseDictLine),
    female: GENZ_FEMALE.split(',').map(parseDictLine),
    unisex: GENZ_UNISEX.split(',').map(parseDictLine),
  };
  return cachedIndex;
}

// --- Middle names (kept as simple arrays — small data) ---

export const INDEX_GENZ_MIDDLE_NAME: Record<string, string[]> = {
  male: ['Minh', 'Gia', 'Đức', 'Bảo', 'Quốc', 'Hoàng', 'Anh', 'Tuấn'],
  female: ['Ngọc', 'Bảo', 'An', 'Khánh', 'Minh', 'Gia', 'Thảo', 'Phương'],
  unisex: ['An', 'Bảo', 'Minh', 'Gia', 'Khánh'],
};
