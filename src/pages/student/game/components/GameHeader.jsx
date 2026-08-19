import React from "react";

const GameHeader = ({ navigate }) => {
  return (
    <header className="game-header">
      <button
        type="button"
        onClick={() => navigate("/student")}
      >
        ← QUAY LẠI TRANG HỌC
      </button>
    </header>
  );
};

export default GameHeader;