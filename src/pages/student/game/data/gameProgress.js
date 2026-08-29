/* =========================================================
   GAME PROGRESS
   Quản lý tiến độ Game / Stage
   ---------------------------------------------------------
   NGUỒN DỮ LIỆU:
   - Supabase: nguồn lưu trữ chính
   - Memory cache: UI phản hồi tức thời

   DATABASE:
   public.game_progress

   MỖI TÀI KHOẢN:
   user_id + game_id = 1 row

   PROFILE:
   public.profiles
   - exp

   XP HISTORY:
   public.xp_history
   - amount
   - reason

   QUY ƯỚC XP:
   - study_time = EXP từ thời gian học
   - game_1     = EXP từ Game 1
   - game_2     = EXP từ Game 2
   - game_3     = EXP từ Game 3
   - game_4     = EXP từ Game 4
   - game_5     = EXP từ Game 5

   LƯU Ý:
   - Không dùng localStorage cho Game Progress.
   - EXP Game chỉ được ghi khi RPC add_xp thành công.
   - Chống double-click / cộng EXP 2 lần.
   - Không tự động cộng lại Game đã có exp_claimed=true.
========================================================= */

import { supabase } from "../../../../supabase";


/* =========================================================
   CACHE
========================================================= */

let currentUserId = null;

let progressCache = {
  games: {},
};

let hydrationPromise = null;


/* =========================================================
   PENDING EXP CLAIM
   Chống double-click / nhiều request cùng lúc
========================================================= */

const pendingExpClaims = new Set();


/* =========================================================
   LISTENER
========================================================= */

const listeners = new Set();

export const subscribeGameProgress = (listener) => {
  if (typeof listener !== "function") {
    return () => {};
  }

  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};


const notifyProgressUpdated = () => {
  listeners.forEach((listener) => {
    try {
      listener(progressCache);
    } catch (error) {
      console.error(
        "❌ Lỗi listener Game Progress:",
        error
      );
    }
  });
};


/* =========================================================
   DEFAULT
========================================================= */

const DEFAULT_GAME = {
  completed: false,
  expClaimed: false,
  badgeClaimed: false,
  stages: {},
};


const DEFAULT_STAGE = {
  completed: false,
  playCount: 0,
  highScore: 0,
};


const createDefaultProgress = () => ({
  games: {},
});


/* =========================================================
   NORMALIZE STAGE
========================================================= */

const normalizeStage = (stage) => {
  if (!stage) {
    return {
      ...DEFAULT_STAGE,
    };
  }

  return {
    completed: Boolean(stage.completed),

    playCount: Math.max(
      0,
      Number(stage.playCount) || 0
    ),

    highScore: Math.max(
      0,
      Number(stage.highScore) || 0
    ),
  };
};


/* =========================================================
   NORMALIZE GAME
========================================================= */

const normalizeGame = (game) => {
  if (!game) {
    return {
      ...DEFAULT_GAME,
      stages: {},
    };
  }

  const stages = {};

  if (
    game.stages &&
    typeof game.stages === "object"
  ) {
    Object.entries(game.stages).forEach(
      ([stageId, stage]) => {
        stages[String(stageId)] =
          normalizeStage(stage);
      }
    );
  }

  return {
    completed: Boolean(game.completed),

    expClaimed: Boolean(game.expClaimed),

    badgeClaimed: Boolean(game.badgeClaimed),

    stages,
  };
};


/* =========================================================
   NORMALIZE PROGRESS
========================================================= */

const normalizeProgress = (progress) => {
  const normalized =
    createDefaultProgress();

  if (
    !progress ||
    typeof progress !== "object"
  ) {
    return normalized;
  }

  if (
    progress.games &&
    typeof progress.games === "object"
  ) {
    Object.entries(progress.games).forEach(
      ([gameId, game]) => {
        normalized.games[String(gameId)] =
          normalizeGame(game);
      }
    );
  }

  return normalized;
};


/* =========================================================
   SET USER
========================================================= */

export const setGameProgressUser = (userId) => {
  const nextUserId =
    userId
      ? String(userId)
      : null;

  if (
    currentUserId === nextUserId
  ) {
    return hydrationPromise;
  }

  currentUserId =
    nextUserId;

  progressCache =
    createDefaultProgress();

  hydrationPromise = null;

  pendingExpClaims.clear();

  notifyProgressUpdated();

  if (currentUserId) {
    hydrationPromise =
      hydrateFromSupabase(
        currentUserId
      );
  }

  return hydrationPromise;
};


