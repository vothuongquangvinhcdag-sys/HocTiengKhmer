import React, {
  useEffect,
  useState,
} from "react";

import GameHeader from "./components/GameHeader";
import GameCard from "./components/GameCard";

import Game1 from "./games/Game1/Game1";
import Game2 from "./games/Game2/Game2";
import Game3 from "./games/Game3/Game3";
import Game4 from "./games/Game4/Game4";
import Game5 from "./games/Game5/Game5";

import { GAME_DATA } from "./data/gameData";

import {
  isGameUnlocked,
  isGameCompleted,
  isStageCompleted,
  GAME_EXP,
  hasClaimedBadge,
  subscribeGameProgress,
} from "./data/gameProgress";

import "./Game.css";


/* =========================================================
   CONFIG
========================================================= */

const TOTAL_STAGES = 4;


/* =========================================================
   GAME
========================================================= */

const Game = ({
  profile,
  session,
  navigate,
  onLogout,
  path,
}) => {

  /* =======================================================
     PROGRESS VERSION
     -------------------------------------------------------
     Mỗi khi gameProgress thay đổi,
     tăng version để Game Home render lại.
  ======================================================= */

  const [
    progressVersion,
    setProgressVersion,
  ] = useState(0);


  useEffect(() => {

    const unsubscribe =
      subscribeGameProgress(
        () => {
          setProgressVersion(
            (value) =>
              value + 1
          );
        }
      );

    return unsubscribe;

  }, []);


  /*
    Tránh warning unused variable.

    progressVersion được dùng để buộc
    React render lại khi Supabase hydrate
    hoặc khi một Stage thay đổi.
  */

  void progressVersion;


  /* =======================================================
     GAME 1
  ======================================================= */

  if (
    path === "/game/1" ||
    path.startsWith(
      "/game/1/"
    )
  ) {
    return (
      <Game1
        profile={
          profile
        }
        session={
          session
        }
        navigate={
          navigate
        }
        onLogout={
          onLogout
        }
        path={
          path
        }
      />
    );
  }


  /* =======================================================
     GAME 2
  ======================================================= */

  if (
    path === "/game/2" ||
    path.startsWith(
      "/game/2/"
    )
  ) {
    return (
      <Game2
        profile={
          profile
        }
        session={
          session
        }
        navigate={
          navigate
        }
        onLogout={
          onLogout
        }
        path={
          path
        }
      />
    );
  }


  /* =======================================================
     GAME 3
  ======================================================= */

  if (
    path === "/game/3" ||
    path.startsWith(
      "/game/3/"
    )
  ) {
    return (
      <Game3
        profile={
          profile
        }
        session={
          session
        }
        navigate={
          navigate
        }
        onLogout={
          onLogout
        }
        path={
          path
        }
      />
    );
  }


  /* =======================================================
     GAME 4
  ======================================================= */

  if (
    path === "/game/4" ||
    path.startsWith(
      "/game/4/"
    )
  ) {
    return (
      <Game4
        profile={
          profile
        }
        session={
          session
        }
        navigate={
          navigate
        }
        onLogout={
          onLogout
        }
        path={
          path
        }
      />
    );
  }


  /* =======================================================
     GAME 5
  ======================================================= */

  if (
    path === "/game/5" ||
    path.startsWith(
      "/game/5/"
    )
  ) {
    return (
      <Game5
        profile={
          profile
        }
        session={
          session
        }
        navigate={
          navigate
        }
        onLogout={
          onLogout
        }
        path={
          path
        }
      />
    );
  }


  /* =======================================================
     COMPLETED GAMES
  ======================================================= */

  const completedGames = [];

  GAME_DATA.forEach(
    (game) => {
      if (
        isGameCompleted(
          game.id
        )
      ) {
        completedGames.push(
          game.id
        );
      }
    }
  );


  /* =======================================================
     EXP
  ======================================================= */

  const totalExp =
    Number(
      profile?.exp
    ) || 0;


  const getLevel = (
    exp
  ) => {

    if (
      exp >= 25600
    ) {
      return 10;
    }

    if (
      exp >= 12800
    ) {
      return 9;
    }

    if (
      exp >= 6400
    ) {
      return 8;
    }

    if (
      exp >= 3200
    ) {
      return 7;
    }

    if (
      exp >= 1600
    ) {
      return 6;
    }

    if (
      exp >= 800
    ) {
      return 5;
    }

    if (
      exp >= 400
    ) {
      return 4;
    }

    if (
      exp >= 200
    ) {
      return 3;
    }

    if (
      exp >= 100
    ) {
      return 2;
    }

    return 1;
  };


  const getLevelStartExp = (
    level
  ) => {

    const levels = {
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

    return (
      levels[level] ||
      0
    );
  };


  const level =
    getLevel(
      totalExp
    );


  const levelStartExp =
    getLevelStartExp(
      level
    );


  const nextLevelExp =
    level >= 10
      ? 25600
      : getLevelStartExp(
          level + 1
        );


  const levelExp =
    Math.max(
      0,
      totalExp -
        levelStartExp
    );


  const levelRange =
    Math.max(
      1,
      nextLevelExp -
        levelStartExp
    );


  const expPercent =
    level >= 10
      ? 100
      : Math.min(
          100,
          Math.round(
            (
              levelExp /
              levelRange
            ) * 100
          )
        );


  /* =======================================================
     LEARNER NAME
  ======================================================= */

  const learnerName =
    profile?.full_name ||
    profile?.name ||
    profile?.username ||
    "NGƯỜI HỌC";


  /* =======================================================
     CLICK GAME
  ======================================================= */

  const handleGameClick =
    (game) => {

      const unlocked =
        isGameUnlocked(
          game.id,
          completedGames
        );

      if (!unlocked) {
        return;
      }

      navigate(
        `/game/${game.id}`
      );
    };


  /* =======================================================
     GAME PROGRESS
  ======================================================= */

  const getGameProgress =
    (gameId) => {

      let completedStages =
        0;

      for (
        let stageId = 1;
        stageId <= TOTAL_STAGES;
        stageId++
      ) {

        if (
          isStageCompleted(
            gameId,
            stageId
          )
        ) {
          completedStages++;
        }
      }

      const percent =
        Math.round(
          (
            completedStages /
            TOTAL_STAGES
          ) * 100
        );

      return {
        completedStages,
        percent,
      };
    };


  /* =======================================================
     BADGES
  ======================================================= */

  const earnedBadges =
    GAME_DATA.filter(
      (game) =>
        hasClaimedBadge(
          game.id
        )
    );


  /* =======================================================
     GAME HOME
  ======================================================= */

  return (
    <div className="game-page">

      <GameHeader
        navigate={
          navigate
        }
      />


      <main className="game-content">

        {/* =================================================
            INTRO
        ================================================= */}

        <section className="game-intro">

          <div className="game-icon">
            🎮
          </div>

          <div className="game-khmer-title">
            ហ្គេម
          </div>

          <h1>
            TRÒ CHƠI
          </h1>

          <p>
            Hành trình chinh phục tiếng Khmer
          </p>

        </section>


        {/* =================================================
            LEARNER
        ================================================= */}

        <section className="game-progress-section">

          <div className="game-section-title">

            <span>
              👤
            </span>

            THÔNG TIN NGƯỜI HỌC

          </div>


          <div className="learner-card">

            <div className="learner-greeting">

              XIN CHÀO,{" "}

              <strong>
                {learnerName}
              </strong>

            </div>


            <div className="learner-level-row">

              <div className="learner-level">

                LEVEL{" "}

                <strong>
                  {level}
                </strong>

              </div>


              <div className="learner-exp">

                {totalExp.toLocaleString()} EXP

              </div>

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

              {totalExp.toLocaleString()} /{" "}

              {nextLevelExp.toLocaleString()} EXP

            </div>

          </div>

        </section>


        {/* =================================================
            GAME PROGRESS
        ================================================= */}

        <section className="game-progress-section">

          <div className="game-section-title">

            <span>
              📊
            </span>

            TIẾN ĐỘ TRÒ CHƠI

          </div>


          <div className="game-progress-list">

            {GAME_DATA.map(
              (game) => {

                const unlocked =
                  isGameUnlocked(
                    game.id,
                    completedGames
                  );


                const completed =
                  isGameCompleted(
                    game.id
                  );


                const {
                  completedStages,
                  percent,
                } =
                  getGameProgress(
                    game.id
                  );


                const reward =
                  GAME_EXP(
                    game.id
                  );


                return (
                  <div
                    key={
                      game.id
                    }
                    className={[
                      "game-progress-card",

                      unlocked
                        ? "unlocked"
                        : "locked",

                      completed
                        ? "completed"
                        : "",
                    ]
                      .filter(
                        Boolean
                      )
                      .join(" ")}
                    onClick={() =>
                      handleGameClick(
                        game
                      )
                    }
                  >

                    {/* GAME TOP */}

                    <div className="game-progress-top">

                      <div className="game-progress-name">

                        <span className="game-progress-dot">

                          {completed
                            ? "🟢"
                            : unlocked
                            ? "🔵"
                            : "🔒"}

                        </span>

                        GAME{" "}
                        {game.id}

                      </div>


                      <div className="game-progress-count">

                        {completedStages} /{" "}

                        {TOTAL_STAGES} MÀN

                      </div>

                    </div>


                    {/* DESCRIPTION */}

                    <div className="game-progress-description">

                      {unlocked
                        ? game.description ||
                          game.title ||
                          "Hành trình chinh phục tiếng Khmer"
                        : "Chưa mở khóa"}

                    </div>


                    {/* PROGRESS BAR */}

                    <div className="game-progress-bar">

                      <div
                        className="game-progress-fill"
                        style={{
                          width:
                            `${percent}%`,
                        }}
                      />

                    </div>


                    {/* BOTTOM */}

                    <div className="game-progress-bottom">

                      <span>
                        {percent}%
                      </span>


                      <span className="game-progress-status">

                        {completed
                          ? "✓ HOÀN THÀNH"
                          : unlocked
                          ? "ĐANG HỌC"
                          : "🔒 CHƯA MỞ"}

                      </span>

                    </div>


                    {/* EXP */}

                    <div className="game-progress-reward">

                      Hoàn thành Game nhận{" "}

                      <strong>

                        +{reward.toLocaleString()} EXP

                      </strong>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </section>


        {/* =================================================
            BADGES
        ================================================= */}

        <section className="game-progress-section badge-section">

          <div className="game-section-title">

            <span>
              🏆
            </span>

            HUY HIỆU

          </div>


          <div className="badge-count">

            ĐÃ ĐẠT{" "}

            <strong>
              {earnedBadges.length}
            </strong>{" "}

            HUY HIỆU

          </div>


          <div className="badge-grid">

            {GAME_DATA.map(
              (game) => {

                const earned =
                  hasClaimedBadge(
                    game.id
                  );


                return (
                  <div
                    key={
                      game.id
                    }
                    className={
                      `badge-card ${
                        earned
                          ? "earned"
                          : "locked"
                      }`
                    }
                  >

                    <div className="badge-icon">

                      {earned
                        ? game.badgeIcon ||
                          "🏆"
                        : "🔒"}

                    </div>


                    <div className="badge-name">

                      {earned
                        ? game.badgeName ||
                          `GAME ${game.id}`
                        : "???"}

                    </div>


                    <div className="badge-description">

                      {earned
                        ? game.badgeDescription ||
                          `Hoàn thành Game ${game.id}`
                        : "Chưa đạt được"}

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </section>


        {/* =================================================
            GAME LIST
        ================================================= */}

        <section className="game-list-section">

          <div className="game-section-title">

            <span>
              🎮
            </span>

            DANH SÁCH TRÒ CHƠI

          </div>


          <section className="game-list">

            {GAME_DATA.map(
              (game) => {

                const unlocked =
                  isGameUnlocked(
                    game.id,
                    completedGames
                  );


                const completed =
                  isGameCompleted(
                    game.id
                  );


                return (
                  <GameCard
                    key={
                      game.id
                    }
                    game={
                      game
                    }
                    unlocked={
                      unlocked
                    }
                    completed={
                      completed
                    }
                    onClick={() =>
                      handleGameClick(
                        game
                      )
                    }
                  />
                );
              }
            )}

          </section>

        </section>

      </main>

    </div>
  );
};


export default Game;