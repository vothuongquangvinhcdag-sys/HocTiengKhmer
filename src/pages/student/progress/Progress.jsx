import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import "./Progress.css";
import StudentLayout from "../StudentLayout";

import { supabase } from "../../../supabase";

import {
  subscribeGameProgress,
  GAME_EXP,
  getGameBadge,
} from "../game/data/gameProgress";


/* =========================================================
   LEVEL
========================================================= */

const LEVEL_EXP = {
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


/* =========================================================
   EXP / PHÚT
========================================================= */

const EXP_PER_MINUTE = 10;


/* =========================================================
   GAME TỐI ĐA
========================================================= */

const MAX_GAME = 10;


/* =========================================================
   CẤP CUP GAME
========================================================= */

const GAME_ACHIEVEMENTS = {
  1: {
    icon: "🏆",
    tier: "ĐỒNG",
    className: "bronze",
    title: "Người khám phá chữ Khmer",
  },

  2: {
    icon: "🏆",
    tier: "BẠC",
    className: "silver",
    title: "Người ghép chữ",
  },

  3: {
    icon: "🏆",
    tier: "VÀNG",
    className: "gold",
    title: "Người thông thạo từ vựng cơ bản",
  },

  4: {
    icon: "🏆",
    tier: "BẠCH KIM",
    className: "platinum",
    title: "Làm chủ phụ âm bổ sung và chân chữ",
  },

  5: {
    icon: "🏆",
    tier: "KIM CƯƠNG",
    className: "diamond",
    title: "Bậc thầy từ vựng",
  },
};


/* =========================================================
   THÀNH TÍCH THỜI GIAN
========================================================= */

const TIME_ACHIEVEMENTS = [
  {
    id: "time-1",
    hours: 1,
    icon: "🕐",
    tier: "ĐỒNG",
    className: "bronze",
    title: "Khởi Đầu Hành Trình",
    description: "Tổng thời gian học đạt 1 giờ",
  },

  {
    id: "time-2",
    hours: 2,
    icon: "🕐",
    tier: "BẠC",
    className: "silver",
    title: "Người Bền Bỉ",
    description: "Tổng thời gian học đạt 2 giờ",
  },

  {
    id: "time-4",
    hours: 4,
    icon: "🕐",
    tier: "VÀNG",
    className: "gold",
    title: "Kẻ Chinh Phục Thời Gian",
    description: "Tổng thời gian học đạt 4 giờ",
  },

  {
    id: "time-8",
    hours: 8,
    icon: "🕐",
    tier: "BẠCH KIM",
    className: "platinum",
    title: "Bậc Thầy Kiên Trì",
    description: "Tổng thời gian học đạt 8 giờ",
  },

  {
    id: "time-16",
    hours: 16,
    icon: "🕐",
    tier: "KIM CƯƠNG",
    className: "diamond",
    title: "Huyền Thoại Thời Gian",
    description: "Tổng thời gian học đạt 16 giờ",
  },
];


/* =========================================================
   THÀNH TÍCH ĐIỂM STAGE
========================================================= */

const SCORE_ACHIEVEMENTS = [
  {
    id: "score-3",
    required: 3,
    icon: "★",
    tier: "ĐỒNG",
    className: "bronze",
    title: "Tay Chơi Triển Vọng",
    description: "Có 3 Stage đạt 550 điểm",
  },

  {
    id: "score-5",
    required: 5,
    icon: "★★",
    tier: "BẠC",
    className: "silver",
    title: "Bậc Thầy Combo",
    description: "Có 5 Stage đạt 550 điểm",
  },

  {
    id: "score-10",
    required: 10,
    icon: "★★★",
    tier: "VÀNG",
    className: "gold",
    title: "Chiến Binh Điểm Số",
    description: "Có 10 Stage đạt 550 điểm",
  },

  {
    id: "score-20",
    required: 20,
    icon: "★★★★",
    tier: "BẠCH KIM",
    className: "platinum",
    title: "Thủ lĩnh trò chơi",
    description: "Có 20 Stage đạt 550 điểm",
  },

  {
    id: "score-50",
    required: 50,
    icon: "★★★★★",
    tier: "KIM CƯƠNG",
    className: "diamond",
    title: "Huyền Thoại 550",
    description: "Có 50 Stage đạt 550 điểm",
  },
];


/* =========================================================
   LEVEL TỪ EXP
========================================================= */

const getLevelFromExp = (exp) => {
  const safeExp = Math.max(0, Number(exp) || 0);

  if (safeExp < LEVEL_EXP[2]) return 1;
  if (safeExp < LEVEL_EXP[3]) return 2;
  if (safeExp < LEVEL_EXP[4]) return 3;
  if (safeExp < LEVEL_EXP[5]) return 4;
  if (safeExp < LEVEL_EXP[6]) return 5;
  if (safeExp < LEVEL_EXP[7]) return 6;
  if (safeExp < LEVEL_EXP[8]) return 7;
  if (safeExp < LEVEL_EXP[9]) return 8;
  if (safeExp < LEVEL_EXP[10]) return 9;

  return 10;
};


/* =========================================================
   LEVEL PROGRESS
========================================================= */

const getLevelProgress = (exp) => {
  const safeExp = Math.max(0, Number(exp) || 0);

  const level = getLevelFromExp(safeExp);

  if (level >= 10) {
    return {
      level: 10,
      currentExp: safeExp,
      nextExp: LEVEL_EXP[10],
      progress: 100,
      remaining: 0,
    };
  }

  const currentLevelExp = LEVEL_EXP[level];
  const nextLevelExp = LEVEL_EXP[level + 1];

  const range = nextLevelExp - currentLevelExp;
  const current = safeExp - currentLevelExp;

  const progress =
    range > 0
      ? Math.min(
          100,
          Math.max(0, (current / range) * 100)
        )
      : 100;

  return {
    level,
    currentExp: safeExp,
    nextExp: nextLevelExp,
    progress,
    remaining: Math.max(
      0,
      nextLevelExp - safeExp
    ),
  };
};


/* =========================================================
   FORMAT THỜI GIAN
========================================================= */

const formatStudyTime = (seconds) => {
  const safeSeconds = Math.max(
    0,
    Number(seconds) || 0
  );

  const hours = Math.floor(
    safeSeconds / 3600
  );

  const minutes = Math.floor(
    (safeSeconds % 3600) / 60
  );

  if (hours > 0) {
    return `${hours} giờ ${minutes} phút`;
  }

  return `${minutes} phút`;
};


/* =========================================================
   DEFAULT GAME
========================================================= */

const createDefaultGame = (gameId) => ({
  game_id: Number(gameId),

  completed: false,
  exp_claimed: false,
  badge_claimed: false,

  stage1_completed: false,
  stage2_completed: false,
  stage3_completed: false,
  stage4_completed: false,

  stage1_play_count: 0,
  stage2_play_count: 0,
  stage3_play_count: 0,
  stage4_play_count: 0,

  stage1_high_score: 0,
  stage2_high_score: 0,
  stage3_high_score: 0,
  stage4_high_score: 0,
});


/* =========================================================
   GAME TITLE
========================================================= */

const getGameTitle = (gameId) => {
  const achievement =
    GAME_ACHIEVEMENTS[gameId];

  if (achievement) {
    return achievement.title;
  }

  try {
    const badge = getGameBadge(gameId);

    if (badge?.name) {
      return badge.name;
    }
  } catch {
    // Không để Progress crash
  }

  return `Thành tích Game ${gameId}`;
};


/* =========================================================
   PROGRESS
========================================================= */

function Progress({
  profile,
  session,
  navigate,
  onLogout,
}) {
  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [profileData, setProfileData] =
    useState(null);

  const [games, setGames] =
    useState([]);


  /* =======================================================
     USER ID
  ======================================================= */

  const userId =
    session?.user?.id ||
    profile?.id ||
    null;


  /* =======================================================
     LOAD DATA
  ======================================================= */

  const loadProgress = useCallback(
    async ({ showLoading = false } = {}) => {
      if (!userId) {
        setLoading(false);
        return;
      }

      if (showLoading) {
        setLoading(true);
      }

      setError("");

      try {
        /* ================================================
           PROFILE
        ================================================= */

        const {
          data: profileRow,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select(`
            id,
            username,
            account,
            email,
            role,
            level,
            exp,
            total_study_seconds,
            avatar_url
          `)
          .eq("id", userId)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }


        /* ================================================
           GAME PROGRESS
        ================================================= */

        const {
          data: gameRows,
          error: gameError,
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
          .eq("user_id", userId)
          .order("game_id", {
            ascending: true,
          });

        if (gameError) {
          throw gameError;
        }


        /* ================================================
           NORMALIZE PROFILE
        ================================================= */

        const safeStudySeconds =
          Math.max(
            0,
            Number(
              profileRow?.total_study_seconds
            ) || 0
          );

        const profileExp =
          Math.max(
            0,
            Number(
              profileRow?.exp
            ) || 0
          );


        /* ================================================
           EXP THỜI GIAN
        ================================================= */

        const studyMinutes =
          Math.floor(
            safeStudySeconds / 60
          );

        const studyExp =
          studyMinutes *
          EXP_PER_MINUTE;


        /* ================================================
           NORMALIZE GAMES
        ================================================= */

        const normalizedGames = [];

        for (
          let gameId = 1;
          gameId <= MAX_GAME;
          gameId++
        ) {
          const row =
            (gameRows || []).find(
              (item) =>
                Number(item.game_id) ===
                gameId
            );

          normalizedGames.push(
            row
              ? {
                  ...createDefaultGame(
                    gameId
                  ),
                  ...row,
                }
              : createDefaultGame(
                  gameId
                )
          );
        }


        /* ================================================
           EXP GAME
        ================================================= */

        const gameExp =
          normalizedGames.reduce(
            (total, game) => {
              if (!game.exp_claimed) {
                return total;
              }

              return (
                total +
                GAME_EXP(
                  game.game_id
                )
              );
            },
            0
          );


        /* ================================================
           TỔNG EXP
        ================================================= */

        const calculatedTotalExp =
          studyExp + gameExp;


        /* ================================================
           LEVEL
        ================================================= */

        const level =
          getLevelFromExp(
            calculatedTotalExp
          );


        /* ================================================
           SET PROFILE
        ================================================= */

        setProfileData({
          ...(profileRow || profile),

          exp: profileExp,

          calculated_exp:
            calculatedTotalExp,

          study_exp:
            studyExp,

          game_exp:
            gameExp,

          total_study_seconds:
            safeStudySeconds,

          level,
        });


        /* ================================================
           SET GAME
        ================================================= */

        setGames(
          normalizedGames
        );
      } catch (err) {
        console.error(
          "❌ Không thể tải Progress:",
          err
        );

        setError(
          "Không thể tải dữ liệu tiến độ học tập."
        );
      } finally {
        setLoading(false);
      }
    },
    [userId, profile]
  );


  /* =======================================================
     LOAD LẦN ĐẦU
  ======================================================= */

  useEffect(() => {
    loadProgress({
      showLoading: true,
    });
  }, [loadProgress]);


  /* =======================================================
     SUBSCRIBE GAME PROGRESS
  ======================================================= */

  useEffect(() => {
    if (!userId) {
      return undefined;
    }

    const unsubscribe =
      subscribeGameProgress(() => {
        loadProgress();
      });

    return unsubscribe;
  }, [
    userId,
    loadProgress,
  ]);


  /* =======================================================
     REALTIME GAME
  ======================================================= */

  useEffect(() => {
    if (!userId) {
      return undefined;
    }

    const channel =
      supabase
        .channel(
          `progress-game-${userId}`
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "game_progress",
            filter:
              `user_id=eq.${userId}`,
          },
          () => {
            loadProgress();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [
    userId,
    loadProgress,
  ]);


  /* =======================================================
     REALTIME PROFILE
  ======================================================= */

  useEffect(() => {
    if (!userId) {
      return undefined;
    }

    const channel =
      supabase
        .channel(
          `progress-profile-${userId}`
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "profiles",
            filter:
              `id=eq.${userId}`,
          },
          () => {
            loadProgress();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [
    userId,
    loadProgress,
  ]);


  /* =======================================================
     DERIVED DATA
  ======================================================= */

  const studyExp =
    Math.max(
      0,
      Number(
        profileData?.study_exp
      ) || 0
    );

  const gameExp =
    Math.max(
      0,
      Number(
        profileData?.game_exp
      ) || 0
    );

  const totalExp =
    studyExp + gameExp;

  const levelInfo =
    useMemo(
      () =>
        getLevelProgress(
          totalExp
        ),
      [totalExp]
    );


  /* =======================================================
     GAME ACHIEVEMENTS
  ======================================================= */

  const completedGameAchievements =
    useMemo(() => {
      return games
        .filter(
          (game) =>
            game.game_id <= 5 &&
            Boolean(game.completed)
        )
        .map((game) => {
          const achievement =
            GAME_ACHIEVEMENTS[
              game.game_id
            ];

          return {
            ...game,
            ...achievement,
          };
        });
    }, [games]);


  /* =======================================================
     STAGE 550
  ======================================================= */

  const perfect550Stages =
    useMemo(() => {
      let count = 0;

      games.forEach((game) => {
        const scores = [
          game.stage1_high_score,
          game.stage2_high_score,
          game.stage3_high_score,
          game.stage4_high_score,
        ];

        scores.forEach((score) => {
          if (Number(score) >= 550) {
            count++;
          }
        });
      });

      return count;
    }, [games]);


  /* =======================================================
     TIME ACHIEVEMENTS
  ======================================================= */

  const earnedTimeAchievements =
    useMemo(() => {
      const hours =
        (
          Number(
            profileData?.total_study_seconds
          ) || 0
        ) / 3600;

      return TIME_ACHIEVEMENTS.filter(
        (achievement) =>
          hours >= achievement.hours
      );
    }, [
      profileData?.total_study_seconds,
    ]);


  /* =======================================================
     SCORE ACHIEVEMENTS
  ======================================================= */

  const earnedScoreAchievements =
    useMemo(
      () =>
        SCORE_ACHIEVEMENTS.filter(
          (achievement) =>
            perfect550Stages >=
            achievement.required
        ),
      [perfect550Stages]
    );


  /* =======================================================
     SPECIAL COUNT
  ======================================================= */

  const specialAchievementsCount =
    earnedTimeAchievements.length +
    earnedScoreAchievements.length;


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <StudentLayout
        profile={profile}
        session={session}
        navigate={navigate}
        onLogout={onLogout}
      >
        <div className="progress-page">
          <div className="progress-loading">
            <div className="progress-loading-icon">
              ⏳
            </div>

            <div>
              Đang tải tiến độ học tập...
            </div>
          </div>
        </div>
      </StudentLayout>
    );
  }


  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <StudentLayout
        profile={profile}
        session={session}
        navigate={navigate}
        onLogout={onLogout}
      >
        <div className="progress-page">
          <div className="progress-error">
            <div className="progress-error-icon">
              ⚠️
            </div>

            <h2>
              Không thể tải dữ liệu
            </h2>

            <p>{error}</p>

            <button
              type="button"
              onClick={() =>
                loadProgress({
                  showLoading: true,
                })
              }
            >
              Thử lại
            </button>
          </div>
        </div>
      </StudentLayout>
    );
  }


  /* =======================================================
     UI
  ======================================================= */

  return (
    <StudentLayout
      profile={profile}
      session={session}
      navigate={navigate}
      onLogout={onLogout}
    >
      <div className="progress-page">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="progress-header">
          <div className="progress-header-content">
            <div className="progress-kicker">
              TIẾN ĐỘ HỌC TẬP
            </div>

            <div className="progress-khmer-title">
              វឌ្ឍនភាពការសិក្សា
            </div>

            <p className="progress-subtitle">
              Theo dõi kinh nghiệm, thời gian học
              và thành tích của bạn.
            </p>
          </div>
        </div>


        {/* =================================================
            LEVEL
        ================================================= */}

        <section className="progress-level-card">

          <div className="progress-level-top">
            <div>
              <span className="progress-level-label">
                CẤP ĐỘ
              </span>

              <div className="progress-level-number">
                Level {levelInfo.level}
              </div>
            </div>

            <div className="progress-level-exp">
              <strong>
                {totalExp.toLocaleString()}
              </strong>

              <span>EXP</span>
            </div>
          </div>


          <div className="progress-level-bar">
            <div
              className="progress-level-fill"
              style={{
                width:
                  `${levelInfo.progress}%`,
              }}
            />
          </div>


          <div className="progress-level-bottom">
            <span>
              {levelInfo.level >= 10
                ? "Đã đạt cấp độ tối đa"
                : `Còn ${levelInfo.remaining.toLocaleString()} EXP để lên Level ${levelInfo.level + 1}`}
            </span>

            <span>
              {Math.round(
                levelInfo.progress
              )}%
            </span>
          </div>

        </section>


        {/* =================================================
            KINH NGHIỆM
        ================================================= */}

        <section className="progress-section">

          <div className="progress-section-heading">
            <div>
              <span className="progress-section-kicker">
                KINH NGHIỆM
              </span>

              <h2>
                {totalExp.toLocaleString()} EXP
              </h2>
            </div>
          </div>


          <div className="progress-exp-grid">

            <div className="progress-exp-card">
              <div className="progress-exp-icon">
                ⏱️
              </div>

              <div className="progress-exp-content">
                <div className="progress-exp-label">
                  Kinh nghiệm đạt được từ
                  <br />
                  thời gian học
                </div>

                <div className="progress-exp-value">
                  {studyExp.toLocaleString()}
                  <span>EXP</span>
                </div>

                <div className="progress-exp-note">
                  {formatStudyTime(
                    profileData?.total_study_seconds
                  )}
                </div>
              </div>
            </div>


            <div className="progress-exp-card">
              <div className="progress-exp-icon">
                🎮
              </div>

              <div className="progress-exp-content">
                <div className="progress-exp-label">
                  Kinh nghiệm đạt được từ
                  <br />
                  trò chơi
                </div>

                <div className="progress-exp-value">
                  {gameExp.toLocaleString()}
                  <span>EXP</span>
                </div>

                <div className="progress-exp-note">
                  {
                    games.filter(
                      (game) =>
                        Boolean(
                          game.exp_claimed
                        )
                    ).length
                  }{" "}
                  game
                </div>
              </div>
            </div>

          </div>

        </section>


        {/* =================================================
            GAME ACHIEVEMENT
        ================================================= */}

        <section className="progress-section">

          <div className="progress-section-heading">
            <div>
              <span className="progress-section-kicker">
                THÀNH TÍCH
              </span>

              <h2>
                Thành tích Game
              </h2>
            </div>
          </div>


          {completedGameAchievements.length > 0 ? (
            <div className="progress-achievement-game-grid">

              {completedGameAchievements.map(
                (achievement) => (
                  <div
                    key={
                      achievement.game_id
                    }
                    className={
                      `progress-achievement-game-card ${achievement.className}`
                    }
                  >

                    <div className="progress-achievement-game-icon-wrap">
                      <div className="progress-achievement-game-icon">
                        {achievement.icon}
                      </div>
                    </div>


                    <div className="progress-achievement-game-info">

                      <div className="progress-achievement-game-number">
                        GAME{" "}
                        {achievement.game_id}
                      </div>

                      <div className="progress-achievement-game-tier">
                        {achievement.tier}
                      </div>

                      <div className="progress-achievement-game-title">
                        {achievement.title ||
                          getGameTitle(
                            achievement.game_id
                          )}
                      </div>

                    </div>


                    <div className="progress-achievement-game-check">
                      ✓
                    </div>

                  </div>
                )
              )}

            </div>
          ) : (
            <div className="progress-empty-achievement">
              <span className="progress-empty-icon">
                🏆
              </span>

              <span>
                Hoàn thành Game để mở khóa
                thành tích đầu tiên.
              </span>
            </div>
          )}

        </section>


        {/* =================================================
            SPECIAL ACHIEVEMENT
        ================================================= */}

        <section className="progress-section">

          <div className="progress-section-heading">
            <div>
              <span className="progress-section-kicker">
                THÀNH TÍCH
              </span>

              <h2>
                Thành tích đặc biệt
              </h2>
            </div>

            {specialAchievementsCount > 0 && (
              <div className="progress-achievement-count">
                {specialAchievementsCount} đã đạt
              </div>
            )}
          </div>


          {/* =================================================
              TIME
          ================================================= */}

          {earnedTimeAchievements.length > 0 && (
            <div className="progress-special-group">

              <div className="progress-special-group-title">
                ⏱️ HÀNH TRÌNH THỜI GIAN
              </div>


              <div className="progress-special-grid">

                {earnedTimeAchievements.map(
                  (achievement) => (
                    <div
                      key={achievement.id}
                      className={
                        `progress-special-card ${achievement.className}`
                      }
                    >

                      <div className="progress-special-icon-wrap">
                        <div className="progress-special-icon">
                          {achievement.icon}
                        </div>
                      </div>


                      <div className="progress-special-info">

                        <div className="progress-special-tier">
                          {achievement.tier}
                        </div>

                        <div className="progress-special-title">
                          {achievement.title}
                        </div>

                        <div className="progress-special-description">
                          {achievement.description}
                        </div>

                      </div>


                      <div className="progress-special-check">
                        ✓
                      </div>

                    </div>
                  )
                )}

              </div>

            </div>
          )}


          {/* =================================================
              SCORE
          ================================================= */}

          {earnedScoreAchievements.length > 0 && (
            <div className="progress-special-group">

              <div className="progress-special-group-title">
                ⭐ CHINH PHỤC ĐIỂM SỐ
              </div>


              <div className="progress-special-grid">

                {earnedScoreAchievements.map(
                  (achievement) => (
                    <div
                      key={achievement.id}
                      className={
                        `progress-special-card score-achievement ${achievement.className}`
                      }
                    >

                      <div className="progress-special-icon-wrap score-stars-wrap">
                        <div className="progress-special-icon score-stars">
                          {achievement.icon}
                        </div>
                      </div>


                      <div className="progress-special-info">

                        <div className="progress-special-tier">
                          {achievement.tier}
                        </div>

                        <div className="progress-special-title">
                          {achievement.title}
                        </div>

                        <div className="progress-special-description">
                          {achievement.description}
                        </div>

                      </div>


                      <div className="progress-special-check">
                        ✓
                      </div>

                    </div>
                  )
                )}

              </div>

            </div>
          )}


          {/* =================================================
              EMPTY
          ================================================= */}

          {specialAchievementsCount === 0 && (
            <div className="progress-empty-achievement">

              <span className="progress-empty-icon">
                🏅
              </span>

              <span>
                Hãy tiếp tục học tập và chơi game.
                <br />
                Những thành tích đặc biệt đang chờ
                bạn khám phá.
              </span>

            </div>
          )}

        </section>

      </div>
    </StudentLayout>
  );
}


export default Progress;