/* =========================================================
   CLEAR USER
========================================================= */

export const clearGameProgressUser = () => {
  currentUserId = null;

  progressCache =
    createDefaultProgress();

  hydrationPromise = null;

  pendingExpClaims.clear();

  notifyProgressUpdated();
};


/* =========================================================
   CHECK USER
========================================================= */

export const hasGameProgressUser = () => {
  return Boolean(currentUserId);
};


/* =========================================================
   GET USER ID
========================================================= */

export const getGameProgressUserId = () => {
  return currentUserId;
};


/* =========================================================
   HYDRATE FROM SUPABASE
========================================================= */

const hydrateFromSupabase = async (userId) => {
  if (!userId) {
    return false;
  }

  if (
    currentUserId !==
    String(userId)
  ) {
    return false;
  }

  try {
    const {
      data,
      error,
    } = await supabase
      .from("game_progress")
      .select(`
        id,
        user_id,
        game_id,

        stage1_completed,
        stage1_play_count,
        stage1_high_score,

        stage2_completed,
        stage2_play_count,
        stage2_high_score,

        stage3_completed,
        stage3_play_count,
        stage3_high_score,

        stage4_completed,
        stage4_play_count,
        stage4_high_score,

        completed,
        exp_claimed,
        badge_claimed,
        updated_at
      `)
      .eq(
        "user_id",
        userId
      )
      .order(
        "game_id",
        {
          ascending: true,
        }
      );

    if (error) {
      console.error(
        "❌ Không thể tải Game Progress từ Supabase:",
        error
      );

      return false;
    }

    if (
      currentUserId !==
      String(userId)
    ) {
      return false;
    }

    const nextProgress =
      createDefaultProgress();

    (data || []).forEach((row) => {
      const gameId =
        String(row.game_id);

      nextProgress.games[gameId] = {
        completed:
          Boolean(
            row.completed
          ),

        expClaimed:
          Boolean(
            row.exp_claimed
          ),

        badgeClaimed:
          Boolean(
            row.badge_claimed
          ),

        stages: {
          "1": {
            completed:
              Boolean(
                row.stage1_completed
              ),

            playCount:
              Math.max(
                0,
                Number(
                  row.stage1_play_count
                ) || 0
              ),

            highScore:
              Math.max(
                0,
                Number(
                  row.stage1_high_score
                ) || 0
              ),
          },

          "2": {
            completed:
              Boolean(
                row.stage2_completed
              ),

            playCount:
              Math.max(
                0,
                Number(
                  row.stage2_play_count
                ) || 0
              ),

            highScore:
              Math.max(
                0,
                Number(
                  row.stage2_high_score
                ) || 0
              ),
          },

          "3": {
            completed:
              Boolean(
                row.stage3_completed
              ),

            playCount:
              Math.max(
                0,
                Number(
                  row.stage3_play_count
                ) || 0
              ),

            highScore:
              Math.max(
                0,
                Number(
                  row.stage3_high_score
                ) || 0
              ),
          },

          "4": {
            completed:
              Boolean(
                row.stage4_completed
              ),

            playCount:
              Math.max(
                0,
                Number(
                  row.stage4_play_count
                ) || 0
              ),

            highScore:
              Math.max(
                0,
                Number(
                  row.stage4_high_score
                ) || 0
              ),
          },
        },
      };
    });

    progressCache =
      normalizeProgress(
        nextProgress
      );

    notifyProgressUpdated();

    /*
      CHỈ xử lý Game completed nhưng
      exp_claimed = false.

      Game 1 / Game 2 hiện tại của bạn:
      exp_claimed = true
      → KHÔNG cộng lại.
    */

    await syncCompletedGameRewards();

    return true;

  } catch (error) {
    console.error(
      "❌ Lỗi hydrate Game Progress:",
      error
    );

    return false;
  }
};


/* =========================================================
   REFRESH
========================================================= */

export const refreshGameProgress = async () => {
  if (!currentUserId) {
    return false;
  }

  hydrationPromise =
    hydrateFromSupabase(
      currentUserId
    );

  return hydrationPromise;
};


/* =========================================================
   GET GAME
========================================================= */

