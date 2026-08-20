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

import { stage4Data } from "./data/stage4Data";

import "../../shared/GameStage.css";
import "./Stage4.css";

/* =========================================================
   CẤU HÌNH
========================================================= */

const GAME_ID = 2;
const STAGE_ID = 4;

const MAX_ATTEMPTS = 3;
const TOTAL_QUESTIONS = 10;
const BASE_SCORE = 10;

/* =========================================================
   SESSION STORAGE
========================================================= */

const SESSION_KEY =
  `game_${GAME_ID}_stage_${STAGE_ID}_session`;

/* =========================================================
   ÂM THANH
========================================================= */

const SOUND_CORRECT =
  "/audio/games/correct.mp3";

const SOUND_WRONG =
  "/audio/games/wrong.mp3";

const SOUND_STAGE_COMPLETE =
  "/audio/games/stage-complete.mp3";

const SOUND_STAGE_FAIL =
  "/audio/games/stage-fail.mp3";

/* =========================================================
   PHÁT ÂM THANH
========================================================= */

const playSound = (src) => {
  try {
    const audio = new Audio(src);

    audio.currentTime = 0;
    audio.volume = 0.9;

    audio.play().catch(() => {});
  } catch {
    /* Không làm game lỗi */
  }
};

/* =========================================================
   TRỘN MẢNG
========================================================= */

