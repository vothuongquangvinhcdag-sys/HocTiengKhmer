/* =========================================================
   ALPHABET - KHMER GOLD & GREEN
========================================================= */

:root {
  --khmer-gold: #d9a441;
  --khmer-gold-dark: #b98216;
  --khmer-gold-light: #fff7df;

  --khmer-green: #2f7d32;
  --khmer-green-dark: #216226;
  --khmer-green-light: #eaf6ea;

  --text-main: #263238;
  --text-soft: #66736a;

  --white: #ffffff;
  --border: #e4e0d4;
  --background: #f7f6f1;

  --shadow-sm: 0 3px 12px rgba(50, 60, 40, 0.08);
  --shadow-md: 0 10px 28px rgba(50, 60, 40, 0.13);
}


/* =========================================================
   PAGE
========================================================= */

.alphabet-page {
  min-height: 100vh;

  background:
    linear-gradient(
      180deg,
      #fffdf7 0%,
      var(--background) 100%
    );

  color: var(--text-main);

  padding: 24px 32px 50px;

  font-family:
    "Segoe UI",
    "Noto Sans",
    Arial,
    sans-serif;
}


/* =========================================================
   TIMER
========================================================= */

.alphabet-timer {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 14px;

  margin-bottom: 16px;

  padding: 10px 16px;

  background: white;

  border: 1px solid var(--border);

  border-radius: 12px;

  box-shadow: var(--shadow-sm);
}

.alphabet-timer-label {
  color: var(--khmer-green);

  font-size: 13px;

  font-weight: 800;
}

.alphabet-timer-value {
  color: var(--text-main);

  font-size: 16px;

  font-weight: 800;

  font-variant-numeric: tabular-nums;
}

.alphabet-timer-exp {
  color: var(--khmer-gold-dark);

  font-size: 12px;

  font-weight: 700;
}


/* =========================================================
   BACK BUTTON
========================================================= */

