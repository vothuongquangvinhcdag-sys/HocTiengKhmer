import React, {
  useEffect,
  useState,
} from "react";

import {
  isGameCompleted,
  isStageCompleted,
  GAME_EXP,
  GAME_BADGES,
  subscribeGameProgress,
} from "../data/gameProgress";


/* =========================================================
   CONSTANTS
========================================================= */

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


/* =========================================================
   GET COMPLETED STAGES
========================================================= */

const getCompletedStages = (
  gameId
) => {
  let count = 0;

  for (
    let stage = 1;
    stage <= TOTAL_STAGES;
    stage++
  ) {
    if (
      isStageCompleted(
        gameId,
        stage
      )
    ) {
      count++;
    }
  }

  return count;
};


/* =========================================================
   COMPONENT
========================================================= */

const GameProgress = ({
  profile,
  games = [],
}) => {
  /*
    Force re-render khi gameProgress
    được hydrate / update từ Supabase.
  */

  const [, setProgressVersion] =
    useState(0);

  useEffect(() => {
    const unsubscribe =
      subscribeGameProgress(() => {
        setProgressVersion(
          (value) =>
            value + 1
        );
      });

    return unsubscribe;
  }, []);


  /* =======================================================
     PROFILE
  ======================================================= */

  const exp =
    Number(
      profile?.exp
    ) || 0;

  const name =
    profile?.full_name ||
    profile?.name ||
    profile?.username ||
    "NGƯỜI HỌC";


  /* =======================================================
     LEVEL
  ======================================================= */

  const level =
    Number(
      profile?.level
    ) || 1;


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
    LEVEL_EXP[level + 1] ??
    currentLevelExp;


  const progressExp =
    Math.max(
      0,
      exp -
        currentLevelExp
    );


  const requiredExp =
    Math.max(
      1,
      nextLevelExp -
        currentLevelExp
    );


  const expPercent =
    level >= 10
      ? 100
      : Math.min(
          100,
          Math.round(
            (
              progressExp /
              requiredExp
            ) *
              100
          )
        );


  /* =======================================================
     COMPLETED GAMES
  ======================================================= */

  const completedGames =
    games.filter(
      (game) =>
        isGameCompleted(
          game.id
        )
    );


  const completedGameCount =
    completedGames.length;


  /* =======================================================
     BADGES
  ======================================================= */

  const earnedBadges =
    games.filter(
      (game) =>
        isGameCompleted(
          game.id
        )
    );


  const badgeCount =
    earnedBadges.length;


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
            XIN CHÀO{" "}
            <strong>
              {name}
            </strong>
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
                width:
                  `${expPercent}%`,
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
          TỔNG QUAN THÀNH TÍCH
      ================================================= */}

      <section className="game-progress-section">

        <div className="progress-section-title">
          🏆 THÀNH TÍCH GAME
        </div>

        <div className="game-progress-list">

          {games.map((game) => {

            const completedStages =
              getCompletedStages(
                game.id
              );


            const percent =
              Math.round(
                (
                  completedStages /
                  TOTAL_STAGES
                ) *
                  100
              );


            const completed =
              isGameCompleted(
                game.id
              );


            const unlocked =
              game.id === 1 ||
              completedStages > 0 ||
              games.some(
                (g) =>
                  g.id ===
                    game.id - 1 &&
                  isGameCompleted(
                    g.id
                  )
              );


            const color =
              GAME_COLORS[
                game.id
              ] ||
              "green";


            let status =
              "CHƯA MỞ KHÓA";


            if (
              completed
            ) {
              status =
                "✓ HOÀN THÀNH";
            } else if (
              completedStages >
              0
            ) {
              status =
                "◉ ĐANG HỌC";
            } else if (
              unlocked
            ) {
              status =
                "○ CHƯA BẮT ĐẦU";
            }


            const badge =
              GAME_BADGES[
                Number(
                  game.id
                )
              ] || {
                name:
                  `Chiến binh Game ${game.id}`,
                icon: "🏆",
              };


            return (
              <div
                key={game.id}
                className={
                  `game-progress-card game-progress-${color} ${
                    !unlocked
                      ? "game-progress-locked"
                      : ""
                  }`
                }
              >

                {/* TOP */}

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


                {/* NAME */}

                <div className="game-progress-name">

                  {GAME_NAMES[
                    game.id
                  ] ||
                    game.title ||
                    `Game ${game.id}`}

                </div>


                {/* PROGRESS BAR */}

                <div className="game-progress-bar">

                  <div
                    style={{
                      width:
                        `${percent}%`,
                    }}
                  />

                </div>


                {/* BOTTOM */}

                <div className="game-progress-bottom">

                  <span>
                    {status}
                  </span>

                  <strong>
                    {percent}%
                  </strong>

                </div>


                {/* EXP */}

                <div className="game-progress-exp">

                  EXP GAME:{" "}

                  <strong>
                    +{GAME_EXP(
                      game.id
                    ).toLocaleString()}{" "}
                    EXP
                  </strong>

                </div>


                {/* BADGE KHI HOÀN THÀNH */}

                {completed && (
                  <div className="game-progress-badge">

                    <span>
                      {badge.icon}
                    </span>

                    <div>

                      <small>
                        DANH HIỆU ĐẠT ĐƯỢC
                      </small>

                      <strong>
                        {badge.name}
                      </strong>

                    </div>

                  </div>
                )}

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

          <strong>
            {badgeCount}
          </strong>{" "}

          HUY HIỆU

        </div>


        {badgeCount === 0 ? (

          <div className="badge-empty">

            <div className="badge-empty-icon">
              🔒
            </div>

            <strong>
              Chưa có danh hiệu trò chơi.
            </strong>

            <span>
              Hãy tiếp tục chinh phục các Game!
            </span>

          </div>

        ) : (

          <div className="badge-list">

            {games.map((game) => {

              const completed =
                isGameCompleted(
                  game.id
                );


              const badge =
                GAME_BADGES[
                  Number(
                    game.id
                  )
                ] || {
                  name:
                    `Chiến binh Game ${game.id}`,
                  icon: "🏆",
                };


              return (
                <div
                  key={game.id}
                  className={
                    `badge-card ${
                      completed
                        ? "badge-earned"
                        : "badge-locked"
                    }`
                  }
                >

                  <div className="badge-icon">

                    {completed
                      ? badge.icon
                      : "🔒"}

                  </div>


                  <div className="badge-name">

                    {completed
                      ? badge.name
                      : "???"}

                  </div>


                  {completed && (
                    <div className="badge-status">
                      GAME {game.id} • ĐẠT ĐƯỢC
                    </div>
                  )}

                </div>
              );
            })}

          </div>
        )}

      </section>

    </section>
  );
};


export default GameProgress;