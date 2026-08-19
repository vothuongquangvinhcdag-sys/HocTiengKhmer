import {
  recordStagePlay,
  completeStage,
} from "../data/gameProgress";

/* =======================================================
   SỐ LƯỢT CHƠI
======================================================= */

export const MAX_ATTEMPTS = 3;

/* =======================================================
   KẾT QUẢ STAGE
======================================================= */

export const STAGE_RESULT = {
  PLAYING: "playing",
  WIN: "win",
  LOSE: "lose",
};

/* =======================================================
   TẠO TRẠNG THÁI STAGE
======================================================= */

export const createStageState = () => ({
  status: STAGE_RESULT.PLAYING,

  attempt: 1,

  score: 0,

  finished: false,
});

/* =======================================================
   KẾT THÚC MỘT LƯỢT
======================================================= */

export const finishStageAttempt = ({
  gameId,
  stageId,
  won,
  score = 0,
  attempt = 1,
}) => {
  /* ===============================================
     LƯU SỐ LƯỢT + ĐIỂM CAO
  =============================================== */

  recordStagePlay(
    gameId,
    stageId,
    score
  );

  /* ===============================================
     THẮNG
  =============================================== */

  if (won) {
    const result =
      completeStage(
        gameId,
        stageId
      );

    return {
      status: STAGE_RESULT.WIN,

      score,

      attempt,

      finished: true,

      isFirstWin:
        result.isFirstWin,
    };
  }

  /* ===============================================
     THUA NHƯNG CÒN LƯỢT
  =============================================== */

  if (attempt < MAX_ATTEMPTS) {
    return {
      status: STAGE_RESULT.LOSE,

      score,

      attempt,

      finished: true,

      canRetry: true,

      isFirstWin: false,
    };
  }

  /* ===============================================
     HẾT 3 LƯỢT
  =============================================== */

  return {
    status: STAGE_RESULT.LOSE,

    score,

    attempt,

    finished: true,

    canRetry: true,

    isFirstWin: false,
  };
};

/* =======================================================
   LƯỢT TIẾP THEO
======================================================= */

export const getNextAttempt = (
  attempt
) => {
  return Math.min(
    attempt + 1,
    MAX_ATTEMPTS
  );
};