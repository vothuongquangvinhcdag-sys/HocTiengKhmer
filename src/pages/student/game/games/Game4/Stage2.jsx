import React, { useEffect, useState } from "react";

import StageResult from "../../components/StageResult";

import {
  startStage,
  isStageCompleted,
  recordStagePlay,
  recordStageScore,
  completeStage,
} from "../../data/gameProgress";

import "../../shared/GameStage.css";
import "./Stage2.css";

/* =========================================================
   CẤU HÌNH
========================================================= */

const GAME_ID = 4;
const STAGE_ID = 2;

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
   STAGE 2 — GAME 4

   SƯỜN GAMEPLAY

   Gameplay của Game 2 đã được loại bỏ.

   GIỮ NGUYÊN:
   - Kiểm tra Stage 1
   - Khóa / mở Stage
   - startStage
   - recordStagePlay
   - recordStageScore
   - completeStage
   - Lượt chơi
   - Điểm
   - Combo
   - Số câu
   - Thắng / thua
   - Retry
   - Continue
   - StageResult

   LOẠI BỎ:
   - stage2Data
   - createOptions()
   - createQuestion()
   - getRandomQuestion()
   - createInitialQuestions()
   - currentQuestion
   - selectedAnswer
   - answered
   - handleAnswer()
   - replaceCurrentQuestion()
   - Gameplay ghép phụ âm + nguyên âm
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

     Giữ questionIndex để bảo toàn
     cơ chế 10 câu của Stage.
  ======================================================= */

  const [
    questionIndex,
    setQuestionIndex,
  ] = useState(0);

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
     KIỂM TRA + START STAGE

     Stage 2 chỉ được vào khi Stage 1
     đã hoàn thành.

     Vào Stage / reload / retry
     → KHÔNG tăng playCount.
  ======================================================= */

  useEffect(() => {
    if (!stage1Completed) {
      navigate("/game/4");
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

  const handleWin = (
    finalScore
  ) => {

    playSound(
      SOUND_STAGE_COMPLETE
    );

    /*
     * Kết thúc đúng 1 lượt chơi.
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

  const handleLose = () => {

    playSound(
      SOUND_STAGE_FAIL
    );

    /*
     * Kết thúc đúng 1 lượt chơi.
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
     CHƠI LẠI
  ======================================================= */

  const handleRetry = () => {

    setAttemptsLeft(
      MAX_ATTEMPTS
    );

    setScore(0);

    setCombo(0);

    setQuestionIndex(0);

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
      "/game/4/stage/3"
    );
  };

  /* =======================================================
     STAGE CHƯA MỞ
  ======================================================= */

  if (!stage1Completed) {
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
              navigate("/game/4")
            }
          />

        </main>

      </div>
    );
  }

  /* =======================================================
     GAMEPLAY PLACEHOLDER
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
            navigate("/game/4")
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
          ហ្គេម ៤
        </div>

        {/* =================================================
            TITLE
        ================================================= */}

        <h1>
          STAGE 2
        </h1>

        <p>
          GAMEPLAY ĐANG ĐƯỢC XÂY DỰNG
        </p>

        {/* =================================================
            THÔNG TIN GAME

            Giữ nguyên cơ chế hiển thị.
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
            GAMEPLAY PLACEHOLDER

            Gameplay mới của Game 4 Stage 2
            sẽ được thêm vào đây.
        ================================================= */}

        <section className="stage-game-area">

          <div className="stage-placeholder">

            <div className="stage-placeholder-icon">
              🎮
            </div>

            <h2>
              SẴN SÀNG CHO GAMEPLAY
            </h2>

            <p>
              Gameplay của Stage 2 Game 4
              sẽ được thêm vào đây.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
};

export default Stage2;