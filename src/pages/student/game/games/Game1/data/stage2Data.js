/* =========================================================
   GAME 1 — STAGE 2
   PHỤ ÂM → GIỌNG O / GIỌNG Ô
========================================================= */

const consonants = [
  { stt: 1, letter: "ក", roman: "Co", voice: "O" },
  { stt: 2, letter: "ខ", roman: "Kho", voice: "O" },
  { stt: 3, letter: "គ", roman: "Cô", voice: "Ô" },
  { stt: 4, letter: "ឃ", roman: "Khô", voice: "Ô" },
  { stt: 5, letter: "ង", roman: "Ngô", voice: "Ô" },
  { stt: 6, letter: "ច", roman: "Cho", voice: "O" },
  { stt: 7, letter: "ឆ", roman: "Chho", voice: "O" },
  { stt: 8, letter: "ជ", roman: "Chô", voice: "Ô" },
  { stt: 9, letter: "ឈ", roman: "Chhô", voice: "Ô" },
  { stt: 10, letter: "ញ", roman: "Nhô", voice: "Ô" },
  { stt: 11, letter: "ដ", roman: "Đo", voice: "O" },
  { stt: 12, letter: "ឋ", roman: "Tho", voice: "O" },
  { stt: 13, letter: "ឌ", roman: "Đô", voice: "Ô" },
  { stt: 14, letter: "ឍ", roman: "Thô", voice: "Ô" },
  { stt: 15, letter: "ណ", roman: "No", voice: "O" },
  { stt: 16, letter: "ត", roman: "To", voice: "O" },
  { stt: 17, letter: "ថ", roman: "Tho", voice: "O" },
  { stt: 18, letter: "ទ", roman: "Tô", voice: "Ô" },
  { stt: 19, letter: "ធ", roman: "Thô", voice: "Ô" },
  { stt: 20, letter: "ន", roman: "Nô", voice: "Ô" },
  { stt: 21, letter: "ប", roman: "Bo", voice: "O" },
  { stt: 22, letter: "ផ", roman: "Pho", voice: "O" },
  { stt: 23, letter: "ព", roman: "Pô", voice: "Ô" },
  { stt: 24, letter: "ភ", roman: "Phô", voice: "Ô" },
  { stt: 25, letter: "ម", roman: "Mô", voice: "Ô" },
  { stt: 26, letter: "យ", roman: "Dô", voice: "Ô" },
  { stt: 27, letter: "រ", roman: "Rô", voice: "Ô" },
  { stt: 28, letter: "ល", roman: "Lô", voice: "Ô" },
  { stt: 29, letter: "វ", roman: "Vô", voice: "Ô" },
  { stt: 30, letter: "ស", roman: "So", voice: "O" },
  { stt: 31, letter: "ហ", roman: "Ho", voice: "O" },
  { stt: 32, letter: "ឡ", roman: "Lo", voice: "O" },
  { stt: 33, letter: "អ", roman: "O", voice: "O" },
];

/* =========================================================
   DỮ LIỆU STAGE 2
========================================================= */

const stage2Data = consonants.map(
  (item, index) => ({
    id: index + 1,
    letter: item.letter,
    roman: item.roman,
    voice: item.voice,
  })
);

export default stage2Data;