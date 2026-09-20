import React from "react";

const GameHeader = ({
  navigate,
}) => {
  return (
    <header className="game-header">
      <button
        type="button"
        className="game-back-button"
        onClick={() =>
          navigate("/student")
        }
      >
        <span className="game-back-arrow">
          ←
        </span>

        <span>
          Quay lại trang chủ
        </span>
      </button>
    </header>
  );
};

export default GameHeader;