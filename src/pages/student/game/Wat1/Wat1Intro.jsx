import "./Wat1Intro.css";

/* =========================================================
   WAT 1 — INTRO
   WAT ÁK-SÂ
   ĐẢO BẢNG CHỮ CÁI

   NHIỆM VỤ:
   - Giới thiệu WAT 1
   - Giới thiệu cốt truyện
   - Giới thiệu nội dung
   - Quay về Game.jsx / Bản đồ hành trình
   - Đi tới ChallengeMenu

   KHÔNG:
   - Không có câu hỏi
   - Không có gameplay
   - Không xử lý unlock
   - Không xử lý điểm
========================================================= */

export default function Wat1Intro({
  onBackToGame,
  onStartChallenges,
}) {
  /* =======================================================
     QUAY VỀ BẢN ĐỒ HÀNH TRÌNH

     Callback này được truyền từ Wat1.jsx.

     Nếu callback không tồn tại thì không làm crash
     toàn bộ component.
  ======================================================= */

  const handleBackToGame = () => {
    if (typeof onBackToGame === "function") {
      onBackToGame();
      return;
    }

    console.error(
      "Wat1Intro: onBackToGame chưa được truyền từ component cha."
    );
  };


  /* =======================================================
     ĐI TỚI DANH SÁCH THỬ THÁCH
  ======================================================= */

  const handleStartChallenges = () => {
    if (typeof onStartChallenges === "function") {
      onStartChallenges();
      return;
    }

    console.error(
      "Wat1Intro: onStartChallenges chưa được truyền từ component cha."
    );
  };


  return (
    <div className="wat1-intro">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div
        className="wat1-intro__glow wat1-intro__glow--top"
        aria-hidden="true"
      />

      <div
        className="wat1-intro__glow wat1-intro__glow--bottom"
        aria-hidden="true"
      />

      <div
        className="wat1-intro__particles"
        aria-hidden="true"
      >
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>


      {/* =====================================================
          TOP NAVIGATION
      ===================================================== */}

      <header className="wat1-intro__topbar">

        <button
          type="button"
          className="wat1-intro__back"
          onClick={handleBackToGame}
          aria-label="Quay về bản đồ hành trình"
        >
          <span
            className="wat1-intro__back-icon"
            aria-hidden="true"
          >
            ←
          </span>

          <span>
            BẢN ĐỒ HÀNH TRÌNH
          </span>
        </button>


        <div className="wat1-intro__wat-label">
          WAT 1
        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="wat1-intro__main">

        {/* ===================================================
            TEMPLE SYMBOL
        =================================================== */}

        <div
          className="wat1-intro__temple"
          aria-hidden="true"
        >
          <div className="wat1-intro__temple-ring">

            <div className="wat1-intro__temple-icon">
              🏛️
            </div>

          </div>

          <div className="wat1-intro__temple-line" />
        </div>


        {/* ===================================================
            WAT NUMBER
        =================================================== */}

        <div className="wat1-intro__eyebrow">
          NGÔI ĐỀN THỨ NHẤT
        </div>


        {/* ===================================================
            TITLE
        =================================================== */}

        <h1 className="wat1-intro__title">
          WAT ÁK-SÂ
        </h1>

        <div className="wat1-intro__khmer">
          វត្តអក្សរ
        </div>

        <div className="wat1-intro__subtitle">
          ĐẢO BẢNG CHỮ CÁI
        </div>


        {/* ===================================================
            GOLD DIVIDER
        =================================================== */}

        <div
          className="wat1-intro__divider"
          aria-hidden="true"
        >
          <span />
          <i>✦</i>
          <span />
        </div>


        {/* ===================================================
            STORY
        =================================================== */}

        <section className="wat1-intro__story">

          <div className="wat1-intro__story-mark">
            ✦
          </div>

          <p>
            Hãy bước vào ngôi đền đầu tiên
            và khám phá những bí mật của
            bảng chữ cái Khmer.
          </p>

          <p>
            Tại WAT ÁK-SÂ, bạn sẽ phải
            vượt qua từng thử thách để
            ghi nhớ ký tự, nhận diện
            phiên âm và làm chủ âm Khmer.
          </p>

          <p className="wat1-intro__story-highlight">
            Vượt qua từng cánh cửa.
            Tìm chìa khóa.
            Mở cổng tiếp theo.
          </p>

        </section>


        {/* ===================================================
            KNOWLEDGE STATS
        =================================================== */}

        <section className="wat1-intro__stats">

          <div className="wat1-intro__stat">

            <div className="wat1-intro__stat-icon">
              ក
            </div>

            <div className="wat1-intro__stat-value">
              33
            </div>

            <div className="wat1-intro__stat-label">
              PHỤ ÂM
            </div>

          </div>


          <div className="wat1-intro__stat">

            <div className="wat1-intro__stat-icon">
              អ
            </div>

            <div className="wat1-intro__stat-value">
              24
            </div>

            <div className="wat1-intro__stat-label">
              NGUYÊN ÂM
            </div>

          </div>


          <div className="wat1-intro__stat">

            <div className="wat1-intro__stat-icon">
              57
            </div>

            <div className="wat1-intro__stat-value">
              57
            </div>

            <div className="wat1-intro__stat-label">
              KÝ TỰ
            </div>

          </div>

        </section>


        {/* ===================================================
            OBJECTIVE
        =================================================== */}

        <section className="wat1-intro__objective">

          <div className="wat1-intro__objective-title">
            MỤC TIÊU WAT ÁK-SÂ
          </div>

          <div className="wat1-intro__objective-list">

            <div className="wat1-intro__objective-item">
              <span>Ⅰ</span>

              <p>
                Nhận diện phụ âm Khmer
              </p>
            </div>


            <div className="wat1-intro__objective-item">
              <span>Ⅱ</span>

              <p>
                Ghi nhớ phiên âm
              </p>
            </div>


            <div className="wat1-intro__objective-item">
              <span>Ⅲ</span>

              <p>
                Phân biệt giọng O và Ô
              </p>
            </div>


            <div className="wat1-intro__objective-item">
              <span>Ⅳ</span>

              <p>
                Vượt qua cổng chìa khóa
              </p>
            </div>

          </div>

        </section>


        {/* ===================================================
            START BUTTON
        =================================================== */}

        <div className="wat1-intro__action">

          <button
            type="button"
            className="wat1-intro__start"
            onClick={handleStartChallenges}
          >

            <span
              className="wat1-intro__start-icon"
              aria-hidden="true"
            >
              ⚔
            </span>


            <span className="wat1-intro__start-text">

              <strong>
                BẮT ĐẦU THỬ THÁCH
              </strong>

              <small>
                Khám phá hành trình Ák-Sâ
              </small>

            </span>


            <span
              className="wat1-intro__start-arrow"
              aria-hidden="true"
            >
              →
            </span>

          </button>

        </div>


        {/* ===================================================
            FOOTER
        =================================================== */}

        <div className="wat1-intro__footer">

          <span>
            WAT ÁK-SÂ
          </span>

          <i>
            •
          </i>

          <span>
            ĐẢO BẢNG CHỮ CÁI
          </span>

          <i>
            •
          </i>

          <span>
            01
          </span>

        </div>

      </main>

    </div>
  );
}