import React, { useEffect, useState } from "react";

import StageResult from "../../components/StageResult";

import {
  startStage,
  isStageCompleted,
  recordStagePlay,
  recordStageScore,
  completeStage,
} from "../../data/gameProgress";

import { stage2Data } from "./data/stage2Data";

import "../../shared/GameStage.css";
import "./Stage2.css";

/* =========================================================
   CẤU HÌNH
========================================================= */

const GAME_ID = 2;
const STAGE_ID = 2;

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
   TRỘN MẢNG
========================================================= */

const shuffleArray = (array) => {
  return [...array].sort(
    () => Math.random() - 0.5
  );
};

/* =========================================================
   TẠO ĐÁP ÁN
========================================================= */

const createOptions = (question) => {
  /*
   * Đáp án đúng
   */
  const correctOption = {
    consonant: question.consonant,
    vowel: question.vowel,
  };

  /*
   * Đáp án nhiễu
   */
  const wrongOptions = [];

  const candidates = shuffleArray(
    stage2Data
  );

  for (const item of candidates) {
    const isSameAsCorrect =
      item.consonant === question.consonant &&
      item.vowel === question.vowel;

    if (isSameAsCorrect) {
      continue;
    }

    const isDuplicate = wrongOptions.some(
      (option) =>
        option.consonant === item.consonant &&
        option.vowel === item.vowel
    );

    if (isDuplicate) {
      continue;
    }

    wrongOptions.push({
      consonant: item.consonant,
      vowel: item.vowel,
    });

    if (wrongOptions.length >= 3) {
      break;
    }
  }

  /*
   * Đáp án đúng + 3 đáp án sai
   * rồi trộn vị trí.
   */
  return shuffleArray([
    correctOption,
    ...wrongOptions,
  ]);
};

/* =========================================================
   TẠO CÂU HỎI
========================================================= */

const createQuestion = (question) => {
  return {
    ...question,
    options: createOptions(question),
  };
};

/* =========================================================
   LẤY CÂU HỎI MỚI
========================================================= */

const getRandomQuestion = (
  currentQuestion = null
) => {
  let availableQuestions = [
    ...stage2Data,
  ];

  /*
   * Khi trả lời sai:
   * ưu tiên thay bằng câu khác câu hiện tại.
   */
  if (
    currentQuestion &&
    availableQuestions.length > 1
  ) {
    availableQuestions =
      availableQuestions.filter(
        (item) =>
          item.id !== currentQuestion.id
      );
  }

  const randomIndex = Math.floor(
    Math.random() *
      availableQuestions.length
  );

  const question =
    availableQuestions[randomIndex];

  return createQuestion(question);
};

/* =========================================================
   TẠO DANH SÁCH 10 CÂU BAN ĐẦU
========================================================= */

const createInitialQuestions = () => {
  const shuffled = shuffleArray(
    stage2Data
  );

  /*
   * stage2Data hiện có 17 câu.
   * Lấy tối đa 10 câu khác nhau.
   */
  const selected = shuffled.slice(
    0,
    Math.min(
      TOTAL_QUESTIONS,
      shuffled.length
    )
  );

  return selected.map(
    (question) =>
      createQuestion(question)
  );
};

/* =========================================================
   STAGE 2 — GAME 2
========================================================= */

