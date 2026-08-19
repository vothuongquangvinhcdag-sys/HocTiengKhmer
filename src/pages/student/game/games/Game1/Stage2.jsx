import React, { useEffect, useState } from "react";

import StageResult from "../../components/StageResult";

import {
  startStage,
  isStageCompleted,
  recordStageScore,
  completeStage,
  recordStagePlay,
} from "../../data/gameProgress";

import "../../shared/GameStage.css";
import "./Stage2.css";

import stage2Data from "./data/stage2Data";

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
   TẠO 1 CÂU HỎI
========================================================= */

const createQuestion = () => {
  return shuffle(stage2Data)[0];
};

/* =========================================================
   TẠO 10 CÂU BAN ĐẦU
========================================================= */

const createQuestions = () => {
  return shuffle(stage2Data).slice(
    0,
    TOTAL_QUESTIONS
  );
};

/* =========================================================
   STAGE 2
   PHỤ ÂM → GIỌNG O / GIỌNG Ô
========================================================= */

const Stage2 = ({ navigate }) => {
  const gameId = 1;
  const stageId = 2;

  /* =======================================================
     TRẠNG THÁI
  ======================================================= */

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
     ANSWER
  ======================================================= */

  const [selectedAnswer, setSelectedAnswer] =
    useState(null);

  const [answered, setAnswered] =
    useState(false);

  /* =======================================================
     CURRENT QUESTION
  ======================================================= */

  const currentQuestion =
    questions[questionIndex];

  /* =======================================================
     KIỂM TRA STAGE 1
  ======================================================= */

  const stage1Completed =
    isStageCompleted(
      gameId,
      1
    );

  /* =======================================================
     START STAGE

     Vào Stage / reload / retry
     → KHÔNG tăng playCount
  ======================================================= */

  useEffect(() => {
    if (!stage1Completed) {
      navigate("/game/1");
      return;
    }

    startStage(
      gameId,
      stageId
    );
  }, [
    stage1Completed,
    navigate,
  ]);

  /* =======================================================
     TẠO LẠI CÂU HIỆN TẠI

     Sai câu nào:
     → Chỉ đổi câu đó
     → Không tăng số câu
     → Không reset điểm
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
    /* -----------------------------------------------
       ÂM THANH HOÀN THÀNH
    ----------------------------------------------- */

    playSound(
      SOUND_STAGE_COMPLETE
    );

    /* -----------------------------------------------
       KẾT THÚC 1 LƯỢT CHƠI
       → +1 playCount
    ----------------------------------------------- */

    recordStagePlay(
      gameId,
      stageId
    );

    /* -----------------------------------------------
       LƯU ĐIỂM
    ----------------------------------------------- */

    recordStageScore(
      gameId,
      stageId,
      finalScore
    );

    /* -----------------------------------------------
       HOÀN THÀNH STAGE
    ----------------------------------------------- */

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
    /* -----------------------------------------------
       ÂM THANH THUA STAGE
    ----------------------------------------------- */

    playSound(
      SOUND_STAGE_FAIL
    );

    /* -----------------------------------------------
       KẾT THÚC 1 LƯỢT CHƠI
       → +1 playCount
    ----------------------------------------------- */

    recordStagePlay(
      gameId,
      stageId
    );

    /* -----------------------------------------------
       LƯU ĐIỂM HIỆN TẠI
    ----------------------------------------------- */

    recordStageScore(
      gameId,
      stageId,
      score
    );

    setResult("lose");
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
      currentQuestion.voice;

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

      setCombo(
        nextCombo
      );

      setScore(
        newScore
      );

      /* -----------------------------------------------
         ÂM THANH ĐÚNG
      ----------------------------------------------- */

      playSound(
        SOUND_CORRECT
      );

      setTimeout(() => {
        /* ---------------------------------------------
           HOÀN THÀNH 10 CÂU
        --------------------------------------------- */

        if (
          questionIndex >=
          questions.length - 1
        ) {
          handleWin(
            newScore
          );

          return;
        }

        /* ---------------------------------------------
           SANG CÂU TIẾP THEO

           Lượt còn lại giữ nguyên
        --------------------------------------------- */

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

    /* -----------------------------------------------
       SAI → RESET COMBO
    ----------------------------------------------- */

    setCombo(0);

    setTimeout(() => {
      const newAttemptsLeft =
        attemptsLeft - 1;

      setAttemptsLeft(
        newAttemptsLeft
      );

      /* ---------------------------------------------
         HẾT 3 LƯỢT
        --------------------------------------------- */

      if (
        newAttemptsLeft <= 0
      ) {
        handleLose();

        return;
      }

      /* ---------------------------------------------
         CÒN LƯỢT

         Không tăng câu.
         Không reset điểm.
         Chỉ thay câu hiện tại.
      --------------------------------------------- */

      replaceCurrentQuestion();

    }, 500);
  };

  /* =======================================================
     TIẾP TỤC STAGE 3
  ======================================================= */

  const handleContinue = () => {
    navigate(
      "/game/1/stage/3"
    );
  };

  /* =======================================================
     CHƯA ĐƯỢC MỞ
  ======================================================= */

  if (!stage1Completed) {
    return null;
  }

  /* =======================================================
     KẾT QUẢ
  ======================================================= */

  if (result) {
    return (
      <div className="game-stage-page game-stage-2">

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
     GAME PLAY
  ======================================================= */

  return (
    <div className="game-stage-page game-stage-2">

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

      <main className="game-stage-content">

        <div className="game-stage-icon">
          🎮
        </div>

        <div className="game-stage-khmer">
          ហ្គេម ១
        </div>

        <h1>
          STAGE 2
        </h1>

        <p>
          PHỤ ÂM → GIỌNG O / GIỌNG Ô
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

            <div className="stage-question">

              <span className="stage-question-label">
                PHỤ ÂM KHMER
              </span>

              <div className="stage-khmer-letter">
                {currentQuestion.letter}
              </div>

              <p>
                Chọn giọng của phụ âm
              </p>

            </div>

            <div className="stage-options">

              {/* =========================================
                  GIỌNG O
              ========================================= */}

              <button
                type="button"
                className={`
                  stage-option
                  ${
                    answered &&
                    currentQuestion.voice ===
                      "O"
                      ? "correct"
                      : ""
                  }
                  ${
                    answered &&
                    selectedAnswer ===
                      "O" &&
                    currentQuestion.voice !==
                      "O"
                      ? "wrong"
                      : ""
                  }
                `}
                disabled={
                  answered
                }
                onClick={() =>
                  handleAnswer(
                    "O"
                  )
                }
              >
                GIỌNG O
              </button>

              {/* =========================================
                  GIỌNG Ô
              ========================================= */}

              <button
                type="button"
                className={`
                  stage-option
                  ${
                    answered &&
                    currentQuestion.voice ===
                      "Ô"
                      ? "correct"
                      : ""
                  }
                  ${
                    answered &&
                    selectedAnswer ===
                      "Ô" &&
                    currentQuestion.voice !==
                      "Ô"
                      ? "wrong"
                      : ""
                  }
                `}
                disabled={
                  answered
                }
                onClick={() =>
                  handleAnswer(
                    "Ô"
                  )
                }
              >
                GIỌNG Ô
              </button>

            </div>

          </section>

        )}

      </main>

    </div>
  );
};

export default Stage2;