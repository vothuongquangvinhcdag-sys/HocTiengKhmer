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

import "../../shared/GameStage.css";

/* =========================================================
   STAGE 4 — GAME 3
========================================================= */

const GAME_ID = 3;
const STAGE_ID = 4;

const MAX_ATTEMPTS = 3;

/* =========================================================
   STAGE 4
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
     TRẠNG THÁI GAME
  ======================================================= */

  const [
    attemptsLeft,
    setAttemptsLeft,
  ] = useState(
    MAX_ATTEMPTS
  );

  const [
    score,
    setScore,
  ] = useState(0);

  const [
    combo,
    setCombo,
  ] = useState(0);

  /* =======================================================
     RESULT
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

      navigate(
        "/game/3"
      );

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

    /* -----------------------------------------------
       KẾT THÚC LƯỢT CHƠI
    ----------------------------------------------- */

    recordStagePlay(
      GAME_ID,
      STAGE_ID
    );

    /* -----------------------------------------------
       LƯU ĐIỂM
    ----------------------------------------------- */

    recordStageScore(
      GAME_ID,
      STAGE_ID,
      finalScore
    );

    /* -----------------------------------------------
       HOÀN THÀNH STAGE
    ----------------------------------------------- */

    const completed =
      completeStage(
        GAME_ID,
        STAGE_ID
      );

    const firstWin =
      completed.isFirstWin;

    setIsFirstWin(
      firstWin
    );

    /* =================================================
       CLAIM EXP + BADGE

       Chỉ lần đầu hoàn thành GAME 3.
    ================================================= */

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

      /*
       * Vẫn hiện phần thưởng
       * trên StageResult.
       */

      setRewardClaimed(
        false
      );

    } else {

      /*
       * Game đã hoàn thành trước đó.
       * Không hiện nhận thưởng lần nữa.
       */

      setRewardClaimed(
        true
      );
    }

    setScore(
      finalScore
    );

    setResult(
      "win"
    );
  };

  /* =======================================================
     THUA
  ======================================================= */

  const handleLose = () => {

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

    setResult(null);

    setIsFirstWin(false);

    setRewardClaimed(false);

    /*
     * Retry không tăng playCount.
     */

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
     CHƯA MỞ
  ======================================================= */

  if (!stage3Completed) {
    return null;
  }

  /* =======================================================
     RESULT
  ======================================================= */

  if (result) {

    return (
      <div className="game-stage-page">

        <main className="game-stage-content">

          <StageResult
            gameId={GAME_ID}
            result={result}
            stageId={STAGE_ID}

            isFirstWin={
              isFirstWin
            }

            isFinalStage={true}

            rewardClaimed={
              rewardClaimed
            }

            onRetry={
              handleRetry
            }

            onComplete={
              handleComplete
            }

            onBack={() =>
              navigate(
                "/game/3"
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
    <div className="game-stage-page">

      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="game-stage-header">

        <button
          type="button"
          onClick={() =>
            navigate(
              "/game/3"
            )
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
          ហ្គេម ៣
        </div>

        <h1>
          STAGE 4
        </h1>

        <p>
          GAMEPLAY SẼ THIẾT KẾ SAU
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
            ĐIỂM: {score}
          </span>

          <span>
            COMBO: {combo}
          </span>

        </div>

        {/* =================================================
            GAMEPLAY
        ================================================= */}

        <section className="stage-game-area">

          <div className="stage-question">

            <span className="stage-question-label">
              GAME 3 — STAGE 4
            </span>

            <div className="stage-khmer-letter">
              ?
            </div>

            <p>
              Khu vực gameplay
            </p>

          </div>

          <div className="stage-options">

            <button
              type="button"
              className="stage-option"
              onClick={() =>
                handleWin(10)
              }
            >
              TEST THẮNG
            </button>

            <button
              type="button"
              className="stage-option"
              onClick={() => {

                const next =
                  attemptsLeft - 1;

                setAttemptsLeft(
                  next
                );

                setCombo(0);

                if (
                  next <= 0
                ) {

                  handleLose();

                }

              }}
            >
              TEST SAI
            </button>

          </div>

        </section>

      </main>

    </div>
  );
};

export default Stage4;