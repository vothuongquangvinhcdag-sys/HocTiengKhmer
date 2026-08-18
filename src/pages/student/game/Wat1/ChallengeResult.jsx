import React from "react";
import "./ChallengeResult.css";

export default function ChallengeResult({
  result = null,
  progress = null,
  onContinue,
  onBackToMenu,
}) {
  const {
    challengeId = "stage1",
    won = false,
    score = 0,
    xp = 0,
    combo = 0,
  } = result || {};

  const isWin = won === true;

  const stageMap = {
    stage1: "THỬ THÁCH I",
    stage2: "THỬ THÁCH II",
    stage3: "THỬ THÁCH III",
    final: "THỬ THÁCH CUỐI CÙNG",
  };

  const stageName =
    stageMap[challengeId] ||
    "THỬ THÁCH";

  const nextStageName =
    challengeId === "stage1"
      ? "THỬ THÁCH II"
      : challengeId === "stage2"
      ? "THỬ THÁCH III"
      : challengeId === "stage3"
      ? "THỬ THÁCH CUỐI CÙNG"
      : "WAT 2";

  const isFinal =
    challengeId === "final";

  return (
    <div className="challenge-result-page">
      <div
        className={`challenge-result-card ${
          isWin
            ? "result-win"
            : "result-fail"
        }`}
      >
        {/* ICON */}
        <div className="challenge-result-icon">
          {isWin ? "✦" : "⚔"}
        </div>

        {/* TITLE */}
        <h1 className="challenge-result-title">
          {isWin
            ? isFinal
              ? "CHÌA KHÓA ÁK-SÂ"
              : "THỬ THÁCH HOÀN THÀNH"
            : "THỬ THÁCH THẤT BẠI"}
        </h1>

        {/* STAGE */}
        <div className="challenge-result-stage">
          {stageName}
        </div>

        {/* FINAL */}
        {isWin && isFinal ? (
          <>
            <div className="final-key-icon">
              🔑
            </div>

            <h2 className="final-key-title">
              BẠN ĐÃ TÌM THẤY!
            </h2>

            <p className="final-key-description">
              Bạn đã hoàn thành toàn bộ
              thử thách của WAT ÁK-SÂ.
            </p>

            <div className="gate-unlocked">
              🔓 CỔNG SỐ 2
              <br />
              <span>
                ĐÃ ĐƯỢC MỞ KHÓA
              </span>
            </div>
          </>
        ) : (
          <>
            {/* STATS */}
            <div className="challenge-result-stats">
              <div className="result-stat">
                <span className="result-stat-icon">
                  ⭐
                </span>

                <span className="result-stat-label">
                  ĐIỂM
                </span>

                <strong className="result-stat-value">
                  {score}
                </strong>
              </div>

              {isWin && (
                <div className="result-stat">
                  <span className="result-stat-icon">
                    ⚡
                  </span>

                  <span className="result-stat-label">
                    XP
                  </span>

                  <strong className="result-stat-value">
                    +{xp}
                  </strong>
                </div>
              )}

              {combo > 0 && (
                <div className="result-stat">
                  <span className="result-stat-icon">
                    🔥
                  </span>

                  <span className="result-stat-label">
                    COMBO
                  </span>

                  <strong className="result-stat-value">
                    {combo}
                  </strong>
                </div>
              )}
            </div>

            {/* UNLOCK */}
            {isWin && (
              <div className="challenge-unlock-message">
                <div className="unlock-icon">
                  🔓
                </div>

                <div className="unlock-content">
                  <strong>
                    {nextStageName} ĐÃ MỞ
                  </strong>

                  <span>
                    Bạn đã mở khóa thử thách
                    tiếp theo.
                  </span>
                </div>
              </div>
            )}

            {/* FAIL */}
            {!isWin && (
              <p className="challenge-fail-message">
                Đừng bỏ cuộc. Hãy thử lại!
              </p>
            )}
          </>
        )}

        {/* ACTION */}
        <div className="challenge-result-actions">
          <button
            type="button"
            className={
              `challenge-result-button ${
                isWin
                  ? "primary"
                  : "secondary"
              }`
            }
            onClick={
              isWin
                ? onContinue
                : onBackToMenu
            }
          >
            {isWin
              ? "TIẾP TỤC"
              : "QUAY LẠI DANH SÁCH"}
          </button>
        </div>
      </div>
    </div>
  );
}