.alphabet-back-button {
  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 7px;

  border: none;

  border-radius: 10px;

  padding: 10px 17px;

  background: var(--khmer-green);

  color: white;

  font-size: 14px;

  font-weight: 700;

  cursor: pointer;

  box-shadow: var(--shadow-sm);

  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.alphabet-back-button:hover {
  background: var(--khmer-green-dark);

  transform: translateY(-1px);

  box-shadow: var(--shadow-md);
}

.alphabet-back-button:active {
  transform: translateY(0);
}


/* =========================================================
   HEADER
========================================================= */

.alphabet-header {
  margin-top: 20px;

  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 30px;

  padding: 30px 34px;

  background: var(--white);

  border: 1px solid #eadfbf;

  border-top: 5px solid var(--khmer-gold);

  border-radius: 18px;

  box-shadow: var(--shadow-sm);
}

.alphabet-header-main {
  flex: 1;
}

.alphabet-khmer {
  font-family:
    "Noto Sans Khmer",
    "Khmer OS",
    "Leelawadee UI",
    sans-serif;

  font-size: 35px;

  font-weight: 700;

  color: var(--khmer-gold-dark);

  margin-bottom: 5px;
}

.alphabet-header h1 {
  margin: 0;

  font-size: 28px;

  line-height: 1.2;

  font-weight: 800;

  color: var(--khmer-green-dark);
}

.alphabet-header p {
  margin: 8px 0 0;

  color: var(--text-soft);

  font-size: 14px;
}


/* =========================================================
   STATISTICS
========================================================= */

.alphabet-stats {
  display: flex;

  gap: 14px;
}

.alphabet-stat {
  min-width: 110px;

  padding: 16px 20px;

  text-align: center;

  background: var(--khmer-gold-light);

  border: 1px solid #ead49b;

  border-radius: 14px;
}

.alphabet-stat strong {
  display: block;

  font-size: 28px;

  line-height: 1;

  color: var(--khmer-green);

  font-weight: 800;
}

.alphabet-stat span {
  display: block;

  margin-top: 7px;

  color: #705a27;

  font-size: 13px;

  font-weight: 600;
}


/* =========================================================
   TABS
========================================================= */

.alphabet-tabs {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 12px;

  margin-top: 20px;
}

.alphabet-tab {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 12px;

  min-height: 60px;

  border: 1px solid var(--border);

  border-radius: 13px;

  background: var(--white);

  color: var(--text-main);

  font-size: 16px;

  font-weight: 750;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.alphabet-tab span {
  font-size: 12px;

  font-weight: 600;

  color: var(--text-soft);
}

.alphabet-tab:hover {
  border-color: var(--khmer-gold);

  transform: translateY(-2px);

  box-shadow: var(--shadow-sm);
}

.alphabet-tab.active {
  background: var(--khmer-green);

  border-color: var(--khmer-green);

  color: white;

  box-shadow: var(--shadow-md);

  transform: translateY(-1px);
}

.alphabet-tab.active span {
  color: #e7f4e7;
}


/* =========================================================
   TOOLBAR
========================================================= */

.alphabet-toolbar {
  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 20px;

  margin-top: 24px;

  margin-bottom: 18px;

  padding: 20px 22px;

  background: var(--white);

  border: 1px solid var(--border);

  border-left: 5px solid var(--khmer-gold);

  border-radius: 14px;

  box-shadow: var(--shadow-sm);
}

.alphabet-toolbar h2 {
  margin: 0;

  font-size: 19px;

  color: var(--khmer-green-dark);
}

.alphabet-toolbar p {
  margin: 5px 0 0;

  font-size: 13px;

  color: var(--text-soft);
}


/* =========================================================
   VOICE FILTER
========================================================= */

.voice-buttons {
  display: flex;

  align-items: center;

  gap: 8px;

  flex-wrap: wrap;
}

.voice-btn {
  border: 1px solid var(--border);

  border-radius: 9px;

  padding: 8px 13px;

  background: white;

  color: var(--text-main);

  font-size: 13px;

  font-weight: 700;

  cursor: pointer;

  transition: all 0.2s ease;
}

.voice-btn:hover {
  border-color: var(--khmer-gold);

  transform: translateY(-1px);
}

.voice-btn.active {
  background: var(--khmer-gold);

  border-color: var(--khmer-gold-dark);

  color: white;
}


/* =========================================================
   VOICE COLORS
========================================================= */

.voice-o {
  color: var(--khmer-green);
}

.voice-oh {
  color: #9b741c;
}

.voice-btn.voice-o.active {
  background: var(--khmer-green);

  border-color: var(--khmer-green);

  color: white;
}

.voice-btn.voice-oh.active {
  background: var(--khmer-gold-dark);

  border-color: var(--khmer-gold-dark);

  color: white;
}


/* =========================================================
   ALPHABET GRID
========================================================= */

.alphabet-grid {
  display: grid;

  grid-template-columns:
    repeat(5, minmax(0, 1fr));

  gap: 14px;
}


/* =========================================================
   CONSONANT CARD
========================================================= */

.consonant-card {
  position: relative;

  min-height: 205px;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: 18px 14px;

  border: 1px solid var(--border);

  border-radius: 15px;

  background: white;

  cursor: pointer;

  box-shadow: var(--shadow-sm);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.consonant-card:hover {
  transform: translateY(-4px);

  border-color: var(--khmer-gold);

  box-shadow: var(--shadow-md);

  background: #fffdf8;
}

.consonant-card:active {
  transform: translateY(-1px);
}


/* =========================================================
   NUMBER
========================================================= */

.consonant-number {
  position: absolute;

  top: 10px;

  left: 11px;

  min-width: 27px;

  height: 27px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: var(--khmer-gold-light);

  color: var(--khmer-gold-dark);

  font-size: 12px;

  font-weight: 800;
}


/* =========================================================
   KHMER LETTER
========================================================= */

.consonant-letter {
  font-family:
    "Noto Sans Khmer",
    "Khmer OS",
    "Leelawadee UI",
    sans-serif;

  font-size: 64px;

  line-height: 1.1;

  font-weight: 700;

  color: var(--khmer-green-dark);

  margin-bottom: 7px;

  font-variant-ligatures: normal;
}


/* =========================================================
   ROMANIZATION
========================================================= */

.consonant-card-roman {
  font-size: 16px;

  color: var(--text-main);

  font-weight: 750;

  margin-bottom: 10px;
}

.consonant-roman {
  font-size: 16px;

  color: var(--text-main);

  font-weight: 750;

  margin-bottom: 10px;
}


/* =========================================================
   VOICE BADGE
========================================================= */

.voice-badge {
  padding: 5px 12px;

  border-radius: 20px;

  font-size: 12px;

  font-weight: 750;

  background: var(--khmer-green-light);

  color: var(--khmer-green);

  border: 1px solid #c9e4ca;
}

.voice-badge.voice-oh {
  background: var(--khmer-gold-light);

  color: var(--khmer-gold-dark);

  border-color: #ead49b;
}


/* =========================================================
   CARD ACTION
========================================================= */

.consonant-card-action {
  margin-top: 9px;

  font-size: 11px;

  color: var(--text-soft);

  font-weight: 600;
}


/* =========================================================
   NOTES
========================================================= */

.alphabet-notes {
  margin-top: 20px;

  padding: 20px 22px;

  background: white;

  border-left: 5px solid var(--khmer-green);

  border-radius: 13px;

  border-top: 1px solid var(--border);

  border-right: 1px solid var(--border);

  border-bottom: 1px solid var(--border);

  box-shadow: var(--shadow-sm);
}

.alphabet-notes h3 {
  margin: 0 0 12px;

  color: var(--khmer-green-dark);

  font-size: 16px;
}

.alphabet-notes p {
  margin: 7px 0;

  font-size: 13px;

  color: var(--text-soft);

  line-height: 1.55;
}

.alphabet-notes strong {
  color: var(--text-main);
}


/* =========================================================
   VOWELS
========================================================= */

.vowel-grid {
  margin-top: 2px;
}

.vowel-card {
  min-height: 205px;
}


/* =========================================================
   VOWEL SYMBOL
========================================================= */

.vowel-symbol {
  font-size: 52px;

  line-height: 1;

  margin-bottom: 8px;
}


/* =========================================================
   VOWEL PRONUNCIATION
========================================================= */

.vowel-pronunciation {
  display: grid;

  grid-template-columns: 1fr 1fr;

  width: 100%;

  gap: 8px;

  margin-top: 2px;

  min-height: 52px;
}

.vowel-pronunciation > div {
  min-height: 52px;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: 5px 4px;

  box-sizing: border-box;

  border-radius: 9px;

  background: #f8f8f5;

  border: 1px solid #ece9de;

  text-align: center;
}

.vowel-pronunciation span {
  display: block;

  height: 16px;

  line-height: 16px;

  font-size: 11px;

  font-weight: 800;

  color: var(--text-soft);

  margin-bottom: 2px;
}

.vowel-pronunciation strong {
  display: block;

  height: 20px;

  line-height: 20px;

  font-size: 15px;

  color: var(--khmer-green-dark);

  font-weight: 800;
}


/* =========================================================
   VOWEL NOTE
========================================================= */

.vowel-note {
  margin-top: 7px;

  min-height: 15px;

  font-size: 11px;

  line-height: 15px;

  color: var(--text-soft);
}


/* =========================================================
   VOWEL RULE
========================================================= */

.vowel-rule {
  margin-top: 20px;

  padding: 21px 22px;

  background: white;

  border: 1px solid var(--border);

  border-top: 4px solid var(--khmer-gold);

  border-radius: 14px;

  box-shadow: var(--shadow-sm);
}

.vowel-rule h3 {
  margin: 0 0 16px;

  color: var(--khmer-green-dark);

  font-size: 17px;
}

.rule-grid {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 13px;
}

.rule-grid > div {
  padding: 15px;

  border-radius: 11px;

  background: #faf9f4;

  border: 1px solid #ebe7da;
}

.rule-grid strong {
  display: block;

  color: var(--text-main);

  font-size: 13px;

  margin-bottom: 7px;
}

.rule-grid p {
  margin: 0;

  color: var(--text-soft);

  font-size: 12px;

  line-height: 1.55;
}


/* =========================================================
   KHMER FONT CHUNG
========================================================= */

.khmer-normal-text,
.khmer-handwriting-text,
.modal-letter,
.consonant-letter,
.alphabet-khmer,
.khmer-value,
.vowel-main-symbol {
  font-family:
    "Noto Sans Khmer",
    "Khmer OS",
    "Leelawadee UI",
    sans-serif;
}


/* =========================================================
   CHỮ THƯỜNG
   FONT: KHMER OS
========================================================= */

.normal-khmer-value {
  font-family:
    "Khmer OS",
    "Noto Sans Khmer",
    "Leelawadee UI",
    sans-serif;

  font-size: 50px;

  line-height: 1;

  font-weight: 400;

  color: var(--khmer-green-dark);
}


/* =========================================================
   CHỮ HOA
   FONT: KHMER OS MUOL
========================================================= */

.uppercase-khmer-value {
  font-family:
    "Khmer OS Muol",
    "Noto Sans Khmer",
    "Khmer OS",
    sans-serif;

  font-size: 50px;

  line-height: 1;

  font-weight: 400;

  color: var(--khmer-green-dark);
}


/* =========================================================
   CHỮ VIẾT TAY
   FONT: KHMER OS FASTHAND
========================================================= */

.handwriting-khmer-value {
  font-family:
    "Khmer OS Fasthand",
    "Noto Sans Khmer",
    "Khmer OS",
    sans-serif;

  font-size: 50px;

  line-height: 1;

  font-weight: 400;

  color: var(--khmer-green-dark);
}


/* =========================================================
   MODAL BACKDROP
========================================================= */

.alphabet-modal-backdrop {
  position: fixed;

  inset: 0;

  z-index: 9999;

  display: flex;

  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(30, 45, 32, 0.58);

  backdrop-filter: blur(5px);

  animation:
    alphabetModalBackdropIn
    0.18s ease;
}

@keyframes alphabetModalBackdropIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}


/* =========================================================
   MODAL
========================================================= */

.alphabet-modal {
  position: relative;

  width: min(560px, 100%);

  max-height: 92vh;

  overflow-y: auto;

  padding: 30px 26px 25px;

  background: white;

  border-radius: 20px;

  border-top: 5px solid var(--khmer-gold);

  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.22);

  text-align: center;

  animation:
    alphabetModalIn
    0.2s ease;
}

@keyframes alphabetModalIn {
  from {
    opacity: 0;

    transform:
      translateY(12px)
      scale(0.97);
  }

  to {
    opacity: 1;

    transform:
      translateY(0)
      scale(1);
  }
}


/* =========================================================
   CLOSE BUTTON
========================================================= */

.modal-close {
  position: absolute;

  top: 10px;

  right: 11px;

  width: 34px;

  height: 34px;

  display: flex;

  align-items: center;
  justify-content: center;

  border: none;

  border-radius: 50%;

  background: transparent;

  color: #555;

  font-size: 27px;

  line-height: 1;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.modal-close:hover {
  background: #f1efe7;

  color: var(--khmer-green-dark);

  transform: rotate(90deg);
}


/* =========================================================
   MODAL STT
========================================================= */

.modal-detail-stt {
  margin: 0;

  font-size: 16px;

  line-height: 1.2;

  font-weight: 800;

  color: var(--text-main);
}


/* =========================================================
   MODAL PHỤ ÂM HEADER
========================================================= */

.modal-consonant-header {
  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  margin-top: 0;

  margin-bottom: 16px;
}


/* =========================================================
   CHỮ KHMER LỚN
========================================================= */

.modal-consonant-letter {
  margin-top: 5px;

  font-family:
    "Noto Sans Khmer",
    "Khmer OS",
    "Leelawadee UI",
    sans-serif;

  font-size: 78px;

  line-height: 1;

  font-weight: 700;

  color: var(--khmer-green-dark);
}


/* =========================================================
   GIỌNG O / Ô
========================================================= */

.modal-voice {
  display: inline-flex;

  align-items: center;
  justify-content: center;

  margin-top: 4px;

  padding: 4px 12px;

  border-radius: 20px;

  font-size: 13px;

  line-height: 1.2;

  font-weight: 800;
}

.modal-voice.voice-o {
  background: var(--khmer-green-light);

  color: var(--khmer-green);

  border: 1px solid #c9e4ca;
}

.modal-voice.voice-oh {
  background: var(--khmer-gold-light);

  color: var(--khmer-gold-dark);

  border: 1px solid #ead49b;
}


/* =========================================================
   VOWEL HEADER
========================================================= */

.modal-vowel-header {
  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  margin-bottom: 16px;
}

.vowel-main-symbol {
  display: flex;

  align-items: center;
  justify-content: center;

  min-height: 85px;

  width: 100%;

  margin-top: 4px;

  font-family:
    "Noto Sans Khmer",
    "Khmer OS",
    "Leelawadee UI",
    sans-serif;

  color: var(--khmer-green-dark);

  font-size: 78px;

  line-height: 1;

  font-weight: 700;
}


/* =========================================================
   DETAIL GRID
========================================================= */

.alphabet-detail-grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 10px;
}


/* =========================================================
   DETAIL CARD
========================================================= */

.alphabet-detail-card {
  min-height: 125px;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: 12px 10px;

  background:
    linear-gradient(
      180deg,
      #fffdf8 0%,
      #faf9f4 100%
    );

  border: 1px solid #ebe7da;

  border-radius: 12px;

  box-shadow:
    0 2px 7px rgba(50, 60, 40, 0.04);
}


/* =========================================================
   CARD TOP BORDER
========================================================= */

.detail-card-normal {
  border-top: 3px solid var(--khmer-green);
}

.detail-card-uppercase {
  border-top: 3px solid var(--khmer-gold);
}

.detail-card-handwriting {
  border-top: 3px solid var(--khmer-green);
}

.detail-card-pronunciation {
  border-top: 3px solid var(--khmer-gold);
}


/* =========================================================
   DETAIL TITLE
========================================================= */

.alphabet-detail-card-title {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 5px;

  min-height: 24px;

  margin-bottom: 5px;

  color: var(--text-main);

  font-size: 14px;

  line-height: 1.2;

  font-weight: 800;
}

.detail-icon {
  font-size: 17px;

  line-height: 1;
}


/* =========================================================
   DETAIL VALUE
========================================================= */

.alphabet-detail-card-value {
  width: 100%;

  min-height: 58px;

  display: flex;

  align-items: center;
  justify-content: center;

  text-align: center;

  color: var(--khmer-green-dark);

  font-size: 20px;

  line-height: 1.25;

  font-weight: 800;
}


/* =========================================================
   CHỮ THƯỜNG - KÍCH THƯỚC
========================================================= */

.normal-khmer-value {
  font-family:
    "Khmer OS",
    "Noto Sans Khmer",
    "Leelawadee UI",
    sans-serif;

  font-size: 50px;

  line-height: 1;

  font-weight: 400;

  color: var(--khmer-green-dark);
}


/* =========================================================
   CHỮ HOA - KHMER OS MUOL
========================================================= */

.uppercase-khmer-value {
  font-family:
    "Khmer OS Muol",
    "Noto Sans Khmer",
    "Khmer OS",
    sans-serif;

  font-size: 50px;

  line-height: 1;

  font-weight: 400;

  color: var(--khmer-green-dark);
}


/* =========================================================
   VIẾT TAY - KHMER OS FASTHAND
========================================================= */

.handwriting-khmer-value {
  font-family:
    "Khmer OS Fasthand",
    "Noto Sans Khmer",
    "Khmer OS",
    sans-serif;

  font-size: 50px;

  line-height: 1;

  font-weight: 400;

  color: var(--khmer-green-dark);
}


/* =========================================================
   EMPTY
========================================================= */

.empty-value {
  font-family:
    "Segoe UI",
    "Noto Sans",
    Arial,
    sans-serif;

  color: #99978e;

  font-size: 14px;

  font-weight: 700;
}


/* =========================================================
   PHIÊN ÂM
========================================================= */

.pronunciation-value {
  color: var(--text-main);

  font-size: 25px;

  font-weight: 850;
}


/* =========================================================
   PHIÊN ÂM NGUYÊN ÂM
========================================================= */

.vowel-pronunciation-detail {
  min-height: 150px;
}

.vowel-modal-pronunciation {
  width: 100%;

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 10px;
}


/* =========================================================
   MỖI GIỌNG = 1 CỤM RIÊNG
========================================================= */

.vowel-modal-pronunciation-row {
  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  width: 100%;

  gap: 2px;

  min-height: 52px;

  line-height: 1;
}


/* =========================================================
   NHÃN GIỌNG
========================================================= */

.vowel-modal-voice {
  display: block;

  width: auto;

  min-width: 0;

  color: var(--text-soft);

  font-size: 13px;

  line-height: 18px;

  font-weight: 800;

  text-align: center;
}

.vowel-modal-voice.voice-o {
  color: var(--khmer-green);
}

.vowel-modal-voice.voice-oh {
  color: var(--khmer-gold-dark);
}


/* =========================================================
   PHIÊN ÂM CHÍNH
========================================================= */

.vowel-modal-pronunciation-row strong {
  display: block;

  width: auto;

  min-width: 0;

  color: var(--text-main);

  font-size: 25px;

  line-height: 30px;

  font-weight: 850;

  text-align: center;
}


/* =========================================================
   GHI CHÚ
========================================================= */

.modal-note {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 5px;

  margin-top: 12px;

  padding: 4px 8px;

  color: var(--text-soft);

  font-size: 13px;

  line-height: 1.35;

  font-weight: 600;
}

.modal-note strong {
  color: var(--text-main);
}

.modal-note-icon {
  font-size: 15px;
}


/* =========================================================
   AUDIO DIVIDER
========================================================= */

.modal-audio-divider {
  margin-top: 14px;

  padding-top: 3px;

  color: var(--text-main);

  font-size: 13px;

  line-height: 1.3;

  font-weight: 850;

  letter-spacing: 0.2px;

  white-space: nowrap;
}


/* =========================================================
   AUDIO AREA
========================================================= */

.modal-audio-area {
  min-height: 50px;

  display: flex;

  align-items: center;
  justify-content: center;

  margin-top: 7px;

  padding: 8px 12px;

  background:
    linear-gradient(
      180deg,
      #f8fbf7 0%,
      #eef7ed 100%
    );

  border: 1px solid #c9e4ca;

  border-radius: 10px;
}

.modal-audio-area audio {
  width: 100%;

  max-width: 430px;
}


/* =========================================================
   AUDIO EMPTY
========================================================= */

.audio-coming {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 7px;

  color: var(--khmer-green-dark);

  font-size: 14px;

  font-weight: 800;
}

.audio-icon {
  font-size: 19px;
}


/* =========================================================
   FOCUS
========================================================= */

.alphabet-back-button:focus-visible,
.alphabet-tab:focus-visible,
.voice-btn:focus-visible,
.consonant-card:focus-visible,
.modal-close:focus-visible {
  outline: 3px solid rgba(217, 164, 65, 0.45);

  outline-offset: 2px;
}


/* =========================================================
   RESPONSIVE - TABLET
========================================================= */

@media (max-width: 1100px) {

  .alphabet-page {
    padding: 20px 22px 40px;
  }

  .alphabet-grid {
    grid-template-columns:
      repeat(4, minmax(0, 1fr));
  }

  .alphabet-header {
    padding: 25px;
  }

  .consonant-letter {
    font-size: 58px;
  }
}


/* =========================================================
   RESPONSIVE - MOBILE
========================================================= */

@media (max-width: 760px) {

  .alphabet-page {
    padding: 16px 14px 30px;
  }

  .alphabet-timer {
    flex-wrap: wrap;

    gap: 7px 12px;
  }

  .alphabet-header {
    flex-direction: column;

    align-items: stretch;

    padding: 22px 18px;
  }

  .alphabet-header-main {
    text-align: center;
  }

  .alphabet-khmer {
    font-size: 30px;
  }

  .alphabet-header h1 {
    font-size: 22px;
  }

  .alphabet-stats {
    display: grid;

    grid-template-columns: 1fr 1fr;
  }

  .alphabet-stat {
    min-width: 0;
  }

  .alphabet-tabs {
    gap: 8px;
  }

  .alphabet-tab {
    flex-direction: column;

    gap: 3px;

    min-height: 65px;

    font-size: 14px;
  }

  .alphabet-toolbar {
    flex-direction: column;

    align-items: stretch;

    padding: 17px;
  }

  .voice-buttons {
    width: 100%;
  }

  .voice-btn {
    flex: 1;
  }

  .alphabet-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));

    gap: 10px;
  }

  .consonant-card {
    min-height: 185px;

    padding: 15px 10px;
  }

  .consonant-letter {
    font-size: 54px;
  }

  .consonant-roman,
  .consonant-card-roman {
    font-size: 14px;
  }


  /* =====================================================
     NGUYÊN ÂM MOBILE
  ===================================================== */

  .vowel-card {
    min-height: 185px;
  }

  .vowel-symbol {
    font-size: 45px;

    margin-bottom: 7px;
  }

  .vowel-pronunciation {
    min-height: 48px;

    gap: 6px;
  }

  .vowel-pronunciation > div {
    min-height: 48px;

    padding: 4px 3px;
  }

  .vowel-pronunciation span {
    height: 15px;

    line-height: 15px;

    font-size: 10px;
  }

  .vowel-pronunciation strong {
    height: 19px;

    line-height: 19px;

    font-size: 14px;
  }

  .vowel-note {
    margin-top: 6px;

    min-height: 14px;

    line-height: 14px;

    font-size: 10px;
  }

  .rule-grid {
    grid-template-columns: 1fr;
  }


  /* =====================================================
     MODAL MOBILE
  ===================================================== */

  .alphabet-modal {
    width: min(100%, 460px);

    max-height: 92vh;

    padding:
      25px
      12px
      18px;
  }

  .modal-detail-stt {
    font-size: 15px;
  }

  .modal-consonant-header {
    margin-bottom: 13px;
  }

  .modal-consonant-letter {
    font-size: 68px;
  }

  .vowel-main-symbol {
    min-height: 75px;

    font-size: 65px;
  }

  .alphabet-detail-grid {
    gap: 8px;
  }

  .alphabet-detail-card {
    min-height: 112px;

    padding:
      10px
      7px;
  }

  .alphabet-detail-card-title {
    font-size: 13px;
  }

  .detail-icon {
    font-size: 16px;
  }

  .alphabet-detail-card-value {
    min-height: 52px;
  }


  /* =====================================================
     FONT KHMER MOBILE
  ===================================================== */

  .normal-khmer-value,
  .uppercase-khmer-value,
  .handwriting-khmer-value {
    font-size: 43px;
  }

  .empty-value {
    font-size: 12px;
  }

  .pronunciation-value {
    font-size: 21px;
  }


  /* =====================================================
     PHIÊN ÂM NGUYÊN ÂM MOBILE
  ===================================================== */

  .vowel-pronunciation-detail {
    min-height: 145px;
  }

  .vowel-modal-pronunciation {
    gap: 8px;
  }

  .vowel-modal-pronunciation-row {
    flex-direction: column;

    min-height: 50px;

    gap: 2px;
  }

  .vowel-modal-pronunciation-row strong {
    width: auto;

    min-width: 0;

    font-size: 23px;

    line-height: 28px;
  }

  .vowel-modal-voice {
    width: auto;

    min-width: 0;

    font-size: 12px;

    line-height: 17px;
  }

  .modal-note {
    font-size: 12px;
  }

  .modal-audio-divider {
    font-size: 11px;
  }

  .audio-coming {
    font-size: 13px;
  }
}


