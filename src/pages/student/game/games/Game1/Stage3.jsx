import React, {
  useEffect,
  useState,
} from "react";

import StageResult from "../../components/StageResult";

import {
  startStage,
  isStageCompleted,
  recordStagePlay,
  recordStageScore,
  completeStage,
} from "../../data/gameProgress";

import stage3Data from "./data/stage3Data";

import "../../shared/GameStage.css";
import "./Stage3.css";

/* =========================================================
   CẤU HÌNH
========================================================= */

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

const shuffle = (array) => {
  return [...array].sort(
    () => Math.random() - 0.5
  );
};

/* =========================================================
   TẠO 1 CÂU HỎI
========================================================= */

const createQuestion = () => {
  const question =
    shuffle(stage3Data)[0];

  return {
    ...question,
    options: shuffle(
      question.options
    ),
  };
};

/* =========================================================
   TẠO 10 CÂU BAN ĐẦU
========================================================= */

const createQuestions = () => {
  return shuffle(stage3Data)
    .slice(0, TOTAL_QUESTIONS)
    .map((question) => ({
      ...question,
      options: shuffle(
        question.options
      ),
    }));
};

/* =========================================================
   PHÁT ÂM THANH
========================================================= */

const playSound = (src) => {
  try {
    const audio = new Audio(src);

    audio.currentTime = 0;
    audio.volume = 0.9;

    audio.play().catch((error) => {
      console.warn(
        "Không thể phát âm thanh:",
        src,
        error
      );
    });
  } catch (error) {
    console.warn(
      "Lỗi tạo âm thanh:",
      src,
      error
    );
  }
};

/* =========================================================
   STAGE 3
   NGUYÊN ÂM KHMER → PHIÊN ÂM
========================================================= */

