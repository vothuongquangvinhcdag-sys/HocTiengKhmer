/* =========================================================
   PHỤ ÂM KHMER
========================================================= */

const consonants = [
  { letter: "ក", roman: "Co", voice: "O", audio: "/audio/alphabet/consonants/ក.mp3" },
  { letter: "ខ", roman: "Kho", voice: "O", audio: "/audio/alphabet/consonants/ខ.mp3" },
  { letter: "គ", roman: "Cô", voice: "Ô", audio: "/audio/alphabet/consonants/គ.mp3" },
  { letter: "ឃ", roman: "Khô", voice: "Ô", audio: "/audio/alphabet/consonants/ឃ.mp3" },
  { letter: "ង", roman: "Ngô", voice: "Ô", audio: "/audio/alphabet/consonants/ង.mp3" },
  { letter: "ច", roman: "Cho", voice: "O", audio: "/audio/alphabet/consonants/ច.mp3" },
  { letter: "ឆ", roman: "Chho", voice: "O", audio: "/audio/alphabet/consonants/ឆ.mp3" },
  { letter: "ជ", roman: "Chô", voice: "Ô", audio: "/audio/alphabet/consonants/ជ.mp3" },
  { letter: "ឈ", roman: "Chhô", voice: "Ô", audio: "/audio/alphabet/consonants/ឈ.mp3" },
  { letter: "ញ", roman: "Nhô", voice: "Ô", audio: "/audio/alphabet/consonants/ញ.mp3" },
  { letter: "ដ", roman: "Đo", voice: "O", audio: "/audio/alphabet/consonants/ដ.mp3" },
  { letter: "ឋ", roman: "Tho", voice: "O", audio: "/audio/alphabet/consonants/ឋ.mp3" },
  { letter: "ឌ", roman: "Đô", voice: "Ô", audio: "/audio/alphabet/consonants/ឌ.mp3" },
  { letter: "ឍ", roman: "Thô", voice: "Ô", audio: "/audio/alphabet/consonants/ឍ.mp3" },
  { letter: "ណ", roman: "No", voice: "O", audio: "/audio/alphabet/consonants/ណ.mp3" },
  { letter: "ត", roman: "To", voice: "O", audio: "/audio/alphabet/consonants/ត.mp3" },
  { letter: "ថ", roman: "Tho", voice: "O", audio: "/audio/alphabet/consonants/ថ.mp3" },
  { letter: "ទ", roman: "Tô", voice: "Ô", audio: "/audio/alphabet/consonants/ទ.mp3" },
  { letter: "ធ", roman: "Thô", voice: "Ô", audio: "/audio/alphabet/consonants/ធ.mp3" },
  { letter: "ន", roman: "Nô", voice: "Ô", audio: "/audio/alphabet/consonants/ន.mp3" },
  { letter: "ប", roman: "Bo", voice: "O", audio: "/audio/alphabet/consonants/ប.mp3" },
  { letter: "ផ", roman: "Pho", voice: "O", audio: "/audio/alphabet/consonants/ផ.mp3" },
  { letter: "ព", roman: "Pô", voice: "Ô", audio: "/audio/alphabet/consonants/ព.mp3" },
  { letter: "ភ", roman: "Phô", voice: "Ô", audio: "/audio/alphabet/consonants/ភ.mp3" },
  { letter: "ម", roman: "Mô", voice: "Ô", audio: "/audio/alphabet/consonants/ម.mp3" },
  { letter: "យ", roman: "Dô", voice: "Ô", audio: "/audio/alphabet/consonants/យ.mp3" },
  { letter: "រ", roman: "Rô", voice: "Ô", audio: "/audio/alphabet/consonants/រ.mp3" },
  { letter: "ល", roman: "Lô", voice: "Ô", audio: "/audio/alphabet/consonants/ល.mp3" },
  { letter: "វ", roman: "Vô", voice: "Ô", audio: "/audio/alphabet/consonants/វ.mp3" },
  { letter: "ស", roman: "So", voice: "O", audio: "/audio/alphabet/consonants/ស.mp3" },
  { letter: "ហ", roman: "Ho", voice: "O", audio: "/audio/alphabet/consonants/ហ.mp3" },
  { letter: "ឡ", roman: "Lo", voice: "O", audio: "/audio/alphabet/consonants/ឡ.mp3" },
  { letter: "អ", roman: "O", voice: "O", audio: "/audio/alphabet/consonants/អ.mp3" },
];

/* =========================================================
   NGUYÊN ÂM
========================================================= */

