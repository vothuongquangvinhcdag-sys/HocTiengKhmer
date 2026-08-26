import { useMemo } from "react";
import "./Progress.css";
import StudentLayout from "../StudentLayout";

/* =========================================================
   CẤU HÌNH LEVEL
   DÙNG Y NGUYÊN LOGIC CỦA STUDENT HOME
========================================================= */

const MAX_LEVEL = 10;

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
   XÁC ĐỊNH LEVEL TỪ EXP

   PHẢI GIỐNG 100% STUDENT HOME
========================================================= */

function getLevelFromExp(exp) {
  const safeExp =
    Math.max(0, Number(exp) || 0);

  if (safeExp < 100) return 1;
  if (safeExp < 200) return 2;
  if (safeExp < 400) return 3;
  if (safeExp < 800) return 4;
  if (safeExp < 1600) return 5;
  if (safeExp < 3200) return 6;
  if (safeExp < 6400) return 7;
  if (safeExp < 12800) return 8;
  if (safeExp < 25600) return 9;

  return 10;
}

/* =========================================================
   TÍNH TIẾN ĐỘ LEVEL

   Ví dụ:
   1160 EXP

   Level hiện tại = 5
   Level 5 bắt đầu = 800
   Level 6 bắt đầu = 1600

   EXP trong Level = 1160 - 800 = 360
   Cần tổng = 1600 - 800 = 800
   Còn = 800 - 360 = 440
   Tiến độ = 360 / 800 = 45%
========================================================= */

function getLevelProgress(exp) {
  const safeExp =
    Math.max(0, Number(exp) || 0);

  const currentLevel =
    getLevelFromExp(safeExp);

  /* =======================================================
     MAX LEVEL
  ======================================================= */

  if (currentLevel >= MAX_LEVEL) {
    return {
      currentLevel,
      currentExp: safeExp,
      requiredExp: 0,
      remainingExp: 0,
      percent: 100,
      isMaxLevel: true,
    };
  }

  /* =======================================================
     MỐC EXP CỦA LEVEL HIỆN TẠI
  ======================================================= */

  const previousExp =
    LEVEL_EXP[currentLevel];

  /* =======================================================
     LEVEL TIẾP THEO
  ======================================================= */

  const nextLevel =
    currentLevel + 1;

  const nextLevelExp =
    LEVEL_EXP[nextLevel];

  /* =======================================================
     EXP CẦN TRONG LEVEL HIỆN TẠI
  ======================================================= */

  const requiredExp =
    nextLevelExp -
    previousExp;

  /* =======================================================
     EXP ĐÃ ĐẠT TRONG LEVEL HIỆN TẠI
  ======================================================= */

  const currentExp =
    Math.max(
      0,
      safeExp - previousExp
    );

  /* =======================================================
     EXP CÒN THIẾU
  ======================================================= */

  const remainingExp =
    Math.max(
      0,
      requiredExp - currentExp
    );

  /* =======================================================
     PHẦN TRĂM
  ======================================================= */

  const percent =
    requiredExp > 0
      ? Math.min(
          100,
          Math.round(
            (currentExp /
              requiredExp) *
              100
          )
        )
      : 100;

  return {
    currentLevel,
    currentExp,
    requiredExp,
    remainingExp,
    percent,
    isMaxLevel: false,
  };
}

/* =========================================================
   FORMAT THỜI GIAN
========================================================= */

function formatStudyTime(seconds) {
  const safeSeconds =
    Math.max(
      0,
      Math.floor(
        Number(seconds) || 0
      )
    );

  const hours =
    Math.floor(
      safeSeconds / 3600
    );

  const minutes =
    Math.floor(
      (safeSeconds % 3600) /
        60
    );

  const secs =
    safeSeconds % 60;

  return {
    hours,
    minutes,
    seconds: secs,
    text:
      `${hours} giờ ` +
      `${minutes} phút ` +
      `${secs} giây`,
  };
}

/* =========================================================
   CHUỖI NGÀY HỌC
========================================================= */

function getStudyStreak(profile) {
  const value =
    Number(
      profile?.study_streak ??
        profile?.learning_streak ??
        0
    );

  return Math.max(
    0,
    Math.floor(value)
  );
}

/* =========================================================
   GAME PROGRESS
========================================================= */

