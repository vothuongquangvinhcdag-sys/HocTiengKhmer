import React, { useEffect, useState } from "react";

import StageResult from "../../components/StageResult";

import {
  startStage,
  recordStagePlay,
  recordStageScore,
  completeStage,
} from "../../data/gameProgress";

import "../../shared/GameStage.css";
import "./Stage1.css";

import { stage1Data } from "./data/stage1Data";

/* =========================================================
   CẤU HÌNH
========================================================= */

const GAME_ID = 2;
const STAGE_ID = 1;

const MAX_ATTEMPTS = 3;
const TOTAL_QUESTIONS = 10;
const BASE_SCORE = 10;

const OPTION_COUNT = 4;

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
   TRỘN MẢNG
========================================================= */

const shuffleArray = (array) => {
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
};

/* =========================================================
   TẠO NGÂN HÀNG 4 ĐÁP ÁN
========================================================= */

const createOptions = (correctQuestion) => {
  if (!correctQuestion) {
    return [];
  }

  /*
   * Lấy tất cả câu khác câu đúng
   */
  const wrongPool =
    stage1Data.filter(
      (item) =>
        item.id !==
        correctQuestion.id
    );

  /*
   * Trộn ngân hàng câu sai
   */
  const shuffledWrong =
    shuffleArray(
      wrongPool
    );

  /*
   * Lấy 3 đáp án sai
   */
  const wrongAnswers =
    shuffledWrong.slice(
      0,
      OPTION_COUNT - 1
    );

  /*
   * Đưa đáp án đúng vào
   * rồi trộn toàn bộ.
   */
  return shuffleArray([
    correctQuestion,
    ...wrongAnswers,
  ]);
};

/* =========================================================
   TẠO CÂU HỎI MỚI
========================================================= */

const createQuestion = () => {
  if (!stage1Data.length) {
    return null;
  }

  const randomIndex =
    Math.floor(
      Math.random() *
        stage1Data.length
    );

  const question =
    stage1Data[randomIndex];

  const options =
    createOptions(question);

  return {
    question,
    options,
  };
};

/* =========================================================
   STAGE 1 — GAME 2
========================================================= */

