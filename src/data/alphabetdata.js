/* =========================================================
   ALPHABET DATA — KHMER

   DÙNG CHUNG:
   - Alphabet
   - WAT 1
   - WAT 2+
   - Các trò chơi nhận diện chữ
   - Âm thanh bảng chữ cái

   CẤU TRÚC:
   ─ 33 PHỤ ÂM
   ─ 24 NGUYÊN ÂM
   ─ 57 KÝ TỰ
   ─ AUDIO PHỤ ÂM
   ─ AUDIO NGUYÊN ÂM GIỌNG O / Ô
========================================================= */


/* =========================================================
   33 PHỤ ÂM KHMER
========================================================= */

export const CONSONANTS = [
  { stt: 1, id: "C1", type: "consonant", letter: "ក", roman: "Co", voice: "O" },
  { stt: 2, id: "C2", type: "consonant", letter: "ខ", roman: "Kho", voice: "O" },
  { stt: 3, id: "C3", type: "consonant", letter: "គ", roman: "Cô", voice: "Ô" },
  { stt: 4, id: "C4", type: "consonant", letter: "ឃ", roman: "Khô", voice: "Ô" },
  { stt: 5, id: "C5", type: "consonant", letter: "ង", roman: "Ngô", voice: "Ô" },

  { stt: 6, id: "C6", type: "consonant", letter: "ច", roman: "Cho", voice: "O" },
  { stt: 7, id: "C7", type: "consonant", letter: "ឆ", roman: "Chho", voice: "O" },
  { stt: 8, id: "C8", type: "consonant", letter: "ជ", roman: "Chô", voice: "Ô" },
  { stt: 9, id: "C9", type: "consonant", letter: "ឈ", roman: "Chhô", voice: "Ô" },
  { stt: 10, id: "C10", type: "consonant", letter: "ញ", roman: "Nhô", voice: "Ô" },

  { stt: 11, id: "C11", type: "consonant", letter: "ដ", roman: "Đo", voice: "O" },
  { stt: 12, id: "C12", type: "consonant", letter: "ឋ", roman: "Tho", voice: "O" },
  { stt: 13, id: "C13", type: "consonant", letter: "ឌ", roman: "Đô", voice: "Ô" },
  { stt: 14, id: "C14", type: "consonant", letter: "ឍ", roman: "Thô", voice: "Ô" },
  { stt: 15, id: "C15", type: "consonant", letter: "ណ", roman: "No", voice: "O" },

  { stt: 16, id: "C16", type: "consonant", letter: "ត", roman: "To", voice: "O" },
  { stt: 17, id: "C17", type: "consonant", letter: "ថ", roman: "Tho", voice: "O" },
  { stt: 18, id: "C18", type: "consonant", letter: "ទ", roman: "Tô", voice: "Ô" },
  { stt: 19, id: "C19", type: "consonant", letter: "ធ", roman: "Thô", voice: "Ô" },
  { stt: 20, id: "C20", type: "consonant", letter: "ន", roman: "Nô", voice: "Ô" },

  { stt: 21, id: "C21", type: "consonant", letter: "ប", roman: "Bo", voice: "O" },
  { stt: 22, id: "C22", type: "consonant", letter: "ផ", roman: "Pho", voice: "O" },
  { stt: 23, id: "C23", type: "consonant", letter: "ព", roman: "Pô", voice: "Ô" },
  { stt: 24, id: "C24", type: "consonant", letter: "ភ", roman: "Phô", voice: "Ô" },
  { stt: 25, id: "C25", type: "consonant", letter: "ម", roman: "Mô", voice: "Ô" },

  { stt: 26, id: "C26", type: "consonant", letter: "យ", roman: "Dô", voice: "Ô" },
  { stt: 27, id: "C27", type: "consonant", letter: "រ", roman: "Rô", voice: "Ô" },
  { stt: 28, id: "C28", type: "consonant", letter: "ល", roman: "Lô", voice: "Ô" },
  { stt: 29, id: "C29", type: "consonant", letter: "វ", roman: "Vô", voice: "Ô" },

  { stt: 30, id: "C30", type: "consonant", letter: "ស", roman: "So", voice: "O" },
  { stt: 31, id: "C31", type: "consonant", letter: "ហ", roman: "Ho", voice: "O" },
  { stt: 32, id: "C32", type: "consonant", letter: "ឡ", roman: "Lo", voice: "O" },
  { stt: 33, id: "C33", type: "consonant", letter: "អ", roman: "O", voice: "O" },
];


