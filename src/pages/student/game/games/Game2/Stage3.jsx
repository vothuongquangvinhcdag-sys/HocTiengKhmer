import React, { useEffect, useState } from "react";

import StageResult from "../../components/StageResult";

import {
  startStage,
  isStageCompleted,
  recordStagePlay,
  recordStageScore,
  completeStage,
} from "../../data/gameProgress";

import { stage3Data } from "./data/stage3Data";

import "../../shared/GameStage.css";
import "./Stage3.css";

/* =========================================================
   CẤU HÌNH
========================================================= */

const GAME_ID = 2;
const STAGE_ID = 3;

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
   TẠO DANH SÁCH CÂU HỎI
========================================================= */

const createQuestions = () => {
  const shuffled = [...stage3Data].sort(
    () => Math.random() - 0.5
  );

  return shuffled.slice(
    0,
    Math.min(
      TOTAL_QUESTIONS,
      shuffled.length
    )
  );
};

/* =========================================================
   TẠO ĐÁP ÁN
========================================================= */

const createOptions = (correctAnswer) => {
  const distractors = stage3Data
    .filter(
      (item) =>
        item.roman !== correctAnswer
    )
    .sort(
      () => Math.random() - 0.5
    )
    .slice(0, 3)
    .map(
      (item) => item.roman
    );

  return [
    correctAnswer,
    ...distractors,
  ].sort(
    () => Math.random() - 0.5
  );
};

/* =========================================================
   STAGE 3 — GAME 2
========================================================= */

