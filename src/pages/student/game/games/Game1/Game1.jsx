import React, {
  useEffect,
  useState,
} from "react";

import StageCard from "../../components/StageCard";

import Stage1 from "./Stage1";
import Stage2 from "./Stage2";
import Stage3 from "./Stage3";
import Stage4 from "./Stage4";

import {
  isStageCompleted,
  getStageState,
  subscribeGameProgress,
} from "../../data/gameProgress";


const TOTAL_STAGES = 4;


const Game1 = ({
  navigate,
  path,
}) => {

  /* =======================================================
     FORCE UI UPDATE KHI GAME PROGRESS THAY ĐỔI
  ======================================================= */

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
     ĐIỀU HƯỚNG STAGE
  ======================================================= */

  if (
    path === "/game/1/stage/1"
  ) {
    return (
      <Stage1
        navigate={navigate}
      />
    );
  }

  if (
    path === "/game/1/stage/2"
  ) {
    return (
      <Stage2
        navigate={navigate}
      />
    );
  }

  if (
    path === "/game/1/stage/3"
  ) {
    return (
      <Stage3
        navigate={navigate}
      />
    );
  }

  if (
    path === "/game/1/stage/4"
  ) {
    return (
      <Stage4
        navigate={navigate}
      />
    );
  }


  /* =======================================================
     TIẾN ĐỘ
  ======================================================= */

  const stage1Completed =
    isStageCompleted(
      1,
      1
    );

  const stage2Completed =
    isStageCompleted(
      1,
      2
    );

  const stage3Completed =
    isStageCompleted(
      1,
      3
    );

  const stage4Completed =
    isStageCompleted(
      1,
      4
    );


  /* =======================================================
     DỮ LIỆU STAGE
  ======================================================= */

  const stageData = [
    {
      id: 1,
      title: "STAGE 1",
      description:
        "Màn chơi đầu tiên",
    },

    {
      id: 2,
      title: "STAGE 2",
      description:
        "Hoàn thành Stage 1 để mở khóa",
    },

    {
      id: 3,
      title: "STAGE 3",
      description:
        "Hoàn thành Stage 2 để mở khóa",
    },

    {
      id: 4,
      title: "STAGE 4",
      description:
        "Màn chơi cuối cùng",
    },
  ];


  /* =======================================================
     TIẾN ĐỘ
  ======================================================= */

  const completedStates = {
    1: stage1Completed,
    2: stage2Completed,
    3: stage3Completed,
    4: stage4Completed,
  };


  /* =======================================================
     MỞ KHÓA STAGE
  ======================================================= */

  const isStageUnlocked = (
    stageId
  ) => {
    if (
      stageId === 1
    ) {
      return true;
    }

    return Boolean(
      completedStates[
        stageId - 1
      ]
    );
  };


  /* =======================================================
     ĐIỀU HƯỚNG
  ======================================================= */

  const handleStageClick = (
    stage
  ) => {
    if (
      !isStageUnlocked(
        stage.id
      )
    ) {
      return;
    }

    navigate(
      `/game/1/stage/${stage.id}`
    );
  };


  /* =======================================================
     GAME 1 HOME
  ======================================================= */

  return (
    <div className="game-stage-page">

      <header className="game-stage-header">

        <button
          type="button"
          onClick={() =>
            navigate("/game")
          }
        >
          ← QUAY LẠI GAME
        </button>

      </header>


      <main className="game-stage-content">

        <div className="game-stage-icon">
          🎮
        </div>

        <div className="game-stage-khmer">
          ហ្គេម ១
        </div>

        <h1>
          GAME 1
        </h1>

        <p>
          Hành trình đầu tiên chinh phục
          tiếng Khmer.
        </p>


        <section className="stage-list">

          {stageData.map(
            (stage) => {

              const unlocked =
                isStageUnlocked(
                  stage.id
                );

              const completed =
                completedStates[
                  stage.id
                ];

              const state =
                getStageState(
                  1,
                  stage.id
                );

              return (
                <StageCard
                  key={stage.id}

                  stage={{
                    ...stage,

                    playCount:
                      state.playCount,

                    highScore:
                      state.highScore,
                  }}

                  unlocked={
                    unlocked
                  }

                  completed={
                    completed
                  }

                  onClick={() =>
                    handleStageClick(
                      stage
                    )
                  }
                />
              );
            }
          )}

        </section>

      </main>

    </div>
  );
};


export default Game1;
