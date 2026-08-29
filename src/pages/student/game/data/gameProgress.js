/* =========================================================
   GAME PROGRESS
   Quản lý tiến độ Game / Stage
   ---------------------------------------------------------
   QUAN TRỌNG:
   - Progress được tách riêng theo từng tài khoản.
   - Tài khoản mới luôn bắt đầu từ Game 1 - Stage 1.
   - Không dùng chung progress giữa các tài khoản.
========================================================= */

/* =========================================================
   STORAGE
========================================================= */

const STORAGE_PREFIX =
  "khmer_game_progress_";

/*
  User hiện tại.

  Không dùng một STORAGE_KEY cố định nữa,
  vì như vậy mọi tài khoản sẽ dùng chung progress.
*/
let currentUserId = null;


/* =========================================================
   SET USER HIỆN TẠI
========================================================= */

/*
  Gọi hàm này ngay sau khi xác định được user hiện tại.

  Ví dụ:
    setGameProgressUser(user.id);

  Khi logout:
    clearGameProgressUser();
*/
export const setGameProgressUser = (
  userId
) => {
  if (!userId) {
    currentUserId = null;
    return;
  }

  currentUserId =
    String(userId);
};


/* =========================================================
   XÓA USER HIỆN TẠI
========================================================= */

export const clearGameProgressUser = () => {
  currentUserId = null;
};


/* =========================================================
   LẤY STORAGE KEY CỦA USER
========================================================= */

const getStorageKey = () => {
  if (!currentUserId) {
    return null;
  }

  return `${STORAGE_PREFIX}${currentUserId}`;
};


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
    const storageKey =
      getStorageKey();

    /*
      Chưa xác định user
      → không được lấy progress của user khác.
    */
    if (!storageKey) {
      return {
        ...DEFAULT_PROGRESS,
      };
    }

    const saved =
      localStorage.getItem(
        storageKey
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
    const storageKey =
      getStorageKey();

    /*
      Không có user
      → tuyệt đối không lưu.
    */
    if (!storageKey) {
      console.warn(
        "Không thể lưu tiến độ game: chưa xác định tài khoản."
      );

      return;
    }

    localStorage.setItem(
      storageKey,
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
   KIỂM TRA USER ĐÃ ĐƯỢC GÁN CHƯA
========================================================= */

export const hasGameProgressUser = () => {
  return Boolean(
    currentUserId
  );
};


/* =========================================================
   KIỂM TRA STAGE ĐÃ MỞ KHÓA
========================================================= */

/*
  Quy tắc:

  Stage 1 → luôn mở nếu Game đã mở.
  Stage 2 → cần hoàn thành Stage 1.
  Stage 3 → cần hoàn thành Stage 2.
  Stage 4 → cần hoàn thành Stage 3.
*/

export const isStageUnlocked = (
  gameId,
  stageId
) => {
  const game =
    Number(gameId);

  const stage =
    Number(stageId);

  if (
    stage <= 1
  ) {
    return true;
  }

  return isStageCompleted(
    game,
    stage - 1
  );
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
========================================================= */

export const startStage = (
  gameId,
  stageId
) => {
  /*
    Không cho bắt đầu Stage chưa mở khóa.
  */
  if (
    !isStageUnlocked(
      gameId,
      stageId
    )
  ) {
    return null;
  }

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
  /*
    Không cho ghi nhận Stage chưa mở khóa.
  */
  if (
    !isStageUnlocked(
      gameId,
      stageId
    )
  ) {
    return null;
  }

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
  /*
    Không cho lưu điểm Stage chưa mở khóa.
  */
  if (
    !isStageUnlocked(
      gameId,
      stageId
    )
  ) {
    return null;
  }

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
  /*
    Không thể hoàn thành Stage
    nếu Stage trước chưa hoàn thành.
  */
  if (
    !isStageUnlocked(
      gameId,
      stageId
    )
  ) {
    console.warn(
      `Stage ${stageId} của Game ${gameId} chưa được mở khóa.`
    );

    return {
      isFirstWin: false,
      stage: null,
      game: null,
    };
  }

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
     STAGE 4
     → HOÀN THÀNH GAME
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

  if (
    id <= 1
  ) {
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

  /*
    Chỉ cho nhận EXP
    khi Game đã hoàn thành.
  */
  if (
    !game.completed
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

  /*
    Chỉ cho nhận Badge
    khi Game đã hoàn thành.
  */
  if (
    !game.completed
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
   RESET GAME PROGRESS CỦA USER HIỆN TẠI
========================================================= */

export const resetGameProgress =
  () => {
    try {
      const storageKey =
        getStorageKey();

      if (!storageKey) {
        return;
      }

      localStorage.removeItem(
        storageKey
      );
    } catch (error) {
      console.error(
        "Không thể reset tiến độ game:",
        error
      );
    }
  };


/* =========================================================
   RESET PROGRESS CỦA MỘT USER CỤ THỂ
   Dùng khi cần test / admin
========================================================= */

export const resetUserGameProgress = (
  userId
) => {
  try {
    if (!userId) {
      return;
    }

    const storageKey =
      `${STORAGE_PREFIX}${userId}`;

    localStorage.removeItem(
      storageKey
    );
  } catch (error) {
    console.error(
      "Không thể reset tiến độ game của user:",
      error
    );
  }
};
