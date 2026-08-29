/* =========================================================
   GAME PROGRESS
   Quản lý tiến độ Game / Stage
   ---------------------------------------------------------
   QUAN TRỌNG:
   - Progress được tách riêng theo từng tài khoản.
   - Tài khoản mới luôn bắt đầu từ Game 1 - Stage 1.
   - Không dùng chung progress giữa các tài khoản.
   - User hiện tại được xác định bằng Supabase user.id.
   
   STORAGE:
   khmer_game_progress_<USER_ID>
========================================================= */


/* =========================================================
   STORAGE
========================================================= */

const STORAGE_PREFIX =
  "khmer_game_progress_";


/* =========================================================
   USER HIỆN TẠI
========================================================= */

let currentUserId = null;


/* =========================================================
   SET USER HIỆN TẠI
========================================================= */

/*
  Gọi khi:
  - App khởi động và đã có session.
  - User đăng nhập.
  - Supabase khôi phục session.

  Ví dụ:
    setGameProgressUser(user.id);
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

/*
  Chỉ xóa user context.

  KHÔNG xóa progress trong localStorage.
*/

export const clearGameProgressUser =
  () => {
    currentUserId = null;
  };


/* =========================================================
   KIỂM TRA ĐÃ CÓ USER
========================================================= */

export const hasGameProgressUser =
  () => {
    return Boolean(
      currentUserId
    );
  };


/* =========================================================
   LẤY STORAGE KEY
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
   LOAD PROGRESS
========================================================= */

const loadProgress = () => {
  try {
    const storageKey =
      getStorageKey();

    /*
      Chưa xác định user:
      tuyệt đối không đọc progress.
    */

    if (!storageKey) {
      return {
        ...DEFAULT_PROGRESS,
        games: {},
      };
    }

    const saved =
      localStorage.getItem(
        storageKey
      );

    /*
      User mới:
      chưa có dữ liệu → bắt đầu từ Game 1.
    */

    if (!saved) {
      return {
        ...DEFAULT_PROGRESS,
        games: {},
      };
    }

    const parsed =
      JSON.parse(saved);

    /*
      Bảo vệ dữ liệu cũ / dữ liệu lỗi.
    */

    if (
      !parsed ||
      typeof parsed !== "object"
    ) {
      return {
        ...DEFAULT_PROGRESS,
        games: {},
      };
    }

    return {
      ...DEFAULT_PROGRESS,
      ...parsed,

      games:
        parsed.games &&
        typeof parsed.games === "object"
          ? parsed.games
          : {},
    };
  } catch (error) {
    console.error(
      "Không thể đọc tiến độ game:",
      error
    );

    return {
      ...DEFAULT_PROGRESS,
      games: {},
    };
  }
};


/* =========================================================
   SAVE PROGRESS
========================================================= */

