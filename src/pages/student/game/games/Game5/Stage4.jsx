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

import "../../shared/GameStage.css";
import "./Stage4.css";

/* =========================================================
   GAME 5 — STAGE 4

   KHUNG SƯỜN GAMEPLAY

   Gameplay thật sẽ được cắm vào:

   .stage-game-area

   Không chứa gameplay riêng của Game 2.
========================================================= */

/* =========================================================
   CẤU HÌNH
========================================================= */

const GAME_ID = 5;
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
   STAGE 4
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
     REWARD
  ======================================================= */

  const [
    rewardClaimed,
    setRewardClaimed,
  ] = useState(false);

  /* =======================================================
     START STAGE
  ======================================================= */

  useEffect(() => {

    if (!stage3Completed) {
      navigate("/game/5");
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

    const firstWin =
      completed.isFirstWin;

    setScore(
      finalScore
    );

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

    setResult(
      "win"
    );
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

    setResult(
      "lose"
    );
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

    setRewardClaimed(false);

    startStage(
      GAME_ID,
      STAGE_ID
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
     QUAY VỀ DANH SÁCH STAGE
  ======================================================= */

  const handleBackToStageList = () => {

    navigate(
      "/game/5"
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
     GAMEPLAY PLACEHOLDER

     Gameplay thật của Game 5 Stage 4
     sẽ được cắm vào đây.
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
          ហ្គេម ៥
        </div>

        {/* =================================================
            TITLE
        ================================================= */}

        <h1>
          STAGE 4
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
            GAMEPLAY AREA

            CHỈ LÀ KHUNG.
            KHÔNG CÓ GAMEPLAY GAME 2.
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
              Gameplay của Stage 4 Game 5
              sẽ được thêm vào đây.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
};

export default Stage4;