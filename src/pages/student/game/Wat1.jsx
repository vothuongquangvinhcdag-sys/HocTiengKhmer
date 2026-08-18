import { useEffect, useMemo, useState } from "react";
import "./Wat1.css";

/* =========================================================
   WAT 1 — ĐẢO BẢNG CHỮ CÁI

   LUỒNG GAME

   THỬ THÁCH I
   - 33 phụ âm
   - Nhìn chữ → chọn phiên âm
   - KHÔNG hiển thị Giọng O / Giọng Ô

   THỬ THÁCH II
   - 24 nguyên âm
   - Nhìn chữ → chọn phiên âm
   - CÓ hiển thị Giọng O / Giọng Ô

   THỬ THÁCH III
   - Trộn 33 phụ âm + 24 nguyên âm
   - Nghe âm thanh → chọn đúng chữ

   BOSS
   - CHỈ 33 phụ âm
   - Kéo chữ → Thuyền Giọng O / Giọng Ô
   - Hoàn thành đủ 33 phụ âm
========================================================= */


/* =========================================================
   33 PHỤ ÂM KHMER
========================================================= */

const CONSONANTS = [
  { id: 1, letter: "ក", roman: "Co", voice: "O" },
  { id: 2, letter: "ខ", roman: "Kho", voice: "O" },
  { id: 3, letter: "គ", roman: "Cô", voice: "Ô" },
  { id: 4, letter: "ឃ", roman: "Khô", voice: "Ô" },
  { id: 5, letter: "ង", roman: "Ngô", voice: "Ô" },

  { id: 6, letter: "ច", roman: "Cho", voice: "O" },
  { id: 7, letter: "ឆ", roman: "Chho", voice: "O" },
  { id: 8, letter: "ជ", roman: "Chô", voice: "Ô" },
  { id: 9, letter: "ឈ", roman: "Chhô", voice: "Ô" },
  { id: 10, letter: "ញ", roman: "Nhô", voice: "Ô" },

  { id: 11, letter: "ដ", roman: "Đo", voice: "O" },
  { id: 12, letter: "ឋ", roman: "Tho", voice: "O" },
  { id: 13, letter: "ឌ", roman: "Đô", voice: "Ô" },
  { id: 14, letter: "ឍ", roman: "Thô", voice: "Ô" },
  { id: 15, letter: "ណ", roman: "No", voice: "Ô" },

  { id: 16, letter: "ត", roman: "To", voice: "O" },
  { id: 17, letter: "ថ", roman: "Tho", voice: "O" },
  { id: 18, letter: "ទ", roman: "Tô", voice: "Ô" },
  { id: 19, letter: "ធ", roman: "Thô", voice: "Ô" },
  { id: 20, letter: "ន", roman: "Nô", voice: "Ô" },

  { id: 21, letter: "ប", roman: "Bo", voice: "O" },
  { id: 22, letter: "ផ", roman: "Pho", voice: "O" },
  { id: 23, letter: "ព", roman: "Po", voice: "Ô" },
  { id: 24, letter: "ភ", roman: "Pho", voice: "Ô" },
  { id: 25, letter: "ម", roman: "Mô", voice: "Ô" },

  { id: 26, letter: "យ", roman: "Dô", voice: "Ô" },
  { id: 27, letter: "រ", roman: "Rô", voice: "Ô" },
  { id: 28, letter: "ល", roman: "Lô", voice: "Ô" },
  { id: 29, letter: "វ", roman: "Vô", voice: "Ô" },

  { id: 30, letter: "ស", roman: "So", voice: "O" },
  { id: 31, letter: "ហ", roman: "Ho", voice: "O" },
  { id: 32, letter: "ឡ", roman: "Lo", voice: "O" },
  { id: 33, letter: "អ", roman: "O", voice: "O" },
];


/* =========================================================
   24 NGUYÊN ÂM

   Nếu alphabetdata.js của bạn đã có VOWELS thì có thể
   thay mảng này bằng dữ liệu VOWELS hiện tại của bạn.

   Cấu trúc cần có:
   {
     id,
     letter,
     roman,
     voice
   }
========================================================= */

const VOWELS = [
  /*
    GIỮ NGUYÊN VOWELS CỦA BẠN Ở ĐÂY.

    Ví dụ:

    {
      id: 1,
      letter: "ា",
      roman: "A",
      voice: "O"
    },

    ...
  */
];


/* =========================================================
   TẤT CẢ KÝ TỰ CHO THỬ THÁCH III

   Stage III:
   33 phụ âm + 24 nguyên âm
========================================================= */

