import React from "react";

const KHMER_NUMBERS = {
  1: "១",
  2: "២",
  3: "៣",
  4: "៤",
  5: "៥",
};

const GameCard = ({
  game,
  unlocked,
  completed,
  completedStages = 0,
  totalStages = 4,
  progressPercent = 0,
  rewardExp = 0,
  badgeEarned = false,
  badgeIcon = "🏆",
  badgeName = "HUY HIỆU",
  badgeDescription = "",
  onClick,
}) => {
  const cardClassName = [
    "game-card",
    unlocked ? "unlocked" : "locked",
    completed ? "completed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  let statusClass = "";
  let statusIcon = "";
  let statusText = "";

  if (!unlocked) {
    statusClass = "locked";
    statusIcon = "🔒";
    statusText = "CHƯA MỞ KHÓA";
  } else if (completed) {
    statusClass = "completed";
    statusIcon = "✓";
    statusText = "ĐÃ HOÀN THÀNH";
  } else {
    statusClass = "playing";
    statusIcon = "●";
    statusText = "ĐANG CHƠI";
  }

  let actionText = "▶ BẮT ĐẦU";

  if (!unlocked) {
    actionText = "🔒 CHƯA MỞ KHÓA";
  } else if (completed) {
    actionText = "↻ CHƠI LẠI";
  } else if (completedStages > 0) {
    actionText = "▶ TIẾP TỤC";
  }

  const description = unlocked
    ? game.description ||
      "Hành trình chinh phục tiếng Khmer"
    : "Hoàn thành Game trước để mở khóa";

  const khmerNumber =
    KHMER_NUMBERS[game.id] || game.id;

  const khmerTitle =
    game.khmerTitle ||
    game.khmer ||
    game.khmerName ||
    `ហ្គេមទី${khmerNumber}`;

  const vietnameseTitle =
    game.title ||
    `Trò chơi ${game.id}`;

  const formattedReward = Number(
    rewardExp
  ).toLocaleString("vi-VN");

  const handleClick = () => {
    if (!unlocked) {
      return;
    }

    if (typeof onClick === "function") {
      onClick();
    }
  };

  return (
    <article className={cardClassName}>
      {/* =================================================
          CARD HEADER
      ================================================= */}

      <div className="game-card-header">
        <div className="game-card-title-area">
          <div className="game-card-khmer-title">
            {khmerTitle}
          </div>

          <div className="game-card-vietnamese-title">
            {vietnameseTitle}
          </div>
        </div>

        <div
          className={[
            "game-card-status-inline",
            statusClass,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span className="game-card-status-icon">
            {statusIcon}
          </span>

          <span>
            {statusText}
          </span>
        </div>
      </div>

      {/* =================================================
          DESCRIPTION
      ================================================= */}

      <div className="game-card-body">
        <div className="game-card-info">
          <p>
            {description}
          </p>
        </div>
      </div>

      {/* =================================================
          PROGRESS
      ================================================= */}

      <div className="game-card-progress">
        <div className="game-card-progress-top">
          <span>
            TIẾN ĐỘ
          </span>

          <strong>
            {progressPercent}%
          </strong>
        </div>

        <div className="game-card-progress-bar">
          <div
            className="game-card-progress-fill"
            style={{
              width:
                `${progressPercent}%`,
            }}
          />
        </div>
      </div>

      {/* =================================================
          EXTRA INFORMATION
      ================================================= */}

      <div className="game-card-extra">
        {/* ===============================
            SỐ MÀN
        =============================== */}

        <div
          className={[
            "game-card-extra-item",
            "game-card-stages",
            completed
              ? "earned"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="game-card-extra-content">
            <small>
              SỐ MÀN ĐÃ CHƠI
            </small>

            <strong>
              {completedStages} / {totalStages}
            </strong>
          </div>
        </div>

        {/* ===============================
            PHẦN THƯỞNG
        =============================== */}

        <div
          className={[
            "game-card-extra-item",
            "game-card-reward",
            completed
              ? "earned"
              : "not-earned",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="game-card-extra-content">
            <small>
              PHẦN THƯỞNG
            </small>

            {completed ? (
              <strong className="game-card-reward-value">
                <span className="game-card-reward-star">
                  ⭐
                </span>

                <span>
                  +{formattedReward} EXP
                </span>
              </strong>
            ) : (
              <>
                <strong className="game-card-reward-value locked-value">
                  🔒 CHƯA ĐẠT
                </strong>

                <span>
                  Hoàn thành Game để nhận
                </span>
              </>
            )}
          </div>
        </div>

        {/* ===============================
            HUY HIỆU
        =============================== */}

        <div
          className={[
            "game-card-extra-item",
            "game-card-badge",
            completed
              ? "earned"
              : "not-earned",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="game-card-extra-content">
            <small>
              HUY HIỆU
            </small>

            {completed ? (
              <>
                <strong className="game-card-badge-name">
                  <span className="game-card-badge-icon">
                    {badgeIcon || "🏆"}
                  </span>

                  <span>
                    HOÀN THÀNH GAME {game.id}
                  </span>
                </strong>
              </>
            ) : (
              <>
                <strong className="game-card-badge-name locked-value">
                  🔒 CHƯA ĐẠT
                </strong>

                <span>
                  Hoàn thành Game để nhận
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* =================================================
          ACTION BUTTON
      ================================================= */}

      <button
        type="button"
        className={[
          "game-card-action",
          !unlocked
            ? "locked"
            : completed
            ? "restart"
            : "start",
        ]
          .filter(Boolean)
          .join(" ")}
        disabled={!unlocked}
        onClick={(event) => {
          event.stopPropagation();
          handleClick();
        }}
      >
        {actionText}
      </button>
    </article>
  );
};

export default GameCard;
