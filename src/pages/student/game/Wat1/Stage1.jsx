import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import "./Stage1.css";

import { CONSONANTS } from "../../../../data/alphabetdata";

/* =========================================================
   WAT 1 — THỬ THÁCH I

   NHÌN CHỮ KHMER
        ↓
   CHỌN PHIÊN ÂM

   LUẬT:
   - 33 phụ âm Khmer
   - 10 câu / lượt
   - 3 mạng
   - Mỗi câu lấy 1 phụ âm
   - Không lặp phụ âm trong cùng một lượt
   - Trộn Giọng O + Giọng Ô
   - Đúng → sang câu tiếp
   - Sai → mất 1 mạng → sang câu tiếp
   - Hết 10 câu → THẮNG
   - Hết 3 mạng → THUA
========================================================= */

const TOTAL_QUESTIONS = 10;
const MAX_LIVES = 3;

/* =========================================================
   NORMALIZE CONSONANTS
========================================================= */

function normalizeConsonant(item, index) {
  return {
    ...item,

    id:
      item?.id ??
      item?.uid ??
      `consonant-${index + 1}`,

    khmer:
      item?.khmer ??
      item?.char ??
      item?.character ??
      item?.letter ??
      "",

    roman:
      item?.roman ??
      item?.romanization ??
      item?.transcription ??
      "",
  };
}

/* =========================================================
   DATA
========================================================= */

const NORMALIZED_CONSONANTS = Array.isArray(
  CONSONANTS
)
  ? CONSONANTS
      .map(normalizeConsonant)
      .filter(
        (item) =>
          item.khmer &&
          item.roman
      )
  : [];

/* =========================================================
   DEBUG
========================================================= */

console.log(
  "WAT 1 — Số phụ âm:",
  NORMALIZED_CONSONANTS.length
);

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
   CREATE QUESTION
========================================================= */

function createQuestion(usedIds) {
  /*
   * Nếu data lỗi thì không crash React.
   */
  if (
    NORMALIZED_CONSONANTS.length < 4
  ) {
    console.error(
      "Stage1 cần ít nhất 4 phụ âm.",
      NORMALIZED_CONSONANTS
    );

    return null;
  }

  /*
   * Lọc những chữ chưa xuất hiện.
   */
  let available =
    NORMALIZED_CONSONANTS.filter(
      (item) =>
        !usedIds.includes(item.id)
    );

  /*
   * Nếu đã dùng hết 33 chữ,
   * cho phép bắt đầu lại.
   */
  if (available.length === 0) {
    available =
      NORMALIZED_CONSONANTS;
  }

  /*
   * Chọn đáp án đúng.
   */
  const correct =
    available[
      Math.floor(
        Math.random() *
          available.length
      )
    ];

  /*
   * Lấy đáp án sai.
   *
   * KHÔNG lọc Giọng O / Ô.
   *
   * Vì Stage1 phải trộn:
   * Cô / Khô / Rô / Nô...
   * và cả các âm thuộc Giọng Ô.
   */
  const wrongAnswers =
    shuffle(
      NORMALIZED_CONSONANTS.filter(
        (item) =>
          item.id !== correct.id
      )
    ).slice(0, 3);

  /*
   * Đảm bảo luôn có 4 đáp án.
   */
  if (
    wrongAnswers.length < 3
  ) {
    console.error(
      "Không đủ đáp án sai."
    );

    return null;
  }

  /*
   * Trộn vị trí đáp án.
   */
  const options = shuffle([
    correct,
    ...wrongAnswers,
  ]);

  return {
    correct,
    options,
  };
}

/* =========================================================
   INITIAL GAME
========================================================= */

