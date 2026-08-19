import React from "react";

const GameCard = ({
  game,
  unlocked,
  completed,
  onClick,
}) => {
  return (
    <button
      type="button"
      className={`game-card ${
        unlocked ? "is-unlocked" : "is-locked"
      } ${completed ? "is-completed" : ""}`}
      disabled={!unlocked}
      onClick={onClick}
    >
      <div className="game-card-number">
        {game.id}
      </div>

      <div className="game-card-content">
        <div className="game-card-khmer">
          {game.khmerTitle}
        </div>

        <h3>{game.title}</h3>

        <p>{game.description}</p>

        <span>
          {completed
            ? "✓ ĐÃ HOÀN THÀNH"
            : unlocked
            ? "BẮT ĐẦU"
            : "🔒 CHƯA MỞ KHÓA"}
        </span>
      </div>
    </button>
  );
};

export default GameCard;