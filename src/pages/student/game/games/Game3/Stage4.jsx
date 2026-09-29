import React, {
  useEffect,
  useState,
} from "react";

import StageResult from "../../components/StageResult";

import {
  isStageCompleted,
  startStage,
  recordStagePlay,
  recordStageScore,
  completeStage,
  hasClaimedGameExp,
  hasClaimedBadge,
  claimGameExp,
  claimBadge,
} from "../../data/gameProgress";

import {
  stage4Data,
} from "./data/stage4Data";

import "../../shared/GameStage.css";
import "./Stage4.css";


/* =========================================================
   GAME 3 — STAGE 4

   PHIÊN ÂM
        ↓
   PHỤ ÂM
        ↓
   CHÂN CHỮ
        ↓
   NGUYÊN ÂM
        ↓
   GHÉP CHỮ KHMER

   NHẤN ĐẾN ĐÂU → GHÉP ĐẾN ĐÓ
========================================================= */


const GAME_ID = 3;
const STAGE_ID = 4;

const MAX_ATTEMPTS = 3;
const TOTAL_QUESTIONS = 10;
const BASE_SCORE = 10;


const SESSION_KEY =
  `game_${GAME_ID}_stage_${STAGE_ID}_session`;


/* =========================================================
   SOUND
========================================================= */

const SOUND_CORRECT =
  "/audio/games/correct.mp3";

const SOUND_WRONG =
  "/audio/games/wrong.mp3";

const SOUND_STAGE_COMPLETE =
  "/audio/games/stage-complete.mp3";

const SOUND_STAGE_FAIL =
  "/audio/games/stage-fail.mp3";


const playSound = (
  src
) => {

  try {

    const audio =
      new Audio(src);

    audio.currentTime = 0;
    audio.volume = 0.9;

    audio
      .play()
      .catch(() => {});

  } catch {
    /* Không làm game lỗi */
  }
};


/* =========================================================
   SHUFFLE
========================================================= */

const shuffle = (
  array
) => {

  const result =
    [...array];

  for (
    let i = result.length - 1;
    i > 0;
    i -= 1
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
};


/* =========================================================
   10 CÂU
========================================================= */

const createQuestionOrder =
  () => {

    return shuffle(
      stage4Data.map(
        (_, index) =>
          index
      )
    ).slice(
      0,
      Math.min(
        TOTAL_QUESTIONS,
        stage4Data.length
      )
    );
  };


/* =========================================================
   OPTION HELPERS
========================================================= */

const createConsonantOptions = (
  correct
) => {

  const all = [
    ...new Set(
      stage4Data.map(
        (item) =>
          item.consonant
      )
    ),
  ];

  const others =
    all.filter(
      (item) =>
        item !== correct
    );

  return shuffle([
    correct,
    ...shuffle(
      others
    ).slice(0, 3),
  ]);
};


const createSubscriptOptions = (
  correct
) => {

  const all = [
    ...new Set(
      stage4Data.map(
        (item) =>
          item.subscript
      )
    ),
  ];

  const others =
    all.filter(
      (item) =>
        item !== correct
    );

  return shuffle([
    correct,
    ...shuffle(
      others
    ).slice(0, 3),
  ]);
};


const createVowelOptions = (
  correct
) => {

  const all = [
    ...new Set(
      stage4Data.map(
        (item) =>
          item.vowel
      )
    ),
  ];

  const others =
    all.filter(
      (item) =>
        item !== correct
    );

  return shuffle([
    correct,
    ...shuffle(
      others
    ).slice(0, 3),
  ]);
};


/* =========================================================
   SESSION
========================================================= */

const getSavedSession =
  () => {

    try {

      const saved =
        sessionStorage.getItem(
          SESSION_KEY
        );

      if (!saved) {
        return null;
      }


      const parsed =
        JSON.parse(
          saved
        );


      if (
        !parsed ||
        !Array.isArray(
          parsed.questionOrder
        )
      ) {
        return null;
      }


      /*
       * Session cũ không đúng cấu trúc
       * thì tạo lại.
       */

      if (
        parsed.questionOrder.length <
        Math.min(
          TOTAL_QUESTIONS,
          stage4Data.length
        )
      ) {
        return null;
      }


      return parsed;

    } catch {

      return null;
    }
  };


const createNewSession =
  () => {

    const questionOrder =
      createQuestionOrder();


    const firstQuestion =
      stage4Data[
        questionOrder[0]
      ];


    const session = {

      attemptsLeft:
        MAX_ATTEMPTS,

      score:
        0,

      combo:
        0,

      questionIndex:
        0,

      questionOrder,

      selectedConsonant:
        null,

      selectedSubscript:
        null,

      selectedVowel:
        null,

      answerState:
        null,

      answered:
        false,

      buildVersion:
        0,

      consonantOptions:
        firstQuestion
          ? createConsonantOptions(
              firstQuestion.consonant
            )
          : [],

      subscriptOptions:
        firstQuestion
          ? createSubscriptOptions(
              firstQuestion.subscript
            )
          : [],

      vowelOptions:
        firstQuestion
          ? createVowelOptions(
              firstQuestion.vowel
            )
          : [],
    };


    try {

      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify(
          session
        )
      );

    } catch {
      /* Không làm game lỗi */
    }


    return session;
  };