function createInitialGame() {
  const first =
    createQuestion([]);

  if (!first) {
    return {
      question: null,
      usedIds: [],
    };
  }

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

export default function Stage1({
  profile,
  onBackToMenu,
  onComplete,
}) {
  /* =======================================================
     INITIAL
  ======================================================= */

  const initialGame =
    createInitialGame();

  const [question, setQuestion] =
    useState(
      initialGame.question
    );

  const [usedIds, setUsedIds] =
    useState(
      initialGame.usedIds
    );

  const [round, setRound] =
    useState(1);

  const [lives, setLives] =
    useState(MAX_LIVES);

  const [score, setScore] =
    useState(0);

  const [combo, setCombo] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState(null);

  const [isCorrect, setIsCorrect] =
    useState(null);

  const [isLocked, setIsLocked] =
    useState(false);

  const [showFeedback, setShowFeedback] =
    useState(false);

  const [finished, setFinished] =
    useState(false);

  const [hasSubmittedResult, setHasSubmittedResult] =
    useState(false);

  /* =======================================================
     NEXT QUESTION

     QUAN TRỌNG:

     KHÔNG setQuestion bên trong setUsedIds.

     Tạo câu trước.
     Sau đó cập nhật từng state riêng.
  ======================================================= */

  const nextQuestion = useCallback(() => {
    const next =
      createQuestion(
        usedIds
      );

    /*
     * Bảo vệ tuyệt đối.
     */
    if (!next) {
      console.error(
        "Không thể tạo câu hỏi tiếp theo."
      );

      return;
    }

    /*
     * Câu hỏi mới.
     */
    setQuestion(
      next
    );

    /*
     * Đánh dấu phụ âm đã sử dụng.
     */
    setUsedIds(
      (previous) => [
        ...previous,
        next.correct.id,
      ]
    );

    /*
     * Reset trạng thái câu.
     */
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowFeedback(false);
    setIsLocked(false);

    /*
     * Sang câu tiếp.
     */
    setRound(
      (previous) =>
        previous + 1
    );
  }, [usedIds]);

  /* =======================================================
     FINISH
  ======================================================= */

  const finishGame = useCallback(
    ({
      won,
      finalScore,
      finalCombo,
      finalRound,
    }) => {
      /*
       * Không submit 2 lần.
       */
      if (
        hasSubmittedResult
      ) {
        return;
      }

      setHasSubmittedResult(
        true
      );

      setFinished(true);

      console.log(
        "STAGE 1 FINISH:",
        {
          won,
          score: finalScore,
          combo: finalCombo,
          questions:
            finalRound,
        }
      );

      /*
       * Trả kết quả về Wat1.jsx.
       */
      if (
        typeof onComplete ===
        "function"
      ) {
        onComplete({
          won,

          score:
            finalScore,

          xp:
            won
              ? finalScore
              : 0,

          combo:
            finalCombo,

          questions:
            finalRound,
        });
      }
    },
    [
      hasSubmittedResult,
      onComplete,
    ]
  );

  /* =======================================================
     ANSWER
  ======================================================= */

  const handleAnswer =
    useCallback(
      (answer) => {
        /*
         * Không cho click khi:
         * - đang khóa
         * - đã kết thúc
         * - không có question
         */
        if (
          isLocked ||
          finished ||
          !question ||
          !answer
        ) {
          return;
        }

        /*
         * Khóa đáp án.
         */
        setIsLocked(true);

        setSelectedAnswer(
          answer
        );

        /*
         * Kiểm tra đúng / sai.
         */
        const correct =
          answer.id ===
          question.correct.id;

        setIsCorrect(
          correct
        );

        setShowFeedback(
          true
        );

        /* =================================================
           ĐÚNG
        ================================================= */

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
            score + gained;

          setCombo(
            nextCombo
          );

          setScore(
            nextScore
          );

          window.setTimeout(() => {
            /*
             * Đã đủ 10 câu.
             */
            if (
              round >=
              TOTAL_QUESTIONS
            ) {
              finishGame({
                won: true,

                finalScore:
                  nextScore,

                finalCombo:
                  nextCombo,

                finalRound:
                  TOTAL_QUESTIONS,
              });

              return;
            }

            /*
             * Chưa đủ 10 câu.
             */
            nextQuestion();
          }, 650);

          return;
        }

        /* =================================================
           SAI
        ================================================= */

        const nextLives =
          lives - 1;

        setLives(
          nextLives
        );

        setCombo(0);

        window.setTimeout(() => {
          /*
           * Hết mạng.
           */
          if (
            nextLives <= 0
          ) {
            finishGame({
              won: false,

              finalScore:
                score,

              finalCombo: 0,

              finalRound:
                round,
            });

            return;
          }

          /*
           * Còn mạng.
           * Sang câu mới.
           */
          nextQuestion();
        }, 850);
      },
      [
        isLocked,
        finished,
        question,
        combo,
        score,
        round,
        lives,
        finishGame,
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
          finished ||
          !question
        ) {
          return;
        }

        const index =
          Number(event.key) - 1;

        if (
          index >= 0 &&
          index < 4
        ) {
          const option =
            question.options[
              index
            ];

          if (option) {
            handleAnswer(
              option
            );
          }
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
     NO DATA
  ======================================================= */

  if (!question) {
    return (
      <div className="stage1">
        <div className="stage1__background" />

        <main className="stage1__game">
          <h2>
            Không thể tải dữ liệu
            phụ âm Khmer.
          </h2>

          <p>
            Kiểm tra lại
            alphabetdata.js
          </p>

          <button
            type="button"
            onClick={
              onBackToMenu
            }
          >
            ← QUAY LẠI DANH SÁCH
          </button>
        </main>
      </div>
    );
  }

  /* =======================================================
     GAME SCREEN
  ======================================================= */

  return (
    <div className="stage1">
      <div className="stage1__background" />

      {/* =================================================
          TOP BAR
      ================================================= */}

      <header className="stage1__topbar">
        <button
          type="button"
          className="stage1__back"
          onClick={
            onBackToMenu
          }
        >
          ← DANH SÁCH THỬ THÁCH
        </button>

        <div className="stage1__lives">
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
                    ? "stage1__heart stage1__heart--active"
                    : "stage1__heart"
                }
              >
                ♥
              </span>
            )
          )}
        </div>
      </header>

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="stage1__header">
        <div className="stage1__eyebrow">
          WAT ÁK-SÂ
        </div>

        <h1>
          THỬ THÁCH I
        </h1>

        <p>
          PHỤ ÂM & PHIÊN ÂM
        </p>
      </section>

      {/* =================================================
          PROGRESS
      ================================================= */}

      <section className="stage1__progress">
        <div className="stage1__progress-info">
          <span>
            CÂU {round} /{" "}
            {TOTAL_QUESTIONS}
          </span>

          <span>
            ⭐ {score}
          </span>
        </div>

        <div className="stage1__progress-track">
          <div
            className="stage1__progress-fill"
            style={{
              width: `${Math.min(
                ((round - 1) /
                  TOTAL_QUESTIONS) *
                  100,
                100
              )}%`,
            }}
          />
        </div>
      </section>

      {/* =================================================
          QUESTION
      ================================================= */}

      <main className="stage1__game">
        <section className="stage1__question">
          <div className="stage1__question-label">
            KÝ TỰ NÀY CÓ PHIÊN ÂM GÌ?
          </div>

          <div className="stage1__khmer">
            {question.correct.khmer}
          </div>

          <p className="stage1__hint">
            Hãy nhìn kỹ phụ âm Khmer
            và chọn phiên âm chính xác.
          </p>
        </section>

        {/* =================================================
            ANSWERS
        ================================================= */}

        <section className="stage1__answers">
          {question.options.map(
            (option, index) => {
              const selected =
                selectedAnswer?.id ===
                option.id;

              const correct =
                option.id ===
                question.correct.id;

              let stateClass =
                "";

              if (
                showFeedback &&
                correct
              ) {
                stateClass =
                  "stage1-answer--correct";
              }

              if (
                showFeedback &&
                selected &&
                !correct
              ) {
                stateClass =
                  "stage1-answer--wrong";
              }

              return (
                <button
                  type="button"
                  key={
                    option.id
                  }
                  className={[
                    "stage1-answer",
                    stateClass,
                  ]
                    .filter(Boolean)
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
                  <span className="stage1-answer__number">
                    {index + 1}
                  </span>

                  <span className="stage1-answer__text">
                    {option.roman}
                  </span>

                  {showFeedback &&
                    correct && (
                      <span className="stage1-answer__mark">
                        ✓
                      </span>
                    )}

                  {showFeedback &&
                    selected &&
                    !correct && (
                      <span className="stage1-answer__mark">
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
              "stage1__feedback",
              isCorrect
                ? "stage1__feedback--correct"
                : "stage1__feedback--wrong",
            ].join(" ")}
          >
            {isCorrect
              ? "✓ CHÍNH XÁC"
              : `✕ SAI — ĐÁP ÁN ĐÚNG: ${question.correct.roman}`}
          </div>
        )}
      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="stage1__footer">
        <span>
          COMBO
        </span>

        <strong>
          🔥 {combo}
        </strong>

        <span>•</span>

        <span>
          33 PHỤ ÂM KHMER
        </span>
      </footer>
    </div>
  );
}