const Stage3 = ({ navigate }) => {
  const gameId = 1;
  const stageId = 3;

  /* =======================================================
     KIỂM TRA STAGE 2
  ======================================================= */

  const stage2Completed =
    isStageCompleted(
      gameId,
      2
    );

  /* =======================================================
     QUESTIONS
  ======================================================= */

  const [questions, setQuestions] =
    useState(
      () => createQuestions()
    );

  const [questionIndex, setQuestionIndex] =
    useState(0);

  /* =======================================================
     LƯỢT
  ======================================================= */

  const [attemptsLeft, setAttemptsLeft] =
    useState(MAX_ATTEMPTS);

  /* =======================================================
     ĐIỂM + COMBO
  ======================================================= */

  const [score, setScore] =
    useState(0);

  const [combo, setCombo] =
    useState(0);

  /* =======================================================
     ANSWER
  ======================================================= */

  const [selectedAnswer, setSelectedAnswer] =
    useState(null);

  const [answered, setAnswered] =
    useState(false);

  /* =======================================================
     RESULT
  ======================================================= */

  const [result, setResult] =
    useState(null);

  const [isFirstWin, setIsFirstWin] =
    useState(false);

  /* =======================================================
     CURRENT QUESTION
  ======================================================= */

  const currentQuestion =
    questions[questionIndex];

  /* =======================================================
     START STAGE
  ======================================================= */

  useEffect(() => {
    if (!stage2Completed) {
      return;
    }

    startStage(
      gameId,
      stageId
    );
  }, [stage2Completed]);

  /* =======================================================
     BẢO VỆ STAGE 3
  ======================================================= */

  useEffect(() => {
    if (!stage2Completed) {
      navigate("/game/1");
    }
  }, [
    stage2Completed,
    navigate,
  ]);

  /* =======================================================
     THAY CÂU HIỆN TẠI
  ======================================================= */

  const replaceCurrentQuestion = () => {
    setQuestions((current) => {
      const updated = [
        ...current,
      ];

      let newQuestion =
        createQuestion();

      let safety = 0;

      while (
        updated.some(
          (item) =>
            item.id ===
            newQuestion.id
        ) &&
        safety < 50
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
      gameId,
      stageId
    );

    recordStageScore(
      gameId,
      stageId,
      finalScore
    );

    const completed =
      completeStage(
        gameId,
        stageId
      );

    setScore(
      finalScore
    );

    setIsFirstWin(
      completed.isFirstWin
    );

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
      gameId,
      stageId
    );

    recordStageScore(
      gameId,
      stageId,
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
      playSound(
        SOUND_CORRECT
      );

      const nextCombo =
        combo + 1;

      const gainedScore =
        nextCombo *
        BASE_SCORE;

      const newScore =
        score +
        gainedScore;

      setCombo(
        nextCombo
      );

      setScore(
        newScore
      );

      setTimeout(() => {
        if (
          questionIndex >=
          questions.length - 1
        ) {
          handleWin(
            newScore
          );

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
    setQuestions(
      createQuestions()
    );

    setQuestionIndex(0);

    setAttemptsLeft(
      MAX_ATTEMPTS
    );

    setScore(0);

    setCombo(0);

    setSelectedAnswer(null);

    setAnswered(false);

    setResult(null);

    setIsFirstWin(false);

    startStage(
      gameId,
      stageId
    );
  };

  /* =======================================================
     TIẾP TỤC STAGE 4
  ======================================================= */

  const handleContinue = () => {
    navigate(
      "/game/1/stage/4"
    );
  };

  /* =======================================================
     CHƯA ĐƯỢC MỞ
  ======================================================= */

  if (!stage2Completed) {
    return null;
  }

  /* =======================================================
     RESULT
  ======================================================= */

  if (result) {
    return (
      <div className="game-stage-page game-stage-3">

        <main className="game-stage-content">

          <StageResult
            gameId={gameId}
            result={result}
            stageId={stageId}
            isFirstWin={isFirstWin}
            onRetry={handleRetry}
            onContinue={
              handleContinue
            }
            onBack={() =>
              navigate(
                "/game/1"
              )
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
    <div className="game-stage-page game-stage-3">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="game-stage-header">

        <button
          type="button"
          onClick={() =>
            navigate(
              "/game/1"
            )
          }
        >
          ← DANH SÁCH STAGE
        </button>

      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="game-stage-content">

        {/* ICON */}

        <div className="game-stage-icon">
          🎮
        </div>

        {/* KHMER */}

        <div className="game-stage-khmer">
          ហ្គេម ១
        </div>

        {/* TITLE */}

        <h1>
          STAGE 3
        </h1>

        <p>
          Nguyên âm Khmer → Phiên âm
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
            GAMEPLAY
        ================================================= */}

        {currentQuestion && (

          <section className="stage-game-area">

            {/* =============================================
                QUESTION
            ============================================= */}

            <div className="stage-question">

              <span className="stage-question-label">
                NGUYÊN ÂM
              </span>

              <div className="stage-khmer-letter">
                {currentQuestion.symbol}
              </div>

              {/* GIỌNG */}

              <div
                className={`stage3-voice ${
                  currentQuestion.voice ===
                  "O"
                    ? "stage3-voice-o"
                    : "stage3-voice-oh"
                }`}
              >
                GIỌNG{" "}
                {currentQuestion.voice}
              </div>

              {/* PROMPT */}

              <p className="stage3-prompt">
                Có phiên âm là:
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

                  /* -------------------------------------
                     ĐÃ TRẢ LỜI
                  ------------------------------------- */

                  if (answered) {

                    if (
                      isCorrect
                    ) {
                      className +=
                        " correct";
                    }

                    if (
                      isSelected &&
                      !isCorrect
                    ) {
                      className +=
                        " wrong";
                    }
                  }

                  return (
                    <button
                      key={`${option}-${index}`}
                      type="button"
                      className={
                        className
                      }
                      disabled={
                        answered
                      }
                      onClick={() =>
                        handleAnswer(
                          option
                        )
                      }
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

export default Stage3;