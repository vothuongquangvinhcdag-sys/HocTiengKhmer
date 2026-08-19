import React from "react";

const StageResult = ({
  gameId,
  result,
  stageId,
  isFirstWin = false,
  isFinalStage = false,
  onRetry,
  onContinue,
  onComplete,
  onBack,
}) => {
  /* =======================================================
     KIỂM TRA DỮ LIỆU
  ======================================================= */

  const safeGameId = Number(gameId);
  const safeStageId = Number(stageId);

  const isValidGame =
    Number.isInteger(safeGameId) &&
    safeGameId >= 1;

  const isValidStage =
    Number.isInteger(safeStageId) &&
    safeStageId >= 1;

  const isWin = result === "win";

  /* =======================================================
     EXP THEO GAME
  ======================================================= */

  const gameExp =
    isValidGame
      ? safeGameId * 1000
      : 0;

  const formattedExp =
    gameExp.toLocaleString("vi-VN");

  /* =======================================================
     CLASS CSS
  ======================================================= */

  const stageClass =
    isValidStage
      ? `stage-result-stage-${safeStageId}`
      : "";

  const gameClass =
    isValidGame
      ? `stage-result-game-${safeGameId}`
      : "";

  /* =======================================================
     DỮ LIỆU KHÔNG HỢP LỆ
  ======================================================= */

  if (!isValidGame || !isValidStage) {
    return (
      <section className="stage-result stage-result-error">
        <div className="stage-result-icon">
          ⚠️
        </div>

        <h1>
          LỖI DỮ LIỆU GAME
        </h1>

        <p>
          Không xác định được Game hoặc Stage.
        </p>

        <button
          type="button"
          onClick={onBack}
        >
          QUAY LẠI
        </button>
      </section>
    );
  }

  /* =======================================================
     HOÀN THÀNH GAME LẦN ĐẦU

     QUAN TRỌNG:
     Không kiểm tra rewardClaimed ở đây.

     Stage4 đã claim EXP/Badge trước khi mở
     StageResult, nhưng người chơi vẫn phải
     nhìn thấy màn hình phần thưởng.
  ======================================================= */

  if (
    isWin &&
    isFinalStage &&
    isFirstWin
  ) {
    return (
      <section
        className={`
          stage-result
          stage-result-final
          ${stageClass}
          ${gameClass}
        `}
      >
        <div className="stage-result-icon">
          🏆
        </div>

        <div className="stage-result-khmer">
          ជោគជ័យ!
        </div>

        <h1>
          HOÀN THÀNH GAME {safeGameId}
        </h1>

        <p>
          Chúc mừng! Bạn đã chinh phục
          toàn bộ {safeStageId} màn chơi.
        </p>

        <div className="stage-reward">
          <strong>
            +{formattedExp} EXP
          </strong>

          <span>
            🏅 DANH HIỆU GAME {safeGameId}
          </span>
        </div>

        <button
          type="button"
          onClick={onComplete}
        >
          HOÀN THÀNH
        </button>
      </section>
    );
  }

  /* =======================================================
     THẮNG STAGE THƯỜNG - LẦN ĐẦU
  ======================================================= */

  if (
    isWin &&
    isFirstWin
  ) {
    return (
      <section
        className={`
          stage-result
          ${stageClass}
          ${gameClass}
        `}
      >
        <div className="stage-result-icon">
          🎉
        </div>

        <div className="stage-result-khmer">
          ជោគជ័យ!
        </div>

        <h1>
          CHIẾN THẮNG!
        </h1>

        <p>
          Chúc mừng! Bạn đã vượt qua
          Stage {safeStageId}.
        </p>

        <button
          type="button"
          onClick={onContinue}
        >
          TIẾP TỤC
        </button>
      </section>
    );
  }

  /* =======================================================
     THẮNG NHƯNG ĐÃ HOÀN THÀNH TRƯỚC ĐÓ
  ======================================================= */

  if (isWin) {
    return (
      <section
        className={`
          stage-result
          ${stageClass}
          ${gameClass}
        `}
      >
        <div className="stage-result-icon">
          🎉
        </div>

        <div className="stage-result-khmer">
          ជោគជ័យ!
        </div>

        <h1>
          CHIẾN THẮNG!
        </h1>

        <p>
          Bạn đã hoàn thành Stage{" "}
          {safeStageId}.
        </p>

        <button
          type="button"
          onClick={onRetry}
        >
          CHƠI LẠI
        </button>

        <button
          type="button"
          onClick={onBack}
        >
          DANH SÁCH STAGE
        </button>
      </section>
    );
  }

  /* =======================================================
     THUA
  ======================================================= */

  return (
    <section
      className={`
        stage-result
        stage-result-lose
        ${stageClass}
        ${gameClass}
      `}
    >
      <div className="stage-result-icon">
        💔
      </div>

      <div className="stage-result-khmer">
        ព្យាយាមម្តងទៀត!
      </div>

      <h1>
        CHƯA VƯỢT QUA
      </h1>

      <p>
        Đừng bỏ cuộc! Hãy thử lại.
      </p>

      <button
        type="button"
        onClick={onRetry}
      >
        CHƠI LẠI
      </button>

      <button
        type="button"
        onClick={onBack}
      >
        DANH SÁCH STAGE
      </button>
    </section>
  );
};

export default StageResult;