const Stage2 = ({ navigate }) => {
  /* =======================================================
     KIỂM TRA STAGE 1
  ======================================================= */

  const stage1Completed =
    isStageCompleted(
      GAME_ID,
      1
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
  ] = useState(
    createInitialQuestions()
  );

  /* =======================================================
     TRẠNG THÁI TRẢ LỜI
  ======================================================= */

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
     CÂU HIỆN TẠI
  ======================================================= */

  const currentQuestion =
    questions[questionIndex];

  /* =======================================================
     KIỂM TRA + START STAGE
  ======================================================= */

  useEffect(() => {
    if (!stage1Completed) {
      navigate("/game/2");
      return;
    }

    startStage(
      GAME_ID,
      STAGE_ID
    );
  }, [
    stage1Completed,
    navigate,
  ]);

  /* =======================================================
     THẮNG
  ======================================================= */

  const handleWin = (finalScore) => {
    playSound(
      SOUND_STAGE_COMPLETE
    );

    /*
     * Kết thúc 1 lượt chơi.
     */

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

    /*
     * Kết thúc 1 lượt chơi.
     */

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
     THAY CÂU HIỆN TẠI
  ======================================================= */

  const replaceCurrentQuestion = () => {
    if (!currentQuestion) {
      return;
    }

    const newQuestion =
      getRandomQuestion(
        currentQuestion
      );

    setQuestions(
      (currentQuestions) => {
        const updated = [
          ...currentQuestions,
        ];

        updated[questionIndex] =
          newQuestion;

        return updated;
      }
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

    /* =====================================================
       KIỂM TRA ĐÁP ÁN
    ===================================================== */

    const isCorrect =
      answer.consonant ===
        currentQuestion.consonant &&
      answer.vowel ===
        currentQuestion.vowel;

    /* =====================================================
       ĐÚNG
    ===================================================== */

    if (isCorrect) {
      const nextCombo =
        combo + 1;

      /*
       * Combo 1 = 10
       * Combo 2 = 20
       * Combo 3 = 30
       * ...
       */

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
        /*
         * Hoàn thành 10 câu
         */
        if (
          questionIndex >=
          TOTAL_QUESTIONS - 1
        ) {
          handleWin(newScore);
          return;
        }

        /*
         * Sang câu tiếp theo
         */
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

    /*
     * Sai → combo về 0.
     */
    setCombo(0);

    setTimeout(() => {
      const newAttemptsLeft =
        attemptsLeft - 1;

      setAttemptsLeft(
        newAttemptsLeft
      );

      /*
       * Hết lượt
       */
      if (
        newAttemptsLeft <= 0
      ) {
        handleLose();
        return;
      }

      /*
       * Còn lượt:
       *
       * - Không tăng câu
       * - Không mất điểm
       * - Combo = 0
       * - Thay câu hiện tại
       */
      replaceCurrentQuestion();

      setSelectedAnswer(null);
      setAnswered(false);
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

    setQuestionIndex(0);

    setQuestions(
      createInitialQuestions()
    );

    setSelectedAnswer(null);

    setAnswered(false);

    setResult(null);

    setIsFirstWin(false);

    startStage(
      GAME_ID,
      STAGE_ID
    );
  };

  /* =======================================================
     TIẾP TỤC STAGE 3
  ======================================================= */

  const handleContinue = () => {
    navigate(
      "/game/2/stage/3"
    );
  };

  /* =======================================================
     STAGE CHƯA MỞ
  ======================================================= */

  if (!stage1Completed) {
    return null;
  }

  /* =======================================================
     CHỜ DỮ LIỆU
  ======================================================= */

  if (!currentQuestion) {
    return null;
  }

  /* =======================================================
     RESULT
  ======================================================= */

  if (result) {
    return (
      <div className="game-stage-page game-stage-2">

        <main className="game-stage-content">

          <StageResult
            gameId={GAME_ID}
            result={result}
            stageId={STAGE_ID}
            isFirstWin={isFirstWin}
            onRetry={handleRetry}
            onContinue={handleContinue}
            onBack={() =>
              navigate("/game/2")
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
    <div className="game-stage-page game-stage-2">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="game-stage-header">

        <button
          type="button"
          onClick={() =>
            navigate("/game/2")
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
          ហ្គេម ២
        </div>

        {/* TITLE */}

        <h1>
          STAGE 2
        </h1>

        <p>
          PHÂN TÍCH PHỤ ÂM + NGUYÊN ÂM
        </p>

        {/* =================================================
            THÔNG TIN GAME
        ================================================= */}

        <div className="stage-play-info">

          <strong>
            LƯỢT CHƠI CÒN LẠI:{" "}
            {attemptsLeft}/{MAX_ATTEMPTS}
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
            GAME AREA
        ================================================= */}

        <section className="stage-game-area">

          {/* =================================================
              CÂU HỎI
          ================================================= */}

          <div className="stage-question">

            <span className="stage-question-label">
              CHỮ KHMER
            </span>

            {/* KHMER + PHIÊN ÂM */}

            <div className="stage2-question-expression">

              <span className="stage-khmer-letter">
                {currentQuestion.combined}
              </span>

              <span className="stage2-question-roman">
                {currentQuestion.roman}
              </span>

            </div>

            {/* CÂU HỎI */}

            <p>
              Phụ âm và nguyên âm của chữ này là gì?
            </p>

          </div>

          {/* =================================================
              4 ĐÁP ÁN
          ================================================= */}

          <div className="stage-options">

            {currentQuestion.options.map(
              (option, index) => {

                const isSelected =
                  selectedAnswer ===
                  option;

                const isCorrect =
                  option.consonant ===
                    currentQuestion.consonant &&
                  option.vowel ===
                    currentQuestion.vowel;

                let optionClass =
                  "stage-option";

                /*
                 * Sau khi chọn:
                 *
                 * Đúng → correct
                 * Sai → wrong
                 */

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
                    key={`${currentQuestion.id}-${index}`}
                    type="button"
                    className={optionClass}
                    disabled={answered}
                    onClick={() =>
                      handleAnswer(option)
                    }
                  >

                    {/* PHỤ ÂM */}

                    <span className="stage2-option-consonant">
                      {option.consonant}
                    </span>

                    {/* DẤU + */}

                    <span className="stage2-option-plus">
                      +
                    </span>

                    {/* NGUYÊN ÂM */}

                    <span className="stage2-option-vowel">
                      {option.vowel}
                    </span>

                  </button>
                );
              }
            )}

          </div>

        </section>

      </main>

    </div>
  );
};

export default Stage2;