function loadGameProgress() {
  try {
    const raw =
      localStorage.getItem(
        "khmer_game_progress"
      );

    if (!raw) {
      return {
        games: {},
      };
    }

    const parsed =
      JSON.parse(raw);

    if (
      !parsed ||
      typeof parsed !== "object"
    ) {
      return {
        games: {},
      };
    }

    return {
      games:
        parsed.games &&
        typeof parsed.games ===
          "object"
          ? parsed.games
          : {},
    };
  } catch (error) {
    console.warn(
      "Không thể đọc tiến độ Game:",
      error
    );

    return {
      games: {},
    };
  }
}

/* =========================================================
   KIỂM TRA GAME HOÀN THÀNH
========================================================= */

function isGameCompleted(
  gameProgress
) {
  if (!gameProgress) {
    return false;
  }

  if (
    gameProgress.completed ===
    true
  ) {
    return true;
  }

  if (
    gameProgress.isCompleted ===
    true
  ) {
    return true;
  }

  if (
    gameProgress.completedAt
  ) {
    return true;
  }

  const stages =
    gameProgress.stages;

  if (
    stages &&
    typeof stages ===
      "object"
  ) {
    const stageIds = [
      "stage1",
      "stage2",
      "stage3",
      "stage4",
    ];

    return stageIds.every(
      (stageId) => {
        const stage =
          stages[stageId];

        if (!stage) {
          return false;
        }

        return (
          stage.completed ===
            true ||
          stage.isCompleted ===
            true ||
          stage.completedAt
        );
      }
    );
  }

  return false;
}

/* =========================================================
   DANH HIỆU TRÒ CHƠI
========================================================= */

const GAME_BADGES = [
  {
    gameId: 1,
    icon: "🏆",
    name: "Người khám phá chữ Khmer",
    description:
      "Hoàn thành Game 1",
  },
  {
    gameId: 2,
    icon: "🏆",
    name: "Bậc thầy ghép chữ",
    description:
      "Hoàn thành Game 2",
  },
  {
    gameId: 3,
    icon: "🏆",
    name: "Người chinh phục Khmer",
    description:
      "Hoàn thành Game 3",
  },
  {
    gameId: 4,
    icon: "🏆",
    name: "Bậc thầy Khmer",
    description:
      "Hoàn thành Game 4",
  },
  {
    gameId: 5,
    icon: "🏆",
    name: "Huyền thoại chữ Khmer",
    description:
      "Hoàn thành Game 5",
  },
];

/* =========================================================
   DANH HIỆU THÀNH TÍCH HỌC TẬP
========================================================= */

const STUDY_BADGES = [
  {
    id: "study-1h",
    icon: "🔥",
    name: "Người học chăm chỉ",
    description:
      "Online 1 giờ",
    requiredSeconds:
      1 * 60 * 60,
  },
  {
    id: "study-2h",
    icon: "💪",
    name: "Người học bền bỉ",
    description:
      "Online 2 giờ",
    requiredSeconds:
      2 * 60 * 60,
  },
  {
    id: "study-4h",
    icon: "🏅",
    name: "Người học kiên trì",
    description:
      "Online 4 giờ",
    requiredSeconds:
      4 * 60 * 60,
  },
  {
    id: "study-8h",
    icon: "🌟",
    name: "Người say mê Khmer",
    description:
      "Online 8 giờ",
    requiredSeconds:
      8 * 60 * 60,
  },
  {
    id: "study-16h",
    icon: "💎",
    name: "Người chinh phục tri thức",
    description:
      "Online 16 giờ",
    requiredSeconds:
      16 * 60 * 60,
  },
  {
    id: "study-32h",
    icon: "👑",
    name: "Bậc thầy chăm học",
    description:
      "Online 32 giờ",
    requiredSeconds:
      32 * 60 * 60,
  },
  {
    id: "study-64h",
    icon: "🏆",
    name: "Học giả Khmer",
    description:
      "Online 64 giờ",
    requiredSeconds:
      64 * 60 * 60,
  },
  {
    id: "study-128h",
    icon: "👑",
    name: "Huyền thoại Khmer",
    description:
      "Online 128 giờ",
    requiredSeconds:
      128 * 60 * 60,
  },
];

/* =========================================================
   COMPONENT
========================================================= */

