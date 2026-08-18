import React from "react";

import "./ChallengeMenu.css";

/* =========================================================
   WAT 1 — CHALLENGE MENU
   HÀNH TRÌNH ÁK-SÂ

   QUY TẮC:

   Stage I
   - Mở mặc định

   Stage II
   - Mở khi thắng Stage I lần đầu

   Stage III
   - Mở khi thắng Stage II lần đầu

   Final
   - Mở khi thắng Stage III lần đầu

   ĐÃ MỞ KHÓA
   - Chơi lại vô hạn
   - Không bị khóa lại khi thua

   HOÀN THÀNH
   - Chỉ có nghĩa là đã từng thắng ít nhất một lần
========================================================= */


/* =========================================================
   CHALLENGE DATA
========================================================= */

const CHALLENGES = [
  {
    id: "stage1",

    number: "Ⅰ",

    title: "THỬ THÁCH I",

    subtitle: "PHỤ ÂM & PHIÊN ÂM",

    description:
      "Nhìn ký tự Khmer và chọn phiên âm chính xác.",

    detail:
      "33 phụ âm Khmer",

    icon: "ក",

    type: "NORMAL",
  },

  {
    id: "stage2",

    number: "Ⅱ",

    title: "THỬ THÁCH II",

    subtitle: "NGUYÊN ÂM & GIỌNG",

    description:
      "Nhận diện nguyên âm và phân biệt giọng O / Ô.",

    detail:
      "24 nguyên âm • O / Ô",

    icon: "អ",

    type: "NORMAL",
  },

  {
    id: "stage3",

    number: "Ⅲ",

    title: "THỬ THÁCH III",

    subtitle: "NGHE & NHẬN DIỆN",

    description:
      "Nghe âm thanh và xác định đúng ký tự Khmer.",

    detail:
      "57 ký tự Khmer",

    icon: "♫",

    type: "NORMAL",
  },

  {
    id: "final",

    number: "🔑",

    title: "THỬ THÁCH CUỐI CÙNG",

    subtitle: "CỔNG CHÌA KHÓA",

    description:
      "Vượt qua thử thách cuối cùng để nhận chìa khóa Ák-Sâ.",

    detail:
      "33 phụ âm • Giọng O / Giọng Ô",

    icon: "🔑",

    type: "FINAL",
  },
];


/* =========================================================
   STATUS
========================================================= */

function getChallengeStatus(challenge, progress) {
  const data = progress?.[challenge.id];

  if (!data?.unlocked) {
    return "locked";
  }

  if (data.completed) {
    return "completed";
  }

  return "unlocked";
}


/* =========================================================
   STATUS TEXT
========================================================= */

function getStatusText(status) {
  switch (status) {
    case "completed":
      return "✓ ĐÃ HOÀN THÀNH";

    case "unlocked":
      return "🔓 ĐÃ MỞ";

    default:
      return "🔒 CHƯA MỞ";
  }
}


/* =========================================================
   COMPONENT
========================================================= */

