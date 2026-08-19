import React, { useEffect, useState } from "react";

import StageResult from "../../components/StageResult";

import {
  isStageCompleted,
  recordStagePlay,
  recordStageScore,
  completeStage,
  hasClaimedGameExp,
  hasClaimedBadge,
  claimGameExp,
  claimBadge,
} from "../../data/gameProgress";

import "../../shared/GameStage.css";

const MAX_ATTEMPTS = 3;

const Stage4 = ({ navigate }) => {
  const gameId = 2;
  const stageId = 4;

  const [attempt, setAttempt] = useState(1);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(null);

  const [isFirstWin, setIsFirstWin] =
    useState(false);

  /*
    PHẦN THƯỞNG ĐÃ NHẬN TRƯỚC ĐÓ
  */
  const [rewardClaimed, setRewardClaimed] =
    useState(false);

  /* =======================================================
     KIỂM TRA STAGE 3
  ======================================================= */

  const stage3Completed =
    isStageCompleted(
      gameId,
      3
    );

  /* =======================================================
     BẢO VỆ STAGE 4

     Vào Stage / reload
     → KHÔNG tăng playCount
  ======================================================= */

  useEffect(() => {
    if (!stage3Completed) {
      navigate("/game/2");
      return;
    }

    const expClaimed =
      hasClaimedGameExp(gameId);

    const badgeClaimed =
      hasClaimedBadge(gameId);

    setRewardClaimed(
      expClaimed && badgeClaimed
    );
  }, [
    stage3Completed,
    navigate,
  ]);

  /* =======================================================
     THẮNG

     Thắng = 1 lần chơi
  ======================================================= */

  const handleWin = () => {
    const finalScore =
      score + 100;

    /*
      Tính 1 lần chơi
    */
    recordStagePlay(
      gameId,
      stageId
    );

    /*
      Lưu điểm
    */
    recordStageScore(
      gameId,
      stageId,
      finalScore
    );

    /*
      Hoàn thành Stage 4
      → hoàn thành Game tương ứng
    */
    const completed =
      completeStage(
        gameId,
        stageId
      );

    /*
      Kiểm tra phần thưởng
      TRƯỚC khi nhận
    */
    const alreadyRewarded =
      hasClaimedGameExp(gameId) &&
      hasClaimedBadge(gameId);

    setScore(finalScore);

    setIsFirstWin(
      completed.isFirstWin
    );

    /*
      Nhận EXP lần đầu
    */
    if (
      completed.isFirstWin &&
      !hasClaimedGameExp(gameId)
    ) {
      claimGameExp(gameId);
    }

    /*
      Nhận danh hiệu lần đầu
    */
    if (
      completed.isFirstWin &&
      !hasClaimedBadge(gameId)
    ) {
      claimBadge(gameId);
    }

    /*
      Nếu đã nhận từ trước
      → true

      Nếu đây là lần đầu
      → false
    */
    setRewardClaimed(
      alreadyRewarded
    );

    setResult("win");
  };

  /* =======================================================
     THUA

     Thua = 1 lần chơi
  ======================================================= */

  const handleLose = () => {
    /*
      Tính 1 lần chơi
    */
    recordStagePlay(
      gameId,
      stageId
    );

    /*
      Lưu điểm
    */
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
  };

  /* =======================================================
     LƯỢT TIẾP THEO

     Không tăng playCount

     Hết 3 lượt
     → THUA
     → handleLose() tính 1 lần chơi
  ======================================================= */

  const handleNextAttempt = () => {
    if (
      attempt >= MAX_ATTEMPTS
    ) {
      handleLose();
      return;
    }

    setAttempt(
      (current) =>
        current + 1
    );

    setResult(null);
  };

  /* =======================================================
     HOÀN THÀNH GAME

     Stage 4 → Game tương ứng
  ======================================================= */

  const handleComplete = () => {
    navigate("/game");
  };

  /* =======================================================
     CHƯA ĐƯỢC MỞ
  ======================================================= */

  if (!stage3Completed) {
    return null;
  }

  /* =======================================================
     KẾT QUẢ
  ======================================================= */

  if (result) {
    return (
      <div className="game-stage-page game-stage-4">

        <main className="game-stage-content">

          <StageResult
            gameId={gameId}
            result={result}
            stageId={stageId}
            isFirstWin={isFirstWin}
            isFinalStage={true}
            rewardClaimed={
              rewardClaimed
            }
            onRetry={handleRetry}
            onComplete={
              handleComplete
            }
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
    <div className="game-stage-page game-stage-4">

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
          STAGE 4
        </h1>

        <p>
          Màn chơi cuối cùng
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
            🏆
          </div>

          <h2>
            NỘI DUNG STAGE 4
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
            onClick={
              handleNextAttempt
            }
          >
            LƯỢT TIẾP THEO
          </button>
        )}

      </main>

    </div>
  );
};

export default Stage4;