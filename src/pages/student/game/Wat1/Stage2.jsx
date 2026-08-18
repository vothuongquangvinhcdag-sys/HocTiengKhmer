import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import "./Stage2.css";

import { VOWELS } from "../../../../data/alphabetdata";

/* =========================================================
   WAT 1 — THỬ THÁCH II

   NGUYÊN ÂM & GIỌNG O / Ô

   LUẬT
   ---------------------------------------------------------
   - 24 nguyên âm Khmer
   - Nhận diện phiên âm
   - Phân biệt giọng O / Ô
   - 10 câu / lượt
   - 3 mạng
   - Chơi lại vô hạn
   - Thắng → Wat1.jsx mở Stage III
   - Thua → không khóa Stage
========================================================= */

const TOTAL_QUESTIONS = 10;
const MAX_LIVES = 3;


/* =========================================================
   NORMALIZE VOWEL
========================================================= */

function normalizeVowel(item, index) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const khmer =
    item.khmer ??
    item.char ??
    item.character ??
    item.letter ??
    item.symbol ??
    "";

  const romanO =
    item.romanO ??
    item.roman_o ??
    item.roman ??
    item.romanization ??
    item.transcription ??
    "";

  const romanOh =
    item.romanOh ??
    item.romanOH ??
    item.roman_oh ??
    item.romanÔ ??
    item.romanO2 ??
    item.oh ??
    "";

  const voiceRaw =
    item.voice ??
    item.type ??
    item.sound ??
    null;

  let voice = null;

  if (
    voiceRaw === "O" ||
    voiceRaw === "o"
  ) {
    voice = "O";
  }

  if (
    voiceRaw === "Ô" ||
    voiceRaw === "ô" ||
    voiceRaw === "Oh" ||
    voiceRaw === "OH" ||
    voiceRaw === "oh"
  ) {
    voice = "Ô";
  }

  return {
    ...item,

    id:
      item.id ??
      item.uid ??
      `vowel-${index + 1}`,

    khmer,

    romanO,

    romanOh,

    voice,
  };
}


/* =========================================================
   NORMALIZED DATA
========================================================= */

const NORMALIZED_VOWELS = Array.isArray(VOWELS)
  ? VOWELS
      .map(normalizeVowel)
      .filter(Boolean)
      .filter(
        (item) =>
          item.khmer &&
          (
            item.romanO ||
            item.romanOh
          )
      )
  : [];


/* =========================================================
   DEBUG
========================================================= */

console.log(
  "WAT 1 — Stage II — Số nguyên âm:",
  NORMALIZED_VOWELS.length
);

if (NORMALIZED_VOWELS.length === 0) {
  console.error(
    "Stage2: Không tìm thấy dữ liệu nguyên âm hợp lệ.",
    VOWELS
  );
}


/* =========================================================
   SHUFFLE
========================================================= */

