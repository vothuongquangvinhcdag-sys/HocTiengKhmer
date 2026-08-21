import React, { useEffect, useState } from "react";

import StageResult from "../../components/StageResult";

import {
  startStage,
  recordStagePlay,
  recordStageScore,
  completeStage,
} from "../../data/gameProgress";

import "../../shared/GameStage.css";
import "./Stage1.css";

/* =========================================================
   CẤU HÌNH
========================================================= */

const GAME_ID = 3;
const STAGE_ID = 1;

const MAX_ATTEMPTS = 3;
const TOTAL_QUESTIONS = 10;
const BASE_SCORE = 10;

/* =========================================================
   ÂM THANH
========================================================= */

const SOUND_CORRECT =
  "/audio/games/correct.mp3";

const SOUND_WRONG =
  "/audio/games/wrong.mp3";

const SOUND_STAGE_COMPLETE =
  "/audio/games/stage-complete.mp3";

const SOUND_STAGE_FAIL =
  "/audio/games/stage-fail.mp3";

/* =========================================================
   PHÁT ÂM THANH
========================================================= */

const playSound = (src) => {
  try {
    const audio = new Audio(src);

    audio.currentTime = 0;
    audio.volume = 0.9;

    audio.play().catch((error) => {
      console.warn(
        "Không thể phát âm thanh:",
        src,
        error
      );
    });
  } catch (error) {
    console.warn(
      "Lỗi tạo âm thanh:",
      src,
      error
    );
  }
};

/* =========================================================
   STAGE 1 — GAME 3

   SƯỜN GAMEPLAY

   Gameplay của Game 2 đã được loại bỏ.

   Giữ nguyên:
   - Cơ chế Stage
   - Lượt chơi
   - Điểm
   - Combo
   - Số câu
   - Thắng / thua
   - Retry
   - Continue
   - StageResult
   - recordStagePlay
   - recordStageScore
   - completeStage

   Gameplay mới sẽ được thêm vào phần
   "GAMEPLAY PLACEHOLDER" sau này.
========================================================= */

