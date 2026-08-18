import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "./Stage3.css";

import {
  CONSONANTS,
  VOWELS,
  getAlphabetAudioUrl,
} from "../../../../data/alphabetdata";

/* =========================================================
   CONFIG
========================================================= */

const TOTAL_QUESTIONS = 10;
const MAX_LIVES = 3;


/* =========================================================
   NORMALIZE
========================================================= */

function normalizeConsonant(item, index) {
  return {
    ...item,

    id:
      item.id ??
      `C-${index + 1}`,

    type: "consonant",

    khmer:
      item.letter ??
      "",

    roman:
      item.roman ??
      "",

    voice:
      item.voice ??
      "O",
  };
}


function normalizeVowel(item, index) {
  return {
    ...item,

    id:
      item.id ??
      `V-${index + 1}`,

    type: "vowel",

    khmer:
      item.symbol ??
      "",

    romanO:
      item.romanO ??
      "",

    romanOh:
      item.romanOh ??
      "",

    voice:
      item.voice ??
      "O",
  };
}


/* =========================================================
   DATA
========================================================= */

const NORMALIZED_CONSONANTS =
  CONSONANTS.map(
    normalizeConsonant
  );

const NORMALIZED_VOWELS =
  VOWELS.map(
    normalizeVowel
  );

const ALL_CHARACTERS = [
  ...NORMALIZED_CONSONANTS,
  ...NORMALIZED_VOWELS,
];


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
   ROMANIZATION
========================================================= */

function getRoman(item, voice) {
  if (!item) {
    return "";
  }

  if (
    item.type ===
    "consonant"
  ) {
    return item.roman;
  }

  if (
    item.type ===
    "vowel"
  ) {
    return voice === "Ô"
      ? item.romanOh
      : item.romanO;
  }

  return "";
}


/* =========================================================
   AUDIO
========================================================= */

function getItemAudioUrl(item) {
  if (!item) {
    return "";
  }

  if (
    item.type ===
    "consonant"
  ) {
    return getAlphabetAudioUrl(
      item
    );
  }

  if (
    item.type ===
    "vowel"
  ) {
    return getAlphabetAudioUrl(
      item,
      item.voice
    );
  }

  return "";
}


/* =========================================================
   CREATE QUESTION
========================================================= */

function createQuestion(
  usedIds = []
) {
  const available =
    ALL_CHARACTERS.filter(
      (item) =>
        !usedIds.includes(
          item.id
        )
    );

  const source =
    available.length > 0
      ? available
      : ALL_CHARACTERS;

  const base =
    source[
      Math.floor(
        Math.random() *
          source.length
      )
    ];


  /* =======================================================
     NGUYÊN ÂM → RANDOM O / Ô
  ======================================================= */

  const correct =
    base.type === "vowel"
      ? {
          ...base,

          voice:
            Math.random() <
            0.5
              ? "O"
              : "Ô",
        }
      : {
          ...base,
        };


  /* =======================================================
     TẠO ĐÁP ÁN SAI
  ======================================================= */

  const candidates =
    shuffle(
      ALL_CHARACTERS.filter(
        (item) =>
          item.id !==
          correct.id
      )
    );

  const unique = [];

  for (
    const item of candidates
  ) {
    if (
      item.khmer ===
      correct.khmer
    ) {
      continue;
    }

    if (
      unique.some(
        (x) =>
          x.khmer ===
          item.khmer
      )
    ) {
      continue;
    }

    unique.push(item);

    if (
      unique.length >= 3
    ) {
      break;
    }
  }


  const options =
    shuffle([
      {
        ...correct,
        correct: true,
      },

      ...unique.map(
        (item) => ({
          ...item,
          correct: false,
        })
      ),
    ]);


  return {
    correct,
    options,
  };
}


/* =========================================================
   COMPONENT
========================================================= */

