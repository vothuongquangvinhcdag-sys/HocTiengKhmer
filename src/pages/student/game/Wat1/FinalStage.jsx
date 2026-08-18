import {
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

   QUY TẮC:

   - 33 phụ âm Khmer
   - Nhìn phụ âm
   - Xác định GIỌNG O / GIỌNG Ô
   - 10 câu / lượt
   - 3 mạng
   - Không lặp phụ âm trong cùng một lượt nếu còn chữ chưa dùng

   LẦN ĐẦU THẮNG:
   - Nhận chìa khóa Ák-Sâ
   - Hoàn thành WAT 1
   - Mở WAT 2
   - Nhận XP

   CHƠI LẠI:
   - Không nhận chìa khóa lần nữa
   - Không mở WAT 2 lần nữa
   - Không nhận XP
   - Chỉ ghi nhận điểm chơi lại

   QUAN TRỌNG:
   FinalStage KHÔNG render màn hình kết quả.
   Kết quả được giao hoàn toàn cho Wat1 → ChallengeResult.
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const TOTAL_QUESTIONS = 10;
const MAX_LIVES = 3;


/* =========================================================
   STORAGE
========================================================= */

const FINAL_COMPLETED_KEY =
  "khmer_wat1_final_completed";


function getCompletedKey(profile) {
  if (profile?.id) {
    return `${FINAL_COMPLETED_KEY}_${profile.id}`;
  }

  if (profile?.user_id) {
    return `${FINAL_COMPLETED_KEY}_${profile.user_id}`;
  }

  if (profile?.username) {
    return `${FINAL_COMPLETED_KEY}_${profile.username}`;
  }

  if (profile?.email) {
    return `${FINAL_COMPLETED_KEY}_${profile.email}`;
  }

  return FINAL_COMPLETED_KEY;
}


/* =========================================================
   CHECK COMPLETED
========================================================= */

function hasCompletedBefore(profile) {
  try {
    return (
      localStorage.getItem(
        getCompletedKey(profile)
      ) === "true"
    );
  } catch {
    return false;
  }
}


/* =========================================================
   MARK COMPLETED
========================================================= */

function markCompleted(profile) {
  try {
    localStorage.setItem(
      getCompletedKey(profile),
      "true"
    );
  } catch (error) {
    console.warn(
      "FinalStage: Không thể lưu trạng thái hoàn thành.",
      error
    );
  }
}


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
     O
  ======================================================= */

  if (
    value === "o" ||
    original === "o"
  ) {
    return "O";
  }


  /* =======================================================
     O — TEXT
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
          label: "O",
          voice: "O",
        },

        {
          id: "voice-OH",
          label: "Ô",
          voice: "Ô",
        },
      ],
    };
  }


  const available =
    NORMALIZED_CONSONANTS.filter(
      (item) =>
        !usedIds.includes(
          item.id
        )
    );


  const pool =
    available.length > 0
      ? available
      : NORMALIZED_CONSONANTS;


  const correct =
    pool[
      Math.floor(
        Math.random() *
        pool.length
      )
    ];


  const correctVoice =
    normalizeVoice(
      correct.voice
    );


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
     CHECK FIRST COMPLETION
     
     Chỉ dùng để xác định:
     - lần đầu thắng
     - chơi lại
  ======================================================= */

  const completedBefore =
    useMemo(
      () =>
        hasCompletedBefore(profile),
      [profile]
    );


  /* =======================================================
     INITIAL GAME
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
     
     QUAN TRỌNG:
     
     KHÔNG setResultType
     KHÔNG render result screen
     
     Chỉ gửi kết quả về Wat1.
  ======================================================= */

  const finishWin =
    useCallback(
      (
        finalScore,
        finalCombo
      ) => {

        if (finished) {
          return;
        }


        setFinished(true);


        /*
         * Kiểm tra NGAY LÚC THẮNG.
         *
         * Không dùng biến completedBefore
         * để tránh trường hợp state/render cũ.
         */

        const isFirstWin =
          !hasCompletedBefore(
            profile
          );


        /*
         * Chỉ lần đầu mới lưu chìa khóa.
         */

        if (isFirstWin) {
          markCompleted(
            profile
          );
        }


        const result = {

          stageId:
            "final",

          result:
            "win",

          won:
            true,

          score:
            finalScore,

          combo:
            finalCombo,

          /*
           * Lần đầu:
           *   XP = score
           *
           * Chơi lại:
           *   XP = 0
           */

          xp:
            isFirstWin
              ? finalScore
              : 0,


          /*
           * CHÌA KHÓA
           */

          key:
            isFirstWin
              ? "ak-sa-key"
              : null,


          /*
           * CỰC KỲ QUAN TRỌNG
           */

          firstCompletion:
            isFirstWin,


          replay:
            !isFirstWin,


          wat1Completed:
            true,


          wat2Unlocked:
            isFirstWin,


          keyObtained:
            isFirstWin,

        };


        console.log(
          "===================================="
        );

        console.log(
          "FINAL STAGE — WIN"
        );

        console.log(
          "Completed before:",
          !isFirstWin
        );

        console.log(
          "First completion:",
          isFirstWin
        );

        console.log(
          "Result:",
          result
        );

        console.log(
          "===================================="
        );


        /*
         * GỬI VỀ WAT1
         *
         * Wat1 sẽ chuyển sang
         * ChallengeResult.
         */

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
        profile,
        onComplete,
        finished,
      ]
    );


  /* =======================================================
     FINISH LOSE
  ======================================================= */

  const finishLose =
    useCallback(
      (finalScore) => {

        if (finished) {
          return;
        }


        setFinished(true);


        const result = {

          stageId:
            "final",

          result:
            "lose",

          won:
            false,

          score:
            finalScore,

          combo:
            0,

          xp:
            0,

          firstCompletion:
            false,

          replay:
            false,

          wat1Completed:
            false,

          wat2Unlocked:
            false,

          keyObtained:
            false,

        };


        console.log(
          "FINAL STAGE — LOSE",
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
        finished,
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


        setIsLocked(
          true
        );

        setSelectedVoice(
          selected
        );


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


        setCombo(
          0
        );

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


        if (
          key === "o"
        ) {

          handleAnswer(
            "O"
          );

          return;
        }


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
     GAME SCREEN
     
     Không còn RESULT SCREEN ở đây.
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
            CÂU{" "}
            {Math.min(
              round,
              TOTAL_QUESTIONS
            )}{" "}
            /{" "}
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
              Vượt qua 10 câu để{" "}
              {completedBefore
                ? "thử thách lại."
                : "nhận Chìa khóa Ák-Sâ."
              }
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