const Stage1 = ({ navigate }) => {

  /* =======================================================
     LƯỢT CHƠI
  ======================================================= */

  const [
    attemptsLeft,
    setAttemptsLeft,
  ] = useState(
    MAX_ATTEMPTS
  );

  /* =======================================================
     ĐIỂM
  ======================================================= */

  const [
    score,
    setScore,
  ] = useState(0);

  /* =======================================================
     COMBO
  ======================================================= */

  const [
    combo,
    setCombo,
  ] = useState(0);

  /* =======================================================
     CÂU HỎI
  ======================================================= */

  const [
    questionIndex,
    setQuestionIndex,
  ] = useState(0);

  /* =======================================================
     KẾT QUẢ
  ======================================================= */

  const [
    result,
    setResult,
  ] = useState(null);

  const [
    isFirstWin,
    setIsFirstWin,
  ] = useState(false);

  /* =======================================================
     START STAGE

     Vào Stage / reload / retry
     → KHÔNG tăng playCount
  ======================================================= */

  useEffect(() => {
    startStage(
      GAME_ID,
      STAGE_ID
    );
  }, []);

  /* =======================================================
     THẮNG

     Giữ nguyên cơ chế Game 2.
  ======================================================= */

  const handleWin = (
    finalScore
  ) => {

    playSound(
      SOUND_STAGE_COMPLETE
    );

    /*
     * Chỉ kết thúc 1 lượt chơi ở đây.
     */

    recordStagePlay(
      GAME_ID,
      STAGE_ID
    );

    recordStageScore(
      GAME_ID,
      STAGE_ID,
      finalScore
    );

    const completed =
      completeStage(
        GAME_ID,
        STAGE_ID
      );

    setScore(
      finalScore
    );

    setIsFirstWin(
      completed.isFirstWin
    );

    setResult("win");
  };

  /* =======================================================
     THUA

     Giữ nguyên cơ chế Game 2.
  ======================================================= */

  const handleLose = (
    finalScore
  ) => {

    playSound(
      SOUND_STAGE_FAIL
    );

    /*
     * Chỉ kết thúc 1 lượt chơi ở đây.
     */

    recordStagePlay(
      GAME_ID,
      STAGE_ID
    );

    recordStageScore(
      GAME_ID,
      STAGE_ID,
      finalScore
    );

    setResult("lose");
  };

  /* =======================================================
     CHƠI LẠI

     Retry:
     - Reset lượt
     - Reset điểm
     - Reset combo
     - Reset câu
     - Không tăng playCount
  ======================================================= */

  const handleRetry = () => {

    setAttemptsLeft(
      MAX_ATTEMPTS
    );

    setScore(0);

    setCombo(0);

    setQuestionIndex(0);

    setResult(null);

    setIsFirstWin(false);

    startStage(
      GAME_ID,
      STAGE_ID
    );
  };

  /* =======================================================
     TIẾP TỤC STAGE 2
  ======================================================= */

  const handleContinue = () => {

    navigate(
      "/game/3/stage/2"
    );
  };

  /* =======================================================
     RESULT
  ======================================================= */

  if (result) {

    return (
      <div className="game-stage-page game-stage-1">

        <main className="game-stage-content">

          <StageResult
            gameId={
              GAME_ID
            }
            result={
              result
            }
            stageId={
              STAGE_ID
            }
            isFirstWin={
              isFirstWin
            }
            onRetry={
              handleRetry
            }
            onContinue={
              handleContinue
            }
            onBack={() =>
              navigate(
                "/game/3"
              )
            }
          />

        </main>

      </div>
    );
  }

  /* =======================================================
     SƯỜN GAMEPLAY

     Không chứa gameplay của Game 2.

     Sau này gameplay Game 3 Stage 1 sẽ được
     đưa vào khu vực này.

     Các biến cơ chế vẫn được giữ nguyên:
     - attemptsLeft
     - score
     - combo
     - questionIndex
     - TOTAL_QUESTIONS
     - MAX_ATTEMPTS
     - BASE_SCORE
     - handleWin()
     - handleLose()
  ======================================================= */

  return (
    <div className="game-stage-page game-stage-1">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="game-stage-header">

        <button
          type="button"
          onClick={() =>
            navigate(
              "/game/3"
            )
          }
        >
          ← DANH SÁCH STAGE
        </button>

      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="game-stage-content">

        {/* =================================================
            ICON
        ================================================= */}

        <div className="game-stage-icon">
          🎮
        </div>

        {/* =================================================
            KHMER
        ================================================= */}

        <div className="game-stage-khmer">
          ហ្គេម ៣
        </div>

        {/* =================================================
            TITLE
        ================================================= */}

        <h1>
          STAGE 1
        </h1>

        <p>
          GAMEPLAY ĐANG ĐƯỢC XÂY DỰNG
        </p>

        {/* =================================================
            THÔNG TIN GAME

            Giữ nguyên cơ chế hiển thị của Game 2.
        ================================================= */}

        <div className="stage-play-info">

          <strong>
            LƯỢT CHƠI CÒN LẠI:{" "}
            {attemptsLeft}/
            {MAX_ATTEMPTS}
          </strong>

          <span>
            CÂU{" "}
            {questionIndex + 1}
            {" / "}
            {TOTAL_QUESTIONS}
          </span>

          <span>
            ĐIỂM:{" "}
            {score}
          </span>

          <span>
            COMBO:{" "}
            {combo}
          </span>

        </div>

        {/* =================================================
            GAMEPLAY PLACEHOLDER

            Đây là vị trí để thêm gameplay Game 3
            sau này.

            Không còn:
            - Câu hỏi Game 2
            - Đáp án Game 2
            - createQuestion()
            - createOptions()
            - stage1Data
            - logic kiểm tra đáp án Game 2
        ================================================= */}

        <section className="stage-game-area">

          <div className="stage-placeholder">

            <div className="stage-placeholder-icon">
              🎮
            </div>

            <h2>
              SẴN SÀNG CHO GAMEPLAY
            </h2>

            <p>
              Gameplay của Stage 1 Game 3
              sẽ được thêm vào đây.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
};

export default Stage1;