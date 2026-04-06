export type THanVietEntry = {
  name: string;
  character: string;
  pinyin?: string;
  meaning: string;
  alternates?: { character: string; meaning: string }[];
};

// Compact: name|character|pinyin|meaning|alt1Char:alt1Meaning;alt2Char:alt2Meaning
const D = `An|安|an|peace|晏:calm
Anh|英|ying|hero|矎:crystal/lustrous
Bảo|寶|bao|treasure
Bình|平|ping|calm|兵:soldier
Cường|強|qiang|strong
Đạt|達|da|achieve
Đức|德|de|virtue
Dũng|勇|yong|brave
Duy|唯|wei|only|維:maintain
Hải|海|hai|sea
Hiếu|孝|xiao|filial piety
Hoàng|皇|huang|royal|黃:yellow
Hùng|雄|xiong|heroic
Huy|輝|hui|radiant
Khang|康|kang|healthy
Khánh|慶|qing|celebrate
Khoa|科|ke|science
Kiên|堅|jian|firm
Long|龍|long|dragon
Minh|明|ming|bright|銘:inscribe/remember;民:people
Nam|南|nan|south
Nghĩa|義|yi|justice
Nhân|仁|ren|benevolent|人:person
Phúc|福|fu|blessing
Quân|君|jun|noble|軍:army
Quang|光|guang|light
Sơn|山|shan|mountain
Tài|才|cai|talent|財:wealth
Thành|成|cheng|success|城:city
Thiện|善|shan|good
Toàn|全|quan|complete
Trí|智|zhi|wisdom
Trung|忠|zhong|loyal|中:middle
Tuấn|俊|jun|handsome
Tùng|松|song|pine
Vinh|榮|rong|glory
Vũ|武|wu|martial|羽:feather
Châu|珠|zhu|pearl
Chi|芝|zhi|sesame/noble|枝:branch
Diệu|妙|miao|wonderful
Giang|江|jiang|river
Hạnh|幸|xing|happiness|行:conduct
Hằng|恆|heng|constant
Hoa|花|hua|flower|華:magnificent
Huệ|慧|hui|wise
Hương|香|xiang|fragrant
Lan|蘭|lan|orchid
Liên|蓮|lian|lotus|連:connect
Linh|靈|ling|spirit|玉:jade tinkling
Mai|梅|mei|plum blossom
Ngọc|玉|yu|jade
Nguyệt|月|yue|moon
Nhung|絨|rong|velvet
Phương|芳|fang|fragrant|方:direction
Quyên|鵑|juan|cuckoo
Thanh|清|qing|pure|青:blue/green;聲:sound
Thảo|草|cao|grass
Thu|秋|qiu|autumn
Thúy|翠|cui|emerald
Trang|莊|zhuang|elegant|裝:adorn
Trâm|簪|zan|hairpin
Trinh|貞|zhen|chaste
Tuyết|雪|xue|snow
Vy|薇|wei|rose
Xuân|春|chun|spring
Yến|燕|yan|swallow|宴:banquet
Bách|柏|bai|cypress|百:hundred
Hà|河|he|river
Kim|金|jin|gold
Lâm|林|lin|forest
Phong|風|feng|wind|豐:abundant
Thủy|水|shui|water
Trúc|竹|zhu|bamboo
Mạnh|孟|meng|eldest/vigorous
Tín|信|xin|trust
Khiêm|謙|qian|humble
Tâm|心|xin|heart
Thê|世|shi|generation
Thịnh|盛|sheng|prosperous
Tiến|進|jin|advance
Phát|發|fa|prosper
Phú|富|fu|wealthy
Lộc|祿|lu|fortune
Thiên|天|tian|heaven
Nhật|日|ri|sun/day
Đông|東|dong|east
Hạ|夏|xia|summer
Dương|陽|yang|sun/positive
Vân|雲|yun|cloud
Hiền|賢|xian|virtuous
Hồng|紅|hong|red/rosy
Mỹ|美|mei|beautiful
Diễm|艶|yan|gorgeous
Kiều|喬|qiao|graceful
Như|如|ru|like/as
Nhi|兒|er|child
Uyên|鴛|yuan|mandarin duck
Duyên|緣|yuan|grace/charm
Ngân|銀|yin|silver
Bích|碧|bi|jade-green
Loan|鸞|luan|phoenix
Sen|蓮|lian|lotus
Đào|桃|tao|peach
Cúc|菊|ju|chrysanthemum
Kiệt|傑|jie|outstanding
Khôi|魁|kui|leader/chief
Triết|哲|zhe|philosopher
Lực|力|li|strength
Hào|豪|hao|heroic/grand
Hân|欣|xin|joy
Phước|福|fu|blessing
Sáng|明|ming|bright/luminous
Sao|星|xing|star`;

let cache: Record<string, THanVietEntry> | null = null;

function hanVietParse(): Record<string, THanVietEntry> {
  if (cache) return cache;
  cache = {};
  const listLine = D.split('\n');
  for (let i = 0; i < listLine.length; i += 1) {
    const listPart = listLine[i].split('|');
    const entry: THanVietEntry = {
      name: listPart[0],
      character: listPart[1],
      meaning: listPart[3],
    };
    if (listPart[2]) entry.pinyin = listPart[2];
    if (listPart[4]) {
      entry.alternates = listPart[4].split(';').map(a => {
        const j = a.indexOf(':');
        return { character: a.slice(0, j), meaning: a.slice(j + 1) };
      });
    }
    cache[entry.name] = entry;
  }
  return cache;
}

export const HAN_VIET_MAP: Record<string, THanVietEntry> = new Proxy(
  {} as Record<string, THanVietEntry>,
  {
    get(_t, p: string) { return hanVietParse()[p]; },
    ownKeys() { return Object.keys(hanVietParse()); },
    getOwnPropertyDescriptor(_t, p: string) {
      const m = hanVietParse();
      return p in m ? { configurable: true, enumerable: true, value: m[p] } : undefined;
    },
    has(_t, p: string) { return p in hanVietParse(); },
  }
);
