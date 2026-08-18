import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import "./FinalStage.css";

import {
  CONSONANTS,
} from "../../../../data/alphabetdata";


/* =========================================================
   WAT 1 — FINAL STAGE
   CỔNG CHÌA KHÓA

   LOGIC:

   - 33 phụ âm Khmer
   - Nhìn phụ âm
   - Xác định GIỌNG O / GIỌNG Ô
   - 10 câu / lượt
   - 3 mạng
   - Không lặp phụ âm trong cùng một lượt nếu còn chữ chưa dùng
   - Chơi lại vô hạn sau khi mở khóa
   - Thắng → nhận Chìa khóa Ák-Sâ
   - Thắng → hoàn thành WAT 1
   - Wat1.jsx chịu trách nhiệm mở WAT 2
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const TOTAL_QUESTIONS = 10;

const MAX_LIVES = 3;


/* =========================================================
   NORMALIZE CONSONANT
========================================================= */

function normalizeConsonant(
  item,
  index
) {

  if (!item) {
    return null;
  }


  const khmer =
    item.khmer ??
    item.letter ??
    item.char ??
    item.character ??
    "";


  const roman =
    item.roman ??
    item.romanization ??
    "";


  const voice =
    item.voice ??
    item.sound ??
    item.class ??
    "";


  return {
    ...item,

    id:
      item.id ??
      item.uid ??
      `consonant-${index + 1}`,

    khmer:
      String(khmer).trim(),

    roman:
      String(roman).trim(),

    voice:
      String(voice).trim(),

    type: "consonant",
  };
}


/* =========================================================
   NORMALIZED CONSONANTS
========================================================= */

const NORMALIZED_CONSONANTS =
  Array.isArray(CONSONANTS)
    ? CONSONANTS
        .map(normalizeConsonant)
        .filter(
          (item) =>
            item &&
            item.khmer &&
            item.roman
        )
    : [];


/* =========================================================
   NORMALIZE VOICE
========================================================= */

function normalizeVoice(voice) {

  if (
    voice === null ||
    voice === undefined
  ) {
    return "";
  }


  const original =
    String(voice)
      .trim()
      .toLowerCase();


  const value =
    original
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      );


  /* =======================================================
     Ô
  ======================================================= */

  if (
    original.includes("ô") ||
    original.includes("ô") ||
    original.includes("oh") ||
    original === "oo" ||
    value.includes("oh")
  ) {
    return "Ô";
  }


  /* =======================================================
     GIỌNG O
  ======================================================= */

  if (
    value === "o" ||
    original === "o"
  ) {
    return "O";
  }


  /* =======================================================
     GIỌNG O — TEXT
  ======================================================= */

  if (
    value.includes("o") &&
    !value.includes("oh")
  ) {
    return "O";
  }


  return "";
}


/* =========================================================
   SHUFFLE
========================================================= */

function shuffle(array) {

  const result = [
    ...array,
  ];


  for (
    let i =
      result.length - 1;

    i > 0;

    i--
  ) {

    const j =
      Math.floor(
        Math.random() *
        (i + 1)
      );


    [
      result[i],
      result[j],
    ] = [
      result[j],
      result[i],
    ];
  }


  return result;
}


/* =========================================================
   CREATE QUESTION
========================================================= */

function createQuestion(
  usedIds = []
) {

  /* =======================================================
     EMPTY DATA
  ======================================================= */

  if (
    NORMALIZED_CONSONANTS.length === 0
  ) {

    return {
      correct: {
        id: "empty",
        khmer: "—",
        roman: "",
        voice: "",
      },

      correctVoice: "",

      options: [
        {
          id: "voice-O",
          voice: "O",
          label: "O",
        },

        {
          id: "voice-OH",
          voice: "Ô",
          label: "Ô",
        },
      ],
    };
  }


  /* =======================================================
     CHỮ CHƯA DÙNG
  ======================================================= */

  const available =
    NORMALIZED_CONSONANTS.filter(
      (item) =>
        !usedIds.includes(
          item.id
        )
    );


  /* =======================================================
     HẾT CHỮ → DÙNG LẠI
  ======================================================= */

  const pool =
    available.length > 0
      ? available
      : NORMALIZED_CONSONANTS;


  /* =======================================================
     CHỌN PHỤ ÂM
  ======================================================= */

  const correct =
    pool[
      Math.floor(
        Math.random() *
        pool.length
      )
    ];


  /* =======================================================
     VOICE THẬT
  ======================================================= */

  const correctVoice =
    normalizeVoice(
      correct.voice
    );


  /* =======================================================
     OPTIONS
  ======================================================= */

  const options =
    shuffle([
      {
        id: "voice-O",
        label: "O",
        voice: "O",
      },

      {
        id: "voice-OH",
        label: "Ô",
        voice: "Ô",
      },
    ]);


  return {
    correct,
    correctVoice,
    options,
  };
}