const getGame = (
  progress,
  gameId
) => {
  const key =
    String(gameId);

  if (
    !progress.games[key]
  ) {
    progress.games[key] = {
      ...DEFAULT_GAME,
      stages: {},
    };
  }

  const game =
    progress.games[key];

  game.completed =
    Boolean(
      game.completed
    );

  game.expClaimed =
    Boolean(
      game.expClaimed
    );

  game.badgeClaimed =
    Boolean(
      game.badgeClaimed
    );

  if (
    !game.stages ||
    typeof game.stages !== "object"
  ) {
    game.stages = {};
  }

  return game;
};


/* =========================================================
   GET STAGE
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

  if (
    !game.stages[key]
  ) {
    game.stages[key] = {
      ...DEFAULT_STAGE,
    };
  }

  const normalized =
    normalizeStage(
      game.stages[key]
    );

  game.stages[key] =
    normalized;

  return normalized;
};


/* =========================================================
   CACHE → SUPABASE ROW
========================================================= */

const buildSupabaseRow = (gameId) => {
  if (!currentUserId) {
    return null;
  }

  const game =
    getGame(
      progressCache,
      gameId
    );

  const stage1 =
    getStage(
      progressCache,
      gameId,
      1
    );

  const stage2 =
    getStage(
      progressCache,
      gameId,
      2
    );

  const stage3 =
    getStage(
      progressCache,
      gameId,
      3
    );

  const stage4 =
    getStage(
      progressCache,
      gameId,
      4
    );

  return {
    user_id:
      currentUserId,

    game_id:
      Number(gameId),

    stage1_completed:
      Boolean(
        stage1.completed
      ),

    stage1_play_count:
      Math.max(
        0,
        Number(
          stage1.playCount
        ) || 0
      ),

    stage1_high_score:
      Math.max(
        0,
        Number(
          stage1.highScore
        ) || 0
      ),

    stage2_completed:
      Boolean(
        stage2.completed
      ),

    stage2_play_count:
      Math.max(
        0,
        Number(
          stage2.playCount
        ) || 0
      ),

    stage2_high_score:
      Math.max(
        0,
        Number(
          stage2.highScore
        ) || 0
      ),

    stage3_completed:
      Boolean(
        stage3.completed
      ),

    stage3_play_count:
      Math.max(
        0,
        Number(
          stage3.playCount
        ) || 0
      ),

    stage3_high_score:
      Math.max(
        0,
        Number(
          stage3.highScore
        ) || 0
      ),

    stage4_completed:
      Boolean(
        stage4.completed
      ),

    stage4_play_count:
      Math.max(
        0,
        Number(
          stage4.playCount
        ) || 0
      ),

    stage4_high_score:
      Math.max(
        0,
        Number(
          stage4.highScore
        ) || 0
      ),

    completed:
      Boolean(
        game.completed
      ),

    exp_claimed:
      Boolean(
        game.expClaimed
      ),

    badge_claimed:
      Boolean(
        game.badgeClaimed
      ),
  };
};


/* =========================================================
   SAVE GAME → SUPABASE
========================================================= */

const saveGameToSupabase = async (gameId) => {
  if (!currentUserId) {
    console.warn(
      "⚠️ Không thể lưu Game Progress: chưa có user."
    );

    return false;
  }

  try {
    const row =
      buildSupabaseRow(
        gameId
      );

    if (!row) {
      return false;
    }

    const {
      error,
    } = await supabase
      .from("game_progress")
      .upsert(
        row,
        {
          onConflict:
            "user_id,game_id",
        }
      );

    if (error) {
      console.error(
        `❌ Không thể lưu Game ${gameId} vào Supabase:`,
        error
      );

      return false;
    }

    return true;

  } catch (error) {
    console.error(
      `❌ Lỗi lưu Game ${gameId}:`,
      error
    );

    return false;
  }
};


/* =========================================================
   SAVE ASYNC
========================================================= */

const persistGame = (gameId) => {
  void saveGameToSupabase(
    gameId
  );
};


/* =========================================================
   IS STAGE COMPLETED
========================================================= */

