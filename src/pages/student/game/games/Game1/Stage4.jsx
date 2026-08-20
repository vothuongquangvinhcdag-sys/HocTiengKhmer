import React, { useEffect, useState } from "react";

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

import stage4Data from "./data/stage4Data";

import "../../shared/GameStage.css";
import "./Stage4.css";

/* =========================================================
   CẤU HÌNH
========================================================= */

const GAME_ID = 1;
const STAGE_ID = 4;

const MAX_ATTEMPTS = 3;
const TOTAL_QUESTIONS = 10;
const BASE_SCORE = 10;

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
   RANDOM
========================================================= */

const shuffle = (array) =>
  [...array].sort(
    () => Math.random() - 0.5
  );

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
   LẤY 3 ĐÁP ÁN SAI
========================================================= */

const getWrongAnswers = (question) => {
  const uniqueAnswers = [
    ...new Set(
      shuffle(
        stage4Data
          .filter(
            (item) =>
              item.id !== question.id &&
              item.answer !== question.answer
          )
          .map((item) => item.answer)
      )
    ),
  ];

  return uniqueAnswers.slice(0, 3);
};

/* =========================================================
   TẠO 1 CÂU HỎI
========================================================= */

const createQuestion = () => {
  const question =
    shuffle(stage4Data)[0];

  const wrongAnswers =
    getWrongAnswers(question);

  return {
    ...question,
    options: shuffle([
      question.answer,
      ...wrongAnswers,
    ]),
  };
};

/* =========================================================
   TẠO 10 CÂU
========================================================= */

const createQuestions = () => {
  return shuffle(stage4Data)
    .slice(0, TOTAL_QUESTIONS)
    .map((question) => {
      const wrongAnswers =
        getWrongAnswers(question);

      return {
        ...question,
        options: shuffle([
          question.answer,
          ...wrongAnswers,
        ]),
      };
    });
};

/* =========================================================
   STAGE 4
   NGHE ÂM THANH → CHỌN KÝ TỰ
========================================================= */