/* =========================================================
   24 NGUYÊN ÂM KHMER
========================================================= */

export const VOWELS = [
  {
    stt: 1,
    id: "V1",
    type: "vowel",
    symbol: "◌ា",
    romanO: "a",
    romanOh: "ia",
    note: "Âm dài",
  },

  {
    stt: 2,
    id: "V2",
    type: "vowel",
    symbol: "◌ិ",
    romanO: "ế",
    romanOh: "í",
    note: "Âm ngắn",
  },

  {
    stt: 3,
    id: "V3",
    type: "vowel",
    symbol: "◌ី",
    romanO: "ây",
    romanOh: "i",
    note: "Âm dài",
  },

  {
    stt: 4,
    id: "V4",
    type: "vowel",
    symbol: "◌ឹ",
    romanO: "ấ",
    romanOh: "ứ",
    note: "Âm ngắn",
  },

  {
    stt: 5,
    id: "V5",
    type: "vowel",
    symbol: "◌ឺ",
    romanO: "ơ",
    romanOh: "ư",
    note: "Âm dài",
  },

  {
    stt: 6,
    id: "V6",
    type: "vowel",
    symbol: "◌ុ",
    romanO: "ố",
    romanOh: "ú",
    note: "Âm ngắn",
  },

  {
    stt: 7,
    id: "V7",
    type: "vowel",
    symbol: "◌ូ",
    romanO: "ô",
    romanOh: "u",
    note: "Không đổi giọng",
  },

  {
    stt: 8,
    id: "V8",
    type: "vowel",
    symbol: "◌ួ",
    romanO: "ua",
    romanOh: "ua",
    note: "",
  },

  {
    stt: 9,
    id: "V9",
    type: "vowel",
    symbol: "ើ",
    romanO: "ờ",
    romanOh: "ơ",
    note: "Không đổi giọng",
  },

  {
    stt: 10,
    id: "V10",
    type: "vowel",
    symbol: "ឿ",
    romanO: "ưa",
    romanOh: "ưa",
    note: "Không đổi giọng",
  },

  {
    stt: 11,
    id: "V11",
    type: "vowel",
    symbol: "ៀ",
    romanO: "ia",
    romanOh: "ia",
    note: "Âm ê",
  },

  {
    stt: 12,
    id: "V12",
    type: "vowel",
    symbol: "េ",
    romanO: "ê",
    romanOh: "ê",
    note: "Âm e / ê",
  },

  {
    stt: 13,
    id: "V13",
    type: "vowel",
    symbol: "ែ",
    romanO: "ae",
    romanOh: "e",
    note: "Âm ay / ây",
  },

  {
    stt: 14,
    id: "V14",
    type: "vowel",
    symbol: "ៃ",
    romanO: "ay",
    romanOh: "ây",
    note: "Âm ao / âu",
  },

  {
    stt: 15,
    id: "V15",
    type: "vowel",
    symbol: "ោ",
    romanO: "ao",
    romanOh: "ô",
    note: "Âm au / âu",
  },

  {
    stt: 16,
    id: "V16",
    type: "vowel",
    symbol: "ៅ",
    romanO: "au",
    romanOh: "âu",
    note: "Nikkahit",
  },

  {
    stt: 17,
    id: "V17",
    type: "vowel",
    symbol: "ុំ",
    romanO: "ôm",
    romanOh: "um",
    note: "Dấu chấm tròn",
  },

  {
    stt: 18,
    id: "V18",
    type: "vowel",
    symbol: "ំ",
    romanO: "om",
    romanOh: "ôm",
    note: "Âm ăm / oăm",
  },

  {
    stt: 19,
    id: "V19",
    type: "vowel",
    symbol: "ាំ",
    romanO: "ăm",
    romanOh: "oăm",
    note: "Reahmuk",
  },

  {
    stt: 20,
    id: "V20",
    type: "vowel",
    symbol: "ះ",
    romanO: "ắs",
    romanOh: "ías",
    note: "Ngắt hơi",
  },

  {
    stt: 21,
    id: "V21",
    type: "vowel",
    symbol: "ិះ",
    romanO: "ếs",
    romanOh: "ís",
    note: "Ngắt hơi",
  },

  {
    stt: 22,
    id: "V22",
    type: "vowel",
    symbol: "េះ",
    romanO: "és",
    romanOh: "ếs",
    note: "Ngắt hơi",
  },

  {
    stt: 23,
    id: "V23",
    type: "vowel",
    symbol: "ុះ",
    romanO: "ốs",
    romanOh: "ús",
    note: "Ngắt hơi",
  },

  {
    stt: 24,
    id: "V24",
    type: "vowel",
    symbol: "ោះ",
    romanO: "ós",
    romanOh: "úas",
    note: "Ngắt hơi",
  },
];


