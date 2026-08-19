/* =========================================================
   GAME PROGRESS
   Quản lý tiến độ Game / Stage
========================================================= */

const STORAGE_KEY = "khmer_game_progress";

/* =========================================================
   CẤU TRÚC MẶC ĐỊNH
========================================================= */

const DEFAULT_PROGRESS = {
  games: {},
};

/* =========================================================
   LOAD
========================================================= */

const loadProgress = () => {
  try {
    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!saved) {
      return {
        ...DEFAULT_PROGRESS,
      };
    }

    const parsed =
      JSON.parse(saved);

    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      games:
        parsed.games || {},
    };
  } catch (error) {
    console.error(
      "Không thể đọc tiến độ game:",
      error
    );

    return {
      ...DEFAULT_PROGRESS,
    };
  }
};

/* =========================================================
   SAVE
========================================================= */

const saveProgress = (
  progress
) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(progress)
    );
  } catch (error) {
    console.error(
      "Không thể lưu tiến độ game:",
      error
    );
  }
};

/* =========================================================
   LẤY GAME
========================================================= */

const getGame = (
  progress,
  gameId
) => {
  const key =
    String(gameId);

  if (!progress.games[key]) {
    progress.games[key] = {
      completed: false,
      expClaimed: false,
      badgeClaimed: false,
      stages: {},
    };
  }

  return progress.games[key];
};

/* =========================================================
   LẤY STAGE
========================================================= */

const getStage = (
  progress,
  gameId,
  stageId
) => {
  const game =
    getGame(
      progress,
      gameId
    );

  const key =
    String(stageId);

  if (!game.stages[key]) {
    game.stages[key] = {
      completed: false,
      playCount: 0,
      highScore: 0,
    };
  }

  return game.stages[key];
};

/* =========================================================
   KIỂM TRA STAGE ĐÃ HOÀN THÀNH
========================================================= */

export const isStageCompleted = (
  gameId,
  stageId
) => {
  const progress =
    loadProgress();

  const game =
    progress.games[
      String(gameId)
    ];

  if (!game) {
    return false;
  }

  const stage =
    game.stages?.[
      String(stageId)
    ];

  return Boolean(
    stage?.completed
  );
};

/* =========================================================
   LẤY THÔNG TIN STAGE
========================================================= */

export const getStageState = (
  gameId,
  stageId
) => {
  const progress =
    loadProgress();

  const stage =
    getStage(
      progress,
      gameId,
      stageId
    );

  return {
    ...stage,
  };
};

/* =========================================================
   BẮT ĐẦU STAGE
   KHÔNG TĂNG PLAY COUNT

   Vào Stage / reload / retry
   → KHÔNG tính là một lần chơi.
========================================================= */

export const startStage = (
  gameId,
  stageId
) => {
  const progress =
    loadProgress();

  const stage =
    getStage(
      progress,
      gameId,
      stageId
    );

  saveProgress(
    progress
  );

  return {
    ...stage,
  };
};

/* =========================================================
   GHI NHẬN MỘT LẦN CHƠI

   Chỉ gọi khi:
   - THẮNG
   - THUA

   → +1 PLAY COUNT
========================================================= */

export const recordStagePlay = (
  gameId,
  stageId
) => {
  const progress =
    loadProgress();

  const stage =
    getStage(
      progress,
      gameId,
      stageId
    );

  stage.playCount += 1;

  saveProgress(
    progress
  );

  return {
    ...stage,
  };
};

/* =========================================================
   LƯU ĐIỂM
========================================================= */

export const recordStageScore = (
  gameId,
  stageId,
  score
) => {
  const progress =
    loadProgress();

  const stage =
    getStage(
      progress,
      gameId,
      stageId
    );

  const safeScore =
    Math.max(
      0,
      Number(score) || 0
    );

  if (
    safeScore >
    stage.highScore
  ) {
    stage.highScore =
      safeScore;
  }

  saveProgress(
    progress
  );

  return {
    ...stage,
  };
};

/* =========================================================
   HOÀN THÀNH STAGE
========================================================= */