function Progress({
  profile,
  navigate,
  onLogout,
}) {
  /* =======================================================
     USER
  ======================================================= */

  const username =
    profile?.username ||
    profile?.account ||
    "Học sinh";

  /* =======================================================
     EXP

     LẤY TRỰC TIẾP TỪ PROFILE
     GIỐNG STUDENT HOME KHI KHÔNG TRUYỀN totalExp
  ======================================================= */

  const totalExp =
    Math.max(
      0,
      Number(
        profile?.exp ?? 0
      ) || 0
    );

  /* =======================================================
     LEVEL

     DÙNG CHUNG MỘT HÀM VỚI STUDENT HOME
  ======================================================= */

  const levelInfo =
    getLevelProgress(
      totalExp
    );

  /* =======================================================
     STUDY TIME
  ======================================================= */

  const totalStudySeconds =
    Math.max(
      0,
      Number(
        profile?.total_study_seconds ??
          0
      ) || 0
    );

  const studyTime =
    formatStudyTime(
      totalStudySeconds
    );

  /* =======================================================
     STUDY STREAK
  ======================================================= */

  const studyStreak =
    getStudyStreak(
      profile
    );

  /* =======================================================
     GAME PROGRESS
  ======================================================= */

  const gameProgress =
    useMemo(
      () =>
        loadGameProgress(),
      []
    );

  /* =======================================================
     GAME BADGES
  ======================================================= */

  const earnedGameBadges =
    useMemo(() => {
      return GAME_BADGES.filter(
        (badge) =>
          isGameCompleted(
            gameProgress.games?.[
              badge.gameId
            ]
          ) ||
          isGameCompleted(
            gameProgress.games?.[
              String(
                badge.gameId
              )
            ]
          )
      );
    }, [gameProgress]);

  /* =======================================================
     STUDY BADGES
  ======================================================= */

  const earnedStudyBadges =
    useMemo(() => {
      return STUDY_BADGES.filter(
        (badge) =>
          totalStudySeconds >=
          badge.requiredSeconds
      );
    }, [
      totalStudySeconds,
    ]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <StudentLayout
      profile={profile}
      navigate={navigate}
      onLogout={onLogout}
      activeMenu="progress"
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="progress-header">

        <div>

          <div className="progress-header-khmer khmer-text">
            ការរីកចម្រើនក្នុងការសិក្សា
          </div>

          <h1>
            📊 Tiến độ học tập
          </h1>

          <p>
            Theo dõi hành trình chinh phục
            tiếng Khmer
          </p>

        </div>

      </header>

      {/* =================================================
          OVERVIEW
      ================================================= */}

      <section className="progress-overview">

        <div className="progress-overview-card">

          <div className="progress-overview-icon">
            ⭐
          </div>

          <div className="progress-overview-label">
            CẤP ĐỘ
          </div>

          <div className="progress-overview-value">
            {levelInfo.currentLevel}
          </div>

          {levelInfo.isMaxLevel && (
            <div className="progress-overview-sub max">
              CẤP ĐỘ TỐI ĐA
            </div>
          )}

        </div>

        <div className="progress-overview-card">

          <div className="progress-overview-icon">
            ⚡
          </div>

          <div className="progress-overview-label">
            TỔNG KINH NGHIỆM
          </div>

          <div className="progress-overview-value exp-value">
            {totalExp.toLocaleString(
              "vi-VN"
            )}
          </div>

          <div className="progress-overview-sub">
           EXP
          </div>

        </div>

        <div className="progress-overview-card">

          <div className="progress-overview-icon">
            🔥
          </div>

          <div className="progress-overview-label">
            CHUỖI NGÀY HỌC
          </div>

          <div className="progress-overview-value">
            {studyStreak}
          </div>

          <div className="progress-overview-sub">
            ngày
          </div>

        </div>

      </section>

      {/* =================================================
          LEVEL PROGRESS
      ================================================= */}

      <section className="progress-panel">

        <div className="progress-panel-heading">

          <div>

            <h2>
              ⚡ Tiến độ Level
            </h2>

            <p>
              Tiếp tục học để chinh phục
              cấp độ tiếp theo.
            </p>

          </div>

        </div>

        {/* =================================================
            LEVEL HIỆN TẠI

            CHỈ HIỂN THỊ MỘT LEVEL
            KHÔNG HIỂN THỊ LEVEL 6 → LEVEL 7
        ================================================= */}

        <div className="progress-level-info">

          <div>

            <strong>
              Level{" "}
              {levelInfo.currentLevel}
            </strong>

          </div>

          <div className="progress-level-exp">

            {levelInfo.isMaxLevel
              ? `${totalExp.toLocaleString(
                  "vi-VN"
                )} EXP`
              : `${levelInfo.currentExp.toLocaleString(
                  "vi-VN"
                )} / ${levelInfo.requiredExp.toLocaleString(
                  "vi-VN"
                )} EXP`}

          </div>

        </div>

        {/* =================================================
            THANH TIẾN ĐỘ
        ================================================= */}

        <div className="progress-level-track">

          <div
            className="progress-level-fill"
            style={{
              width:
                `${levelInfo.percent}%`,
            }}
          >

            <div className="progress-level-shine" />

          </div>

        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="progress-level-footer">

          {levelInfo.isMaxLevel ? (

            <span className="progress-max-text">
              👑 Bạn đã đạt cấp độ tối đa
            </span>

          ) : (

            <>

              <span>
                {levelInfo.percent}%
                {" "}hoàn thành
              </span>

              <span>
                Còn{" "}
                <strong>
                  {levelInfo.remainingExp.toLocaleString(
                    "vi-VN"
                  )}{" "}
                  EXP
                </strong>{" "}
                để đạt Level{" "}
                {levelInfo.currentLevel + 1}
              </span>

            </>

          )}

        </div>

      </section>

      {/* =================================================
          TOTAL STUDY TIME
      ================================================= */}

      <section className="progress-time-panel">

        <div className="progress-time-icon">
          ⏱️
        </div>

        <div className="progress-time-content">

          <div className="progress-time-label">
            TỔNG THỜI GIAN HỌC
          </div>

          <div className="progress-time-value">

            <span>
              {studyTime.hours}
            </span>

            <small>
              giờ
            </small>

            <span>
              {studyTime.minutes}
            </span>

            <small>
              phút
            </small>

            <span>
              {studyTime.seconds}
            </span>

            <small>
              giây
            </small>

          </div>

        </div>

      </section>

      {/* =================================================
          GAME BADGES
      ================================================= */}

      <section className="progress-panel badges-panel">

        <div className="progress-panel-heading">

          <div>

            <h2>
              🏆 Danh hiệu trò chơi
            </h2>

            <p>
              Những danh hiệu bạn đã đạt được
              qua hành trình chinh phục các Game.
            </p>

          </div>

        </div>

        {earnedGameBadges.length > 0 ? (

          <div className="badges-grid">

            {earnedGameBadges.map(
              (badge) => (

                <div
                  key={badge.gameId}
                  className="badge-card game-badge"
                >

                  <div className="badge-icon">
                    {badge.icon}
                  </div>

                  <h3>
                    {badge.name}
                  </h3>

                  <p>
                    {badge.description}
                  </p>

                </div>

              )
            )}

          </div>

        ) : (

          <div className="empty-badge-state">
            Chưa có danh hiệu trò chơi.
            <br />
            Hãy tiếp tục chinh phục các Game!
          </div>

        )}

      </section>

      {/* =================================================
          STUDY BADGES
      ================================================= */}

      <section className="progress-panel badges-panel">

        <div className="progress-panel-heading">

          <div>

            <h2>
              🌟 Danh hiệu thành tích học tập
            </h2>

            <p>
              Những danh hiệu bạn đã khám phá
              trong hành trình học tập.
            </p>

          </div>

        </div>

        {earnedStudyBadges.length > 0 ? (

          <div className="badges-grid">

            {earnedStudyBadges.map(
              (badge) => (

                <div
                  key={badge.id}
                  className="badge-card study-badge"
                >

                  <div className="badge-icon">
                    {badge.icon}
                  </div>

                  <h3>
                    {badge.name}
                  </h3>

                  <p>
                    {badge.description}
                  </p>

                </div>

              )
            )}

          </div>

        ) : (

          <div className="empty-badge-state">
            Chưa có danh hiệu thành tích học tập.
            <br />
            Hãy tiếp tục học tập để khám phá!
          </div>

        )}

      </section>

    </StudentLayout>
  );
}

export default Progress;