const Stage4 = ({ navigate }) => {
  /* =======================================================
     KIỂM TRA STAGE 3
  ======================================================= */

  const stage3Completed =
    isStageCompleted(
      GAME_ID,
      3
    );

  /* =======================================================
     LƯỢT CHƠI
  ======================================================= */

  const [
    attemptsLeft,
    setAttemptsLeft,
  ] = useState(
    MAX_ATTEMPTS
  );

  /* =======================================================
     ĐIỂM + COMBO
  ======================================================= */

  const [score, setScore] =
    useState(0);

  const [combo, setCombo] =
    useState(0);

  /* =======================================================
     QUESTIONS
  ======================================================= */

  const [questions, setQuestions] =
    useState(
      () => createQuestions()
    );

  const [
    questionIndex,
    setQuestionIndex,
  ] = useState(0);

  /* =======================================================
     ANSWER
  ======================================================= */

  const [
    selectedAnswer,
    setSelectedAnswer,
  ] = useState(null);

  const [answered, setAnswered] =
    useState(false);

  /* =======================================================
     RESULT
  ======================================================= */

  const [result, setResult] =
    useState(null);

  const [
    isFirstWin,
    setIsFirstWin,
  ] = useState(false);

  const [
    rewardClaimed,
    setRewardClaimed,
  ] = useState(false);

  /* =======================================================
     CÂU HIỆN TẠI
  ======================================================= */

  const currentQuestion =
    questions[questionIndex];

  /* =======================================================
     START STAGE
  ======================================================= */

  useEffect(() => {
    if (!stage3Completed) {
      navigate("/game/1");
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
     PHÁT AUDIO CÂU HỎI
  ======================================================= */

  const playAudio = () => {
    if (!currentQuestion?.audio) {
      return;
    }

    try {
      const audio =
        new Audio(
          currentQuestion.audio
        );

      audio.currentTime = 0;
      audio.volume = 1;

      audio.play().catch(() => {});
    } catch {
      /* Không làm game lỗi */
    }
  };

  /* =======================================================
     THAY CÂU HIỆN TẠI

     Sai:
     - Không tăng số câu
     - Không reset điểm
     - Không reset lượt
     - Chỉ thay câu hiện tại
========================================================= */

  const replaceCurrentQuestion = () => {
    setQuestions((current) => {
      const updated = [...current];

      let newQuestion =
        createQuestion();

      let safety = 0;

      while (
        updated.some(
          (item) =>
            item.id ===
            newQuestion.id
        ) &&
        safety < 100
      ) {
        newQuestion =
          createQuestion();

        safety++;
      }

      updated[questionIndex] =
        newQuestion;

      return updated;
    });

    setSelectedAnswer(null);
    setAnswered(false);
  };

  /* =======================================================
     THẮNG
  ======================================================= */

  const handleWin = (finalScore) => {
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

    setIsFirstWin(firstWin);

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

      setRewardClaimed(false);
    } else {
      setRewardClaimed(true);
    }

    setScore(finalScore);
    setResult("win");
  };

  /* =======================================================
     THUA
  ======================================================= */

  const handleLose = () => {
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
      score
    );

    setResult("lose");
  };

  /* =======================================================
     CHỌN ĐÁP ÁN
  ======================================================= */

  const handleAnswer = (answer) => {
    if (
      answered ||
      !currentQuestion
    ) {
      return;
    }

    setSelectedAnswer(answer);
    setAnswered(true);

    const isCorrect =
      answer ===
      currentQuestion.answer;

    /* =====================================================
       ĐÚNG
    ===================================================== */

    if (isCorrect) {
      const nextCombo =
        combo + 1;

      const gainedScore =
        nextCombo *
        BASE_SCORE;

      const newScore =
        score +
        gainedScore;

      setCombo(nextCombo);
      setScore(newScore);

      playSound(
        SOUND_CORRECT
      );

      setTimeout(() => {
        if (
          questionIndex >=
          questions.length - 1
        ) {
          handleWin(newScore);
          return;
        }

        setQuestionIndex(
          (current) =>
            current + 1
        );

        setSelectedAnswer(null);
        setAnswered(false);
      }, 500);

      return;
    }

    /* =====================================================
       SAI
    ===================================================== */

    playSound(
      SOUND_WRONG
    );

    setCombo(0);

    setTimeout(() => {
      const newAttemptsLeft =
        attemptsLeft - 1;

      setAttemptsLeft(
        newAttemptsLeft
      );

      if (
        newAttemptsLeft <= 0
      ) {
        handleLose();
        return;
      }

      replaceCurrentQuestion();
    }, 500);
  };

  /* =======================================================
     CHƠI LẠI
  ======================================================= */

  const handleRetry = () => {
    setAttemptsLeft(
      MAX_ATTEMPTS
    );

    setScore(0);
    setCombo(0);

    setResult(null);
    setIsFirstWin(false);
    setRewardClaimed(false);

    setQuestions(
      createQuestions()
    );

    setQuestionIndex(0);

    setSelectedAnswer(null);
    setAnswered(false);

    startStage(
      GAME_ID,
      STAGE_ID
    );
  };

  /* =======================================================
     HOÀN THÀNH GAME
  ======================================================= */

  const handleComplete = () => {
    navigate("/game");
  };

  /* =======================================================
     STAGE CHƯA MỞ
  ======================================================= */

  if (!stage3Completed) {
    return null;
  }

  /* =======================================================
     KẾT QUẢ
  ======================================================= */

  if (result) {
    return (
      <div className="game-stage-page game-stage-4">
        <main className="game-stage-content">
          <StageResult
            gameId={GAME_ID}
            result={result}
            stageId={STAGE_ID}
            isFirstWin={isFirstWin}
            isFinalStage={true}
            rewardClaimed={
              rewardClaimed
            }
            onRetry={handleRetry}
            onComplete={
              handleComplete
            }
            onBack={() =>
              navigate("/game/1")
            }
          />
        </main>
      </div>
    );
  }

  /* =======================================================
     GAMEPLAY
  ======================================================= */

  return (
    <div className="game-stage-page game-stage-4">

      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="game-stage-header">
        <button
          type="button"
          onClick={() =>
            navigate("/game/1")
          }
        >
          ← DANH SÁCH STAGE
        </button>
      </header>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <main className="game-stage-content">

        <div className="game-stage-icon">
          🎮
        </div>

        <div className="game-stage-khmer">
          ហ្គេម ១
        </div>

        <h1>
          STAGE 4
        </h1>

        <p>
          Nghe âm thanh → Chọn ký tự
        </p>

        {/* =================================================
            THÔNG TIN
        ================================================= */}

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
            ĐIỂM: {score}
          </span>

          <span>
            COMBO: {combo}
          </span>

        </div>

        {/* =================================================
            GAMEPLAY — CẤU TRÚC CHUẨN
        ================================================= */}

        {currentQuestion && (
          <section className="stage-game-area">

            {/* =============================================
                QUESTION
            ============================================= */}

            <div className="stage-question">

              <span className="stage-question-label">
                NGHE ÂM THANH
              </span>

              <div className="stage4-audio-area">

                <button
                  type="button"
                  className="stage4-audio-button"
                  onClick={playAudio}
                  aria-label="Nghe phát âm"
                >
                  🔊
                </button>

                <div className="stage4-hint">
                  Nhấn để nghe
                </div>

              </div>

              <p>
                Chọn ký tự tương ứng
              </p>

            </div>

            {/* =============================================
                ANSWERS
            ============================================= */}

            <div className="stage-options">

              {currentQuestion.options.map(
                (option, index) => {

                  const isSelected =
                    selectedAnswer ===
                    option;

                  const isCorrect =
                    option ===
                    currentQuestion.answer;

                  let className =
                    "stage-option";

                  if (
                    answered &&
                    isCorrect
                  ) {
                    className +=
                      " correct";
                  }

                  if (
                    answered &&
                    isSelected &&
                    !isCorrect
                  ) {
                    className +=
                      " wrong";
                  }

                  return (
                    <button
                      key={`${option}-${index}`}
                      type="button"
                      className={className}
                      onClick={() =>
                        handleAnswer(
                          option
                        )
                      }
                      disabled={answered}
                    >
                      {option}
                    </button>
                  );
                }
              )}

            </div>

          </section>
        )}

      </main>
    </div>
  );
};

export default Stage4;
