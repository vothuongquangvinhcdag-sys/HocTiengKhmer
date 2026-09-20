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

     Chỉ dùng để buộc Game Home render lại khi
     gameProgress thay đổi.

     KHÔNG lưu dữ liệu.
     KHÔNG thay đổi Supabase.
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


  void progressVersion;


  /* =======================================================
     GAME 1
  ======================================================= */

  if (
    path === "/game/1" ||
    path.startsWith("/game/1/")
  ) {

    return (
      <Game1
        profile={profile}
        session={session}
        navigate={navigate}
        onLogout={onLogout}
        path={path}
      />
    );

  }


  /* =======================================================
     GAME 2
  ======================================================= */

  if (
    path === "/game/2" ||
    path.startsWith("/game/2/")
  ) {

    return (
      <Game2
        profile={profile}
        session={session}
        navigate={navigate}
        onLogout={onLogout}
        path={path}
      />
    );

  }


  /* =======================================================
     GAME 3
  ======================================================= */

  if (
    path === "/game/3" ||
    path.startsWith("/game/3/")
  ) {

    return (
      <Game3
        profile={profile}
        session={session}
        navigate={navigate}
        onLogout={onLogout}
        path={path}
      />
    );

  }


  /* =======================================================
     GAME 4
  ======================================================= */

  if (
    path === "/game/4" ||
    path.startsWith("/game/4/")
  ) {

    return (
      <Game4
        profile={profile}
        session={session}
        navigate={navigate}
        onLogout={onLogout}
        path={path}
      />
    );

  }


  /* =======================================================
     GAME 5
  ======================================================= */

  if (
    path === "/game/5" ||
    path.startsWith("/game/5/")
  ) {

    return (
      <Game5
        profile={profile}
        session={session}
        navigate={navigate}
        onLogout={onLogout}
        path={path}
      />
    );

  }


  /* =======================================================
     COMPLETED GAMES
  ======================================================= */

  const completedGames =
    GAME_DATA
      .filter((game) =>
        isGameCompleted(game.id)
      )
      .map((game) =>
        game.id
      );


  /* =======================================================
     GAME CLICK
  ======================================================= */

  const handleGameClick = (game) => {

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

  const getGameProgress = (gameId) => {

    let completedStages = 0;


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
     GAME HOME
  ======================================================= */

  return (
    <div className="game-page">

      <GameHeader
        navigate={navigate}
      />


      <main className="game-content">

        {/* =================================================
            INTRO
        ================================================= */}

        <section className="game-intro">

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
            GAME LIST
        ================================================= */}

        <section className="game-list-section">

          <div className="game-section-title">
            DANH SÁCH TRÒ CHƠI
          </div>


          <section className="game-list">

            {GAME_DATA.map((game) => {

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


              const badgeEarned =
                hasClaimedBadge(
                  game.id
                );


              return (
                <GameCard
                  key={game.id}

                  game={game}

                  unlocked={unlocked}

                  completed={completed}

                  completedStages={
                    completedStages
                  }

                  totalStages={
                    TOTAL_STAGES
                  }

                  progressPercent={
                    percent
                  }

                  rewardExp={
                    reward
                  }

                  badgeEarned={
                    badgeEarned
                  }

                  badgeIcon={
                    game.badgeIcon ||
                    "🏆"
                  }

                  badgeName={
                    game.badgeName ||
                    `GAME ${game.id}`
                  }

                  badgeDescription={
                    game.badgeDescription ||
                    `Hoàn thành Game ${game.id}`
                  }

                  onClick={() =>
                    handleGameClick(
                      game
                    )
                  }
                />
              );

            })}

          </section>

        </section>

      </main>

    </div>
  );
};


export default Game;