const Stage1 = ({ navigate }) => {

  /* =======================================================
     CÂU HỎI HIỆN TẠI
  ======================================================= */

  const [
    currentQuestion,
    setCurrentQuestion,
  ] = useState(null);

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

  const [
    score,
    setScore,
  ] = useState(0);

  /* =======================================================
     COMBO
  ======================================================= */

  const [
    combo,
    setCombo,
  ] = useState(0);

  /* =======================================================
     CÂU HỎI
  ======================================================= */

  const [
    questionIndex,
    setQuestionIndex,
  ] = useState(0);

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

  const [
    result,
    setResult,
  ] = useState(null);

  const [
    isFirstWin,
    setIsFirstWin,
  ] = useState(false);

  /* =======================================================
     START STAGE

     Vào Stage / reload / retry
     → KHÔNG tăng playCount
  ======================================================= */

  useEffect(() => {
    startStage(
      GAME_ID,
      STAGE_ID
    );

    loadNewQuestion();
  }, []);

  /* =======================================================
     LOAD CÂU HỎI
  ======================================================= */

  const loadNewQuestion = () => {
    const newQuestion =
      createQuestion();

    setCurrentQuestion(
      newQuestion
    );

    setSelectedAnswer(null);
    setAnswered(false);
  };

  /* =======================================================
     THẮNG
  ======================================================= */

  const handleWin = (
    finalScore
  ) => {

    playSound(
      SOUND_STAGE_COMPLETE
    );

    /*
     * Chỉ kết thúc 1 lượt chơi ở đây
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

  const handleLose = (
    finalScore
  ) => {

    playSound(
      SOUND_STAGE_FAIL
    );

    /*
     * Chỉ kết thúc 1 lượt chơi ở đây
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

    setResult("lose");
  };

  /* =======================================================
     CHỌN ĐÁP ÁN
  ======================================================= */

  const handleAnswer = (
    answer
  ) => {

    if (
      answered ||
      !currentQuestion ||
      result
    ) {
      return;
    }

    /*
     * Khóa không cho chọn nhiều đáp án
     */

    setSelectedAnswer(
      answer.id
    );

    setAnswered(true);

    /*
     * Kiểm tra đáp án
     */

    const isCorrect =
      answer.id ===
      currentQuestion.question.id;

    /* =====================================================
       ĐÚNG
    ===================================================== */

    if (isCorrect) {

      const nextCombo =
        combo + 1;

      /*
       * Combo:
       *
       * Combo 1 → +10
       * Combo 2 → +20
       * Combo 3 → +30
       * ...
       */

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

        /*
         * Đủ 10 câu → THẮNG
         */

        if (
          questionIndex >=
          TOTAL_QUESTIONS - 1
        ) {

          handleWin(
            newScore
          );

          return;
        }

        /*
         * Sang câu tiếp theo
         */

        setQuestionIndex(
          (current) =>
            current + 1
        );

        loadNewQuestion();

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
     * Sai → combo về 0
     */

    setCombo(0);

    setTimeout(() => {

      const newAttemptsLeft =
        attemptsLeft - 1;

      setAttemptsLeft(
        newAttemptsLeft
      );

      /* ===================================================
         HẾT LƯỢT
      =================================================== */

      if (
        newAttemptsLeft <= 0
      ) {

        handleLose(
          score
        );

        return;
      }

      /* ===================================================
         CÒN LƯỢT

         Không tăng questionIndex.

         Ví dụ:

         CÂU 3 / 10
         trả lời sai
         ↓
         vẫn CÂU 3 / 10
         nhưng câu hỏi mới.
      =================================================== */

      loadNewQuestion();

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

    setSelectedAnswer(
      null
    );

    setAnswered(false);

    setResult(null);

    setIsFirstWin(false);

    startStage(
      GAME_ID,
      STAGE_ID
    );

    loadNewQuestion();
  };

  /* =======================================================
     TIẾP TỤC STAGE 2
  ======================================================= */

  const handleContinue = () => {

    navigate(
      "/game/2/stage/2"
    );
  };

  /* =======================================================
     RESULT
  ======================================================= */

  if (result) {

    return (
      <div className="game-stage-page game-stage-1">

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
     LOADING
  ======================================================= */

  if (!currentQuestion) {

    return (
      <div className="game-stage-page game-stage-1">

        <main className="game-stage-content">

          <div className="game-stage-icon">
            🎮
          </div>

          <div className="game-stage-khmer">
            ហ្គេម ២
          </div>

          <h1>
            STAGE 1
          </h1>

          <p>
            ĐANG CHUẨN BỊ CÂU HỎI...
          </p>

        </main>

      </div>
    );
  }

  /* =======================================================
     DỮ LIỆU CÂU HIỆN TẠI
  ======================================================= */

  const question =
    currentQuestion.question;

  const options =
    currentQuestion.options;

  /* =======================================================
     GAMEPLAY
  ======================================================= */

  return (
    <div className="game-stage-page game-stage-1">

      {/* =================================================
          HEADER
      ================================================= */}

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

      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="game-stage-content">

        {/* =================================================
            ICON
        ================================================= */}

        <div className="game-stage-icon">
          🎮
        </div>

        {/* =================================================
            KHMER
        ================================================= */}

        <div className="game-stage-khmer">
          ហ្គេម ២
        </div>

        {/* =================================================
            TITLE
        ================================================= */}

        <h1>
          STAGE 1
        </h1>

        <p>
          GHÉP PHỤ ÂM + NGUYÊN ÂM
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
            GAME AREA
        ================================================= */}

        <section className="stage-game-area">

          {/* ===============================================
              CÂU HỎI
          =============================================== */}

          <div className="stage-question">

            <span className="stage-question-label">
              HÃY CHỌN CHỮ KHMER TƯƠNG ỨNG
            </span>

            {/* ---------------------------------------------
                PHỤ ÂM + NGUYÊN ÂM
            --------------------------------------------- */}

            <div className="stage1-expression">

              <span className="stage1-consonant">
                {question.consonant}
              </span>

              <span className="stage1-plus">
                +
              </span>

              <span className="stage1-vowel">
                {question.vowel}
              </span>

            </div>

            {/* ---------------------------------------------
                GỢI Ý
            --------------------------------------------- */}

            <p className="stage1-question-hint">
              Ghép phụ âm với nguyên âm
            </p>

          </div>

          {/* ===============================================
              NGÂN HÀNG ĐÁP ÁN
          =============================================== */}

          <div className="stage-options">

            {options.map(
              (option) => {

                const isSelected =
                  selectedAnswer ===
                  option.id;

                const isCorrect =
                  option.id ===
                  question.id;

                let optionClass =
                  "stage-option";

                if (
                  isSelected
                ) {
                  optionClass +=
                    " selected";
                }

                if (
                  answered &&
                  isSelected &&
                  isCorrect
                ) {
                  optionClass +=
                    " correct";
                }

                if (
                  answered &&
                  isSelected &&
                  !isCorrect
                ) {
                  optionClass +=
                    " wrong";
                }

                return (
                  <button
                    key={
                      option.id
                    }
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

                    {/* ---------------------------------
                        CHỮ KHMER
                    --------------------------------- */}

                    <span className="stage1-option-character">
                      {
                        option.combined
                      }
                    </span>

                    {/* ---------------------------------
                        PHIÊN ÂM
                    --------------------------------- */}

                    <span className="stage1-option-roman">
                      {
                        option.roman
                      }
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

export default Stage1;