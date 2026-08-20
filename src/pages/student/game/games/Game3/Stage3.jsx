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

/* =========================================================
   STAGE 3 — GAME 3
========================================================= */

const GAME_ID = 3;
const STAGE_ID = 3;

const MAX_ATTEMPTS = 3;

/* =========================================================
   STAGE 3
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
     TRẠNG THÁI GAME
  ======================================================= */

  const [
    attemptsLeft,
    setAttemptsLeft,
  ] = useState(MAX_ATTEMPTS);

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
     START STAGE
  ======================================================= */

  useEffect(() => {

    if (!stage2Completed) {
      return;
    }

    startStage(
      GAME_ID,
      STAGE_ID
    );

  }, [
    stage2Completed,
  ]);

  /* =======================================================
     BẢO VỆ STAGE
  ======================================================= */

  useEffect(() => {

    if (!stage2Completed) {

      navigate(
        "/game/3"
      );

    }

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

    /*
     * Kết thúc một lượt chơi
     */

    recordStagePlay(
      GAME_ID,
      STAGE_ID
    );

    /*
     * Lưu điểm
     */

    recordStageScore(
      GAME_ID,
      STAGE_ID,
      finalScore
    );

    /*
     * Hoàn thành Stage
     */

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

    /*
     * Retry không tăng playCount
     */

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
      "/game/3/stage/4"
    );
  };

  /* =======================================================
     CHƯA MỞ
  ======================================================= */

  if (!stage2Completed) {
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
            isFirstWin={isFirstWin}
            onRetry={
              handleRetry
            }
            onContinue={
              handleContinue
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
          STAGE 3
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
              GAME 3 — STAGE 3
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

export default Stage3;