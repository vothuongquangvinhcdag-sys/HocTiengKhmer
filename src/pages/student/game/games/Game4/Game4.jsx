import React from "react";

import StageCard from "../../components/StageCard";

import Stage1 from "./Stage1";
import Stage2 from "./Stage2";
import Stage3 from "./Stage3";
import Stage4 from "./Stage4";

import {
  isStageCompleted,
  getStageState,
} from "../../data/gameProgress";

const Game4 = ({ navigate, path }) => {
  /* =======================================================
     ĐIỀU HƯỚNG STAGE
  ======================================================= */

  if (path === "/game/4/stage/1") {
    return <Stage1 navigate={navigate} />;
  }

  if (path === "/game/4/stage/2") {
    return <Stage2 navigate={navigate} />;
  }

  if (path === "/game/4/stage/3") {
    return <Stage3 navigate={navigate} />;
  }

  if (path === "/game/4/stage/4") {
    return <Stage4 navigate={navigate} />;
  }

  /* =======================================================
     TIẾN ĐỘ
  ======================================================= */

  const stage1Completed =
    isStageCompleted(4, 1);

  const stage2Completed =
    isStageCompleted(4, 2);

  const stage3Completed =
    isStageCompleted(4, 3);

  const stage4Completed =
    isStageCompleted(4, 4);

  /* =======================================================
     DỮ LIỆU STAGE
  ======================================================= */

  const stageData = [
    {
      id: 1,
      title: "STAGE 1",
      description: "Màn chơi đầu tiên",
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
     TIẾN ĐỘ STAGE
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
    if (stageId === 1) {
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
      !isStageUnlocked(stage.id)
    ) {
      return;
    }

    navigate(
      `/game/4/stage/${stage.id}`
    );
  };

  /* =======================================================
     GAME 4 HOME
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
          ហ្គេម ៤
        </div>

        <h1>
          GAME 4
        </h1>

        <p>
          Hành trình thứ tư chinh phục
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
                  4,
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

export default Game4;