export default function Stage3({
  profile,
  onBackToMenu,
  onComplete,
}) {
  const initialGame =
    useMemo(
      () =>
        createQuestion([]),
      []
    );


  const [question, setQuestion] =
    useState(
      initialGame
    );

  const [usedIds, setUsedIds] =
    useState([
      initialGame.correct.id,
    ]);

  const [round, setRound] =
    useState(1);

  const [lives, setLives] =
    useState(
      MAX_LIVES
    );

  const [score, setScore] =
    useState(0);

  const [combo, setCombo] =
    useState(0);

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
     AUDIO
  ======================================================= */

  const audioRef =
    useRef(null);


  const stopAudio =
    useCallback(() => {
      if (
        audioRef.current
      ) {
        audioRef.current.pause();

        audioRef.current.currentTime =
          0;

        audioRef.current =
          null;
      }
    }, []);


  const playCurrentSound =
    useCallback(() => {
      if (
        !question?.correct
      ) {
        return;
      }

      const url =
        getItemAudioUrl(
          question.correct
        );

      if (!url) {
        console.error(
          "Không tìm thấy audio:",
          question.correct
        );

        return;
      }

      stopAudio();

      const audio =
        new Audio(url);

      audio.preload =
        "auto";

      audioRef.current =
        audio;

      audio.onerror = (
        error
      ) => {
        console.error(
          "AUDIO ERROR:",
          url,
          error
        );
      };

      audio.onended = () => {
        if (
          audioRef.current ===
          audio
        ) {
          audioRef.current =
            null;
        }
      };

      audio
        .play()
        .catch(
          (error) => {
            console.error(
              "KHÔNG THỂ PHÁT AUDIO:",
              url,
              error
            );
          }
        );
    }, [
      question,
      stopAudio,
    ]);


  /* =======================================================
     AUTO PLAY
  ======================================================= */

  useEffect(() => {
    if (
      finished ||
      !question?.correct
    ) {
      return;
    }

    const timer =
      window.setTimeout(
        () => {
          playCurrentSound();
        },
        300
      );

    return () => {
      window.clearTimeout(
        timer
      );

      stopAudio();
    };
  }, [
    question,
    finished,
    playCurrentSound,
    stopAudio,
  ]);


  /* =======================================================
     CLEANUP
  ======================================================= */

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [
    stopAudio,
  ]);


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

     QUAN TRỌNG:
     Gọi onComplete để Wat1.jsx nhận kết quả.
  ======================================================= */

  const finishWin =
    useCallback(
      ({
        finalScore,
        finalCombo,
      }) => {
        setFinished(
          true
        );

        setResultType(
          "win"
        );


        /* ================================================
           GỬI KẾT QUẢ VỀ WAT1
        ================================================= */

        if (
          typeof onComplete ===
          "function"
        ) {
          onComplete({
            won: true,

            score:
              finalScore,

            xp:
              finalScore,

            combo:
              finalCombo,

            questions:
              TOTAL_QUESTIONS,
          });
        } else {
          console.error(
            "WAT 1 STAGE 3: onComplete không tồn tại!"
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
      ({
        finalScore,
        finalCombo,
      }) => {
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

            xp: 0,

            combo:
              finalCombo,

            questions:
              TOTAL_QUESTIONS,
          });
        } else {
          console.error(
            "WAT 1 STAGE 3: onComplete không tồn tại!"
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


          window.setTimeout(
            () => {
              if (
                round >=
                TOTAL_QUESTIONS
              ) {
                /*
                  Dùng nextScore thay vì score
                  để không mất điểm câu cuối.
                */

                finishWin({
                  finalScore:
                    nextScore,

                  finalCombo:
                    nextCombo,
                });
              } else {
                nextQuestion();
              }
            },
            650
          );

          return;
        }


        /* =================================================
           SAI
        ================================================= */

        const nextCombo =
          0;

        const nextLives =
          lives - 1;

        const currentScore =
          score;


        setCombo(
          nextCombo
        );

        setLives(
          nextLives
        );


        window.setTimeout(
          () => {
            if (
              nextLives <= 0
            ) {
              finishLose({
                finalScore:
                  currentScore,

                finalCombo:
                  nextCombo,
              });
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


        /* SPACE */
        if (
          event.code ===
          "Space"
        ) {
          event.preventDefault();

          playCurrentSound();

          return;
        }


        /* 1 - 4 */
        const index =
          Number(
            event.key
          ) - 1;

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
    playCurrentSound,
    handleAnswer,
  ]);


  /* =======================================================
     RESULT
  ======================================================= */

  if (finished) {
    return (
      <div className="stage3">

        <div className="stage3__background" />

        <main className="stage3-result">

          {resultType === "win" ? (
            <>

              <div className="stage3-result__symbol">
                ✦
              </div>

              <div className="stage3-result__eyebrow">
                THỬ THÁCH III
              </div>

              <h1>
                THỬ THÁCH HOÀN THÀNH
              </h1>

              <p className="stage3-result__subtitle">
                NGHE & NHẬN DIỆN
              </p>


              <div className="stage3-result__stats">

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


              <div className="stage3-result__unlock">

                <span>
                  🔓
                </span>

                <div>
                  <strong>
                    THỬ THÁCH CUỐI ĐÃ MỞ
                  </strong>

                  <small>
                    Cổng chìa khóa đang chờ bạn.
                  </small>
                </div>

              </div>


              <button
                type="button"
                className="stage3-result__button"
                onClick={
                  onBackToMenu
                }
              >
                TIẾP TỤC
              </button>

            </>
          ) : (
            <>

              <div className="stage3-result__symbol stage3-result__symbol--lose">
                ⚔
              </div>

              <div className="stage3-result__eyebrow">
                THỬ THÁCH III
              </div>

              <h1>
                THỬ THÁCH THẤT BẠI
              </h1>

              <p className="stage3-result__subtitle">
                Hãy nghe thật kỹ và thử lại.
              </p>

              <div className="stage3-result__lose-score">
                ĐIỂM:{" "}
                <strong>
                  {score}
                </strong>
              </div>

              <button
                type="button"
                className="stage3-result__button stage3-result__button--secondary"
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
    <div className="stage3">

      <div className="stage3__background" />


      {/* ===================================================
          TOP BAR
      =================================================== */}

      <header className="stage3__topbar">

        <button
          type="button"
          className="stage3__back"
          onClick={
            onBackToMenu
          }
        >
          ← DANH SÁCH THỬ THÁCH
        </button>


        <div className="stage3__lives">

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
                    ? "stage3__heart stage3__heart--active"
                    : "stage3__heart"
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

      <section className="stage3__header">

        <div className="stage3__eyebrow">
          WAT ÁK-SÂ
        </div>

        <h1>
          THỬ THÁCH III
        </h1>

        <p>
          NGHE & NHẬN DIỆN
        </p>

      </section>


      {/* ===================================================
          PROGRESS
      =================================================== */}

      <section className="stage3__progress">

        <div className="stage3__progress-info">

          <span>
            CÂU {round} / {TOTAL_QUESTIONS}
          </span>

          <span>
            ⭐ {score}
          </span>

        </div>


        <div className="stage3__progress-track">

          <div
            className="stage3__progress-fill"
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

      <main className="stage3__game">

        <section className="stage3__question">

          <div className="stage3__question-label">
            HÃY NGHE VÀ CHỌN KÝ TỰ
          </div>


          <button
            type="button"
            className="stage3__sound"
            onClick={
              playCurrentSound
            }
            disabled={
              isLocked
            }
            aria-label="Phát âm thanh"
          >

            <span className="stage3__sound-icon">
              🔊
            </span>

            <span className="stage3__sound-text">
              NGHE PHÁT ÂM
            </span>

            <span className="stage3__sound-key">
              SPACE
            </span>

          </button>


          <div className="stage3__question-divider">
            ✦
          </div>


          <p className="stage3__hint">
            Hãy nghe thật kỹ âm thanh
            và chọn đúng ký tự Khmer.
          </p>

        </section>


        {/* =================================================
            OPTIONS
        ================================================= */}

        <section className="stage3__answers">

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
                  "stage3-answer--correct";
              }

              if (
                showFeedback &&
                selected &&
                !correct
              ) {
                stateClass =
                  "stage3-answer--wrong";
              }


              return (
                <button
                  type="button"
                  key={
                    `${option.id}-${index}`
                  }
                  className={[
                    "stage3-answer",
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

                  <span className="stage3-answer__number">
                    {index + 1}
                  </span>


                  <span className="stage3-answer__khmer">
                    {option.khmer}
                  </span>


                  <span className="stage3-answer__roman">

                    {option.type ===
                    "vowel"
                      ? getRoman(
                          option,
                          question.correct.voice
                        )
                      : option.roman}

                  </span>


                  {showFeedback &&
                    correct && (
                      <span className="stage3-answer__mark">
                        ✓
                      </span>
                    )}


                  {showFeedback &&
                    selected &&
                    !correct && (
                      <span className="stage3-answer__mark">
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
              "stage3__feedback",

              isCorrect
                ? "stage3__feedback--correct"
                : "stage3__feedback--wrong",
            ].join(" ")}
          >

            {isCorrect
              ? "✓ CHÍNH XÁC"
              : `✕ SAI — ĐÁP ÁN ĐÚNG: ${question.correct.khmer}`}

          </div>
        )}

      </main>


      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer className="stage3__footer">

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
          57 KÝ TỰ KHMER
        </span>

      </footer>

    </div>
  );
}