/* =========================================================
   AUDIO PATH
   =========================================================

   THƯ MỤC THỰC TẾ:

   public/
   └── audio/
       └── alphabet/
           ├── consonants/
           │   ├── ក.mp3
           │   ├── ខ.mp3
           │   ├── គ.mp3
           │   └── ...
           │
           └── vowels/
               ├── ◌ា-o.mp3
               ├── ◌ា-oh.mp3
               ├── ◌ិ-o.mp3
               ├── ◌ិ-oh.mp3
               └── ...
========================================================= */


/* =========================================================
   PHỤ ÂM
========================================================= */

export function getConsonantAudioUrl(letter) {
  if (!letter) return "";

  return `/audio/alphabet/consonants/${encodeURIComponent(
    letter
  )}.mp3`;
}


/* =========================================================
   NGUYÊN ÂM
========================================================= */

export function getVowelAudioUrl(
  symbol,
  voice = "O"
) {
  if (!symbol) return "";

  const normalizedVoice =
    String(voice).trim().toUpperCase() === "Ô"
      ? "oh"
      : "o";

  const filename =
    `${symbol}-${normalizedVoice}.mp3`;

  return `/audio/alphabet/vowels/${encodeURIComponent(
    filename
  )}`;
}


/* =========================================================
   AUDIO CHUNG
========================================================= */

export function getAlphabetAudioUrl(
  item,
  voice = null
) {
  if (!item) return "";

  /* -------------------------------------------------------
     PHỤ ÂM
  ------------------------------------------------------- */

  if (
    item.type === "consonant" ||
    item.letter
  ) {
    return getConsonantAudioUrl(
      item.letter
    );
  }

  /* -------------------------------------------------------
     NGUYÊN ÂM
  ------------------------------------------------------- */

  if (
    item.type === "vowel" ||
    item.symbol
  ) {
    return getVowelAudioUrl(
      item.symbol,
      voice || item.voice || "O"
    );
  }

  return "";
}


/* =========================================================
   ALPHABET
========================================================= */

export const ALPHABET = [
  ...CONSONANTS,
  ...VOWELS,
];


/* =========================================================
   COUNT
========================================================= */

export const CONSONANT_COUNT =
  CONSONANTS.length;

export const VOWEL_COUNT =
  VOWELS.length;

export const ALPHABET_COUNT =
  ALPHABET.length;


/* =========================================================
   ALIAS
========================================================= */

export const consonants =
  CONSONANTS;

export const vowels =
  VOWELS;


/* =========================================================
   DEFAULT
========================================================= */

const alphabetData = {
  CONSONANTS,
  VOWELS,
  ALPHABET,

  CONSONANT_COUNT,
  VOWEL_COUNT,
  ALPHABET_COUNT,

  getConsonantAudioUrl,
  getVowelAudioUrl,
  getAlphabetAudioUrl,
};

export default alphabetData;