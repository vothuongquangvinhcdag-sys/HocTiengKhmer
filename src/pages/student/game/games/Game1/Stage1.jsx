import React, { useEffect, useState } from "react";

import StageResult from "../../components/StageResult";

import {
  startStage,
  recordStagePlay,
  recordStageScore,
  completeStage,
} from "../../data/gameProgress";

import "../../shared/GameStage.css";
import stage1Data from "./data/stage1Data";
import "./Stage1.css";

/* =========================================================
   CẤU HÌNH
========================================================= */

const MAX_ATTEMPTS = 3;
const TOTAL_QUESTIONS = 10;
const BASE_SCORE = 10;

/* =========================================================
   ÂM THANH
========================================================= */

const SOUND_CORRECT = "/audio/games/correct.mp3";
const SOUND_WRONG = "/audio/games/wrong.mp3";
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
   TẠO ĐÁP ÁN SAI
   - Không trùng phiên âm đúng
   - Không trùng nhau
   - Luôn lấy tối đa 3 phiên âm khác nhau
========================================================= */

const createWrongAnswers = (question) => {
  const uniqueWrongRomans = [
    ...new Set(
      stage1Data
        .filter(
          (item) =>
            item.id !== question.id &&
            item.roman !== question.roman
        )
        .map((item) => item.roman)
    ),
  ];

  return shuffle(uniqueWrongRomans).slice(0, 3);
};

/* =========================================================
   TẠO 1 CÂU HỎI
========================================================= */

const createQuestion = () => {
  const question = shuffle(stage1Data)[0];

  const wrongAnswers =
    createWrongAnswers(question);

  return {
    ...question,
    options: shuffle([
      question.roman,
      ...wrongAnswers,
    ]),
  };
};

/* =========================================================
   TẠO 10 CÂU
========================================================= */

const createQuestions = () => {
  return shuffle(stage1Data)
    .slice(0, TOTAL_QUESTIONS)
    .map((question) => {
      const wrongAnswers =
        createWrongAnswers(question);

      return {
        ...question,
        options: shuffle([
          question.roman,
          ...wrongAnswers,
        ]),
      };
    });
};

/* =========================================================
   STAGE 1
   PHỤ ÂM → PHIÊN ÂM
========================================================= */

const Stage1 = ({ navigate }) => {
  const gameId = 1;
  const stageId = 1;

  const [attemptsLeft, setAttemptsLeft] =
    useState(MAX_ATTEMPTS);

  const [score, setScore] =
    useState(0);

  const [combo, setCombo] =
    useState(0);

  const [result, setResult] =
    useState(null);

  const [isFirstWin, setIsFirstWin] =
    useState(false);

  const [questions, setQuestions] =
    useState(() => createQuestions());

  const [questionIndex, setQuestionIndex] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState(null);

  const [answered, setAnswered] =
    useState(false);

  const currentQuestion =
    questions[questionIndex];

  /* =======================================================
     START STAGE
  ======================================================= */

  useEffect(() => {
    startStage(gameId, stageId);
  }, []);

  /* =======================================================
     THAY CÂU HIỆN TẠI
  ======================================================= */

  const replaceCurrentQuestion = () => {
    setQuestions((current) => {
      const updated = [...current];

      let newQuestion =
        createQuestion();

      let safety = 0;

      while (
        updated.some(
          (item) =>
            item.id === newQuestion.id
        ) &&
        safety < 50
      ) {
        newQuestion =
          createQuestion();

        safety += 1;
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

    setScore(finalScore);

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
      currentQuestion.roman;

    /* =====================================================
       ĐÚNG
    ===================================================== */

    if (isCorrect) {
      const nextCombo =
        combo + 1;

      const gainedScore =
        nextCombo * BASE_SCORE;

      const newScore =
        score + gainedScore;

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

    setQuestions(
      createQuestions()
    );

    setQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);

    startStage(
      gameId,
      stageId
    );
  };

  /* =======================================================
     TIẾP TỤC STAGE 2
  ======================================================= */

  const handleContinue = () => {
    navigate(
      "/game/1/stage/2"
    );
  };

  /* =======================================================
     KẾT QUẢ
  ======================================================= */

  if (result) {
    return (
      <div className="game-stage-page game-stage-1">
        <main className="game-stage-content">
          <StageResult
            gameId={gameId}
            result={result}
            stageId={stageId}
            isFirstWin={isFirstWin}
            onRetry={handleRetry}
            onContinue={handleContinue}
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
    <div className="game-stage-page game-stage-1">

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

      <main className="game-stage-content">

        <div className="game-stage-icon">
          🎮
        </div>

        <div className="game-stage-khmer">
          ហ្គេម ១
        </div>

        <h1>
          STAGE 1
        </h1>

        <p>
          PHỤ ÂM → PHIÊN ÂM
        </p>

        <div className="stage-play-info">

          <strong>
            LƯỢT CHƠI CÒN LẠI:{" "}
            {attemptsLeft}/
            {MAX_ATTEMPTS}
          </strong>

          <span>
            CÂU {questionIndex + 1} /{" "}
            {TOTAL_QUESTIONS}
          </span>

          <span>
            ĐIỂM: {score}
          </span>

          <span>
            COMBO: {combo}
          </span>

        </div>

        {currentQuestion && (
          <section className="stage-game-area">

            <div className="stage-question">

              <span className="stage-question-label">
                PHỤ ÂM KHMER
              </span>

              <div className="stage-khmer-letter">
                {currentQuestion.letter}
              </div>

              <p>
                Chọn phiên âm tương ứng
              </p>

            </div>

            <div className="stage-options">

              {currentQuestion.options.map(
                (option, optionIndex) => {

                  const isCorrect =
                    option ===
                    currentQuestion.roman;

                  const isSelected =
                    option ===
                    selectedAnswer;

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
                      key={`${currentQuestion.id}-${option}-${optionIndex}`}
                      type="button"
                      className={
                        className
                      }
                      disabled={answered}
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

export default Stage1;