function shuffle(array) {
  const result = [...array];

  for (
    let i = result.length - 1;
    i > 0;
    i--
  ) {
    const j =
      Math.floor(
        Math.random() * (i + 1)
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
   GET VOICE
========================================================= */

function getVoiceType(item) {
  if (!item) {
    return "O";
  }

  /*
    Nếu dữ liệu có voice cố định
    thì ưu tiên voice đó.
  */

  if (item.voice === "O") {
    return "O";
  }

  if (item.voice === "Ô") {
    return "Ô";
  }

  /*
    Có cả O và Ô
    → random để game thực sự trộn hai giọng.
  */

  if (
    item.romanO &&
    item.romanOh
  ) {
    return Math.random() < 0.5
      ? "O"
      : "Ô";
  }

  if (item.romanO) {
    return "O";
  }

  if (item.romanOh) {
    return "Ô";
  }

  return "O";
}


/* =========================================================
   GET ROMANIZATION
========================================================= */

function getRoman(item, voice) {
  if (!item) {
    return "";
  }

  if (voice === "Ô") {
    return (
      item.romanOh ||
      item.romanO ||
      ""
    );
  }

  return (
    item.romanO ||
    item.romanOh ||
    ""
  );
}


/* =========================================================
   CREATE OPTION
========================================================= */

function createOption(
  item,
  voice,
  correct = false
) {
  if (!item) {
    return null;
  }

  const roman =
    getRoman(
      item,
      voice
    );

  if (!roman) {
    return null;
  }

  return {
    id:
      `${item.id}-${voice}-${roman}`,

    roman,

    voice,

    sourceId:
      item.id,

    correct,
  };
}


/* =========================================================
   CREATE QUESTION
========================================================= */

function createQuestion(
  usedIds = []
) {
  if (
    NORMALIZED_VOWELS.length === 0
  ) {
    throw new Error(
      "Stage2: VOWELS không có dữ liệu hợp lệ."
    );
  }


  /* -------------------------------------------------------
     CHỌN NGUYÊN ÂM CHƯA XUẤT HIỆN
  ------------------------------------------------------- */

  const available =
    NORMALIZED_VOWELS.filter(
      (item) =>
        !usedIds.includes(
          item.id
        )
    );


  const source =
    available.length > 0
      ? available
      : NORMALIZED_VOWELS;


  const correct =
    source[
      Math.floor(
        Math.random() *
          source.length
      )
    ];


  if (!correct) {
    throw new Error(
      "Stage2: Không thể tạo câu hỏi."
    );
  }


  /* -------------------------------------------------------
     CHỌN GIỌNG
  ------------------------------------------------------- */

  const voice =
    getVoiceType(
      correct
    );


  const correctRoman =
    getRoman(
      correct,
      voice
    );


  if (!correctRoman) {
    throw new Error(
      `Stage2: ${correct.khmer} không có phiên âm giọng ${voice}.`
    );
  }


  /* -------------------------------------------------------
     ĐÁP ÁN SAI
  ------------------------------------------------------- */

  const candidates = [];


  /* =======================================================
     1. CÙNG KÝ TỰ — KHÁC GIỌNG
  ======================================================= */

  const oppositeVoice =
    voice === "O"
      ? "Ô"
      : "O";


  const oppositeOption =
    createOption(
      correct,
      oppositeVoice,
      false
    );


  if (
    oppositeOption &&
    oppositeOption.roman !==
      correctRoman
  ) {
    candidates.push(
      oppositeOption
    );
  }


  /* =======================================================
     2. NGUYÊN ÂM KHÁC — CÙNG GIỌNG
  ======================================================= */

  NORMALIZED_VOWELS.forEach(
    (item) => {
      if (
        item.id ===
        correct.id
      ) {
        return;
      }

      const option =
        createOption(
          item,
          voice,
          false
        );

      if (
        option &&
        option.roman !==
          correctRoman
      ) {
        candidates.push(
          option
        );
      }
    }
  );


  /* =======================================================
     3. KHÔNG TRÙNG PHIÊN ÂM
  ======================================================= */

  const uniqueCandidates =
    candidates.filter(
      (
        item,
        index,
        array
      ) =>
        array.findIndex(
          (x) =>
            x.roman ===
            item.roman
        ) === index
    );


  /* =======================================================
     4. LẤY 3 ĐÁP ÁN SAI
  ======================================================= */

  let wrongAnswers =
    shuffle(
      uniqueCandidates
    ).slice(
      0,
      3
    );


  /* =======================================================
     5. FALLBACK O / Ô
  ======================================================= */

  if (
    wrongAnswers.length < 3
  ) {
    const fallback = [];


    NORMALIZED_VOWELS.forEach(
      (item) => {

        ["O", "Ô"].forEach(
          (candidateVoice) => {

            const option =
              createOption(
                item,
                candidateVoice,
                false
              );


            if (!option) {
              return;
            }


            if (
              option.roman ===
              correctRoman
            ) {
              return;
            }


            if (
              fallback.some(
                (x) =>
                  x.roman ===
                  option.roman
              )
            ) {
              return;
            }


            if (
              wrongAnswers.some(
                (x) =>
                  x.roman ===
                  option.roman
              )
            ) {
              return;
            }


            fallback.push(
              option
            );
          }
        );
      }
    );


    wrongAnswers = [
      ...wrongAnswers,

      ...shuffle(
        fallback
      ).slice(
        0,
        3 -
          wrongAnswers.length
      ),
    ];
  }


  /* =======================================================
     6. ĐÁP ÁN ĐÚNG
  ======================================================= */

  const correctOption =
    createOption(
      correct,
      voice,
      true
    );


  /* =======================================================
     7. 4 ĐÁP ÁN
  ======================================================= */

  const options =
    shuffle([
      correctOption,
      ...wrongAnswers,
    ].filter(Boolean));


  return {
    correct,

    voice,

    correctRoman,

    options:
      options.slice(
        0,
        4
      ),
  };
}


/* =========================================================
   INITIAL GAME
========================================================= */

function createInitialGame() {
  const first =
    createQuestion([]);


  return {
    question:
      first,

    usedIds: [
      first.correct.id,
    ],
  };
}


/* =========================================================
   COMPONENT
========================================================= */

export default function Stage2({
  profile,
  onBackToMenu,
  onComplete,
}) {

  const initialGame =
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
    initialGame.question
  );


  const [
    usedIds,
    setUsedIds,
  ] = useState(
    initialGame.usedIds
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
    selectedAnswer,
    setSelectedAnswer,
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


      setSelectedAnswer(
        null
      );

      setIsCorrect(
        null
      );

      setShowFeedback(
        false
      );

      setIsLocked(
        false
      );

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
    useCallback(() => {

      setFinished(true);

      setResultType(
        "win"
      );


      if (
        typeof onComplete ===
        "function"
      ) {
        onComplete({
          won: true,

          score,

          combo,

          questions:
            TOTAL_QUESTIONS,

          xp: score,
        });
      }

    }, [
      score,
      combo,
      onComplete,
    ]);


  /* =======================================================
     FINISH LOSE
  ======================================================= */

  const finishLose =
    useCallback(() => {

      setFinished(true);

      setResultType(
        "lose"
      );


      if (
        typeof onComplete ===
        "function"
      ) {
        onComplete({
          won: false,

          score,

          combo,

          questions:
            TOTAL_QUESTIONS,

          xp: 0,
        });
      }

    }, [
      score,
      combo,
      onComplete,
    ]);


  /* =======================================================
     HANDLE ANSWER
  ======================================================= */

  const handleAnswer =
    useCallback(
      (answer) => {

        if (
          isLocked ||
          finished
        ) {
          return;
        }


        setIsLocked(
          true
        );


        setSelectedAnswer(
          answer
        );


        const correct =
          answer.correct ===
          true;


        setIsCorrect(
          correct
        );


        setShowFeedback(
          true
        );


        /* ================================================
           CORRECT
        ================================================ */

        if (correct) {

          const nextCombo =
            combo + 1;


          const gained =
            10 +
            Math.min(
              nextCombo * 2,
              20
            );


          const nextScore =
            score +
            gained;


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
                /*
                  Score đã được truyền trực tiếp
                  từ closure hiện tại.
                */
                finishWinWithScore(
                  nextScore,
                  nextCombo
                );
              } else {
                nextQuestion();
              }

            },
            650
          );


          return;
        }


        /* ================================================
           WRONG
        ================================================ */

        setCombo(
          0
        );


        const nextLives =
          lives - 1;


        setLives(
          nextLives
        );


        window.setTimeout(
          () => {

            if (
              nextLives <= 0
            ) {
              finishLoseWithScore(
                score,
                0
              );
            } else {
              nextQuestion();
            }

          },
          850
        );

      },
      [
        isLocked,
        finished,
        combo,
        score,
        round,
        lives,
        nextQuestion,
      ]
    );


  /* =======================================================
     FINISH FUNCTIONS
     
     Dùng score truyền trực tiếp để tránh
     stale state khi vừa setScore().
  ======================================================= */

  const finishWinWithScore =
    useCallback(
      (
        finalScore,
        finalCombo
      ) => {

        setFinished(
          true
        );

        setResultType(
          "win"
        );


        if (
          typeof onComplete ===
          "function"
        ) {
          onComplete({
            won: true,

            score:
              finalScore,

            combo:
              finalCombo,

            questions:
              TOTAL_QUESTIONS,

            xp:
              finalScore,
          });
        }

      },
      [
        onComplete,
      ]
    );


  const finishLoseWithScore =
    useCallback(
      (
        finalScore,
        finalCombo
      ) => {

        setFinished(
          true
        );

        setResultType(
          "lose"
        );


        if (
          typeof onComplete ===
          "function"
        ) {
          onComplete({
            won: false,

            score:
              finalScore,

            combo:
              finalCombo,

            questions:
              TOTAL_QUESTIONS,

            xp: 0,
          });
        }

      },
      [
        onComplete,
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


        const index =
          Number(key) - 1;


        if (
          index >= 0 &&
          index <
            question.options.length
        ) {

          handleAnswer(
            question.options[
              index
            ]
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
    question,
    isLocked,
    finished,
    handleAnswer,
  ]);


  /* =======================================================
     RESULT SCREEN
  ======================================================= */

  if (finished) {

    return (
      <div className="stage2">

        <div className="stage2__background" />

        <main className="stage2-result">

          {resultType === "win" ? (
            <>

              <div className="stage2-result__symbol">
                ✦
              </div>

              <div className="stage2-result__eyebrow">
                THỬ THÁCH II
              </div>

              <h1>
                THỬ THÁCH HOÀN THÀNH
              </h1>

              <p className="stage2-result__subtitle">
                NGUYÊN ÂM & GIỌNG O / Ô
              </p>


              <div className="stage2-result__stats">

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
                    {score}
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


              <div className="stage2-result__unlock">

                <span>
                  🔓
                </span>

                <div>

                  <strong>
                    THỬ THÁCH III ĐÃ MỞ
                  </strong>

                  <small>
                    Bạn đã mở khóa thử thách tiếp theo.
                  </small>

                </div>

              </div>


              <button
                type="button"
                className="stage2-result__button"
                onClick={
                  onBackToMenu
                }
              >
                TIẾP TỤC
              </button>

            </>

          ) : (

            <>

              <div className="stage2-result__symbol stage2-result__symbol--lose">
                ⚔
              </div>

              <div className="stage2-result__eyebrow">
                THỬ THÁCH II
              </div>

              <h1>
                THỬ THÁCH THẤT BẠI
              </h1>

              <p className="stage2-result__subtitle">
                Hãy thử lại để chinh phục ngôi đền.
              </p>


              <div className="stage2-result__lose-score">

                ĐIỂM:{" "}

                <strong>
                  {score}
                </strong>

              </div>


              <button
                type="button"
                className="stage2-result__button stage2-result__button--secondary"
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
     GAME
  ======================================================= */

  return (
    <div className="stage2">

      <div className="stage2__background" />


      {/* ===================================================
          TOP BAR
      =================================================== */}

      <header className="stage2__topbar">

        <button
          type="button"
          className="stage2__back"
          onClick={
            onBackToMenu
          }
        >
          ← DANH SÁCH THỬ THÁCH
        </button>


        <div className="stage2__lives">

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
                    ? "stage2__heart stage2__heart--active"
                    : "stage2__heart"
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

      <section className="stage2__header">

        <div className="stage2__eyebrow">
          WAT ÁK-SÂ
        </div>

        <h1>
          THỬ THÁCH II
        </h1>

        <p>
          NGUYÊN ÂM & GIỌNG O / Ô
        </p>

      </section>


      {/* ===================================================
          PROGRESS
      =================================================== */}

      <section className="stage2__progress">

        <div className="stage2__progress-info">

          <span>
            CÂU {round} / {TOTAL_QUESTIONS}
          </span>

          <span>
            ⭐ {score}
          </span>

        </div>


        <div className="stage2__progress-track">

          <div
            className="stage2__progress-fill"
            style={{
              width:
                `${Math.min(
                  ((round - 1) /
                    TOTAL_QUESTIONS) *
                    100,
                  100
                )}%`,
            }}
          />

        </div>

      </section>


      {/* ===================================================
          GAME
      =================================================== */}

      <main className="stage2__game">

        <section className="stage2__question">

          <div className="stage2__question-label">
            KÝ TỰ NÀY CÓ PHIÊN ÂM GÌ?
          </div>


          <div className="stage2__khmer">
            {question.correct.khmer}
          </div>


          <div className="stage2__voice-badge">
            GIỌNG{" "}
            <strong>
              {question.voice}
            </strong>
          </div>


          <p className="stage2__hint">
            Hãy xác định đúng nguyên âm
            và giọng O / Ô.
          </p>

        </section>


        {/* =================================================
            ANSWERS
        ================================================= */}

        <section className="stage2__answers">

          {question.options.map(
            (
              option,
              index
            ) => {

              const selected =
                selectedAnswer?.id ===
                option.id;


              const correct =
                option.correct;


              let stateClass =
                "";


              if (
                showFeedback &&
                correct
              ) {
                stateClass =
                  "stage2-answer--correct";
              }


              if (
                showFeedback &&
                selected &&
                !correct
              ) {
                stateClass =
                  "stage2-answer--wrong";
              }


              return (
                <button
                  type="button"
                  key={
                    option.id
                  }
                  className={[
                    "stage2-answer",
                    stateClass,
                  ]
                    .filter(
                      Boolean
                    )
                    .join(" ")}
                  onClick={() =>
                    handleAnswer(
                      option
                    )
                  }
                  disabled={
                    isLocked
                  }
                >

                  <span className="stage2-answer__number">
                    {index + 1}
                  </span>


                  <span className="stage2-answer__content">

                    <strong>
                      {
                        option.roman
                      }
                    </strong>

                    <small>
                      GIỌNG{" "}
                      {
                        option.voice
                      }
                    </small>

                  </span>


                  {showFeedback &&
                    correct && (
                      <span className="stage2-answer__mark">
                        ✓
                      </span>
                    )}


                  {showFeedback &&
                    selected &&
                    !correct && (
                      <span className="stage2-answer__mark">
                        ✕
                      </span>
                    )}

                </button>
              );
            }
          )}

        </section>


        {/* =================================================
            FEEDBACK
        ================================================= */}

        {showFeedback && (

          <div
            className={[
              "stage2__feedback",

              isCorrect
                ? "stage2__feedback--correct"
                : "stage2__feedback--wrong",

            ].join(" ")}
          >

            {isCorrect
              ? "✓ CHÍNH XÁC"
              : `✕ SAI — ĐÁP ÁN ĐÚNG: ${question.correctRoman}`}

          </div>

        )}

      </main>


      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer className="stage2__footer">

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
          {NORMALIZED_VOWELS.length} NGUYÊN ÂM KHMER
        </span>

      </footer>

    </div>
  );
}