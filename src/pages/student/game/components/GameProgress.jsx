import React from "react";

import {
  isGameCompleted,
  isStageCompleted,
  GAME_EXP,
} from "../data/gameProgress";

const TOTAL_STAGES = 4;

const GAME_COLORS = {
  1: "green",
  2: "blue",
  3: "purple",
  4: "red",
};

const GAME_NAMES = {
  1: "Hành trình chữ Khmer",
  2: "Thử thách tiếp theo",
  3: "Chinh phục Khmer",
  4: "Bậc thầy tiếng Khmer",
};

const getCompletedStages = (gameId) => {
  let count = 0;

  for (let stage = 1; stage <= TOTAL_STAGES; stage++) {
    if (isStageCompleted(gameId, stage)) {
      count++;
    }
  }

  return count;
};

const GameProgress = ({ profile, games = [] }) => {
  const exp = Number(profile?.exp) || 0;

  const name =
    profile?.full_name ||
    profile?.name ||
    "NGƯỜI HỌC";

  /*
    Nếu project đã có level trong profile
    thì dùng trực tiếp.
  */
  const level =
    Number(profile?.level) || 1;

  /*
    EXP cần cho Level tiếp theo.
    Dùng theo hệ thống hiện tại của project.
  */
  const LEVEL_EXP = {
    1: 0,
    2: 100,
    3: 200,
    4: 400,
    5: 800,
    6: 1600,
    7: 3200,
    8: 6400,
    9: 12800,
    10: 25600,
  };

  const currentLevelExp =
    LEVEL_EXP[level] ?? 0;

  const nextLevelExp =
    LEVEL_EXP[level + 1] ?? currentLevelExp;

  const progressExp =
    Math.max(
      0,
      exp - currentLevelExp
    );

  const requiredExp =
    Math.max(
      1,
      nextLevelExp - currentLevelExp
    );

  const expPercent =
    level >= 10
      ? 100
      : Math.min(
          100,
          Math.round(
            (progressExp / requiredExp) * 100
          )
        );

  const completedGames = games.filter(
    (game) =>
      isGameCompleted(game.id)
  ).length;

  const badgeCount = completedGames;

  return (
    <section className="game-progress">

      {/* =================================================
          THÔNG TIN NGƯỜI HỌC
      ================================================= */}

      <section className="learner-progress-card">

        <div className="progress-section-title">
          👤 THÔNG TIN NGƯỜI HỌC
        </div>

        <div className="learner-info">

          <div className="learner-name">
            XIN CHÀO,{" "}
            <strong>{name}</strong>
          </div>

          <div className="level-row">

            <strong>
              LEVEL {level}
            </strong>

            <span>
              {exp.toLocaleString()} EXP
            </span>

          </div>

          <div className="exp-bar">
            <div
              className="exp-bar-fill"
              style={{
                width: `${expPercent}%`,
              }}
            />
          </div>

          <div className="exp-detail">
            {exp.toLocaleString()} /{" "}
            {nextLevelExp.toLocaleString()} EXP
          </div>

          <div className="exp-glow-text">
            ✨ TIẾN TRÌNH LEVEL
          </div>

        </div>

      </section>

      {/* =================================================
          TIẾN ĐỘ GAME
      ================================================= */}

      <section className="game-progress-section">

        <div className="progress-section-title">
          📊 TIẾN ĐỘ TRÒ CHƠI
        </div>

        <div className="game-progress-list">

          {games.map((game) => {

            const completedStages =
              getCompletedStages(game.id);

            const percent =
              Math.round(
                (completedStages /
                  TOTAL_STAGES) *
                  100
              );

            const completed =
              completedStages === TOTAL_STAGES;

            const unlocked =
              game.id === 1 ||
              completedStages > 0 ||
              games.some(
                (g) =>
                  g.id === game.id - 1 &&
                  isGameCompleted(g.id)
              );

            const color =
              GAME_COLORS[game.id] ||
              "green";

            let status = "CHƯA MỞ KHÓA";

            if (completed) {
              status = "✓ HOÀN THÀNH";
            } else if (completedStages > 0) {
              status = "◉ ĐANG HỌC";
            } else if (unlocked) {
              status = "○ CHƯA BẮT ĐẦU";
            }

            return (
              <div
                key={game.id}
                className={`game-progress-card game-progress-${color} ${
                  !unlocked
                    ? "game-progress-locked"
                    : ""
                }`}
              >

                <div className="game-progress-top">

                  <strong>
                    {unlocked
                      ? "●"
                      : "🔒"}{" "}
                    GAME {game.id}
                  </strong>

                  <span>
                    {completedStages} /{" "}
                    {TOTAL_STAGES} MÀN
                  </span>

                </div>

                <div className="game-progress-name">
                  {GAME_NAMES[game.id] ||
                    game.title ||
                    `Game ${game.id}`}
                </div>

                <div className="game-progress-bar">

                  <div
                    style={{
                      width: `${percent}%`,
                    }}
                  />

                </div>

                <div className="game-progress-bottom">

                  <span>
                    {status}
                  </span>

                  <strong>
                    {percent}%
                  </strong>

                </div>

                <div className="game-progress-exp">
                  EXP GAME:{" "}
                  <strong>
                    +{GAME_EXP(game.id).toLocaleString()} EXP
                  </strong>
                </div>

              </div>
            );
          })}

        </div>

      </section>

      {/* =================================================
          HUY HIỆU
      ================================================= */}

      <section className="badge-section">

        <div className="progress-section-title">
          🏆 HUY HIỆU
        </div>

        <div className="badge-count">
          ĐÃ ĐẠT{" "}
          <strong>{badgeCount}</strong>{" "}
          HUY HIỆU
        </div>

        <div className="badge-list">

          {games.map((game) => {

            const completed =
              isGameCompleted(game.id);

            return (
              <div
                key={game.id}
                className={`badge-card ${
                  completed
                    ? "badge-earned"
                    : "badge-locked"
                }`}
              >

                <div className="badge-icon">
                  {completed
                    ? "🏆"
                    : "🔒"}
                </div>

                <div className="badge-name">
                  {completed
                    ? `GAME ${game.id}`
                    : "???"}
                </div>

                {completed && (
                  <div className="badge-status">
                    ĐẠT ĐƯỢC
                  </div>
                )}

              </div>
            );
          })}

        </div>

      </section>

    </section>
  );
};

export default GameProgress;