const ALL_LETTERS = [
  ...CONSONANTS,
  ...VOWELS,
];


/* =========================================================
   TIỆN ÍCH
========================================================= */

function shuffle(array) {
  return [...array].sort(
    () => Math.random() - 0.5
  );
}


function getRandomItems(array, count) {
  return shuffle(array).slice(0, count);
}


/* =========================================================
   PHÁT ÂM
========================================================= */

function speakKhmer(text) {
  if (
    typeof window === "undefined" ||
    !("speechSynthesis" in window)
  ) {
    return;
  }

  if (!text) return;

  window.speechSynthesis.cancel();

  const utterance =
    new SpeechSynthesisUtterance(text);

  utterance.lang = "km-KH";
  utterance.rate = 0.72;
  utterance.pitch = 1;

  window.speechSynthesis.speak(
    utterance
  );
}


/* =========================================================
   COMPONENT
========================================================= */

function Wat1({
  profile,
  session,
  navigate,
  onProgressUpdated,
}) {

  /* =======================================================
     STATE
  ======================================================= */

  const [screen, setScreen] =
    useState("intro");

  const [round, setRound] =
    useState(1);

  const [score, setScore] =
    useState(0);

  const [combo, setCombo] =
    useState(0);

  const [bestCombo, setBestCombo] =
    useState(0);

  const [lives, setLives] =
    useState(3);

  const [question, setQuestion] =
    useState(null);

  const [options, setOptions] =
    useState([]);

  const [selected, setSelected] =
    useState(null);

  const [feedback, setFeedback] =
    useState(null);

  /*
    BOSS CHỈ CHỨA 33 PHỤ ÂM
  */

  const [voiceBoat, setVoiceBoat] =
    useState({
      O: [],
      Ô: [],
    });

  const [draggedItem, setDraggedItem] =
    useState(null);

  const [completed, setCompleted] =
    useState(false);


  /* =======================================================
     THỐNG KÊ TIẾN ĐỘ
  ======================================================= */

  const progressPercent =
    useMemo(() => {

      if (screen === "stage1") {
        return Math.min(
          ((round - 1) / 10) * 100,
          100
        );
      }

      if (screen === "stage2") {
        return Math.min(
          ((round - 1) / 10) * 100,
          100
        );
      }

      if (screen === "stage3") {
        return Math.min(
          ((round - 1) / 10) * 100,
          100
        );
      }

      /*
        BOSS = 33 PHỤ ÂM
      */

      if (screen === "boss") {

        const totalPlaced =
          voiceBoat.O.length +
          voiceBoat.Ô.length;

        return Math.min(
          (totalPlaced /
            CONSONANTS.length) *
            100,
          100
        );
      }

      return 0;

    }, [
      screen,
      round,
      voiceBoat,
    ]);


  /* =======================================================
     THỬ THÁCH I
     PHỤ ÂM → PHIÊN ÂM
========================================================= */

  function createStage1Question() {

    const correct =
      CONSONANTS[
        Math.floor(
          Math.random() *
            CONSONANTS.length
        )
      ];

    const wrong =
      getRandomItems(
        CONSONANTS.filter(
          (item) =>
            item.id !== correct.id
        ),
        3
      );

    setQuestion(correct);

    setOptions(
      shuffle([
        correct,
        ...wrong,
      ])
    );

    setSelected(null);
    setFeedback(null);
  }


  /* =======================================================
     THỬ THÁCH II
     NGUYÊN ÂM → PHIÊN ÂM
========================================================= */

  function createStage2Question() {

    /*
      Nếu VOWELS chưa có dữ liệu,
      không tạo câu lỗi.
    */

    if (!VOWELS.length) {
      console.warn(
        "WAT1: VOWELS đang rỗng."
      );

      return;
    }

    const correct =
      VOWELS[
        Math.floor(
          Math.random() *
            VOWELS.length
        )
      ];

    const wrong =
      getRandomItems(
        VOWELS.filter(
          (item) =>
            item.id !== correct.id
        ),
        3
      );

    setQuestion(correct);

    setOptions(
      shuffle([
        correct,
        ...wrong,
      ])
    );

    setSelected(null);
    setFeedback(null);
  }


  /* =======================================================
     THỬ THÁCH III
     NGHE → CHỌN CHỮ

     TRỘN:
     - 33 phụ âm
     - 24 nguyên âm
========================================================= */

  function createStage3Question() {

    if (!ALL_LETTERS.length) {
      return;
    }

    const correct =
      ALL_LETTERS[
        Math.floor(
          Math.random() *
            ALL_LETTERS.length
        )
      ];

    const wrong =
      getRandomItems(
        ALL_LETTERS.filter(
          (item) =>
            item.id !== correct.id
        ),
        3
      );

    setQuestion(correct);

    setOptions(
      shuffle([
        correct,
        ...wrong,
      ])
    );

    setSelected(null);
    setFeedback(null);

    setTimeout(() => {
      speakKhmer(
        correct.roman
      );
    }, 300);
  }


  /* =======================================================
     BẮT ĐẦU GAME
========================================================= */

  function startGame() {

    setScore(0);

    setCombo(0);

    setBestCombo(0);

    setLives(3);

    setRound(1);

    setCompleted(false);

    setVoiceBoat({
      O: [],
      Ô: [],
    });

    setDraggedItem(null);

    setQuestion(null);

    setOptions([]);

    setSelected(null);

    setFeedback(null);

    setScreen("stage1");

    setTimeout(() => {
      createStage1Question();
    }, 100);
  }


  /* =======================================================
     KIỂM TRA ĐÁP ÁN
========================================================= */

  function handleAnswer(answer) {

    if (
      selected ||
      !question
    ) {
      return;
    }

    setSelected(answer);

    const isCorrect =
      answer.id === question.id;


    /* =====================================================
       ĐÚNG
    ===================================================== */

    if (isCorrect) {

      const nextCombo =
        combo + 1;

      setCombo(nextCombo);

      setBestCombo(
        (current) =>
          Math.max(
            current,
            nextCombo
          )
      );

      const gained =
        10 +
        Math.min(
          nextCombo * 2,
          20
        );

      setScore(
        (current) =>
          current + gained
      );

      setFeedback({
        type: "correct",
        text: "Chính xác!",
        subtext:
          `+${gained} điểm`,
      });

    }


    /* =====================================================
       SAI
    ===================================================== */

    else {

      setCombo(0);

      setLives(
        (current) =>
          Math.max(
            current - 1,
            0
          )
      );

      setFeedback({
        type: "wrong",
        text:
          "Chưa chính xác!",
        subtext:
          `Đáp án đúng: ${question.letter} — ${question.roman}`,
      });
    }


    /* =====================================================
       CHUYỂN CÂU
    ===================================================== */

    setTimeout(() => {

      /*
        Dùng lives hiện tại.
        Vì setLives là async nên
        lives <= 1 nghĩa là người chơi
        vừa mất mạng cuối cùng.
      */

      if (
        !isCorrect &&
        lives <= 1
      ) {

        setScreen("failed");

        return;
      }


      /* ===================================================
         STAGE 1 → STAGE 2
      =================================================== */

      if (screen === "stage1") {

        if (round >= 10) {

          setRound(1);

          setScreen("stage2");

          setTimeout(() => {
            createStage2Question();
          }, 100);

          return;
        }

        setRound(
          (current) =>
            current + 1
        );

        setTimeout(() => {
          createStage1Question();
        }, 100);

        return;
      }


      /* ===================================================
         STAGE 2 → STAGE 3
      =================================================== */

      if (screen === "stage2") {

        if (round >= 10) {

          setRound(1);

          setScreen("stage3");

          setTimeout(() => {
            createStage3Question();
          }, 100);

          return;
        }

        setRound(
          (current) =>
            current + 1
        );

        setTimeout(() => {
          createStage2Question();
        }, 100);

        return;
      }


      /* ===================================================
         STAGE 3 → BOSS

         BOSS CHỈ PHỤ ÂM
      =================================================== */

      if (screen === "stage3") {

        if (round >= 10) {

          setVoiceBoat({
            O: [],
            Ô: [],
          });

          setDraggedItem(null);

          setScreen("boss");

          return;
        }

        setRound(
          (current) =>
            current + 1
        );

        setTimeout(() => {
          createStage3Question();
        }, 100);

        return;
      }

    }, 1000);
  }


  /* =======================================================
     BOSS — DRAG START
========================================================= */

  function handleDragStart(item) {

    setDraggedItem(item);
  }


  /* =======================================================
     BOSS — DRAG END
========================================================= */

  function handleDragEnd() {

    setDraggedItem(null);
  }


  /* =======================================================
     BOSS — DROP VÀO THUYỀN
     
     CHỈ NHẬN 33 PHỤ ÂM
========================================================= */

  function handleDropToBoat(
    boat
  ) {

    if (!draggedItem) {
      return;
    }

    const item =
      draggedItem;

    setDraggedItem(null);


    const isCorrect =
      item.voice === boat;


    /* =====================================================
       ĐÚNG THUYỀN
    ===================================================== */

    if (isCorrect) {

      const nextCombo =
        combo + 1;

      setCombo(nextCombo);

      setBestCombo(
        (current) =>
          Math.max(
            current,
            nextCombo
          )
      );

      const gained =
        15 +
        Math.min(
          nextCombo * 2,
          20
        );

      setScore(
        (current) =>
          current + gained
      );

      setVoiceBoat(
        (current) => ({
          ...current,

          [boat]: [
            ...current[boat],
            item,
          ],
        })
      );

      setFeedback({
        type: "correct",
        text:
          "Đúng thuyền!",
        subtext:
          `+${gained} điểm`,
      });


      /*
        ĐỦ 33 PHỤ ÂM
      */

      const totalPlaced =
        voiceBoat.O.length +
        voiceBoat.Ô.length +
        1;

      if (
        totalPlaced >=
        CONSONANTS.length
      ) {

        setTimeout(() => {

          setFeedback(null);

          completeWat();

        }, 1000);

        return;
      }

    }


    /* =====================================================
       SAI THUYỀN
    ===================================================== */

    else {

      setCombo(0);

      setLives(
        (current) =>
          Math.max(
            current - 1,
            0
          )
      );

      setFeedback({
        type: "wrong",
        text:
          "Sai thuyền!",
        subtext:
          `${item.letter} thuộc Giọng ${item.voice}`,
      });


      /*
        Hết mạng
      */

      if (lives <= 1) {

        setTimeout(() => {

          setFeedback(null);

          setScreen("failed");

        }, 900);

        return;
      }
    }


    setTimeout(() => {

      setFeedback(null);

    }, 900);
  }


  /* =======================================================
     HOÀN THÀNH WAT 1
========================================================= */

  function completeWat() {

    setCompleted(true);

    setScreen("complete");

    const payload = {
      wat: 1,
      completed: true,
      score,
      bestCombo,
      completedAt:
        new Date().toISOString(),
    };

    try {

      localStorage.setItem(
        "khmer_wat1_completed",
        JSON.stringify(payload)
      );

    } catch {
      // Không làm gián đoạn game
    }


    if (
      typeof onProgressUpdated ===
      "function"
    ) {

      onProgressUpdated();
    }
  }


  /* =======================================================
     QUAY LẠI GAME MAP
========================================================= */

  function backToMap() {

    window.speechSynthesis?.cancel();

    if (
      typeof navigate ===
      "function"
    ) {

      navigate("/game");

      return;
    }

    window.history.back();
  }


  /* =======================================================
     HỦY ÂM THANH
========================================================= */

  useEffect(() => {

    return () => {

      window.speechSynthesis?.cancel();

    };

  }, []);


  /* =======================================================
     INTRO
========================================================= */

  if (screen === "intro") {

    return (
      <div className="wat1-page">

        <div className="wat1-bg-symbol symbol-one">
          ក
        </div>

        <div className="wat1-bg-symbol symbol-two">
          ខ
        </div>

        <div className="wat1-bg-symbol symbol-three">
          គ
        </div>


        <div className="wat1-container">

          <button
            className="wat1-back-button"
            onClick={backToMap}
          >
            ← Bản đồ 10 ngôi đền
          </button>


          <div className="wat1-intro-card">

            <div className="wat1-temple-emblem">
              <span>ក</span>
            </div>


            <div className="wat1-eyebrow">
              NGÔI ĐỀN THỨ NHẤT
            </div>


            <h1>
              WAT ÁK-SÂ
            </h1>


            <div className="wat1-khmer-title">
              វត្តអក្សរ
            </div>


            <h2>
              ĐẢO BẢNG CHỮ CÁI
            </h2>


            <p className="wat1-intro-description">
              Bước qua cánh cổng đầu tiên
              của hành trình Khmer. Hãy ghi
              nhớ phụ âm, nguyên âm, âm đọc
              và phân biệt hai dòng Giọng O
              và Giọng Ô.
            </p>


            <div className="wat1-objectives">

              <div className="wat1-objective">

                <span>១</span>

                <div>

                  <strong>
                    Phụ âm & Phiên âm
                  </strong>

                  <small>
                    Nhìn phụ âm Khmer và chọn
                    đúng phiên âm.
                  </small>

                </div>

              </div>


              <div className="wat1-objective">

                <span>២</span>

                <div>

                  <strong>
                    Nguyên âm & Giọng
                  </strong>

                  <small>
                    Nhận diện nguyên âm và
                    phân biệt Giọng O / Ô.
                  </small>

                </div>

              </div>


              <div className="wat1-objective">

                <span>៣</span>

                <div>

                  <strong>
                    Nghe & Nhận diện
                  </strong>

                  <small>
                    Nghe âm thanh và chọn
                    đúng ký tự Khmer.
                  </small>

                </div>

              </div>


              <div className="wat1-objective">

                <span>♛</span>

                <div>

                  <strong>
                    BOSS — Phân loại phụ âm
                  </strong>

                  <small>
                    Kéo 33 phụ âm vào đúng
                    thuyền Giọng O / Ô.
                  </small>

                </div>

              </div>

            </div>


            <div className="wat1-intro-stats">

              <div>
                <strong>33</strong>
                <span>PHỤ ÂM</span>
              </div>

              <div>
                <strong>24</strong>
                <span>NGUYÊN ÂM</span>
              </div>

              <div>
                <strong>1</strong>
                <span>BOSS</span>
              </div>

            </div>


            <button
              className="wat1-primary-button"
              onClick={startGame}
            >
              <span>⚔</span>
              BẮT ĐẦU CHINH PHỤC
            </button>

          </div>

        </div>

      </div>
    );
  }


  /* =======================================================
     HEADER
========================================================= */

  const renderHeader = () => (

    <header className="wat1-game-header">

      <button
        className="wat1-header-back"
        onClick={backToMap}
      >
        ←
      </button>


      <div className="wat1-header-title">

        <span>
          WAT ÁK-SÂ
        </span>

        <small>
          ĐẢO BẢNG CHỮ CÁI
        </small>

      </div>


      <div className="wat1-header-stats">

        <div className="wat1-header-stat">

          <span>⭐</span>

          <strong>
            {score}
          </strong>

        </div>


        <div className="wat1-header-stat">

          <span>🔥</span>

          <strong>
            {combo}
          </strong>

        </div>


        <div className="wat1-lives">

          {[1, 2, 3].map(
            (life) => (

              <span
                key={life}
                className={
                  life <= lives
                    ? "life-active"
                    : "life-lost"
                }
              >
                ♥
              </span>

            )
          )}

        </div>

      </div>

    </header>
  );


  /* =======================================================
     PROGRESS
========================================================= */

  const renderProgress = () => (

    <div className="wat1-progress-area">

      <div className="wat1-progress-info">

        <span>

          {screen === "stage1" &&
            "THỬ THÁCH I — PHỤ ÂM & PHIÊN ÂM"}

          {screen === "stage2" &&
            "THỬ THÁCH II — NGUYÊN ÂM & GIỌNG"}

          {screen === "stage3" &&
            "THỬ THÁCH III — NGHE & CHỌN CHỮ"}

          {screen === "boss" &&
            "BOSS — PHÂN LOẠI 33 PHỤ ÂM"}

        </span>


        <strong>
          {Math.round(
            progressPercent
          )}
          %
        </strong>

      </div>


      <div className="wat1-progress-track">

        <div
          className="wat1-progress-fill"
          style={{
            width:
              `${progressPercent}%`,
          }}
        />

      </div>

    </div>
  );


  /* =======================================================
     THỬ THÁCH I
     PHỤ ÂM → PHIÊN ÂM
========================================================= */

  if (screen === "stage1") {

    return (

      <div className="wat1-page wat1-game-page">

        {renderHeader()}


        <main className="wat1-game-main">

          {renderProgress()}


          <div className="wat1-stage-label">

            <span>
              THỬ THÁCH I
            </span>

            <strong>
              CÂU {round} / 10
            </strong>

          </div>


          <section className="wat1-question-card">

            <div className="wat1-letter-display">
              {question?.letter}
            </div>


            <div className="wat1-question-khmer">
              អក្សរ
            </div>


            <h1>
              Ký tự này có phiên âm gì?
            </h1>


            <p>
              Hãy nhìn kỹ phụ âm Khmer
              và chọn phiên âm chính xác.
            </p>


            <div className="wat1-answer-grid">

              {options.map(
                (item) => {

                  let className =
                    "wat1-answer roman-answer";


                  if (
                    selected &&
                    item.id ===
                      selected.id
                  ) {

                    className +=
                      item.id ===
                      question.id
                        ? " answer-correct"
                        : " answer-wrong";
                  }


                  if (
                    selected &&
                    item.id ===
                      question.id
                  ) {

                    className +=
                      " answer-reveal";
                  }


                  return (

                    <button
                      key={item.id}
                      className={
                        className
                      }
                      onClick={() =>
                        handleAnswer(
                          item
                        )
                      }
                      disabled={
                        !!selected
                      }
                    >

                      <span className="answer-roman">
                        {item.roman}
                      </span>

                    </button>

                  );
                }
              )}

            </div>

          </section>


          {feedback && (

            <div
              className={`wat1-feedback ${feedback.type}`}
            >

              <strong>
                {feedback.text}
              </strong>

              <span>
                {feedback.subtext}
              </span>

            </div>

          )}

        </main>

      </div>
    );
  }


  /* =======================================================
     THỬ THÁCH II
     NGUYÊN ÂM → PHIÊN ÂM + GIỌNG
========================================================= */

  if (screen === "stage2") {

    return (

      <div className="wat1-page wat1-game-page">

        {renderHeader()}


        <main className="wat1-game-main">

          {renderProgress()}


          <div className="wat1-stage-label">

            <span>
              THỬ THÁCH II
            </span>

            <strong>
              CÂU {round} / 10
            </strong>

          </div>


          <section className="wat1-question-card">

            <div className="wat1-letter-display">
              {question?.letter}
            </div>


            <div className="wat1-question-khmer">
              ស្រៈ
            </div>


            <h1>
              Nguyên âm này đọc thế nào?
            </h1>


            <p>
              Chọn phiên âm chính xác và
              chú ý Giọng O hoặc Giọng Ô.
            </p>


            <div className="wat1-answer-grid">

              {options.map(
                (item) => {

                  let className =
                    "wat1-answer roman-answer";


                  if (
                    selected &&
                    item.id ===
                      selected.id
                  ) {

                    className +=
                      item.id ===
                      question.id
                        ? " answer-correct"
                        : " answer-wrong";
                  }


                  if (
                    selected &&
                    item.id ===
                      question.id
                  ) {

                    className +=
                      " answer-reveal";
                  }


                  return (

                    <button
                      key={item.id}
                      className={
                        className
                      }
                      onClick={() =>
                        handleAnswer(
                          item
                        )
                      }
                      disabled={
                        !!selected
                      }
                    >

                      <span className="answer-roman">
                        {item.roman}
                      </span>


                      <small>
                        Giọng {item.voice}
                      </small>

                    </button>

                  );
                }
              )}

            </div>

          </section>


          {feedback && (

            <div
              className={`wat1-feedback ${feedback.type}`}
            >

              <strong>
                {feedback.text}
              </strong>

              <span>
                {feedback.subtext}
              </span>

            </div>

          )}

        </main>

      </div>
    );
  }


  /* =======================================================
     THỬ THÁCH III
     NGHE → CHỌN CHỮ
     TRỘN PHỤ ÂM + NGUYÊN ÂM
========================================================= */

  if (screen === "stage3") {

    return (

      <div className="wat1-page wat1-game-page">

        {renderHeader()}


        <main className="wat1-game-main">

          {renderProgress()}


          <div className="wat1-stage-label">

            <span>
              THỬ THÁCH III
            </span>

            <strong>
              CÂU {round} / 10
            </strong>

          </div>


          <section className="wat1-question-card">

            <div className="wat1-question-icon">
              🔊
            </div>


            <div className="wat1-question-khmer">
              ស្តាប់
            </div>


            <h1>
              Nghe âm thanh
            </h1>


            <p>
              Nghe thật kỹ và chọn đúng
              ký tự Khmer. Phụ âm và
              nguyên âm được trộn lẫn.
            </p>


            <button
              className="wat1-listen-button"
              onClick={() =>
                question &&
                speakKhmer(
                  question.roman
                )
              }
            >

              <span>🔊</span>

              NGHE LẠI

            </button>


            <div className="wat1-answer-grid">

              {options.map(
                (item) => {

                  let className =
                    "wat1-answer";


                  if (
                    selected &&
                    item.id ===
                      selected.id
                  ) {

                    className +=
                      item.id ===
                      question.id
                        ? " answer-correct"
                        : " answer-wrong";
                  }


                  if (
                    selected &&
                    item.id ===
                      question.id
                  ) {

                    className +=
                      " answer-reveal";
                  }


                  return (

                    <button
                      key={item.id}
                      className={
                        className
                      }
                      onClick={() =>
                        handleAnswer(
                          item
                        )
                      }
                      disabled={
                        !!selected
                      }
                    >

                      <span className="answer-letter">
                        {item.letter}
                      </span>

                    </button>

                  );
                }
              )}

            </div>

          </section>


          {feedback && (

            <div
              className={`wat1-feedback ${feedback.type}`}
            >

              <strong>
                {feedback.text}
              </strong>

              <span>
                {feedback.subtext}
              </span>

            </div>

          )}

        </main>

      </div>
    );
  }


  /* =======================================================
     BOSS
     
     CHỈ 33 PHỤ ÂM
     
     KÉO → THUYỀN O / Ô
========================================================= */

  if (screen === "boss") {

    const bossRemaining =
      CONSONANTS.filter(
        (item) =>
          !voiceBoat.O.some(
            (placed) =>
              placed.id ===
              item.id
          ) &&
          !voiceBoat.Ô.some(
            (placed) =>
              placed.id ===
              item.id
          )
      );


    const totalPlaced =
      voiceBoat.O.length +
      voiceBoat.Ô.length;


    const bossCompleted =
      totalPlaced >=
      CONSONANTS.length;


    return (

      <div className="wat1-page wat1-game-page wat1-boss-page">

        <div className="wat1-boss-glow" />


        {renderHeader()}


        <main className="wat1-game-main wat1-boss-main">

          {renderProgress()}


          <div className="wat1-boss-title">

            <div className="boss-crown">
              ♛
            </div>


            <span>
              THỬ THÁCH CUỐI
            </span>


            <h1>
              CỔNG ĐỀN ÁK-SÂ
            </h1>


            <p>
              Kéo 33 phụ âm Khmer vào
              đúng chiếc thuyền Giọng O
              hoặc Giọng Ô.
            </p>

          </div>


          <section className="wat1-boss-card">

            <div className="wat1-boss-round">

              PHỤ ÂM ĐÃ PHÂN LOẠI{" "}

              <strong>
                {totalPlaced}
              </strong>

              {" / 33"}

            </div>


            {!bossCompleted && (

              <div className="wat1-boss-letters">

                {bossRemaining.map(
                  (item) => (

                    <button
                      key={item.id}
                      className={`wat1-drag-letter ${
                        draggedItem?.id ===
                        item.id
                          ? "dragging"
                          : ""
                      }`}
                      draggable
                      onDragStart={() =>
                        handleDragStart(
                          item
                        )
                      }
                      onDragEnd={
                        handleDragEnd
                      }
                    >

                      <span>
                        {item.letter}
                      </span>

                    </button>

                  )
                )}

              </div>

            )}


            {bossCompleted ? (

              <div className="wat1-boss-success">

                <div className="boss-success-icon">
                  ✓
                </div>

                <h2>
                  ĐÃ PHÂN LOẠI ĐỦ 33 PHỤ ÂM!
                </h2>

                <p>
                  Bạn đã làm chủ Giọng O
                  và Giọng Ô của bảng chữ
                  cái Khmer.
                </p>


                <button
                  className="wat1-primary-button"
                  onClick={
                    completeWat
                  }
                >
                  ⚔ MỞ CỔNG ĐỀN
                </button>

              </div>

            ) : (

              <div className="wat1-boss-boats">


                {/* =====================================
                    THUYỀN GIỌNG O
                ===================================== */}

                <div
                  className={`wat1-boss-boat wat1-boss-boat-o ${
                    draggedItem
                      ? "drop-ready"
                      : ""
                  }`}
                  onDragOver={(event) =>
                    event.preventDefault()
                  }
                  onDrop={() =>
                    handleDropToBoat(
                      "O"
                    )
                  }
                >

                  <div className="boss-boat-icon">
                    🛶
                  </div>


                  <div className="boss-boat-title">

                    <span>
                      THUYỀN
                    </span>

                    <strong>
                      GIỌNG O
                    </strong>

                  </div>


                  <div className="boss-boat-count">
                    {voiceBoat.O.length}
                  </div>


                  <div className="boss-boat-hint">
                    KÉO CHỮ VÀO ĐÂY
                  </div>


                  <div className="boss-boat-letters">

                    {voiceBoat.O.map(
                      (item) => (

                        <span
                          key={item.id}
                          className="boss-placed-letter"
                        >
                          {item.letter}
                        </span>

                      )
                    )}

                  </div>

                </div>


                {/* =====================================
                    THUYỀN GIỌNG Ô
                ===================================== */}

                <div
                  className={`wat1-boss-boat wat1-boss-boat-oh ${
                    draggedItem
                      ? "drop-ready"
                      : ""
                  }`}
                  onDragOver={(event) =>
                    event.preventDefault()
                  }
                  onDrop={() =>
                    handleDropToBoat(
                      "Ô"
                    )
                  }
                >

                  <div className="boss-boat-icon">
                    🛶
                  </div>


                  <div className="boss-boat-title">

                    <span>
                      THUYỀN
                    </span>

                    <strong>
                      GIỌNG Ô
                    </strong>

                  </div>


                  <div className="boss-boat-count">
                    {voiceBoat.Ô.length}
                  </div>


                  <div className="boss-boat-hint">
                    KÉO CHỮ VÀO ĐÂY
                  </div>


                  <div className="boss-boat-letters">

                    {voiceBoat.Ô.map(
                      (item) => (

                        <span
                          key={item.id}
                          className="boss-placed-letter"
                        >
                          {item.letter}
                        </span>

                      )
                    )}

                  </div>

                </div>

              </div>

            )}

          </section>


          {feedback && (

            <div
              className={`wat1-feedback ${feedback.type}`}
            >

              <strong>
                {feedback.text}
              </strong>

              <span>
                {feedback.subtext}
              </span>

            </div>

          )}

        </main>

      </div>
    );
  }


  /* =======================================================
     FAILED
========================================================= */

  if (screen === "failed") {

    return (

      <div className="wat1-page">

        <div className="wat1-container">

          <section className="wat1-result-card wat1-failed-card">

            <div className="result-icon">
              ⚔
            </div>


            <span className="result-eyebrow">
              CỔNG ĐỀN CHƯA MỞ
            </span>


            <h1>
              Hãy thử lại!
            </h1>


            <p>
              Hành trình chinh phục
              tiếng Khmer cần sự kiên trì.
              Hãy quay lại và luyện tập
              thêm bảng chữ cái.
            </p>


            <div className="result-score">

              <span>
                ĐIỂM
              </span>

              <strong>
                {score}
              </strong>

            </div>


            <button
              className="wat1-primary-button"
              onClick={
                startGame
              }
            >
              ↻ CHƠI LẠI
            </button>


            <button
              className="wat1-secondary-button"
              onClick={
                backToMap
              }
            >
              ← VỀ BẢN ĐỒ
            </button>

          </section>

        </div>

      </div>
    );
  }


  /* =======================================================
     COMPLETE
========================================================= */

  if (screen === "complete") {

    return (

      <div className="wat1-page wat1-complete-page">

        <div className="wat1-complete-particles">

          <span>✦</span>
          <span>✧</span>
          <span>✦</span>
          <span>✧</span>
          <span>✦</span>

        </div>


        <div className="wat1-container">

          <section className="wat1-result-card wat1-complete-card">

            <div className="temple-complete-emblem">
              <span>ក</span>
            </div>


            <span className="result-eyebrow">
              NGÔI ĐỀN ĐÃ ĐƯỢC CHINH PHỤC
            </span>


            <h1>
              WAT ÁK-SÂ
            </h1>


            <div className="result-khmer">
              វត្តអក្សរ
            </div>


            <div className="complete-title">
              BẠN ĐÃ MỞ CỔNG CHỮ KHMER!
            </div>


            <p>
              Bạn đã hoàn thành những
              thử thách đầu tiên trên hành
              trình chinh phục tiếng Khmer.
            </p>


            <div className="result-stats">

              <div>

                <strong>
                  {score}
                </strong>

                <span>
                  ĐIỂM
                </span>

              </div>


              <div>

                <strong>
                  {bestCombo}
                </strong>

                <span>
                  COMBO CAO NHẤT
                </span>

              </div>


              <div>

                <strong>
                  33
                </strong>

                <span>
                  PHỤ ÂM
                </span>

              </div>

            </div>


            <div className="unlock-message">

              <span>
                🔓
              </span>


              <div>

                <strong>
                  NGÔI ĐỀN TIẾP THEO ĐÃ MỞ
                </strong>

                <small>
                  Wat 2 — Đảo Ghép Âm
                </small>

              </div>

            </div>


            <button
              className="wat1-primary-button"
              onClick={
                backToMap
              }
            >
              🗺 VỀ BẢN ĐỒ 10 NGÔI ĐỀN
            </button>

          </section>

        </div>

      </div>
    );
  }


  return null;
}


export default Wat1;