const vowels = [
  { symbol: "ា", romanO: "a", romanOh: "ia" },
  { symbol: "ិ", romanO: "ế", romanOh: "í" },
  { symbol: "ី", romanO: "ây", romanOh: "i" },
  { symbol: "ឹ", romanO: "ấ", romanOh: "ứ" },
  { symbol: "ឺ", romanO: "ơ", romanOh: "ư" },
  { symbol: "ុ", romanO: "ố", romanOh: "ú" },
  { symbol: "ូ", romanO: "ô", romanOh: "u" },
  { symbol: "ួ", romanO: "ua", romanOh: "ua" },
  { symbol: "ើ", romanO: "ờ", romanOh: "ơ" },
  { symbol: "ឿ", romanO: "ưa", romanOh: "ưa" },
  { symbol: "ៀ", romanO: "ia", romanOh: "ia" },
  { symbol: "េ", romanO: "ê", romanOh: "ê" },
  { symbol: "ែ", romanO: "ae", romanOh: "e" },
  { symbol: "ៃ", romanO: "ay", romanOh: "ây" },
  { symbol: "ោ", romanO: "ao", romanOh: "ô" },
  { symbol: "ៅ", romanO: "au", romanOh: "âu" },
  { symbol: "ុំ", romanO: "ôm", romanOh: "um" },
  { symbol: "ំ", romanO: "om", romanOh: "ôm" },
  { symbol: "ាំ", romanO: "ăm", romanOh: "oăm" },
  { symbol: "ះ", romanO: "ắs", romanOh: "ías" },
  { symbol: "ិះ", romanO: "ếs", romanOh: "ís" },
  { symbol: "េះ", romanO: "és", romanOh: "ếs" },
  { symbol: "ុះ", romanO: "ốs", romanOh: "ús" },
  { symbol: "ោះ", romanO: "ós", romanOh: "úas" },
];

/* =========================================================
   CHUYỂN PHỤ ÂM → CÂU HỎI
========================================================= */

const consonantQuestions = consonants.map(
  (item, index) => ({
    id: `c-${index + 1}`,
    type: "consonant",
    symbol: item.letter,
    answer: item.letter,
    roman: item.roman,
    voice: item.voice,
    audio: item.audio,
  })
);

/* =========================================================
   CHUYỂN NGUYÊN ÂM → CÂU HỎI
========================================================= */

const vowelQuestions =
  vowels.flatMap(
    (item, index) => [
      {
        id: `v-${index + 1}-o`,
        type: "vowel",
        symbol: item.symbol,
        answer: item.symbol,
        roman: item.romanO,
        voice: "O",
        audio: `/audio/alphabet/vowels/${item.symbol}-o.mp3`,
      },

      {
        id: `v-${index + 1}-oh`,
        type: "vowel",
        symbol: item.symbol,
        answer: item.symbol,
        roman: item.romanOh,
        voice: "Ô",
        audio: `/audio/alphabet/vowels/${item.symbol}-oh.mp3`,
      },
    ]
  );

/* =========================================================
   TẤT CẢ CÂU HỎI
========================================================= */

const allQuestions = [
  ...consonantQuestions,
  ...vowelQuestions,
];

/* =========================================================
   SHUFFLE
========================================================= */

const shuffle = (array) =>
  [...array].sort(
    () => Math.random() - 0.5
  );

/* =========================================================
   TẠO 4 ĐÁP ÁN
   1 ĐÚNG + 3 KÝ TỰ KHÁC
========================================================= */

const createOptions = (question) => {

  /*
   * Lấy các ký tự khác ký tự đúng.
   *
   * Không dùng:
   * item.answer !== question.answer
   *
   * đơn thuần cho toàn bộ dữ liệu,
   * vì vowel O và Ô có cùng answer.
   *
   * Ta lọc theo symbol để đảm bảo
   * 4 nút luôn là 4 ký tự khác nhau.
   */

  const candidates =
    allQuestions.filter(
      (item) =>
        item.symbol !==
        question.symbol
    );

  const uniqueSymbols = [
    ...new Set(
      candidates.map(
        (item) =>
          item.symbol
      )
    ),
  ];

  const wrongAnswers =
    shuffle(uniqueSymbols)
      .slice(0, 3);

  return shuffle([
    question.answer,
    ...wrongAnswers,
  ]);
};

/* =========================================================
   DATA CUỐI CÙNG
========================================================= */

const stage4Data =
  allQuestions.map(
    (question) => ({
      ...question,
      options:
        createOptions(question),
    })
  );

export default stage4Data;