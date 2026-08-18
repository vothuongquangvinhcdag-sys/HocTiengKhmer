import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import "./Game.css";


/* =========================================================
   STORAGE WAT 1
========================================================= */

const WAT1_STORAGE_PREFIX =
  "khmer_wat1_progress";


/* =========================================================
   GET USER STORAGE KEY
========================================================= */

function getWat1StorageKey(profile) {
  const userId =
    profile?.id ||
    profile?.user_id ||
    profile?.username ||
    profile?.email ||
    "guest";

  return `${WAT1_STORAGE_PREFIX}_${String(userId)}`;
}


/* =========================================================
   READ WAT 1 PROGRESS
========================================================= */

function getWat1Progress(profile) {
  try {
    const key =
      getWat1StorageKey(profile);

    const saved =
      localStorage.getItem(key);

    if (!saved) {
      return null;
    }

    const parsed =
      JSON.parse(saved);

    if (
      !parsed ||
      typeof parsed !== "object"
    ) {
      return null;
    }

    return parsed;

  } catch (error) {

    console.error(
      "GAME: Không thể đọc tiến trình WAT 1:",
      error
    );

    return null;
  }
}


/* =========================================================
   CHECK WAT 1 COMPLETED
========================================================= */

function isWat1Completed(profile) {
  const progress =
    getWat1Progress(profile);

  return (
    progress?.wat1Completed === true ||
    progress?.keyObtained === true ||
    progress?.final?.completed === true
  );
}


/* =========================================================
   GET COMPLETED WAT COUNT
========================================================= */

function getCompletedWatCount(profile) {

  const profileCompleted =
    Number(
      profile?.completed_wat ?? 0
    );

  const wat1Completed =
    isWat1Completed(profile);


  /*
    WAT 1 hoàn thành trong localStorage
    nhưng profile chưa đồng bộ
    → ép tối thiểu completedWat = 1
  */

  const localCompleted =
    wat1Completed
      ? 1
      : 0;


  return Math.max(
    profileCompleted,
    localCompleted
  );
}


/* =========================================================
   10 NGÔI ĐỀN
========================================================= */

const GAMES = [
  {
    id: 1,
    wat: "Wat Ák-sâ",
    khmer: "វត្តអក្សរ",
    title: "Chùa Chữ Cái",
    description:
      "Nhận diện phụ âm và nguyên âm Khmer.",
    icon: "🔤",
    route: "/game/Wat1",
  },

  {
    id: 2,
    wat: "Wat Sâm-lâng",
    khmer: "វត្តសំឡេង",
    title: "Chùa Âm Thanh",
    description:
      "Nghe và nhận diện âm thanh Khmer.",
    icon: "🔊",
    route: "/game/wat-sam-lang",
  },

  {
    id: 3,
    wat: "Wat Sâp",
    khmer: "វត្តពាក្យ",
    title: "Chùa Từ Vựng",
    description:
      "Ghi nhớ và nhận diện từ vựng Khmer.",
    icon: "📖",
    route: "/game/wat-sap",
  },

  {
    id: 4,
    wat: "Wat Bân-teh",
    khmer: "វត្តផ្សំពាក្យ",
    title: "Chùa Ghép Chữ",
    description:
      "Ghép chữ và tạo thành từ Khmer.",
    icon: "🧩",
    route: "/game/wat-ban-teh",
  },

  {
    id: 5,
    wat: "Wat Sâm-râl",
    khmer: "វត្តប្រតិកម្ម",
    title: "Chùa Phản Xạ",
    description:
      "Rèn luyện khả năng phản xạ với tiếng Khmer.",
    icon: "⚡",
    route: "/game/wat-sam-ral",
  },

  {
    id: 6,
    wat: "Wat Châng",
    khmer: "វត្តអក្ខរាវិរុទ្ធ",
    title: "Chùa Chính Tả",
    description:
      "Luyện nghe, viết và chính tả Khmer.",
    icon: "✍️",
    route: "/game/wat-chang",
  },

  {
    id: 7,
    wat: "Wat Chhâk",
    khmer: "វត្តប្រកួតប្រជែង",
    title: "Chùa Thử Thách",
    description:
      "Vượt qua những thử thách tổng hợp.",
    icon: "🎯",
    route: "/game/wat-chhak",
  },

  {
    id: 8,
    wat: "Wat Bânh-chhâp",
    khmer: "វត្តល្បឿន",
    title: "Chùa Tốc Độ",
    description:
      "Hoàn thành thử thách trong thời gian giới hạn.",
    icon: "⏱️",
    route: "/game/wat-banh-chhap",
  },

  {
    id: 9,
    wat: "Wat Vôl",
    khmer: "វត្តមហាប្រកួត",
    title: "Chùa Đại Thử Thách",
    description:
      "Thử thách tổng hợp kiến thức tiếng Khmer.",
    icon: "👑",
    route: "/game/wat-vol",
  },

  {
    id: 10,
    wat: "Wat Mahâ-chây",
    khmer: "វត្តមហាជ័យ",
    title: "Đền Tối Cao",
    description:
      "Đại thử thách cuối cùng của hành trình tiếng Khmer.",
    icon: "👑",
    route: "/game/wat-maha-chay",
    final: true,
  },
];


