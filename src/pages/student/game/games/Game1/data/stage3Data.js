/* =========================================================
   GAME 1 — STAGE 3
   NGUYÊN ÂM → PHIÊN ÂM

   GIỌNG O:
   → 1 đúng + 3 nhiễu từ nhóm O

   GIỌNG Ô:
   → 1 đúng + 3 nhiễu từ nhóm Ô

   4 đáp án luôn KHÔNG TRÙNG NHAU
========================================================= */


/* =========================================================
   24 NGUYÊN ÂM KHMER
========================================================= */

const vowels = [
  { stt: 1, symbol: "ា", romanO: "a", romanOh: "ia", note: "Âm dài" },
  { stt: 2, symbol: "ិ", romanO: "ế", romanOh: "í", note: "Âm ngắn" },
  { stt: 3, symbol: "ី", romanO: "ây", romanOh: "i", note: "Âm dài" },
  { stt: 4, symbol: "ឹ", romanO: "ấ", romanOh: "ứ", note: "Âm ngắn" },
  { stt: 5, symbol: "ឺ", romanO: "ơ", romanOh: "ư", note: "Âm dài" },
  { stt: 6, symbol: "ុ", romanO: "ố", romanOh: "ú", note: "Âm ngắn" },
  { stt: 7, symbol: "ូ", romanO: "ô", romanOh: "u", note: "Không đổi giọng" },
  { stt: 8, symbol: "ួ", romanO: "ua", romanOh: "ua", note: "" },
  { stt: 9, symbol: "ើ", romanO: "ờ", romanOh: "ơ", note: "Không đổi giọng" },
  { stt: 10, symbol: "ឿ", romanO: "ưa", romanOh: "ưa", note: "Không đổi giọng" },
  { stt: 11, symbol: "ៀ", romanO: "ia", romanOh: "ia", note: "Âm ê" },
  { stt: 12, symbol: "េ", romanO: "ê", romanOh: "ê", note: "Âm e / ê" },
  { stt: 13, symbol: "ែ", romanO: "ae", romanOh: "e", note: "Âm ay / ây" },
  { stt: 14, symbol: "ៃ", romanO: "ay", romanOh: "ây", note: "Âm ao / âu" },
  { stt: 15, symbol: "ោ", romanO: "ao", romanOh: "ô", note: "Âm au / âu" },
  { stt: 16, symbol: "ៅ", romanO: "au", romanOh: "âu", note: "Nikkahit" },
  { stt: 17, symbol: "ុំ", romanO: "ôm", romanOh: "um", note: "Dấu chấm tròn" },
  { stt: 18, symbol: "ំ", romanO: "om", romanOh: "ôm", note: "Âm ăm / oăm" },
  { stt: 19, symbol: "ាំ", romanO: "ăm", romanOh: "oăm", note: "Reahmuk" },
  { stt: 20, symbol: "ះ", romanO: "ắs", romanOh: "ías", note: "Ngắt hơi" },
  { stt: 21, symbol: "ិះ", romanO: "ếs", romanOh: "ís", note: "Ngắt hơi" },
  { stt: 22, symbol: "េះ", romanO: "és", romanOh: "ếs", note: "Ngắt hơi" },
  { stt: 23, symbol: "ុះ", romanO: "ốs", romanOh: "ús", note: "Ngắt hơi" },
  { stt: 24, symbol: "ោះ", romanO: "ós", romanOh: "úas", note: "Ngắt hơi" },
];


/* =========================================================
   LẤY PHIÊN ÂM THEO TỪNG GIỌNG
========================================================= */

const romanOList = [
  ...new Set(
    vowels.map(
      (item) => item.romanO
    )
  ),
];

const romanOhList = [
  ...new Set(
    vowels.map(
      (item) => item.romanOh
    )
  ),
];


/* =========================================================
   TẠO 4 ĐÁP ÁN KHÔNG TRÙNG
========================================================= */

const createOptions = (
  correctAnswer,
  voice
) => {
  const source =
    voice === "O"
      ? romanOList
      : romanOhList;

  const wrongAnswers = source
    .filter(
      (roman) =>
        roman !== correctAnswer
    )
    .sort(
      () => Math.random() - 0.5
    )
    .slice(0, 3);

  return [
    correctAnswer,
    ...wrongAnswers,
  ].sort(
    () => Math.random() - 0.5
  );
};


/* =========================================================
   TẠO CÂU HỎI
========================================================= */

const stage3Data = vowels.flatMap(
  (item) => {
    const questionO = {
      id: `${item.stt}-O`,
      vowelId: item.stt,
      symbol: item.symbol,
      voice: "O",
      answer: item.romanO,
      note: item.note,
      options: createOptions(
        item.romanO,
        "O"
      ),
    };

    const questionOh = {
      id: `${item.stt}-Ô`,
      vowelId: item.stt,
      symbol: item.symbol,
      voice: "Ô",
      answer: item.romanOh,
      note: item.note,
      options: createOptions(
        item.romanOh,
        "Ô"
      ),
    };

    return [
      questionO,
      questionOh,
    ];
  }
);


/* =========================================================
   EXPORT
========================================================= */

export default stage3Data;