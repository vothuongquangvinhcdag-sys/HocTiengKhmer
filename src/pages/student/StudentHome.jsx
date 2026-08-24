import { useEffect, useState } from "react";
import "./StudentHome.css";

/* =========================================================
   CẤU HÌNH LEVEL
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
========================================================= */

function getLevelFromExp(exp) {
  const safeExp = Math.max(0, Number(exp) || 0);

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
========================================================= */

function getLevelProgress(exp) {
  const safeExp = Math.max(0, Number(exp) || 0);

  const currentLevel = getLevelFromExp(safeExp);

  if (currentLevel >= MAX_LEVEL) {
    return {
      currentExp: safeExp,
      requiredExp: 0,
      remainingExp: 0,
      percent: 100,
      isMaxLevel: true,
    };
  }

  const previousExp = LEVEL_EXP[currentLevel];
  const nextLevel = currentLevel + 1;

  const requiredExp =
    LEVEL_EXP[nextLevel] - previousExp;

  const currentExp =
    Math.max(0, safeExp - previousExp);

  const remainingExp =
    Math.max(0, requiredExp - currentExp);

  const percent =
    requiredExp > 0
      ? Math.min(
          100,
          Math.round(
            (currentExp / requiredExp) * 100
          )
        )
      : 100;

  return {
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

function formatTime(seconds) {
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

  const secs = safeSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(
      2,
      "0"
    )}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(
      2,
      "0"
    )}`;
  }

  return `${String(minutes).padStart(
    2,
    "0"
  )}:${String(secs).padStart(
    2,
    "0"
  )}`;
}

/* =========================================================
   COMPONENT
========================================================= */

function StudentHome({
  profile,
  navigate,
  onLogout,

  /*
    App.jsx có thể truyền dữ liệu timer toàn hệ thống
    xuống đây.

    Nếu chưa truyền thì lấy từ profile.
  */
  totalExp: totalExpFromApp,
  totalStudySeconds: totalStudySecondsFromApp,
}) {
  /* =======================================================
     THÔNG TIN USER
  ======================================================= */

  const username =
    profile?.username ||
    profile?.account ||
    "Học sinh";

  const profileExp = Math.max(
    0,
    Number(profile?.exp ?? 0)
  );

  const profileStudySeconds = Math.max(
    0,
    Number(
      profile?.total_study_seconds ?? 0
    )
  );

  /*
    Ưu tiên dữ liệu do App quản lý.
    Nếu App chưa truyền thì dùng profile.
  */

  const totalExp =
    totalExpFromApp !== undefined
      ? Math.max(
          0,
          Number(totalExpFromApp) || 0
        )
      : profileExp;

  const totalStudySeconds =
    totalStudySecondsFromApp !== undefined
      ? Math.max(
          0,
          Number(
            totalStudySecondsFromApp
          ) || 0
        )
      : profileStudySeconds;

  const level =
    getLevelFromExp(totalExp);

  /* =======================================================
     LEVEL UP
  ======================================================= */

  const [showLevelUp, setShowLevelUp] =
    useState(false);

  const [levelUpNumber, setLevelUpNumber] =
    useState(level);

  /*
    Chỉ hiển thị Level Up nếu App truyền
    levelUpNumber mới.
  */

  useEffect(() => {
    if (
      level > levelUpNumber &&
      level <= MAX_LEVEL
    ) {
      setLevelUpNumber(level);
      setShowLevelUp(true);

      const timer = setTimeout(() => {
        setShowLevelUp(false);
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [level, levelUpNumber]);

  /* =======================================================
     MENU
  ======================================================= */

  const [activeMenu, setActiveMenu] =
    useState("home");

  const menuItems = [
    {
      id: "home",
      icon: "🏠",
      label: "Trang chủ",
    },
    {
      id: "alphabet",
      icon: "ក",
      label: "Bảng chữ cái",
    },
    {
      id: "vocabulary",
      icon: "📚",
      label: "Từ vựng",
    },
    {
      id: "games",
      icon: "🎮",
      label: "Trò chơi",
    },
    {
      id: "communication",
      icon: "💬",
      label: "Giao tiếp",
    },
    {
      id: "progress",
      icon: "📊",
      label: "Tiến độ học tập",
    },
  ];

  /* =======================================================
     ĐIỀU HƯỚNG
  ======================================================= */

  const handleMenu = (id) => {
    setActiveMenu(id);

    switch (id) {
      case "home":
        navigate("/student");
        break;

      case "alphabet":
        navigate("/alphabet");
        break;

      case "vocabulary":
        navigate("/vocabulary");
        break;

      case "games":
        navigate("/game");
        break;

      case "communication":
        navigate("/communication");
        break;

      case "progress":
        alert(
          "📊 Phần Tiến độ học tập đang được phát triển."
        );
        break;

      default:
        console.warn(
          "Menu không xác định:",
          id
        );
    }
  };

  /* =======================================================
     BẮT ĐẦU HỌC
  ======================================================= */

  const handleStartLearning = () => {
    setActiveMenu("home");

    const target =
      document.querySelector(
        ".learning-section-target"
      );

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  /* =======================================================
     EXP INFO
  ======================================================= */

  const expInfo =
    getLevelProgress(totalExp);

  const currentLevelExp =
    expInfo.currentExp;

  const requiredLevelExp =
    expInfo.requiredExp;

  const nextLevelExp =
    expInfo.remainingExp;

  const expPercent =
    expInfo.percent;

  const isMaxLevel =
    expInfo.isMaxLevel;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      {/* =================================================
          LEVEL UP
      ================================================= */}

      {showLevelUp && (
        <div className="level-up-overlay">
          <div className="level-up-confetti">
            🎉 ✨ ⭐ 🏆 ✨ 🎉
          </div>

          <div className="level-up-card">
            <div className="level-up-icon">
              🏆
            </div>

            <div className="level-up-small">
              CHÚC MỪNG BẠN
            </div>

            <h2>
              LEVEL UP!
            </h2>

            <div className="level-up-number">
              Level {levelUpNumber}
            </div>

            <p>
              Bạn đã đạt một cấp độ mới!
            </p>

            <div className="level-up-khmer">
              អបអរសាទរ! អ្នកបានឡើងកម្រិតថ្មី!
            </div>

            <button
              type="button"
              className="level-up-button"
              onClick={() =>
                setShowLevelUp(false)
              }
            >
              Tuyệt vời! 🎉
            </button>
          </div>
        </div>
      )}

      {/* =================================================
          APP
      ================================================= */}

      <div className="student-app">

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="student-sidebar">

          <div className="student-logo">

            <div className="student-logo-symbol">
              ក
            </div>

            <div>
              <div className="student-logo-title">
                HỌC TIẾNG KHMER
              </div>

              <div className="student-logo-khmer">
                រៀនភាសាខ្មែរ
              </div>
            </div>

          </div>

          {/* PROFILE */}

          <div className="student-profile">

            <div className="student-avatar">
              {username
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="student-profile-info">

              <strong>
                {username}
              </strong>

              <span>
                Level {level}
              </span>

            </div>

          </div>

          {/* MENU */}

          <nav className="student-menu">

            <div className="student-menu-title">
              HỌC TẬP
            </div>

            {menuItems.map(
              (item) => (
                <button
                  key={item.id}
                  type="button"
                  className={
                    activeMenu === item.id
                      ? "student-menu-item active"
                      : "student-menu-item"
                  }
                  onClick={() =>
                    handleMenu(
                      item.id
                    )
                  }
                >

                  <span className="student-menu-icon">
                    {item.icon}
                  </span>

                  <span>
                    {item.label}
                  </span>

                </button>
              )
            )}

          </nav>

          {/* BOTTOM */}

          <div className="student-sidebar-bottom">

            <button
              type="button"
              className="student-menu-item"
              onClick={() =>
                navigate(
                  "/student/profile"
                )
              }
            >

              <span className="student-menu-icon">
                👤
              </span>

              <span>
                Tài khoản
              </span>

            </button>

            <button
              type="button"
              className="student-menu-item logout"
              onClick={onLogout}
            >

              <span className="student-menu-icon">
                ➜]
              </span>

              <span>
                Đăng xuất
              </span>

            </button>

          </div>

        </aside>

        {/* =================================================
            MAIN
        ================================================= */}

        <main className="student-main">

          {/* HEADER */}

          <header className="student-header">

            <div>

              <h1>
                Xin chào, {username}! 👋
              </h1>

              <h2 className="student-header-khmer">
                សួស្តី, {username}! 👋
              </h2>

              <p>
                Chào mừng bạn quay trở lại
                với hành trình học tiếng Khmer.
              </p>

              <p className="student-header-khmer-sub">
                សូមស្វាគមន៍ការត្រឡប់មកវិញ
                ក្នុងដំណើររៀនភាសាខ្មែរ។
              </p>

            </div>

            <div className="student-header-user">

              <div className="student-header-avatar">
                {username
                  .charAt(0)
                  .toUpperCase()}
              </div>

            </div>

          </header>

          {/* WELCOME */}

          <section className="student-welcome">

            <div className="student-welcome-content">

              <div className="student-welcome-khmer">
                សួស្តី!
              </div>

              <h2>
                Hãy tiếp tục hành trình học
                tiếng Khmer
              </h2>

              <p>
                Mỗi ngày một chút, bạn sẽ
                ngày càng hiểu và sử dụng
                tiếng Khmer tốt hơn.
              </p>

              <button
                type="button"
                className="student-primary-button"
                onClick={
                  handleStartLearning
                }
              >
                Bắt đầu học →
              </button>

            </div>

            <div className="student-welcome-symbol">
              ក
            </div>

          </section>

          {/* STATISTICS */}

          <section className="student-stat-grid">

            {/* LEVEL */}

            <div className="student-stat-card">

              <div className="student-stat-icon">
                ⭐
              </div>

              <div>

                <span>
                  Cấp độ
                </span>

                <strong>
                  Level {level}
                  {isMaxLevel &&
                    " • MAX"}
                </strong>

              </div>

            </div>

            {/* EXP */}

            <div className="student-stat-card exp-stat-card">

              <div className="student-stat-icon exp-icon">
                ⚡
              </div>

              <div className="exp-stat-content">

                <div className="exp-stat-header">

                  <span>
                    Kinh nghiệm
                  </span>

                  <strong>
                    {isMaxLevel
                      ? "MAX"
                      : `${expPercent}%`}
                  </strong>

                </div>

                <div className="exp-progress-track">

                  <div
                    className="exp-progress-fill"
                    style={{
                      width:
                        `${expPercent}%`,
                    }}
                  >
                    <div className="exp-progress-shine" />
                  </div>

                </div>

                <div className="exp-stat-footer">

                  <span>
                    {isMaxLevel
                      ? `${totalExp} EXP`
                      : `${currentLevelExp} / ${requiredLevelExp} EXP`}
                  </span>

                  <span>
                    {isMaxLevel
                      ? "Cấp tối đa"
                      : `Còn ${nextLevelExp} EXP`}
                  </span>

                </div>

              </div>

            </div>

            {/* BÀI ĐÃ HỌC */}

            <div className="student-stat-card">

              <div className="student-stat-icon">
                📚
              </div>

              <div>

                <span>
                  Bài đã học
                </span>

                <strong>
                  0
                </strong>

              </div>

            </div>

            {/* CHUỖI NGÀY */}

            <div className="student-stat-card">

              <div className="student-stat-icon">
                🔥
              </div>

              <div>

                <span>
                  Chuỗi ngày học
                </span>

                <strong>
                  0 ngày
                </strong>

              </div>

            </div>

          </section>

          {/* =================================================
              THỜI GIAN HỌC

              QUAN TRỌNG:
              StudentHome KHÔNG chạy timer.

              Dữ liệu này chỉ được hiển thị.
              Timer phải nằm ở App.jsx.
          ================================================= */}

          <section className="online-learning-card">

            <div className="online-learning-icon">
              ⏱️
            </div>

            <div className="online-learning-content">

              <div className="online-learning-title">
                Tổng thời gian học
              </div>

              <div className="online-learning-time">
                {formatTime(
                  totalStudySeconds
                )}
              </div>

              <div className="online-learning-note">
                Cứ mỗi 1 phút học
                <strong>
                  +10 EXP
                </strong>
              </div>

            </div>

            <div className="online-learning-status">

              <span className="online-dot" />

              Đang học

            </div>

          </section>

          {/* NỘI DUNG HỌC */}

          <section
            className="student-section learning-section-target"
          >

            <div className="student-section-heading">

              <div>

                <h2>
                  Nội dung học tập
                </h2>

                <p>
                  Chọn một nội dung để bắt đầu.
                </p>

              </div>

            </div>

            <div className="student-learning-grid">

              {/* BẢNG CHỮ CÁI */}

              <button
                type="button"
                className="learning-card"
                onClick={() =>
                  handleMenu(
                    "alphabet"
                  )
                }
              >

                <div className="learning-card-icon">
                  ក
                </div>

                <div>

                  <h3>
                    Bảng chữ cái
                  </h3>

                  <p>
                    Làm quen với 33 phụ âm,
                    24 nguyên âm và cách phát âm
                    tiếng Khmer.
                  </p>

                </div>

                <span className="learning-arrow">
                  →
                </span>

              </button>

              {/* TỪ VỰNG */}

              <button
                type="button"
                className="learning-card"
                onClick={() =>
                  handleMenu(
                    "vocabulary"
                  )
                }
              >

                <div className="learning-card-icon">
                  📚
                </div>

                <div>

                  <h3>
                    Từ vựng
                  </h3>

                  <p>
                    Học các từ Khmer theo
                    chủ đề.
                  </p>

                </div>

                <span className="learning-arrow">
                  →
                </span>

              </button>

              {/* TRÒ CHƠI */}

              <button
                type="button"
                className="learning-card"
                onClick={() =>
                  handleMenu(
                    "games"
                  )
                }
              >

                <div className="learning-card-icon">
                  🎮
                </div>

                <div>

                  <h3>
                    Trò chơi
                  </h3>

                  <p>
                    Vừa chơi vừa củng cố
                    kiến thức.
                  </p>

                </div>

                <span className="learning-arrow">
                  →
                </span>

              </button>

              {/* GIAO TIẾP */}

              <button
                type="button"
                className="learning-card"
                onClick={() =>
                  handleMenu(
                    "communication"
                  )
                }
              >

                <div className="learning-card-icon">
                  💬
                </div>

                <div>

                  <h3>
                    Giao tiếp
                  </h3>

                  <p>
                    Học cách giao tiếp và sử dụng
                    tiếng Khmer trong các tình huống
                    thực tế.
                  </p>

                </div>

                <span className="learning-arrow">
                  →
                </span>

              </button>

            </div>

          </section>

          {/* MỤC TIÊU */}

          <section className="student-section">

            <div className="student-section-heading">

              <div>

                <h2>
                  🎯 Mục tiêu hôm nay
                </h2>

                <p>
                  Duy trì thói quen học mỗi ngày.
                </p>

              </div>

            </div>

            <div className="daily-goal-card">

              <div className="daily-goal-top">

                <div>

                  <strong>
                    Hoàn thành bài học hôm nay
                  </strong>

                  <p>
                    0 / 3 hoạt động
                  </p>

                </div>

                <div className="daily-goal-percent">
                  0%
                </div>

              </div>

              <div className="progress-track">

                <div
                  className="progress-fill"
                  style={{
                    width: "0%",
                  }}
                />

              </div>

              <div className="daily-goal-bottom">
                Hãy bắt đầu bài học đầu tiên!
              </div>

            </div>

          </section>

        </main>

      </div>

    </>
  );
}

export default StudentHome;