/* =========================================================
   COMPONENT
========================================================= */

function Game({
  profile,
  session,
  navigate,
  onLogout,
  onProgressUpdated,
}) {

  /* =======================================================
     COMPLETED WAT
  ======================================================= */

  const [completedWat, setCompletedWat] =
    useState(() =>
      getCompletedWatCount(profile)
    );


  /* =======================================================
     SYNC PROGRESS
  ======================================================= */

  const syncProgress =
    useCallback(() => {

      const nextCount =
        getCompletedWatCount(profile);

      setCompletedWat(
        nextCount
      );

      console.log(
        "GAME: Đồng bộ tiến trình",
        {
          profileCompleted:
            profile?.completed_wat,

          wat1Completed:
            isWat1Completed(profile),

          completedWat:
            nextCount,
        }
      );

    }, [
      profile,
    ]);


  /* =======================================================
     PROFILE THAY ĐỔI
  ======================================================= */

  useEffect(() => {

    syncProgress();

  }, [
    syncProgress,
  ]);


  /* =======================================================
     LISTENER TIẾN TRÌNH
  ======================================================= */

  useEffect(() => {

    const handleProgress =
      () => {

        syncProgress();

      };


    window.addEventListener(
      "wat1-progress-updated",
      handleProgress
    );


    window.addEventListener(
      "storage",
      handleProgress
    );


    return () => {

      window.removeEventListener(
        "wat1-progress-updated",
        handleProgress
      );

      window.removeEventListener(
        "storage",
        handleProgress
      );

    };

  }, [
    syncProgress,
  ]);


  /* =======================================================
     PROFILE UPDATE CALLBACK
  ======================================================= */

  useEffect(() => {

    if (
      typeof onProgressUpdated ===
      "function"
    ) {

      onProgressUpdated();

    }

  }, [
    completedWat,
    onProgressUpdated,
  ]);


  /* =======================================================
     COMPLETED COUNT
  ======================================================= */

  const completedCount =
    Math.min(
      Math.max(
        Number(completedWat) || 0,
        0
      ),
      GAMES.length
    );


  const badgeCount =
    completedCount;


  const progressPercent =
    (completedCount / GAMES.length) *
    100;


  /* =======================================================
     UNLOCK
  ======================================================= */

  const isWatUnlocked =
    useCallback(
      (game) => {

        /*
          WAT 1 luôn mở.

          WAT 2 mở khi WAT 1 hoàn thành.

          WAT 3 mở khi WAT 2 hoàn thành.

          ...
        */

        return (
          game.id <=
          completedCount + 1
        );

      },
      [
        completedCount,
      ]
    );


  /* =======================================================
     CLICK WAT
  ======================================================= */

  const handleWatClick =
    useCallback(
      (game) => {

        if (
          !isWatUnlocked(game)
        ) {

          console.log(
            `GAME: ${game.wat} chưa mở khóa.`
          );

          return;
        }


        navigate(
          game.route
        );

      },
      [
        isWatUnlocked,
        navigate,
      ]
    );


  /* =======================================================
     BACK
  ======================================================= */

  const handleBack =
    useCallback(() => {

      navigate(
        "/student"
      );

    }, [
      navigate,
    ]);


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="game-page">

      {/* ===================================================
          ÁNH SÁNG HUYỀN BÍ
      =================================================== */}

      <div className="game-mystic-glow game-glow-1" />
      <div className="game-mystic-glow game-glow-2" />
      <div className="game-mystic-glow game-glow-3" />


      {/* ===================================================
          HERO
      =================================================== */}

      <section className="game-hero">

        <div className="hero-mist hero-mist-1" />
        <div className="hero-mist hero-mist-2" />

        <button
          type="button"
          className="game-back-button"
          onClick={
            handleBack
          }
        >
          ← Trang học
        </button>


        <div className="game-hero-content">

          <div className="game-hero-icon">
            🛕
          </div>

          <h1 className="game-hero-title">
            HÀNH TRÌNH CHINH PHỤC 10 NGÔI ĐỀN
          </h1>

          <div className="game-hero-khmer-title">
            ដំណើរនៃការយកឈ្នះប្រាសាទទាំង ១០
          </div>

          <p className="game-hero-subtitle">
            Chinh phục tiếng Khmer qua từng ngôi đền
          </p>

          <div className="game-hero-khmer-subtitle">
            ដំណើររៀនភាសាខ្មែរតាមរយៈប្រាសាទនីមួយៗ
          </div>

          <div className="hero-rune-line">
            ✦ ───── ✧ ───── ✦
          </div>

        </div>

      </section>


      {/* ===================================================
          PLAYER CARD
      =================================================== */}

      <section className="game-player-card">

        <div className="game-player-main">

          <div className="game-player-info">

            <div className="game-player-avatar">
              👤
            </div>

            <div className="game-player-name">

              <span className="game-player-label">
                NHÀ CHINH PHỤC
              </span>

              <strong>
                {profile?.username ||
                  "Học viên"}
              </strong>

              <small>
                Hành trình chinh phục tiếng Khmer
              </small>

            </div>

          </div>


          <div className="game-player-stats">

            <div className="game-player-stat">

              <span className="game-stat-icon">
                ✦
              </span>

              <div>

                <strong>
                  {profile?.exp ?? 0}
                </strong>

                <small>
                  EXP
                </small>

              </div>

            </div>


            <div className="game-player-stat">

              <span className="game-stat-icon">
                🛕
              </span>

              <div>

                <strong>
                  {completedCount} / 10
                </strong>

                <small>
                  NGÔI ĐỀN
                </small>

              </div>

            </div>


            <div className="game-player-stat">

              <span className="game-stat-icon">
                🏆
              </span>

              <div>

                <strong>
                  {badgeCount} / 10
                </strong>

                <small>
                  HUY HIỆU
                </small>

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            PROGRESS
        ================================================= */}

        <div className="game-progress-area">

          <div className="game-progress-heading">

            <strong>
              ✦ HÀNH TRÌNH CỦA BẠN
            </strong>

            <span>
              {completedCount} / 10 ngôi đền
            </span>

          </div>


          <div className="game-progress-bar">

            <div
              className="game-progress-fill"
              style={{
                width:
                  `${progressPercent}%`,
              }}
            />

          </div>


          <div className="game-progress-text">

            {completedCount === 0
              ? "Hãy bước qua cánh cổng và bắt đầu Wat Ák-sâ."

              : completedCount === 10
              ? "Bạn đã hoàn thành toàn bộ hành trình."

              : `Đã chinh phục ${completedCount} ngôi đền — ${
                  10 - completedCount
                } ngôi đền vẫn đang chờ bạn.`}

          </div>

        </div>


        {/* =================================================
            BADGES
        ================================================= */}

        <div className="game-badges-section">

          <div className="game-badges-header">

            <div>

              <h2>
                🏯 HUY HIỆU CHINH PHỤC
              </h2>

              <p>
                Mỗi huy hiệu đánh dấu một ngôi đền đã vượt qua
              </p>

            </div>

            <span className="game-badge-count">
              {badgeCount} / 10
            </span>

          </div>


          <div className="game-badges">

            {GAMES.map((game) => {

              const completed =
                game.id <=
                completedCount;


              return (
                <div
                  key={game.id}
                  className={`
                    game-badge
                    ${
                      completed
                        ? "game-badge-completed"
                        : "game-badge-locked"
                    }
                    ${
                      game.final
                        ? "game-badge-final"
                        : ""
                    }
                  `}
                  title={
                    completed
                      ? `${game.wat} — Đã chinh phục`
                      : `${game.wat} — Chưa chinh phục`
                  }
                >

                  <div className="game-badge-temple">

                    {completed
                      ? "🛕"
                      : "🔒"}

                    <span className="game-badge-number">
                      {game.id}
                    </span>

                  </div>

                  <strong className="game-badge-wat">
                    {game.wat}
                  </strong>

                  <span className="game-badge-khmer">
                    {game.khmer}
                  </span>

                  <small>
                    {game.title}
                  </small>

                </div>
              );

            })}

          </div>

        </div>

      </section>


      {/* ===================================================
          START BANNER
      =================================================== */}

      <section className="game-start-banner">

        <div className="game-start-icon">
          🗝️
        </div>

        <div className="game-start-content">

          <h2>
            CÁNH CỔNG ĐANG CHỜ BẠN
          </h2>

          <p>
            Bước vào hành trình khám phá những bí mật của tiếng Khmer
          </p>

          <div className="game-start-khmer">
            ចាប់ផ្តើមដំណើររបស់អ្នក
          </div>

        </div>

        <div className="game-start-arrow">
          ↓
        </div>

      </section>


      {/* ===================================================
          MAP
      =================================================== */}

      <section className="game-section">

        <div className="game-section-header">

          <div className="game-section-icon">
            ✦
          </div>

          <h2>
            BẢN ĐỒ HÀNH TRÌNH
          </h2>

          <div className="game-section-khmer">
            ផែនទីដំណើរ
          </div>

          <p>
            Mỗi ngôi đền là một thử thách.
            Mỗi bước tiến mở ra một bí mật mới.
          </p>

        </div>


        {/* =================================================
            MAP
        ================================================= */}

        <div className="game-map">

          <div className="game-map-mist map-mist-1" />
          <div className="game-map-mist map-mist-2" />
          <div className="game-map-mist map-mist-3" />


          {/* SAO */}

          <div className="game-stars">

            <span className="map-star star-1">
              ✦
            </span>

            <span className="map-star star-2">
              ✧
            </span>

            <span className="map-star star-3">
              ✦
            </span>

            <span className="map-star star-4">
              ·
            </span>

            <span className="map-star star-5">
              ✧
            </span>

            <span className="map-star star-6">
              ✦
            </span>

            <span className="map-star star-7">
              ·
            </span>

            <span className="map-star star-8">
              ✧
            </span>

            <span className="map-star star-9">
              ✦
            </span>

            <span className="map-star star-10">
              ·
            </span>

          </div>


          {/* CHỮ KHMER */}

          <div className="game-map-runes">

            <span className="map-rune rune-1">
              អ
            </span>

            <span className="map-rune rune-2">
              ក
            </span>

            <span className="map-rune rune-3">
              ខ
            </span>

            <span className="map-rune rune-4">
              ម
            </span>

            <span className="map-rune rune-5">
              យ
            </span>

            <span className="map-rune rune-6">
              ភ
            </span>

          </div>


          {/* ĐƯỜNG ÁNH SÁNG */}

          <div className="game-map-energy-line" />


          {/* =================================================
              10 NGÔI ĐỀN
          ================================================= */}

          <div className="game-map-path">

            {GAMES.map(
              (game, index) => {

                const completed =
                  game.id <=
                  completedCount;


                const unlocked =
                  isWatUnlocked(
                    game
                  );


                const isCurrent =
                  unlocked &&
                  !completed;


                return (
                  <div
                    key={game.id}
                    className={`
                      game-map-node-wrapper
                      ${
                        index % 2 === 0
                          ? "map-left"
                          : "map-right"
                      }
                    `}
                  >

                    {/* ĐƯỜNG NỐI */}

                    {index <
                      GAMES.length - 1 && (
                      <div
                        className={`
                          game-map-connector
                          ${
                            completed
                              ? "connector-completed"
                              : ""
                          }
                        `}
                      />
                    )}


                    {/* NGÔI ĐỀN */}

                    <div
                      className={`
                        game-map-node

                        ${
                          completed
                            ? "game-map-node-completed"
                            : ""
                        }

                        ${
                          isCurrent
                            ? "game-map-node-current"
                            : ""
                        }

                        ${
                          !unlocked
                            ? "game-map-node-locked"
                            : ""
                        }

                        ${
                          game.final
                            ? "game-map-node-final"
                            : ""
                        }
                      `}
                      onClick={() =>
                        handleWatClick(
                          game
                        )
                      }
                    >

                      {/* HÀO QUANG */}

                      <div className="temple-aura" />

                      <div className="temple-aura temple-aura-2" />


                      {/* SỐ */}

                      <div className="game-map-number">
                        {game.id}
                      </div>


                      {/* KHÓA */}

                      {!unlocked && (
                        <div className="game-map-lock">
                          🔒
                        </div>
                      )}


                      {/* HOÀN THÀNH */}

                      {completed && (
                        <div className="game-map-completed">
                          ✓
                        </div>
                      )}


                      {/* MÁI ĐỀN */}

                      <div className="temple-building">

                        <div className="temple-roof temple-roof-top">
                          <span />
                        </div>

                        <div className="temple-roof temple-roof-middle">
                          <span />
                        </div>

                        <div className="temple-roof temple-roof-bottom">
                          <span />
                        </div>


                        {/* CỘT */}

                        <div className="temple-pillars">

                          <span className="temple-pillar" />
                          <span className="temple-pillar" />
                          <span className="temple-pillar" />
                          <span className="temple-pillar" />

                        </div>


                        {/* CỬA */}

                        <div className="temple-door">
                          {game.icon}
                        </div>


                        {/* BỆ */}

                        <div className="temple-base" />

                      </div>


                      {/* THÔNG TIN */}

                      <div className="temple-info">

                        <div className="temple-wat">
                          {game.wat}
                        </div>

                        <div className="temple-khmer">
                          {game.khmer}
                        </div>

                        <h3>
                          {game.title}
                        </h3>

                        <p>
                          {game.description}
                        </p>

                      </div>


                      {/* TRẠNG THÁI */}

                      <div
                        className={`
                          game-map-status

                          ${
                            completed
                              ? "status-completed"
                              : unlocked
                              ? "status-available"
                              : "status-locked"
                          }
                        `}
                      >

                        {completed ? (
                          <>
                            🏆 Đã chinh phục
                          </>
                        ) : unlocked ? (
                          <>
                            <span className="status-dot" />
                            Chinh phục ngay
                          </>
                        ) : (
                          <>
                            🔒 Chưa mở khóa
                          </>
                        )}

                      </div>

                    </div>

                  </div>
                );

              }
            )}

          </div>


          {/* =================================================
              CỔNG CUỐI
          ================================================= */}

          <div
            className={`
              game-map-ending
              ${
                completedCount === 10
                  ? "game-map-ending-completed"
                  : "game-map-ending-locked"
              }
            `}
          >

            <div className="ending-energy-ring ending-ring-1" />
            <div className="ending-energy-ring ending-ring-2" />
            <div className="ending-energy-ring ending-ring-3" />

            <div className="ending-symbol">
              {completedCount === 10
                ? "✦"
                : "🔒"}
            </div>

            <div className="ending-title">
              {completedCount === 10
                ? "HÀNH TRÌNH HOÀN TẤT"
                : "HẾT HÀNH TRÌNH"}
            </div>

            <div className="ending-khmer">
              មហាជ័យ
            </div>

            <div className="ending-text">

              {completedCount === 10 ? (
                <>
                  ✦ Bạn đã chinh phục đủ{" "}
                  <strong>
                    10 ngôi đền
                  </strong>.
                  <br />
                  Cánh cổng Đại Thắng đã được đánh thức.
                </>
              ) : (
                <>
                  Chỉ người chinh phục đủ{" "}
                  <strong>
                    10 ngôi đền
                  </strong>
                  <br />
                  mới có thể bước đến đây.
                </>
              )}

            </div>

            {completedCount === 10 && (
              <div className="ending-complete-badge">
                🏆 ĐÃ CHINH PHỤC 10 / 10 NGÔI ĐỀN
              </div>
            )}

          </div>

        </div>

      </section>

    </div>
  );
}


export default Game;