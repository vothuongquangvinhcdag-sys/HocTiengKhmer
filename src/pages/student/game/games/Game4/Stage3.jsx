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
import "./Stage3.css";

/* =========================================================
   CẤU HÌNH
========================================================= */

const GAME_ID = 4;
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
   STAGE 3 — GAME 4

   BỘ KHUNG GAMEPLAY

   Giữ:
   - Kiểm tra Stage 2
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
   - Âm thanh

   Loại bỏ:
   - stage3Data
   - createQuestions()
   - createOptions()
   - currentQuestion
   - selectedAnswer
   - answered
   - handleAnswer()
   - Gameplay riêng của Game 2

   Gameplay thật của Game 4 sẽ được cắm
   vào .stage-game-area sau.
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
     START STAGE
  ======================================================= */

  useEffect(() => {

    if (!stage2Completed) {
      navigate("/game/4");
      return;
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
     TIẾP TỤC STAGE 4
  ======================================================= */

  const handleContinue = () => {

    navigate(
      "/game/4/stage/4"
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
                "/game/4"
              )
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
    <div className="game-stage-page game-stage-3">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="game-stage-header">

        <button
          type="button"
          onClick={() =>
            navigate(
              "/game/4"
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
          ហ្គេម ៤
        </div>

        {/* =================================================
            TITLE
        ================================================= */}

        <h1>
          STAGE 3
        </h1>

        <p>
          GAMEPLAY ĐANG ĐƯỢC XÂY DỰNG
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
            GAMEPLAY PLACEHOLDER

            Gameplay thật của Game 4
            sẽ được cắm vào đây.
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
              Gameplay của Stage 3 Game 4
              sẽ được thêm vào đây.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
};

export default Stage3;