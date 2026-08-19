import React, { useEffect, useState } from "react";

import StageResult from "../../components/StageResult";

import {
  startStage,
  recordStagePlay,
  recordStageScore,
  completeStage,
} from "../../data/gameProgress";

import "../../shared/GameStage.css";

const MAX_ATTEMPTS = 3;

const Stage1 = ({ navigate }) => {
  const gameId = 2;
  const stageId = 1;

  const [attempt, setAttempt] = useState(1);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(null);
  const [isFirstWin, setIsFirstWin] = useState(false);

  /* =======================================================
     BẮT ĐẦU STAGE

     Vào Stage / reload / retry
     → KHÔNG tăng playCount
  ======================================================= */

  useEffect(() => {
    startStage(gameId, stageId);
  }, []);

  /* =======================================================
     THẮNG

     Thắng = 1 lần chơi
  ======================================================= */

  const handleWin = () => {
    const finalScore = score + 100;

    /* Tính 1 lần chơi */
    recordStagePlay(
      gameId,
      stageId
    );

    /* Lưu điểm */
    recordStageScore(
      gameId,
      stageId,
      finalScore
    );

    /* Hoàn thành Stage */
    const completed = completeStage(
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

     Thua = 1 lần chơi
  ======================================================= */

  const handleLose = () => {
    /* Tính 1 lần chơi */
    recordStagePlay(
      gameId,
      stageId
    );

    /* Lưu điểm */
    recordStageScore(
      gameId,
      stageId,
      score
    );

    setResult("lose");
  };

  /* =======================================================
     CHƠI LẠI

     Không tăng playCount
  ======================================================= */

  const handleRetry = () => {
    setAttempt(1);
    setScore(0);
    setResult(null);
    setIsFirstWin(false);

    startStage(
      gameId,
      stageId
    );
  };

  /* =======================================================
     LƯỢT TIẾP THEO

     Không tăng playCount
  ======================================================= */

  const handleNextAttempt = () => {
    if (
      attempt >= MAX_ATTEMPTS
    ) {
      setResult("lose");
      return;
    }

    setAttempt(
      (current) =>
        current + 1
    );

    setResult(null);
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
              navigate("/game/2")
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
    <div className="game-stage-page game-stage-1">

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
          Màn chơi đầu tiên
        </p>

        <div className="stage-play-info">

          <strong>
            LƯỢT {attempt} / {MAX_ATTEMPTS}
          </strong>

          <span>
            ĐIỂM: {score}
          </span>

        </div>

        {/* =================================================
            KHU VỰC GAME TẠM
        ================================================= */}

        <section className="stage-game-placeholder">

          <div className="stage-placeholder-icon">
            🎮
          </div>

          <h2>
            NỘI DUNG STAGE 1
          </h2>

          <p>
            Gameplay Khmer sẽ được xây dựng
            tại đây.
          </p>

          <div className="stage-test-buttons">

            <button
              type="button"
              onClick={handleWin}
            >
              🏆 THẮNG
            </button>

            <button
              type="button"
              onClick={handleLose}
            >
              💔 THUA
            </button>

          </div>

        </section>

        {/* =================================================
            LƯỢT TIẾP THEO
        ================================================= */}

        {attempt < MAX_ATTEMPTS && (
          <button
            type="button"
            onClick={handleNextAttempt}
          >
            LƯỢT TIẾP THEO
          </button>
        )}

      </main>

    </div>
  );
};

export default Stage1;