/* =========================================================
   VERY SMALL SCREEN
========================================================= */

@media (max-width: 420px) {

  .alphabet-page {
    padding-left: 10px;

    padding-right: 10px;
  }

  .alphabet-grid {
    gap: 8px;
  }

  .consonant-card {
    min-height: 175px;
  }

  .consonant-letter {
    font-size: 48px;
  }

  .alphabet-stat strong {
    font-size: 24px;
  }

  .voice-btn {
    padding: 8px 7px;

    font-size: 11px;
  }


  /* =====================================================
     NGUYÊN ÂM MÀN HÌNH RẤT NHỎ
  ===================================================== */

  .vowel-card {
    min-height: 175px;
  }

  .vowel-symbol {
    font-size: 40px;
  }

  .vowel-pronunciation {
    min-height: 44px;

    gap: 5px;
  }

  .vowel-pronunciation > div {
    min-height: 44px;
  }

  .vowel-pronunciation span {
    height: 14px;

    line-height: 14px;

    font-size: 9px;
  }

  .vowel-pronunciation strong {
    height: 18px;

    line-height: 18px;

    font-size: 13px;
  }

  .vowel-note {
    min-height: 13px;

    line-height: 13px;

    font-size: 9px;
  }


  /* =====================================================
     MODAL MÀN HÌNH RẤT NHỎ
  ===================================================== */

  .alphabet-modal {
    padding-left: 9px;

    padding-right: 9px;
  }

  .modal-detail-stt {
    font-size: 14px;
  }

  .modal-consonant-letter {
    font-size: 60px;
  }

  .vowel-main-symbol {
    min-height: 68px;

    font-size: 58px;
  }

  .alphabet-detail-grid {
    gap: 6px;
  }

  .alphabet-detail-card {
    min-height: 102px;

    padding:
      8px
      4px;
  }

  .alphabet-detail-card-title {
    font-size: 11px;

    gap: 3px;
  }

  .detail-icon {
    font-size: 14px;
  }

  .alphabet-detail-card-value {
    min-height: 46px;
  }


  /* =====================================================
     FONT KHMER - VERY SMALL
  ===================================================== */

  .normal-khmer-value,
  .uppercase-khmer-value,
  .handwriting-khmer-value {
    font-size: 38px;
  }

  .empty-value {
    font-size: 10px;
  }

  .pronunciation-value {
    font-size: 19px;
  }


  /* =====================================================
     PHIÊN ÂM NGUYÊN ÂM - VERY SMALL
  ===================================================== */

  .vowel-pronunciation-detail {
    min-height: 135px;
  }

  .vowel-modal-pronunciation {
    gap: 7px;
  }

  .vowel-modal-pronunciation-row {
    flex-direction: column;

    min-height: 46px;

    gap: 1px;
  }

  .vowel-modal-pronunciation-row strong {
    width: auto;

    min-width: 0;

    font-size: 21px;

    line-height: 26px;
  }

  .vowel-modal-voice {
    width: auto;

    min-width: 0;

    font-size: 10px;

    line-height: 16px;
  }

  .modal-note {
    font-size: 11px;
  }

  .modal-audio-divider {
    font-size: 10px;
  }

  .audio-coming {
    font-size: 12px;
  }
}