/* =========================================================
   INITIAL GAME
========================================================= */

function createInitialGame() {

  const first =
    createQuestion([]);


  return {
    question: first,

    usedIds: [
      first.correct.id,
    ],
  };
}


/* =========================================================
   COMPONENT
========================================================= */

export default function FinalStage({
  profile,
  onBackToMenu,
  onComplete,
}) {

  /* =======================================================
     INITIAL
  ======================================================= */

  const initial =
    useMemo(
      () =>
        createInitialGame(),
      []
    );


  /* =======================================================
     GAME STATE
  ======================================================= */

  const [
    question,
    setQuestion,
  ] = useState(
    initial.question
  );


  const [
    usedIds,
    setUsedIds,
  ] = useState(
    initial.usedIds
  );


  const [
    round,
    setRound,
  ] = useState(1);


  const [
    lives,
    setLives,
  ] = useState(
    MAX_LIVES
  );


  const [
    score,
    setScore,
  ] = useState(0);


  const [
    combo,
    setCombo,
  ] = useState(0);


  const [
    selectedVoice,
    setSelectedVoice,
  ] = useState(null);


  const [
    isCorrect,
    setIsCorrect,
  ] = useState(null);


  const [
    isLocked,
    setIsLocked,
  ] = useState(false);


  const [
    showFeedback,
    setShowFeedback,
  ] = useState(false);


  const [
    finished,
    setFinished,
  ] = useState(false);


  const [
    resultType,
    setResultType,
  ] = useState(null);


  /* =======================================================
     NEXT QUESTION
  ======================================================= */

  const nextQuestion =
    useCallback(() => {

      const next =
        createQuestion(
          usedIds
        );


      setQuestion(
        next
      );


      setUsedIds(
        (previous) => [
          ...previous,
          next.correct.id,
        ]
      );


      setSelectedVoice(null);

      setIsCorrect(null);

      setShowFeedback(false);

      setIsLocked(false);


      setRound(
        (previous) =>
          previous + 1
      );

    }, [
      usedIds,
    ]);


  /* =======================================================
     FINISH WIN
  ======================================================= */

  const finishWin =
    useCallback(
      (
        finalScore,
        finalCombo
      ) => {

        setFinished(true);

        setResultType("win");


        const result = {

          stageId: "final",

          result: "win",

          won: true,

          score:
            finalScore,

          combo:
            finalCombo,

          xp:
            finalScore,

          key:
            "ak-sa-key",

          wat1Completed:
            true,

          wat2Unlocked:
            true,
        };


        console.log(
          "FINAL STAGE: WIN",
          result
        );


        /* ===============================================
           GỬI VỀ WAT1
        =============================================== */

        if (
          typeof onComplete ===
          "function"
        ) {

          onComplete(
            result
          );

        } else {

          console.error(
            "FinalStage: onComplete chưa được truyền vào."
          );

        }

      },
      [
        onComplete,
      ]
    );


  /* =======================================================
     FINISH LOSE
  ======================================================= */

  const finishLose =
    useCallback(
      (finalScore) => {

        setFinished(true);

        setResultType("lose");


        const result = {

          stageId: "final",

          result: "lose",

          won: false,

          score:
            finalScore,

          combo: 0,

          xp: 0,
        };


        console.log(
          "FINAL STAGE: LOSE",
          result
        );


        if (
          typeof onComplete ===
          "function"
        ) {

          onComplete(
            result
          );

        }

      },
      [
        onComplete,
      ]
    );


  /* =======================================================
     ANSWER
======================================================= */

  const handleAnswer =
    useCallback(
      (selected) => {

        if (
          isLocked ||
          finished
        ) {
          return;
        }


        if (
          selected !== "O" &&
          selected !== "Ô"
        ) {
          return;
        }


        setIsLocked(true);

        setSelectedVoice(
          selected
        );


        /* =================================================
           VOICE THẬT
        ================================================= */

        const correctVoice =
          question.correctVoice;


        const correct =
          selected ===
          correctVoice;


        setIsCorrect(
          correct
        );

        setShowFeedback(
          true
        );


        /* =================================================
           CORRECT
        ================================================= */

        if (correct) {

          const nextCombo =
            combo + 1;


          const gained =
            15 +
            Math.min(
              nextCombo * 3,
              30
            );


          const nextScore =
            score + gained;


          setCombo(
            nextCombo
          );


          setScore(
            nextScore
          );


          window.setTimeout(
            () => {

              if (
                round >=
                TOTAL_QUESTIONS
              ) {

                finishWin(
                  nextScore,
                  nextCombo
                );

                return;
              }


              nextQuestion();

            },
            700
          );


          return;
        }


        /* =================================================
           WRONG
        ================================================= */

        const nextLives =
          lives - 1;


        setCombo(0);

        setLives(
          nextLives
        );


        window.setTimeout(
          () => {

            if (
              nextLives <= 0
            ) {

              finishLose(
                score
              );

              return;
            }


            nextQuestion();

          },
          900
        );

      },
      [
        isLocked,
        finished,
        question.correctVoice,
        combo,
        score,
        lives,
        round,
        finishWin,
        finishLose,
        nextQuestion,
      ]
    );


  /* =======================================================
     KEYBOARD
======================================================= */

  useEffect(() => {

    const handleKeyDown =
      (event) => {

        if (
          isLocked ||
          finished
        ) {
          return;
        }


        const key =
          event.key.toLowerCase();


        /* O */

        if (
          key === "o"
        ) {

          handleAnswer(
            "O"
          );

          return;
        }


        /* P = Ô */

        if (
          key === "p"
        ) {

          handleAnswer(
            "Ô"
          );

        }

      };


    window.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };

  }, [
    handleAnswer,
    isLocked,
    finished,
  ]);


  /* =======================================================
     CORRECT VOICE
======================================================= */

  const correctVoice =
    question.correctVoice;


  /* =======================================================
     RESULT SCREEN
======================================================= */

  if (finished) {

    return (
      <div className="final-stage">

        <div className="final-stage__background" />


        <main className="final-result">

          {resultType === "win" ? (
            <>

              <div className="final-result__key">

                <div className="final-result__key-glow" />

                <span>
                  🔑
                </span>

              </div>


              <div className="final-result__eyebrow">
                CỔNG CHÌA KHÓA
              </div>


              <h1>
                CHÌA KHÓA ÁK-SÂ
              </h1>


              <p className="final-result__found">
                BẠN ĐÃ TÌM THẤY!
              </p>


              <div className="final-result__line">
                ✦
              </div>


              <p className="final-result__message">
                Bạn đã hoàn thành toàn bộ
                thử thách của WAT ÁK-SÂ.
              </p>


              <div className="final-result__stats">

                <div>

                  <strong>
                    +{score} XP
                  </strong>

                  <span>
                    ĐIỂM NHẬN ĐƯỢC
                  </span>

                </div>


                <div>

                  <strong>
                    ⭐ {score}
                  </strong>

                  <span>
                    ĐIỂM
                  </span>

                </div>


                <div>

                  <strong>
                    🔥 {combo}
                  </strong>

                  <span>
                    COMBO
                  </span>

                </div>

              </div>


              <div className="final-result__gate">

                <div className="final-result__gate-icon">
                  🚪
                </div>


                <div>

                  <strong>
                    CỔNG SỐ 2
                  </strong>

                  <span>
                    ĐÃ ĐƯỢC MỞ KHÓA
                  </span>

                </div>


                <div className="final-result__gate-status">
                  ✓
                </div>

              </div>


              <button
                type="button"
                className="final-result__button"
                onClick={
                  onBackToMenu
                }
              >
                TIẾP TỤC
              </button>

            </>

          ) : (

            <>

              <div className="final-result__lose-icon">
                ⚔
              </div>


              <div className="final-result__eyebrow">
                CỔNG CHÌA KHÓA
              </div>


              <h1>
                THỬ THÁCH THẤT BẠI
              </h1>


              <p className="final-result__message">
                Chìa khóa vẫn đang chờ
                người xứng đáng.
              </p>


              <div className="final-result__lose-score">

                ĐIỂM:{" "}

                <strong>
                  {score}
                </strong>

              </div>


              <button
                type="button"
                className="final-result__button final-result__button--secondary"
                onClick={
                  onBackToMenu
                }
              >
                QUAY LẠI DANH SÁCH
              </button>

            </>

          )}

        </main>

      </div>
    );
  }


  /* =======================================================
     GAME SCREEN
  ======================================================= */

  return (
    <div className="final-stage">

      <div className="final-stage__background" />


      {/* ===================================================
          TOP BAR
      =================================================== */}

      <header className="final-stage__topbar">

        <button
          type="button"
          className="final-stage__back"
          onClick={
            onBackToMenu
          }
        >
          ← DANH SÁCH THỬ THÁCH
        </button>


        <div className="final-stage__title-mini">
          🔑 CỔNG CHÌA KHÓA
        </div>


        <div className="final-stage__lives">

          {Array.from(
            {
              length:
                MAX_LIVES,
            },
            (_, index) => (

              <span
                key={index}
                className={
                  index < lives
                    ? "final-stage__heart final-stage__heart--active"
                    : "final-stage__heart"
                }
              >
                ♥
              </span>

            )
          )}

        </div>

      </header>


      {/* ===================================================
          HEADER
      =================================================== */}

      <section className="final-stage__header">

        <div className="final-stage__seal">
          🔑
        </div>


        <div className="final-stage__eyebrow">
          WAT ÁK-SÂ
        </div>


        <h1>
          THỬ THÁCH CUỐI CÙNG
        </h1>


        <p>
          CỔNG CHÌA KHÓA
        </p>

      </section>


      {/* ===================================================
          PROGRESS
      =================================================== */}

      <section className="final-stage__progress">

        <div className="final-stage__progress-info">

          <span>
            CÂU {Math.min(
              round,
              TOTAL_QUESTIONS
            )} /{" "}
            {TOTAL_QUESTIONS}
          </span>


          <span>
            ⭐ {score}
          </span>

        </div>


        <div className="final-stage__progress-track">

          <div
            className="final-stage__progress-fill"
            style={{
              width:
                `${
                  Math.min(
                    (
                      round /
                      TOTAL_QUESTIONS
                    ) * 100,
                    100
                  )
                }%`,
            }}
          />

        </div>

      </section>


      {/* ===================================================
          GAME
      =================================================== */}

      <main className="final-stage__game">

        <section className="final-stage__question">

          <div className="final-stage__question-label">
            PHÂN LOẠI GIỌNG KHMER
          </div>


          <div className="final-stage__khmer">
            {question.correct.khmer}
          </div>


          <div className="final-stage__roman">
            {question.correct.roman}
          </div>


          <div className="final-stage__question-line">
            ✦
          </div>


          <p>
            Phụ âm này thuộc
            <br />
            giọng nào?
          </p>

        </section>


        {/* =================================================
            VOICE BUTTONS
        ================================================= */}

        <section className="final-stage__voices">

          {/* O */}

          <button
            type="button"
            className={[
              "final-voice",

              selectedVoice === "O"
                ? isCorrect
                  ? "final-voice--correct"
                  : "final-voice--wrong"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() =>
              handleAnswer("O")
            }
            disabled={
              isLocked
            }
          >

            <span className="final-voice__key">
              O
            </span>


            <span className="final-voice__title">
              GIỌNG O
            </span>


            <span className="final-voice__roman">
              O
            </span>

          </button>


          {/* Ô */}

          <button
            type="button"
            className={[
              "final-voice",

              selectedVoice === "Ô"
                ? isCorrect
                  ? "final-voice--correct"
                  : "final-voice--wrong"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() =>
              handleAnswer("Ô")
            }
            disabled={
              isLocked
            }
          >

            <span className="final-voice__key">
              P
            </span>


            <span className="final-voice__title">
              GIỌNG Ô
            </span>


            <span className="final-voice__roman">
              Ô
            </span>

          </button>

        </section>


        {/* =================================================
            FEEDBACK
        ================================================= */}

        {showFeedback && (

          <div
            className={[
              "final-stage__feedback",

              isCorrect
                ? "final-stage__feedback--correct"
                : "final-stage__feedback--wrong",

            ].join(" ")}
          >

            {isCorrect ? (
              <>
                ✓ CHÍNH XÁC —{" "}
                {question.correct.khmer}
                {" "}LÀ GIỌNG{" "}
                {correctVoice}
              </>
            ) : (
              <>
                ✕ CHƯA ĐÚNG —{" "}
                {question.correct.khmer}
                {" "}LÀ GIỌNG{" "}
                {correctVoice}
              </>
            )}

          </div>

        )}


        {/* =================================================
            OBJECTIVE
        ================================================= */}

        <div className="final-stage__objective">

          <span>
            🔑
          </span>


          <div>

            <strong>
              MỤC TIÊU
            </strong>


            <small>
              Vượt qua 10 câu để nhận
              Chìa khóa Ák-Sâ.
            </small>

          </div>

        </div>

      </main>


      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer className="final-stage__footer">

        <span>
          COMBO
        </span>


        <strong>
          🔥 {combo}
        </strong>


        <span>
          •
        </span>


        <span>
          33 PHỤ ÂM
        </span>


        <span>
          •
        </span>


        <span>
          O / Ô
        </span>

      </footer>

    </div>
  );
}