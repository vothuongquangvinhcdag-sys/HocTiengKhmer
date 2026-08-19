import React from "react";

const StageCard = ({
  stage,
  unlocked = false,
  completed = false,
  onClick,
}) => {
  const {
    id,
    title,
    description,
    playCount = 0,
    highScore = 0,
  } = stage;

  return (
    <button
      type="button"
      className={`stage-card ${
        unlocked
          ? "stage-card-unlocked"
          : "stage-card-locked"
      } ${
        completed
          ? "stage-card-completed"
          : ""
      }`}
      disabled={!unlocked}
      onClick={onClick}
    >
      <div className="stage-card-number">
        {completed
          ? "✓"
          : unlocked
          ? id
          : "🔒"}
      </div>

      <div className="stage-card-info">
        <h3>{title}</h3>

        <p>
          {unlocked
            ? description
            : `Hoàn thành Stage ${
                id - 1
              } để mở khóa`}
        </p>

        {unlocked && (
          <div className="stage-card-stats">
            <span>
              🎮 {playCount} lần chơi
            </span>

            <span>
              ⭐ Cao nhất: {highScore}
            </span>
          </div>
        )}
      </div>

      <div className="stage-card-arrow">
        {unlocked ? "→" : "🔒"}
      </div>
    </button>
  );
};

export default StageCard;