export default function ChallengeMenu({
  progress,
  profile,
  onBackToIntro,
  onBackToGame,
  onStartChallenge,
}) {
  const completedCount = CHALLENGES.filter(
    (challenge) =>
      progress?.[challenge.id]?.completed
  ).length;


  const unlockedCount = CHALLENGES.filter(
    (challenge) =>
      progress?.[challenge.id]?.unlocked
  ).length;


  const allCompleted =
    completedCount === CHALLENGES.length;


  return (
    <div className="challenge-menu">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div
        className="challenge-menu__glow challenge-menu__glow--top"
        aria-hidden="true"
      />

      <div
        className="challenge-menu__glow challenge-menu__glow--bottom"
        aria-hidden="true"
      />


      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <header className="challenge-menu__topbar">

        <button
          type="button"
          className="challenge-menu__back"
          onClick={onBackToIntro}
        >
          <span>←</span>

          <span>
            WAT ÁK-SÂ — GIỚI THIỆU
          </span>
        </button>


        <button
          type="button"
          className="challenge-menu__map"
          onClick={onBackToGame}
        >
          🗺️ BẢN ĐỒ
        </button>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="challenge-menu__main">

        {/* ===================================================
            HEADER
        =================================================== */}

        <section className="challenge-menu__header">

          <div
            className="challenge-menu__symbol"
            aria-hidden="true"
          >
            𓂀
          </div>

          <div className="challenge-menu__eyebrow">
            WAT ÁK-SÂ
          </div>

          <h1 className="challenge-menu__title">
            HÀNH TRÌNH ÁK-SÂ
          </h1>

          <p className="challenge-menu__description">
            Hãy vượt qua từng thử thách
            để tìm chìa khóa mở Cổng Số 2.
          </p>

        </section>


        {/* ===================================================
            PROGRESS SUMMARY
        =================================================== */}

        <section className="challenge-menu__summary">

          <div className="challenge-menu__summary-item">

            <span className="challenge-menu__summary-icon">
              🔓
            </span>

            <div>
              <strong>
                {unlockedCount}/{CHALLENGES.length}
              </strong>

              <small>
                ĐÃ MỞ
              </small>
            </div>

          </div>


          <div className="challenge-menu__summary-divider" />


          <div className="challenge-menu__summary-item">

            <span className="challenge-menu__summary-icon">
              ✓
            </span>

            <div>
              <strong>
                {completedCount}/{CHALLENGES.length}
              </strong>

              <small>
                ĐÃ HOÀN THÀNH
              </small>
            </div>

          </div>


          <div className="challenge-menu__summary-divider" />


          <div className="challenge-menu__summary-item">

            <span className="challenge-menu__summary-icon">
              🔑
            </span>

            <div>
              <strong>
                {allCompleted ? "CÓ" : "—"}
              </strong>

              <small>
                CHÌA KHÓA
              </small>
            </div>

          </div>

        </section>


        {/* ===================================================
            CHALLENGES
        =================================================== */}

        <section className="challenge-menu__list">

          {CHALLENGES.map(
            (challenge, index) => {
              const status =
                getChallengeStatus(
                  challenge,
                  progress
                );

              const data =
                progress?.[challenge.id];


              const isLocked =
                status === "locked";

              const isCompleted =
                status === "completed";


              return (
                <article
                  key={challenge.id}
                  className={[
                    "challenge-card",

                    `challenge-card--${status}`,

                    challenge.type === "FINAL"
                      ? "challenge-card--final"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >

                  {/* =========================================
                      CARD NUMBER / ICON
                  ========================================= */}

                  <div className="challenge-card__left">

                    <div className="challenge-card__number">
                      {challenge.number}
                    </div>

                    <div className="challenge-card__icon">
                      {challenge.icon}
                    </div>

                  </div>


                  {/* =========================================
                      CARD CONTENT
                  ========================================= */}

                  <div className="challenge-card__content">

                    <div className="challenge-card__top">

                      <div className="challenge-card__title-group">

                        <div className="challenge-card__title">
                          {challenge.title}
                        </div>

                        <div className="challenge-card__subtitle">
                          {challenge.subtitle}
                        </div>

                      </div>


                      <div
                        className={[
                          "challenge-card__status",

                          `challenge-card__status--${status}`,
                        ].join(" ")}
                      >
                        {getStatusText(status)}
                      </div>

                    </div>


                    <p className="challenge-card__description">
                      {challenge.description}
                    </p>


                    <div className="challenge-card__bottom">

                      <span className="challenge-card__detail">
                        {challenge.detail}
                      </span>


                      {isCompleted && (
                        <span className="challenge-card__completed">
                          ✓ Đã vượt qua
                        </span>
                      )}

                    </div>

                  </div>


                  {/* =========================================
                      ACTION
                  ========================================= */}

                  <div className="challenge-card__action">

                    {isLocked ? (
                      <button
                        type="button"
                        className="challenge-card__button challenge-card__button--locked"
                        disabled
                        aria-label={`${challenge.title} chưa mở`}
                      >
                        <span>
                          🔒
                        </span>

                        <small>
                          CHƯA MỞ
                        </small>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={[
                          "challenge-card__button",

                          isCompleted
                            ? "challenge-card__button--replay"
                            : "",

                          challenge.type === "FINAL"
                            ? "challenge-card__button--final"
                            : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        onClick={() =>
                          onStartChallenge(
                            challenge.id
                          )
                        }
                      >
                        <span>
                          {isCompleted
                            ? "↻"
                            : challenge.type === "FINAL"
                              ? "🔑"
                              : "⚔"}
                        </span>

                        <small>
                          {isCompleted
                            ? "CHƠI LẠI"
                            : challenge.type === "FINAL"
                              ? "VÀO THỬ THÁCH"
                              : "CHƠI"}
                        </small>
                      </button>
                    )}

                  </div>

                </article>
              );
            }
          )}

        </section>


        {/* ===================================================
            KEY REWARD
        =================================================== */}

        {allCompleted && (
          <section className="challenge-menu__key">

            <div className="challenge-menu__key-glow" />

            <div className="challenge-menu__key-icon">
              🔑
            </div>

            <div className="challenge-menu__key-content">

              <div className="challenge-menu__key-eyebrow">
                WAT ÁK-SÂ
              </div>

              <h2>
                CHÌA KHÓA ÁK-SÂ ĐÃ CÓ
              </h2>

              <p>
                Bạn đã hoàn thành toàn bộ
                thử thách của ngôi đền đầu tiên.
              </p>

              <strong>
                🚪 CÁNH CỔNG SỐ 2 ĐÃ MỞ
              </strong>

            </div>

          </section>
        )}


        {/* ===================================================
            FOOTER
        =================================================== */}

        <footer className="challenge-menu__footer">

          <div>
            WAT ÁK-SÂ
          </div>

          <span>•</span>

          <div>
            {completedCount === 0
              ? "HÃY BẮT ĐẦU HÀNH TRÌNH"
              : `${completedCount}/${CHALLENGES.length} THỬ THÁCH ĐÃ VƯỢT QUA`}
          </div>

          <span>•</span>

          <div>
            01
          </div>

        </footer>

      </main>
    </div>
  );
}