export const completeStage = (
  gameId,
  stageId
) => {
  const progress =
    loadProgress();

  const game =
    getGame(
      progress,
      gameId
    );

  const stage =
    getStage(
      progress,
      gameId,
      stageId
    );

  const isFirstWin =
    !stage.completed;

  stage.completed =
    true;

  /* =====================================
     STAGE CUỐI → HOÀN THÀNH GAME
     
     Quan trọng:
     Game nào hoàn thành Stage 4
     thì CHÍNH GAME ĐÓ hoàn thành.
     
     Không còn mặc định Game 1.
  ===================================== */

  if (
    Number(stageId) === 4
  ) {
    game.completed =
      true;
  }

  saveProgress(
    progress
  );

  return {
    isFirstWin,

    stage: {
      ...stage,
    },

    game: {
      ...game,
    },
  };
};

/* =========================================================
   KIỂM TRA GAME ĐÃ HOÀN THÀNH
========================================================= */

export const isGameCompleted = (
  gameId
) => {
  const progress =
    loadProgress();

  const game =
    progress.games[
      String(gameId)
    ];

  return Boolean(
    game?.completed
  );
};

/* =========================================================
   KIỂM TRA GAME ĐÃ MỞ KHÓA
========================================================= */

export const isGameUnlocked = (
  gameId,
  completedGames = []
) => {
  const id =
    Number(gameId);

  if (id <= 1) {
    return true;
  }

  return completedGames.includes(
    id - 1
  );
};

/* =========================================================
   LẤY DANH SÁCH GAME ĐÃ HOÀN THÀNH
========================================================= */

export const getCompletedGames =
  () => {
    const progress =
      loadProgress();

    return Object.entries(
      progress.games
    )
      .filter(
        ([, game]) =>
          game.completed
      )
      .map(
        ([gameId]) =>
          Number(gameId)
      );
  };

/* =========================================================
   EXP GAME

   Game 1   → 1.000
   Game 2   → 2.000
   Game 3   → 3.000
   ...
   Game 100 → 100.000
========================================================= */

export const GAME_EXP = (
  gameId
) => {
  const id =
    Math.max(
      1,
      Number(gameId) || 1
    );

  return id * 1000;
};

/* =========================================================
   KIỂM TRA ĐÃ NHẬN EXP
========================================================= */

export const hasClaimedGameExp = (
  gameId
) => {
  const progress =
    loadProgress();

  const game =
    progress.games[
      String(gameId)
    ];

  return Boolean(
    game?.expClaimed
  );
};

/* =========================================================
   NHẬN EXP GAME
========================================================= */

export const claimGameExp = (
  gameId
) => {
  const progress =
    loadProgress();

  const game =
    getGame(
      progress,
      gameId
    );

  if (
    game.expClaimed
  ) {
    return {
      claimed: false,
      exp: 0,
    };
  }

  game.expClaimed =
    true;

  saveProgress(
    progress
  );

  return {
    claimed: true,
    exp: GAME_EXP(
      gameId
    ),
  };
};

/* =========================================================
   KIỂM TRA ĐÃ NHẬN DANH HIỆU
========================================================= */

export const hasClaimedBadge = (
  gameId
) => {
  const progress =
    loadProgress();

  const game =
    progress.games[
      String(gameId)
    ];

  return Boolean(
    game?.badgeClaimed
  );
};

/* =========================================================
   NHẬN DANH HIỆU
========================================================= */

export const claimBadge = (
  gameId
) => {
  const progress =
    loadProgress();

  const game =
    getGame(
      progress,
      gameId
    );

  if (
    game.badgeClaimed
  ) {
    return {
      claimed: false,
    };
  }

  game.badgeClaimed =
    true;

  saveProgress(
    progress
  );

  return {
    claimed: true,
  };
};

/* =========================================================
   RESET TOÀN BỘ GAME
   Dùng khi test
========================================================= */

export const resetGameProgress =
  () => {
    try {
      localStorage.removeItem(
        STORAGE_KEY
      );
    } catch (error) {
      console.error(
        "Không thể reset tiến độ game:",
        error
      );
    }
  };