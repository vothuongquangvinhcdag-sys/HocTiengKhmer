import React, { useEffect, useState } from "react";

import StageResult from "../../components/StageResult";

import {
  isStageCompleted,
  recordStageScore,
  completeStage,
  recordStagePlay,
} from "../../data/gameProgress";

import "../../shared/GameStage.css";

const MAX_ATTEMPTS = 3;

const Stage2 = ({ navigate }) => {
  const gameId = 2;
  const stageId = 2;

  const [attempt, setAttempt] = useState(1);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(null);
  const [isFirstWin, setIsFirstWin] = useState(false);

  /* =======================================================
     KIỂM TRA STAGE 1
  ======================================================= */

  const stage1Completed = isStageCompleted(2, 1);

  /* =======================================================
     BẢO VỆ STAGE 2
  ======================================================= */

  useEffect(() => {
    if (!stage1Completed) {
      navigate("/game/2");
    }
  }, [stage1Completed, navigate]);

  /* =======================================================
     THẮNG
     → ĐÂY MỚI TÍNH 1 LẦN CHƠI
  ======================================================= */

  const handleWin = () => {
    // Mỗi lần thắng = 1 lần chơi
    recordStagePlay(gameId, stageId);

    const finalScore = score + 100;

    recordStageScore(
      gameId,
      stageId,
      finalScore
    );

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
     → ĐÂY MỚI TÍNH 1 LẦN CHƠI
  ======================================================= */

  const handleLose = () => {
    // Mỗi lần thua = 1 lần chơi
    recordStagePlay(gameId, stageId);

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
    setAttempt(1);
    setScore(0);
    setResult(null);
    setIsFirstWin(false);

    // KHÔNG recordStagePlay ở đây
  };

  /* =======================================================
     LƯỢT TIẾP THEO
  ======================================================= */

  const handleNextAttempt = () => {
    if (attempt >= MAX_ATTEMPTS) {
      setResult("lose");
      return;
    }

    setAttempt(
      (current) => current + 1
    );

    setResult(null);
  };

  /* =======================================================
     TIẾP TỤC STAGE 3
  ======================================================= */

  const handleContinue = () => {
    navigate("/game/2/stage/3");
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
    <div className="game-stage-page game-stage-2">

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
          STAGE 2
        </h1>

        <p>
          Màn chơi thứ hai
        </p>

        <div className="stage-play-info">

          <strong>
            LƯỢT {attempt} / {MAX_ATTEMPTS}
          </strong>

          <span>
            ĐIỂM: {score}
          </span>

        </div>

        <section className="stage-game-placeholder">

          <div className="stage-placeholder-icon">
            🎮
          </div>

          <h2>
            NỘI DUNG STAGE 2
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

export default Stage2;