const saveProgress = (
  progress
) => {
  try {
    const storageKey =
      getStorageKey();

    /*
      Không có user:
      tuyệt đối không lưu.
    */

    if (!storageKey) {
      console.warn(
        "Không thể lưu tiến độ game: chưa xác định tài khoản."
      );

      return false;
    }

    localStorage.setItem(
      storageKey,
      JSON.stringify(progress)
    );

    return true;
  } catch (error) {
    console.error(
      "Không thể lưu tiến độ game:",
      error
    );

    return false;
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

  /*
    Bảo vệ dữ liệu cũ nếu game tồn tại
    nhưng thiếu một số thuộc tính.
  */

  const game =
    progress.games[key];

  if (
    typeof game.completed !==
    "boolean"
  ) {
    game.completed = false;
  }

  if (
    typeof game.expClaimed !==
    "boolean"
  ) {
    game.expClaimed = false;
  }

  if (
    typeof game.badgeClaimed !==
    "boolean"
  ) {
    game.badgeClaimed = false;
  }

  if (
    !game.stages ||
    typeof game.stages !== "object"
  ) {
    game.stages = {};
  }

  return game;
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

  const stage =
    game.stages[key];

  /*
    Bảo vệ dữ liệu cũ.
  */

  if (
    typeof stage.completed !==
    "boolean"
  ) {
    stage.completed = false;
  }

  stage.playCount =
    Math.max(
      0,
      Number(stage.playCount) || 0
    );

  stage.highScore =
    Math.max(
      0,
      Number(stage.highScore) || 0
    );

  return stage;
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
   KIỂM TRA STAGE ĐÃ MỞ KHÓA
========================================================= */

/*
  Quy tắc:

  Stage 1 → luôn mở.

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

  /*
    ID không hợp lệ.
  */

  if (
    !Number.isFinite(game) ||
    !Number.isFinite(stage) ||
    game < 1 ||
    stage < 1
  ) {
    return false;
  }

  /*
    Stage 1 luôn mở.
  */

  if (
    stage === 1
  ) {
    return true;
  }

  /*
    Stage 2+:
    Stage trước phải hoàn thành.
  */

  return isStageCompleted(
    game,
    stage - 1
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
   ---------------------------------------------------------
   KHÔNG TĂNG PLAY COUNT
========================================================= */

export const startStage = (
  gameId,
  stageId
) => {
  /*
    Không cho bắt đầu Stage
    chưa được mở khóa.
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
   ---------------------------------------------------------
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
    Không cho ghi nhận
    Stage chưa mở khóa.
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

  stage.playCount =
    Math.max(
      0,
      Number(stage.playCount) || 0
    ) + 1;

  saveProgress(
    progress
  );

  return {
    ...stage,
  };
};


/* =========================================================
   LƯU ĐIỂM
   ---------------------------------------------------------
   Chỉ lưu HIGH SCORE.
========================================================= */

export const recordStageScore = (
  gameId,
  stageId,
  score
) => {
  /*
    Không cho lưu điểm
    Stage chưa mở khóa.
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

  /*
    Chỉ cập nhật nếu
    điểm mới cao hơn điểm cũ.
  */

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

  /*
    Chỉ lần đầu hoàn thành
    mới được xem là First Win.
  */

  const isFirstWin =
    !stage.completed;

  stage.completed =
    true;

  /* =======================================================
     STAGE 4
     → HOÀN THÀNH GAME
  ======================================================= */

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

/*
  Game 1 → luôn mở.

  Game 2 → cần Game 1 hoàn thành.

  Game 3 → cần Game 2 hoàn thành.

  ...
*/

export const isGameUnlocked = (
  gameId,
  completedGames = []
) => {
  const id =
    Number(gameId);

  /*
    ID không hợp lệ.
  */

  if (
    !Number.isFinite(id) ||
    id < 1
  ) {
    return false;
  }

  /*
    Game 1 luôn mở.
  */

  if (
    id === 1
  ) {
    return true;
  }

  /*
    Game tiếp theo cần Game trước
    hoàn thành.
  */

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
          Boolean(
            game?.completed
          )
      )
      .map(
        ([gameId]) =>
          Number(gameId)
      )
      .filter(
        (gameId) =>
          Number.isFinite(
            gameId
          )
      )
      .sort(
        (a, b) =>
          a - b
      );
  };


/* =========================================================
   EXP GAME

   Game 1 → 1.000 EXP
   Game 2 → 2.000 EXP
   Game 3 → 3.000 EXP
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

  /*
    Không nhận EXP lần thứ hai.
  */

  if (
    game.expClaimed
  ) {
    return {
      claimed: false,
      exp: 0,
    };
  }

  /*
    Chỉ nhận EXP
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

  /*
    Không nhận Badge lần thứ hai.
  */

  if (
    game.badgeClaimed
  ) {
    return {
      claimed: false,
    };
  }

  /*
    Chỉ nhận Badge
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
   RESET GAME PROGRESS
   CỦA USER HIỆN TẠI
========================================================= */

/*
  Xóa toàn bộ tiến độ Game
  của user hiện tại.

  Không ảnh hưởng user khác.
*/

export const resetGameProgress =
  () => {
    try {
      const storageKey =
        getStorageKey();

      if (!storageKey) {
        return false;
      }

      localStorage.removeItem(
        storageKey
      );

      return true;
    } catch (error) {
      console.error(
        "Không thể reset tiến độ game:",
        error
      );

      return false;
    }
  };


/* =========================================================
   RESET PROGRESS CỦA MỘT USER CỤ THỂ
   ---------------------------------------------------------
   Dùng khi:
   - TEST
   - ADMIN
   - DEBUG
========================================================= */

export const resetUserGameProgress =
  (userId) => {
    try {
      if (!userId) {
        return false;
      }

      const storageKey =
        `${STORAGE_PREFIX}${String(userId)}`;

      localStorage.removeItem(
        storageKey
      );

      return true;
    } catch (error) {
      console.error(
        "Không thể reset tiến độ game của user:",
        error
      );

      return false;
    }
  };