const Stage3 = ({ navigate }) => {

  /* =======================================================
     KIỂM TRA STAGE 2
  ======================================================= */

  const stage2Completed =
    isStageCompleted(
      GAME_ID,
      2
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
     ĐIỂM
  ======================================================= */

  const [score, setScore] =
    useState(0);

  /* =======================================================
     COMBO
  ======================================================= */

  const [combo, setCombo] =
    useState(0);

  /* =======================================================
     CÂU HỎI
  ======================================================= */

  const [
    questionIndex,
    setQuestionIndex,
  ] = useState(0);

  const [
    questions,
    setQuestions,
  ] = useState([]);

  /* =======================================================
     ĐÁP ÁN
  ======================================================= */

  const [
    options,
    setOptions,
  ] = useState([]);

  const [
    selectedAnswer,
    setSelectedAnswer,
  ] = useState(null);

  const [
    answered,
    setAnswered,
  ] = useState(false);

  /* =======================================================
     KẾT QUẢ
  ======================================================= */

  const [result, setResult] =
    useState(null);

  const [
    isFirstWin,
    setIsFirstWin,
  ] = useState(false);

  /* =======================================================
     START STAGE
  ======================================================= */

  useEffect(() => {

    if (!stage2Completed) {
      navigate("/game/2");
      return;
    }

    const newQuestions =
      createQuestions();

    setQuestions(
      newQuestions
    );

    if (
      newQuestions.length > 0
    ) {
      setOptions(
        createOptions(
          newQuestions[0].roman
        )
      );
    }

    startStage(
      GAME_ID,
      STAGE_ID
    );

  }, [
    stage2Completed,
    navigate,
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
========================================================= */

  const handleAnswer = (
    answer
  ) => {

    if (
      answered ||
      !questions[questionIndex]
    ) {
      return;
    }

    const currentQuestion =
      questions[questionIndex];

    const isCorrect =
      answer ===
      currentQuestion.roman;

    setSelectedAnswer(
      answer
    );

    setAnswered(true);

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

        const nextIndex =
          questionIndex + 1;

        setQuestionIndex(
          nextIndex
        );

        setSelectedAnswer(
          null
        );

        setAnswered(
          false
        );

        if (
          questions[nextIndex]
        ) {
          setOptions(
            createOptions(
              questions[nextIndex]
                .roman
            )
          );
        }

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

      /* ===================================================
         THAY CÂU HIỆN TẠI
      =================================================== */

      const usedIds =
        questions.map(
          (question) =>
            question.id
        );

      const availableQuestions =
        stage3Data.filter(
          (question) =>
            !usedIds.includes(
              question.id
            )
        );

      if (
        availableQuestions.length > 0
      ) {

        const randomIndex =
          Math.floor(
            Math.random() *
              availableQuestions.length
          );

        const newQuestion =
          availableQuestions[
            randomIndex
          ];

        setQuestions(
          (current) => {

            const updated = [
              ...current,
            ];

            updated[
              questionIndex
            ] = newQuestion;

            return updated;
          }
        );

        setOptions(
          createOptions(
            newQuestion.roman
          )
        );

      } else {

        /*
         * Nếu không còn câu mới,
         * dùng lại một câu ngẫu nhiên
         * khác câu hiện tại.
         */

        const otherQuestions =
          stage3Data.filter(
            (question) =>
              question.id !==
              questions[
                questionIndex
              ]?.id
          );

        if (
          otherQuestions.length > 0
        ) {

          const randomIndex =
            Math.floor(
              Math.random() *
                otherQuestions.length
            );

          const newQuestion =
            otherQuestions[
              randomIndex
            ];

          setQuestions(
            (current) => {

              const updated = [
                ...current,
              ];

              updated[
                questionIndex
              ] = newQuestion;

              return updated;
            }
          );

          setOptions(
            createOptions(
              newQuestion.roman
            )
          );
        }
      }

      setSelectedAnswer(
        null
      );

      setAnswered(
        false
      );

    }, 500);
  };

  /* =======================================================
     CHƠI LẠI
  ======================================================= */

  const handleRetry = () => {

    const newQuestions =
      createQuestions();

    setAttemptsLeft(
      MAX_ATTEMPTS
    );

    setScore(0);

    setCombo(0);

    setQuestionIndex(0);

    setQuestions(
      newQuestions
    );

    setSelectedAnswer(
      null
    );

    setAnswered(false);

    setResult(null);

    setIsFirstWin(false);

    if (
      newQuestions.length > 0
    ) {
      setOptions(
        createOptions(
          newQuestions[0].roman
        )
      );
    } else {
      setOptions([]);
    }

    startStage(
      GAME_ID,
      STAGE_ID
    );
  };

  /* =======================================================
     TIẾP TỤC STAGE 4
  ======================================================= */

  const handleContinue = () => {

    navigate(
      "/game/2/stage/4"
    );
  };

  /* =======================================================
     STAGE CHƯA MỞ
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
            onRetry={
              handleRetry
            }
            onContinue={
              handleContinue
            }
            onBack={() =>
              navigate(
                "/game/2"
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

  const currentQuestion =
    questions[questionIndex];

  return (
    <div className="game-stage-page game-stage-3">

      <header className="game-stage-header">

        <button
          type="button"
          onClick={() =>
            navigate(
              "/game/2"
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
          ហ្គេម ២
        </div>

        <h1>
          STAGE 3
        </h1>

        <p>
          CHỮ KHMER → PHIÊN ÂM
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
            ĐIỂM:{" "}
            {score}
          </span>

          <span>
            COMBO:{" "}
            {combo}
          </span>

        </div>

        {/* =================================================
            GAMEPLAY
        ================================================= */}

        <section className="stage-game-area">

          {currentQuestion && (
            <>

              {/* =================================================
                  CÂU HỎI
              ================================================= */}

              <div className="stage-question">

                <span className="stage-question-label">
                  CHỌN PHIÊN ÂM ĐÚNG
                </span>

                <div className="stage-khmer-letter">
                  {currentQuestion.combined}
                </div>

                <p>
                  Chữ Khmer đã ghép
                </p>

              </div>

              {/* =================================================
                  ĐÁP ÁN
              ================================================= */}

              <div className="stage-options">

                {options.map(
                  (
                    option,
                    index
                  ) => {

                    const isSelected =
                      selectedAnswer ===
                      option;

                    const isCorrect =
                      option ===
                      currentQuestion.roman;

                    let optionClass =
                      "stage-option";

                    if (
                      answered &&
                      isSelected
                    ) {
                      optionClass +=
                        isCorrect
                          ? " correct"
                          : " wrong";
                    }

                    return (
                      <button
                        key={`${option}-${index}`}
                        type="button"
                        className={
                          optionClass
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

            </>
          )}

        </section>

      </main>

    </div>
  );
};

export default Stage3;