const saveSession = (
  data
) => {

  try {

    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify(
        data
      )
    );

  } catch {
    /* Không làm game lỗi */
  }
};


const clearSession = () => {

  try {

    sessionStorage.removeItem(
      SESSION_KEY
    );

  } catch {
    /* Không làm game lỗi */
  }
};


/* =========================================================
   STAGE 4
========================================================= */

const Stage4 = ({
  navigate,
}) => {

  const stage3Completed =
    isStageCompleted(
      GAME_ID,
      3
    );


  const [
    session,
    setSession,
  ] = useState(
    () =>
      getSavedSession() ||
      createNewSession()
  );


  const attemptsLeft =
    session.attemptsLeft;

  const score =
    session.score;

  const combo =
    session.combo;

  const questionIndex =
    session.questionIndex;


  const selectedConsonant =
    session.selectedConsonant;

  const selectedSubscript =
    session.selectedSubscript;

  const selectedVowel =
    session.selectedVowel;


  const answerState =
    session.answerState;

  const answered =
    session.answered;


  const [
    result,
    setResult,
  ] = useState(null);

  const [
    isFirstWin,
    setIsFirstWin,
  ] = useState(false);

  const [
    rewardClaimed,
    setRewardClaimed,
  ] = useState(false);


  const currentQuestion =
    stage4Data[
      session.questionOrder[
        questionIndex
      ]
    ];


  const consonantOptions =
    session.consonantOptions;

  const subscriptOptions =
    session.subscriptOptions;

  const vowelOptions =
    session.vowelOptions;


  const currentCombined =
    `${selectedConsonant || ""}${
      selectedSubscript || ""
    }${
      selectedVowel || ""
    }`;


  /* =======================================================
     START
  ======================================================= */

  useEffect(() => {

    if (!stage3Completed) {

      navigate(
        "/game/3"
      );

      return;
    }


    startStage(
      GAME_ID,
      STAGE_ID
    );

  }, [
    stage3Completed,
    navigate,
  ]);


  /* =======================================================
     SAVE SESSION
  ======================================================= */

  useEffect(() => {

    saveSession(
      session
    );

  }, [
    session,
  ]);


  /* =======================================================
     WIN
  ======================================================= */

  const handleWin = (
    finalScore
  ) => {

    playSound(
      SOUND_STAGE_COMPLETE
    );


    recordStagePlay(
      GAME_ID,
      STAGE_ID
    );


    recordStageScore(
      GAME_ID,
      STAGE_ID,
      finalScore
    );


    const completed =
      completeStage(
        GAME_ID,
        STAGE_ID
      );


    const firstWin =
      completed.isFirstWin;


    setIsFirstWin(
      firstWin
    );


    /* =====================================================
       EXP + BADGE
    ===================================================== */

    if (firstWin) {

      if (
        !hasClaimedGameExp(
          GAME_ID
        )
      ) {

        claimGameExp(
          GAME_ID
        );
      }


      if (
        !hasClaimedBadge(
          GAME_ID
        )
      ) {

        claimBadge(
          GAME_ID
        );
      }


      setRewardClaimed(
        false
      );

    } else {

      setRewardClaimed(
        true
      );
    }


    setSession(
      (current) => ({

        ...current,

        score:
          finalScore,

      })
    );


    setResult(
      "win"
    );


    clearSession();
  };


  /* =======================================================
     LOSE
  ======================================================= */

  const handleLose = (
    finalScore
  ) => {

    playSound(
      SOUND_STAGE_FAIL
    );


    recordStagePlay(
      GAME_ID,
      STAGE_ID
    );


    recordStageScore(
      GAME_ID,
      STAGE_ID,
      finalScore
    );


    setResult(
      "lose"
    );


    clearSession();
  };


  /* =======================================================
     NEXT QUESTION
     CHỈ DÙNG KHI TRẢ LỜI ĐÚNG
  ======================================================= */

  const goToNextQuestion = (
    currentSession
  ) => {

    const nextIndex =
      currentSession.questionIndex +
      1;


    const nextQuestion =
      stage4Data[
        currentSession
          .questionOrder[
            nextIndex
          ]
      ];


    if (!nextQuestion) {
      return;
    }


    const nextSession = {

      ...currentSession,

      questionIndex:
        nextIndex,

      selectedConsonant:
        null,

      selectedSubscript:
        null,

      selectedVowel:
        null,

      answerState:
        null,

      answered:
        false,

      buildVersion:
        (
          currentSession
            .buildVersion ||
          0
        ) + 1,

      consonantOptions:
        createConsonantOptions(
          nextQuestion.consonant
        ),

      subscriptOptions:
        createSubscriptOptions(
          nextQuestion.subscript
        ),

      vowelOptions:
        createVowelOptions(
          nextQuestion.vowel
        ),
    };


    setSession(
      nextSession
    );
  };


  /* =======================================================
     THAY CÂU NHƯNG KHÔNG TĂNG CÂU
  ======================================================= */

  const replaceCurrentQuestion = (
    currentSession
  ) => {

    const currentOrderIndex =
      currentSession
        .questionOrder[
          currentSession
            .questionIndex
        ];


    const usedIndexes =
      currentSession
        .questionOrder;


    let candidates =
      stage4Data
        .map(
          (_, index) =>
            index
        )
        .filter(
          (index) =>
            !usedIndexes.includes(
              index
            )
        );


    /*
     * Hết câu chưa dùng:
     * lấy một câu khác câu hiện tại.
     */

    if (
      candidates.length === 0
    ) {

      candidates =
        stage4Data
          .map(
            (_, index) =>
              index
          )
          .filter(
            (index) =>
              index !==
              currentOrderIndex
          );
    }


    if (
      candidates.length === 0
    ) {
      return;
    }


    const newDataIndex =
      shuffle(
        candidates
      )[0];


    const newQuestion =
      stage4Data[
        newDataIndex
      ];


    const newOrder =
      [
        ...currentSession
          .questionOrder,
      ];


    newOrder[
      currentSession
        .questionIndex
    ] =
      newDataIndex;


    const newSession = {

      ...currentSession,

      questionOrder:
        newOrder,

      selectedConsonant:
        null,

      selectedSubscript:
        null,

      selectedVowel:
        null,

      answerState:
        null,

      answered:
        false,

      buildVersion:
        (
          currentSession
            .buildVersion ||
          0
        ) + 1,

      consonantOptions:
        createConsonantOptions(
          newQuestion.consonant
        ),

      subscriptOptions:
        createSubscriptOptions(
          newQuestion.subscript
        ),

      vowelOptions:
        createVowelOptions(
          newQuestion.vowel
        ),
    };


    setSession(
      newSession
    );
  };


  /* =======================================================
     CHECK
  ======================================================= */

  const handleCheckAnswer = (
    consonant,
    subscript,
    vowel
  ) => {

    if (
      session.answered ||
      !currentQuestion
    ) {
      return;
    }


    const combined =
      consonant +
      subscript +
      vowel;


    const isCorrect =
      combined ===
      currentQuestion.combined;


    const checkedSession = {

      ...session,

      selectedConsonant:
        consonant,

      selectedSubscript:
        subscript,

      selectedVowel:
        vowel,

      answerState:
        isCorrect
          ? "correct"
          : "wrong",

      answered:
        true,

      buildVersion:
        (
          session.buildVersion ||
          0
        ) + 1,
    };


    /* =====================================================
       CORRECT
    ===================================================== */

    if (isCorrect) {

      const nextCombo =
        session.combo + 1;


      const gainedScore =
        nextCombo *
        BASE_SCORE;


      const newScore =
        session.score +
        gainedScore;


      const newSession = {

        ...checkedSession,

        combo:
          nextCombo,

        score:
          newScore,
      };


      setSession(
        newSession
      );


      playSound(
        SOUND_CORRECT
      );


      window.setTimeout(
        () => {

          if (
            questionIndex >=
            TOTAL_QUESTIONS - 1
          ) {

            handleWin(
              newScore
            );

            return;
          }


          goToNextQuestion(
            newSession
          );

        },
        650
      );


      return;
    }


    /* =====================================================
       WRONG
    ===================================================== */

    playSound(
      SOUND_WRONG
    );


    const newAttemptsLeft =
      session.attemptsLeft -
      1;


    const wrongSession = {

      ...checkedSession,

      attemptsLeft:
        newAttemptsLeft,

      combo:
        0,
    };


    setSession(
      wrongSession
    );


    window.setTimeout(
      () => {

        if (
          newAttemptsLeft <= 0
        ) {

          handleLose(
            session.score
          );

          return;
        }


        /*
         * SAI:
         * KHÔNG tăng questionIndex.
         * Đổi câu tại cùng vị trí.
         */

        replaceCurrentQuestion(
          wrongSession
        );

      },
      650
    );
  };


  /* =======================================================
     SELECT CONSONANT
  ======================================================= */

  const handleSelectConsonant = (
    consonant
  ) => {

    if (
      session.answered ||
      session.answerState
    ) {
      return;
    }


    setSession(
      (current) => ({

        ...current,

        selectedConsonant:
          consonant,

        selectedSubscript:
          null,

        selectedVowel:
          null,

        buildVersion:
          (
            current.buildVersion ||
            0
          ) + 1,

      })
    );
  };


  /* =======================================================
     SELECT SUBSCRIPT
  ======================================================= */

  const handleSelectSubscript = (
    subscript
  ) => {

    if (
      session.answered ||
      session.answerState ||
      !session.selectedConsonant
    ) {
      return;
    }


    setSession(
      (current) => ({

        ...current,

        selectedSubscript:
          subscript,

        selectedVowel:
          null,

        buildVersion:
          (
            current.buildVersion ||
            0
          ) + 1,

      })
    );
  };


  /* =======================================================
     SELECT VOWEL
  ======================================================= */

  const handleSelectVowel = (
    vowel
  ) => {

    if (
      session.answered ||
      session.answerState ||
      !session.selectedConsonant ||
      !session.selectedSubscript
    ) {
      return;
    }


    handleCheckAnswer(
      session.selectedConsonant,
      session.selectedSubscript,
      vowel
    );
  };


  /* =======================================================
     RETRY
  ======================================================= */

  const handleRetry = () => {

    clearSession();


    const newSession =
      createNewSession();


    setSession(
      newSession
    );


    setResult(
      null
    );


    setIsFirstWin(
      false
    );


    setRewardClaimed(
      false
    );


    startStage(
      GAME_ID,
      STAGE_ID
    );
  };


  /* =======================================================
     BACK
  ======================================================= */

  const handleBackToStageList =
    () => {

      clearSession();

      navigate(
        "/game/3"
      );
    };


  /* =======================================================
     COMPLETE GAME
  ======================================================= */

  const handleComplete = () => {

    navigate(
      "/game"
    );
  };


  if (!stage3Completed) {
    return null;
  }


  /* =======================================================
     RESULT
  ======================================================= */

  if (result) {

    return (

      <div className="game-stage-page game-stage-4">

        <main className="game-stage-content">

          <StageResult
            gameId={
              GAME_ID
            }

            result={
              result
            }

            stageId={
              STAGE_ID
            }

            isFirstWin={
              isFirstWin
            }

            isFinalStage={
              true
            }

            rewardClaimed={
              rewardClaimed
            }

            onRetry={
              handleRetry
            }

            onComplete={
              handleComplete
            }

            onBack={
              handleBackToStageList
            }
          />

        </main>

      </div>
    );
  }


  if (!currentQuestion) {
    return null;
  }


  /* =======================================================
     UI
  ======================================================= */

  return (

    <div className="game-stage-page game-stage-4 game3-stage4">

      <header className="game-stage-header">

        <button
          type="button"
          onClick={
            handleBackToStageList
          }
        >
          ← DANH SÁCH STAGE
        </button>

      </header>


      <main className="game-stage-content">

        <div className="game-stage-icon">
          🎮
        </div>

        <div className="game-stage-khmer">
          ហ្គេម ៣
        </div>

        <h1>
          STAGE 4
        </h1>

        <p>
          PHIÊN ÂM → GHÉP CHỮ KHMER
        </p>


        <div className="stage-play-info">

          <strong>
            LƯỢT CHƠI CÒN LẠI:{" "}
            {attemptsLeft}/
            {MAX_ATTEMPTS}
          </strong>

          <span>
            CÂU{" "}
            {questionIndex + 1}
            {" / "}
            {TOTAL_QUESTIONS}
          </span>

          <span>
            ĐIỂM:{" "}
            {score}
          </span>

          <span>
            COMBO:{" "}
            {combo}
          </span>

        </div>


        <section className="stage4-game">

          <div className="stage4-question">

            <div className="stage4-question-label">
              CHO PHIÊN ÂM
            </div>

            <div className="stage4-roman">
              {currentQuestion.roman}
            </div>

            <div className="stage4-instruction">
              Hãy chọn phụ âm, chân chữ và nguyên âm
              để tạo thành chữ Khmer tương ứng.
            </div>

          </div>


          {/* =================================================
              CHỮ ĐÃ GHÉP
          ================================================= */}

          <div className="stage4-build-area">

            <div className="stage4-build-label">
              CHỮ ĐÃ GHÉP
            </div>

            <div
              key={
                session.buildVersion
              }

              className={`stage4-combined stage4-build-pop ${
                answerState
                  ? `stage4-combined-${answerState}`
                  : ""
              }`}

              lang="km"
            >
              {currentCombined || "?"}
            </div>

          </div>


          {/* =================================================
              3 CỘT
          ================================================= */}

          <div className="stage4-columns">


            {/* PHỤ ÂM */}

            <div className="stage4-column">

              <div className="stage4-column-title">
                PHỤ ÂM
              </div>

              <div className="stage4-vertical-options">

                {consonantOptions.map(
                  (
                    consonant,
                    index
                  ) => {

                    const selected =
                      selectedConsonant ===
                      consonant;

                    return (

                      <button
                        key={
                          `${consonant}-${index}`
                        }

                        type="button"

                        className={`stage4-option ${
                          selected
                            ? "selected"
                            : ""
                        }`}

                        disabled={
                          answered
                        }

                        onClick={() =>
                          handleSelectConsonant(
                            consonant
                          )
                        }

                        lang="km"
                      >
                        {consonant}
                      </button>

                    );
                  }
                )}

              </div>

            </div>


            {/* CHÂN CHỮ */}

            <div className="stage4-column">

              <div className="stage4-column-title">
                CHÂN CHỮ
              </div>

              <div className="stage4-vertical-options">

                {subscriptOptions.map(
                  (
                    subscript,
                    index
                  ) => {

                    const selected =
                      selectedSubscript ===
                      subscript;

                    return (

                      <button
                        key={
                          `${subscript}-${index}`
                        }

                        type="button"

                        className={`stage4-option ${
                          selected
                            ? "selected"
                            : ""
                        }`}

                        disabled={
                          answered ||
                          !selectedConsonant
                        }

                        onClick={() =>
                          handleSelectSubscript(
                            subscript
                          )
                        }

                        lang="km"
                      >

                        <span className="stage4-subscript">
                          {subscript}
                        </span>

                      </button>

                    );
                  }
                )}

              </div>

            </div>


            {/* NGUYÊN ÂM */}

            <div className="stage4-column">

              <div className="stage4-column-title">
                NGUYÊN ÂM
              </div>

              <div className="stage4-vertical-options">

                {vowelOptions.map(
                  (
                    vowel,
                    index
                  ) => {

                    const selected =
                      selectedVowel ===
                      vowel;

                    return (

                      <button
                        key={
                          `${vowel}-${index}`
                        }

                        type="button"

                        className={`stage4-option ${
                          selected
                            ? "selected"
                            : ""
                        }`}

                        disabled={
                          answered ||
                          !selectedConsonant ||
                          !selectedSubscript
                        }

                        onClick={() =>
                          handleSelectVowel(
                            vowel
                          )
                        }

                        lang="km"
                      >

                        <span className="stage4-vowel">
                          {vowel}
                        </span>

                      </button>

                    );
                  }
                )}

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
};


export default Stage4;