const shuffle = (array) => {
  const result = [...array];

  for (
    let i = result.length - 1;
    i > 0;
    i--
  ) {
    const j = Math.floor(
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
};

/* =========================================================
   TẠO NGÂN HÀNG CÂU HỎI

   Toàn bộ stage4Data được xáo trộn.

   Mỗi lượt chơi mới:
   → thứ tự câu hỏi khác nhau.
========================================================= */

const createQuestionOrder = () => {
  return shuffle(
    stage4Data.map(
      (_, index) => index
    )
  );
};

/* =========================================================
   TẠO 4 PHỤ ÂM
========================================================= */

const createConsonantOptions = (
  correct,
  data
) => {
  const all = [
    ...new Set(
      data.map(
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

/* =========================================================
   TẠO 4 NGUYÊN ÂM
========================================================= */

const createVowelOptions = (
  correct,
  data
) => {
  const all = [
    ...new Set(
      data.map(
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
   ĐỌC SESSION
========================================================= */

const getSavedSession = () => {
  try {
    const saved =
      sessionStorage.getItem(
        SESSION_KEY
      );

    if (!saved) {
      return null;
    }

    const parsed =
      JSON.parse(saved);

    if (
      !parsed ||
      !Array.isArray(
        parsed.questionOrder
      )
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

/* =========================================================
   TẠO SESSION MỚI
========================================================= */

const createNewSession = () => {
  const questionOrder =
    createQuestionOrder();

  const firstQuestion =
    stage4Data[
      questionOrder[0]
    ];

  const session = {
    attemptsLeft:
      MAX_ATTEMPTS,

    score: 0,

    combo: 0,

    questionIndex: 0,

    questionOrder,

    selectedConsonant:
      null,

    selectedVowel:
      null,

    answerState:
      null,

    answered:
      false,

    consonantOptions:
      firstQuestion
        ? createConsonantOptions(
            firstQuestion.consonant,
            stage4Data
          )
        : [],

    vowelOptions:
      firstQuestion
        ? createVowelOptions(
            firstQuestion.vowel,
            stage4Data
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

/* =========================================================
   LƯU SESSION
========================================================= */

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

/* =========================================================
   XÓA SESSION
========================================================= */

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
   STAGE 4 — GAME 2

   CHO PHIÊN ÂM
   ↓
   CHỌN PHỤ ÂM
   ↓
   CHỌN NGUYÊN ÂM
   ↓
   GHÉP CHỮ KHMER
========================================================= */

const Stage4 = ({
  navigate,
}) => {
  /* =======================================================
     KIỂM TRA STAGE 3
  ======================================================= */

  const stage3Completed =
    isStageCompleted(
      GAME_ID,
      3
    );

  /* =======================================================
     SESSION

     Nếu còn session:
     → giữ nguyên.

     Nếu không còn session:
     → tạo lượt mới.

     Điều này giúp:
     - Đổi tab: giữ nguyên.
     - Reload: giữ nguyên.
     - Rời Stage bằng nút Danh sách Stage:
       session bị xóa.
     - Vào lại Stage 4:
       tạo bộ mới.
  ======================================================= */

  const [
    session,
    setSession,
  ] = useState(
    () =>
      getSavedSession() ||
      createNewSession()
  );

  /* =======================================================
     LƯỢT CHƠI
  ======================================================= */

  const attemptsLeft =
    session.attemptsLeft;

  /* =======================================================
     ĐIỂM
  ======================================================= */

  const score =
    session.score;

  /* =======================================================
     COMBO
  ======================================================= */

  const combo =
    session.combo;

  /* =======================================================
     CÂU HIỆN TẠI
  ======================================================= */

  const questionIndex =
    session.questionIndex;

  /* =======================================================
     LỰA CHỌN
  ======================================================= */

  const selectedConsonant =
    session.selectedConsonant;

  const selectedVowel =
    session.selectedVowel;

  /* =======================================================
     TRẠNG THÁI
  ======================================================= */

  const answerState =
    session.answerState;

  const answered =
    session.answered;

  /* =======================================================
     RESULT
  ======================================================= */

  const [
    result,
    setResult,
  ] = useState(null);

  const [
    isFirstWin,
    setIsFirstWin,
  ] = useState(false);

  /* =======================================================
     REWARD
  ======================================================= */

  const [
    rewardClaimed,
    setRewardClaimed,
  ] = useState(false);

  /* =======================================================
     CÂU HỎI HIỆN TẠI
  ======================================================= */

  const currentQuestion =
    stage4Data[
      session.questionOrder[
        questionIndex
      ]
    ];

  /* =======================================================
     ĐÁP ÁN HIỆN TẠI

     Đã lưu trong session.

     Vì vậy:
     - Click phụ âm → không random.
     - Click nguyên âm → không random.
     - Chuyển tab → không random.
     - Reload → không random.
  ======================================================= */

  const consonantOptions =
    session.consonantOptions;

  const vowelOptions =
    session.vowelOptions;

  /* =======================================================
     START STAGE
  ======================================================= */

  useEffect(() => {
    if (!stage3Completed) {
      navigate("/game/2");
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
     ĐỒNG BỘ SESSION
  ======================================================= */

  useEffect(() => {
    saveSession(
      session
    );
  }, [
    session,
  ]);

  /* =======================================================
     THẮNG
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
       CLAIM EXP + BADGE
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

    /* Lượt đã kết thúc */
    clearSession();
  };

  /* =======================================================
     THUA
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

    /* Lượt đã kết thúc */
    clearSession();
  };

  /* =======================================================
     TẠO CÂU MỚI
  ======================================================= */

  const goToNextQuestion = (
    currentSession
  ) => {
    let nextIndex =
      currentSession.questionIndex +
      1;

    let nextOrder =
      currentSession.questionOrder;

    /* Hết ngân hàng → xáo trộn lại */
    if (
      nextIndex >=
      nextOrder.length
    ) {
      nextOrder =
        createQuestionOrder();

      nextIndex = 0;
    }

    const nextQuestion =
      stage4Data[
        nextOrder[
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

      questionOrder:
        nextOrder,

      selectedConsonant:
        null,

      selectedVowel:
        null,

      answerState:
        null,

      answered:
        false,

      consonantOptions:
        createConsonantOptions(
          nextQuestion.consonant,
          stage4Data
        ),

      vowelOptions:
        createVowelOptions(
          nextQuestion.vowel,
          stage4Data
        ),
    };

    setSession(
      nextSession
    );
  };

  /* =======================================================
     KIỂM TRA GHÉP CHỮ
  ======================================================= */

  const handleCheckAnswer = (
    consonant,
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
      vowel;

    const isCorrect =
      combined ===
      currentQuestion.combined;

    /* =====================================================
       KHÓA
    ===================================================== */

    const checkedSession = {
      ...session,

      selectedConsonant:
        consonant,

      selectedVowel:
        vowel,

      answerState:
        isCorrect
          ? "correct"
          : "wrong",

      answered:
        true,
    };

    /* =====================================================
       ĐÚNG
    ===================================================== */

    if (isCorrect) {
      const nextCombo =
        session.combo +
        1;

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

      setTimeout(() => {

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

      }, 650);

      return;
    }

    /* =====================================================
       SAI
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

    setTimeout(() => {

      /* HẾT LƯỢT */
      if (
        newAttemptsLeft <= 0
      ) {
        handleLose(
          session.score
        );

        return;
      }

      /* SAI → ĐỔI CÂU */
      goToNextQuestion(
        wrongSession
      );

    }, 650);
  };

  /* =======================================================
     CHỌN PHỤ ÂM

     PHỤ ÂM PHẢI ĐƯỢC CHỌN TRƯỚC.
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
      })
    );
  };

  /* =======================================================
     CHỌN NGUYÊN ÂM

     Chỉ được chọn sau phụ âm.
  ======================================================= */

  const handleSelectVowel = (
    vowel
  ) => {
    if (
      session.answered ||
      session.answerState
    ) {
      return;
    }

    if (
      !session.selectedConsonant
    ) {
      return;
    }

    handleCheckAnswer(
      session.selectedConsonant,
      vowel
    );
  };

  /* =======================================================
     CHƠI LẠI
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
     QUAY VỀ DANH SÁCH STAGE

     QUAN TRỌNG:

     Khi người chơi rời Stage 4 bằng
     nút này → XÓA SESSION.

     Vì vậy khi từ danh sách Stage
     bấm vào Stage 4 lần nữa:

     → createNewSession()
     → xáo trộn ngân hàng
     → xáo trộn phụ âm
     → xáo trộn nguyên âm
     → bắt đầu bộ mới.

     Nhưng nếu chỉ TAB sang tab khác
     hoặc F5:

     → session vẫn còn
     → không đổi câu.
  ======================================================= */

  const handleBackToStageList = () => {
    clearSession();

    navigate(
      "/game/2"
    );
  };

  /* =======================================================
     HOÀN THÀNH GAME
  ======================================================= */

  const handleComplete = () => {
    navigate(
      "/game"
    );
  };

  /* =======================================================
     STAGE CHƯA MỞ
  ======================================================= */

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

  /* =======================================================
     CHỜ CÂU HỎI
  ======================================================= */

  if (!currentQuestion) {
    return null;
  }

  /* =======================================================
     GAMEPLAY
  ======================================================= */

  return (
    <div className="game-stage-page game-stage-4">

      {/* =================================================
          HEADER
      ================================================= */}

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

        {/* =================================================
            HEADER GAME
        ================================================= */}

        <div className="game-stage-icon">
          🎮
        </div>

        <div className="game-stage-khmer">
          ហ្គេម ២
        </div>

        <h1>
          STAGE 4
        </h1>

        <p>
          PHIÊN ÂM → GHÉP CHỮ KHMER
        </p>

        {/* =================================================
            THÔNG TIN GAME
        ================================================= */}

        <div className="stage-play-info">

          <strong>
            LƯỢT CHƠI CÒN LẠI:{" "}
            {attemptsLeft}/
            {MAX_ATTEMPTS}
          </strong>

          <span>
            CÂU{" "}
            {Math.min(
              questionIndex + 1,
              TOTAL_QUESTIONS
            )}
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

        {/* =================================================
            STAGE 4 GAMEPLAY
        ================================================= */}

        <section className="stage4-game">

          {/* =================================================
              CÂU HỎI
          ================================================= */}

          <div className="stage4-question">

            <span className="stage4-label">
              CHO PHIÊN ÂM
            </span>

            <div className="stage4-roman">
              {currentQuestion.roman}
            </div>

            <p className="stage4-instruction">
              Hãy chọn một phụ âm và một
              nguyên âm bên dưới để ghép
              chữ có đúng phiên âm
            </p>

          </div>

          {/* =================================================
              PHỤ ÂM — HÀNG TRÊN
          ================================================= */}

          <div className="stage4-selection-group">

            <div className="stage4-selection-title">
              PHỤ ÂM
            </div>

            <div className="stage4-horizontal-options">

              {consonantOptions.map(
                (
                  consonant,
                  index
                ) => {

                  const isSelected =
                    selectedConsonant ===
                    consonant;

                  return (
                    <button
                      key={`${consonant}-${index}`}
                      type="button"
                      className={`stage4-option stage4-consonant-option ${
                        isSelected
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
                    >
                      {consonant}
                    </button>
                  );
                }
              )}

            </div>

          </div>

          {/* =================================================
              Ô GHÉP — GIỮA
          ================================================= */}

          <div className="stage4-center">

            <div className="stage4-center-label">
              CHỮ ĐÃ GHÉP
            </div>

            <div
              className={`stage4-combined ${
                answerState
                  ? `stage4-combined-${answerState}`
                  : ""
              }`}
            >

              {selectedConsonant ||
              selectedVowel ? (
                <>
                  {selectedConsonant ||
                    ""}

                  {selectedVowel ||
                    ""}
                </>
              ) : (
                "?"
              )}

            </div>

          </div>

          {/* =================================================
              NGUYÊN ÂM — HÀNG DƯỚI
          ================================================= */}

          <div className="stage4-selection-group">

            <div className="stage4-selection-title">
              NGUYÊN ÂM
            </div>

            <div className="stage4-horizontal-options">

              {vowelOptions.map(
                (
                  vowel,
                  index
                ) => {

                  const isSelected =
                    selectedVowel ===
                    vowel;

                  return (
                    <button
                      key={`${vowel}-${index}`}
                      type="button"
                      className={`stage4-option stage4-vowel-option ${
                        isSelected
                          ? "selected"
                          : ""
                      }`}
                      disabled={
                        answered ||
                        !selectedConsonant
                      }
                      onClick={() =>
                        handleSelectVowel(
                          vowel
                        )
                      }
                    >
                      {vowel}
                    </button>
                  );
                }
              )}

            </div>

          </div>

        </section>

      </main>

    </div>
  );
};

export default Stage4;