export const isStageCompleted = (
  gameId,
  stageId
) => {
  const game =
    progressCache.games[
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
   IS STAGE UNLOCKED
========================================================= */

export const isStageUnlocked = (
  gameId,
  stageId
) => {
  const game =
    Number(gameId);

  const stage =
    Number(stageId);

  if (
    !Number.isFinite(game) ||
    !Number.isFinite(stage) ||
    game < 1 ||
    stage < 1 ||
    stage > 4
  ) {
    return false;
  }

  if (
    stage === 1
  ) {
    return true;
  }

  return isStageCompleted(
    game,
    stage - 1
  );
};


/* =========================================================
   GET STAGE STATE
========================================================= */

export const getStageState = (
  gameId,
  stageId
) => {
  const stage =
    getStage(
      progressCache,
      gameId,
      stageId
    );

  return {
    ...stage,
  };
};


/* =========================================================
   START STAGE
========================================================= */

export const startStage = (
  gameId,
  stageId
) => {
  if (
    !isStageUnlocked(
      gameId,
      stageId
    )
  ) {
    return null;
  }

  const stage =
    getStage(
      progressCache,
      gameId,
      stageId
    );

  return {
    ...stage,
  };
};


/* =========================================================
   RECORD STAGE PLAY
========================================================= */

export const recordStagePlay = (
  gameId,
  stageId
) => {
  if (
    !isStageUnlocked(
      gameId,
      stageId
    )
  ) {
    return null;
  }

  const stage =
    getStage(
      progressCache,
      gameId,
      stageId
    );

  stage.playCount =
    Math.max(
      0,
      Number(
        stage.playCount
      ) || 0
    ) + 1;

  notifyProgressUpdated();

  persistGame(
    gameId
  );

  return {
    ...stage,
  };
};


/* =========================================================
   RECORD STAGE SCORE
========================================================= */

export const recordStageScore = (
  gameId,
  stageId,
  score
) => {
  if (
    !isStageUnlocked(
      gameId,
      stageId
    )
  ) {
    return null;
  }

  const stage =
    getStage(
      progressCache,
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

  notifyProgressUpdated();

  persistGame(
    gameId
  );

  return {
    ...stage,
  };
};


/* =========================================================
   COMPLETE STAGE
========================================================= */

export const completeStage = (
  gameId,
  stageId
) => {
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

  const game =
    getGame(
      progressCache,
      gameId
    );

  const stage =
    getStage(
      progressCache,
      gameId,
      stageId
    );

  const isFirstWin =
    !stage.completed;

  stage.completed =
    true;

  if (
    Number(stageId) === 4
  ) {
    game.completed =
      true;
  }

  notifyProgressUpdated();

  persistGame(
    gameId
  );

  /*
    Game vừa hoàn thành:
    tự động claim EXP + badge.

    claimGameExp() sẽ:
    - kiểm tra expClaimed
    - chống double-click
    - gọi RPC add_xp()
    - ghi profiles.exp
    - ghi xp_history
    - chỉ sau khi thành công mới expClaimed=true
  */

  if (
    Number(stageId) === 4 &&
    game.completed
  ) {
    void claimCompletedGameRewards(
      gameId
    );
  }

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
   IS GAME COMPLETED
========================================================= */

export const isGameCompleted = (
  gameId
) => {
  const game =
    progressCache.games[
      String(gameId)
    ];

  return Boolean(
    game?.completed
  );
};


/* =========================================================
   IS GAME UNLOCKED
========================================================= */

export const isGameUnlocked = (
  gameId,
  completedGames = []
) => {
  const id =
    Number(gameId);

  if (
    !Number.isFinite(id) ||
    id < 1
  ) {
    return false;
  }

  if (
    id === 1
  ) {
    return true;
  }

  return completedGames.includes(
    id - 1
  );
};


/* =========================================================
   GET COMPLETED GAMES
========================================================= */

export const getCompletedGames = () => {
  return Object.entries(
    progressCache.games
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
   GAME EXP
========================================================= */

export const GAME_EXP = (gameId) => {
  const id =
    Math.max(
      1,
      Number(gameId) || 1
    );

  return id * 1000;
};


/* =========================================================
   GAME BADGE
========================================================= */

export const GAME_BADGES = {
  1: {
    name: "Người khám phá chữ Khmer",
    icon: "🏆",
  },

  2: {
    name: "Bậc thầy ghép chữ",
    icon: "🏆",
  },

  3: {
    name: "Chinh phục tiếng Khmer",
    icon: "🏆",
  },

  4: {
    name: "Bậc thầy tiếng Khmer",
    icon: "👑",
  },

  5: {
    name: "Huyền thoại chữ Khmer",
    icon: "👑",
  },
};


/* =========================================================
   GET GAME BADGE
========================================================= */

export const getGameBadge = (
  gameId
) => {
  const id =
    Number(gameId);

  return (
    GAME_BADGES[id] || {
      name: `Chiến binh Game ${id}`,
      icon: "🏆",
    }
  );
};


/* =========================================================
   HAS CLAIMED GAME EXP
========================================================= */

export const hasClaimedGameExp = (
  gameId
) => {
  const game =
    progressCache.games[
      String(gameId)
    ];

  return Boolean(
    game?.expClaimed
  );
};


/* =========================================================
   CLAIM GAME EXP
   ---------------------------------------------------------
   EXP Game được ghi theo transaction:

   RPC add_xp()
      ↓
   profiles.exp += reward
      +
   xp_history INSERT

   Sau khi RPC thành công:
      game_progress.exp_claimed = true
========================================================= */

export const claimGameExp = (
  gameId
) => {
  const id =
    Number(gameId);

  if (
    !Number.isFinite(id) ||
    id < 1
  ) {
    return {
      claimed: false,
      exp: 0,
    };
  }

  if (!currentUserId) {
    console.warn(
      "⚠️ Không thể claim EXP: chưa có user."
    );

    return {
      claimed: false,
      exp: 0,
    };
  }

  const game =
    getGame(
      progressCache,
      id
    );

  /*
    Đã nhận EXP trước đó.
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
    Game chưa hoàn thành.
  */

  if (
    !game.completed
  ) {
    return {
      claimed: false,
      exp: 0,
    };
  }

  /*
    Đang có request claim.
    Không cho phép double-click.
  */

  if (
    pendingExpClaims.has(id)
  ) {
    return {
      claimed: false,
      exp: 0,
      pending: true,
    };
  }

  const exp =
    GAME_EXP(id);

  const userId =
    currentUserId;

  const reason =
    `game_${id}`;

  pendingExpClaims.add(id);

  /*
    Không đánh dấu expClaimed=true ở đây.

    Chỉ đánh dấu sau khi Supabase RPC
    cộng EXP thành công.
  */

  void processGameExpClaim({
    gameId: id,
    userId,
    exp,
    reason,
  });

  return {
    claimed: true,
    exp,
    pending: true,
  };
};


/* =========================================================
   PROCESS GAME EXP CLAIM
========================================================= */

const processGameExpClaim = async ({
  gameId,
  userId,
  exp,
  reason,
}) => {
  try {
    /*
      User có thể logout trong lúc request chạy.
    */

    if (
      currentUserId !==
      String(userId)
    ) {
      return false;
    }

    /*
      Gọi RPC transaction.

      RPC thực hiện:
      1. profiles.exp += exp
      2. INSERT xp_history
    */

    const {
      data: newExp,
      error,
    } = await supabase.rpc(
      "add_xp",
      {
        p_user_id:
          userId,

        p_amount:
          exp,

        p_reason:
          reason,
      }
    );

    if (error) {
      console.error(
        `❌ Không thể cộng EXP Game ${gameId}:`,
        error
      );

      return false;
    }

    /*
      Chỉ khi RPC thành công mới đánh dấu
      expClaimed=true.
    */

    const game =
      progressCache.games[
        String(gameId)
      ];

    if (
      game &&
      currentUserId ===
        String(userId)
    ) {
      game.expClaimed =
        true;

      notifyProgressUpdated();

      /*
        Lưu exp_claimed=true vào game_progress.
      */

      const saved =
        await saveGameToSupabase(
          gameId
        );

      if (!saved) {
        console.warn(
          `⚠️ EXP Game ${gameId} đã cộng thành công nhưng chưa lưu được exp_claimed.`
        );
      }
    }

    console.log(
      `✅ Game ${gameId}: +${exp} EXP | reason=${reason} | profile.exp=${newExp}`
    );

    return true;

  } catch (error) {
    console.error(
      `❌ Lỗi xử lý EXP Game ${gameId}:`,
      error
    );

    return false;

  } finally {
    pendingExpClaims.delete(
      gameId
    );
  }
};


/* =========================================================
   CLAIM COMPLETED GAME REWARDS
========================================================= */

const claimCompletedGameRewards =
  async (gameId) => {
    const game =
      getGame(
        progressCache,
        gameId
      );

    if (
      !game.completed
    ) {
      return false;
    }

    /*
      EXP
    */

    if (
      !game.expClaimed
    ) {
      claimGameExp(
        gameId
      );
    }

    /*
      BADGE
    */

    if (
      !game.badgeClaimed
    ) {
      claimBadge(
        gameId
      );
    }

    return true;
  };


/* =========================================================
   SYNC CÁC GAME ĐÃ HOÀN THÀNH
   ---------------------------------------------------------
   CHỈ xử lý:
      completed = true
      exp_claimed = false

   Game có:
      exp_claimed = true

   sẽ KHÔNG được cộng lại.
========================================================= */

const syncCompletedGameRewards =
  async () => {
    if (!currentUserId) {
      return false;
    }

    const completedGames =
      getCompletedGames();

    if (
      completedGames.length === 0
    ) {
      return true;
    }

    for (
      const gameId of completedGames
    ) {
      const game =
        progressCache.games[
          String(gameId)
        ];

      if (!game) {
        continue;
      }

      /*
        EXP chưa nhận.
      */

      if (
        !game.expClaimed
      ) {
        claimGameExp(
          gameId
        );
      }

      /*
        Badge chưa nhận.
      */

      if (
        !game.badgeClaimed
      ) {
        claimBadge(
          gameId
        );
      }
    }

    return true;
  };


/* =========================================================
   HAS CLAIMED BADGE
========================================================= */

export const hasClaimedBadge = (
  gameId
) => {
  const game =
    progressCache.games[
      String(gameId)
    ];

  return Boolean(
    game?.badgeClaimed
  );
};


/* =========================================================
   CLAIM BADGE
========================================================= */

export const claimBadge = (
  gameId
) => {
  const game =
    getGame(
      progressCache,
      gameId
    );

  if (
    game.badgeClaimed
  ) {
    return {
      claimed: false,
    };
  }

  if (
    !game.completed
  ) {
    return {
      claimed: false,
    };
  }

  game.badgeClaimed =
    true;

  notifyProgressUpdated();

  persistGame(
    gameId
  );

  return {
    claimed: true,
  };
};


/* =========================================================
   RESET GAME PROGRESS
========================================================= */

export const resetGameProgress =
  async () => {
    if (!currentUserId) {
      return false;
    }

    try {
      const {
        error,
      } = await supabase
        .from("game_progress")
        .delete()
        .eq(
          "user_id",
          currentUserId
        );

      if (error) {
        console.error(
          "❌ Không thể reset Game Progress:",
          error
        );

        return false;
      }

      progressCache =
        createDefaultProgress();

      pendingExpClaims.clear();

      notifyProgressUpdated();

      return true;

    } catch (error) {
      console.error(
        "❌ Lỗi reset Game Progress:",
        error
      );

      return false;
    }
  };


/* =========================================================
   RESET USER GAME PROGRESS
========================================================= */

export const resetUserGameProgress =
  async (userId) => {
    if (!userId) {
      return false;
    }

    try {
      const targetUserId =
        String(userId);

      const {
        error,
      } = await supabase
        .from("game_progress")
        .delete()
        .eq(
          "user_id",
          targetUserId
        );

      if (error) {
        console.error(
          "❌ Không thể reset Game Progress của user:",
          error
        );

        return false;
      }

      if (
        currentUserId ===
        targetUserId
      ) {
        progressCache =
          createDefaultProgress();

        pendingExpClaims.clear();

        notifyProgressUpdated();
      }

      return true;

    } catch (error) {
      console.error(
        "❌ Lỗi reset Game Progress user:",
        error
      );

      return false;
    }
  };


/* =========================================================
   SYNC ONE GAME
========================================================= */

export const syncGameProgress =
  async (gameId) => {
    return saveGameToSupabase(
      gameId
    );
  };


/* =========================================================
   SYNC ALL GAME
========================================================= */

export const syncAllGameProgress =
  async () => {
    if (!currentUserId) {
      return false;
    }

    const gameIds =
      Object.keys(
        progressCache.games
      );

    if (
      gameIds.length === 0
    ) {
      return true;
    }

    let success = true;

    for (
      const gameId of gameIds
    ) {
      const result =
        await saveGameToSupabase(
          gameId
        );

      if (!result) {
        success = false;
      }
    }

    return success;
  };
