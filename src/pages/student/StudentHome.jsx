import { useEffect, useRef, useState } from "react";
import { supabase } from "../../supabase";

/* =========================================================
   CẤU HÌNH HỆ THỐNG EXP
========================================================= */

const MAX_LEVEL = 10;
const EXP_PER_MINUTE = 10;

const LEVEL_EXP = {
  1: 100,
  2: 200,
  3: 400,
  4: 800,
  5: 1600,
  6: 3200,
  7: 6400,
  8: 12800,
  9: 25600,
  10: Infinity,
};

/* =========================================================
   XÁC ĐỊNH LEVEL TỪ EXP
========================================================= */

function getLevelFromExp(exp) {
  const safeExp = Math.max(0, Number(exp) || 0);

  if (safeExp < LEVEL_EXP[1]) return 1;
  if (safeExp < LEVEL_EXP[2]) return 2;
  if (safeExp < LEVEL_EXP[3]) return 3;
  if (safeExp < LEVEL_EXP[4]) return 4;
  if (safeExp < LEVEL_EXP[5]) return 5;
  if (safeExp < LEVEL_EXP[6]) return 6;
  if (safeExp < LEVEL_EXP[7]) return 7;
  if (safeExp < LEVEL_EXP[8]) return 8;
  if (safeExp < LEVEL_EXP[9]) return 9;

  return 10;
}

/* =========================================================
   THÔNG TIN TIẾN ĐỘ LEVEL
========================================================= */

function getLevelProgress(exp, level) {
  const safeExp = Math.max(0, Number(exp) || 0);

  const currentLevel = Math.max(
    1,
    Math.min(MAX_LEVEL, Number(level) || 1)
  );

  if (currentLevel >= MAX_LEVEL) {
    return {
      currentExp: safeExp,
      requiredExp: safeExp,
      previousExp: LEVEL_EXP[9],
      remainingExp: 0,
      percent: 100,
      isMaxLevel: true,
    };
  }

  const previousExp =
    currentLevel === 1
      ? 0
      : LEVEL_EXP[currentLevel - 1];

  const requiredExp =
    LEVEL_EXP[currentLevel];

  const currentExp =
    Math.max(0, safeExp - previousExp);

  const levelRange =
    requiredExp - previousExp;

  const percent =
    levelRange > 0
      ? Math.min(
          100,
          Math.round(
            (currentExp / levelRange) * 100
          )
        )
      : 100;

  const remainingExp =
    Math.max(
      0,
      requiredExp - safeExp
    );

  return {
    currentExp,
    requiredExp,
    previousExp,
    remainingExp,
    percent,
    isMaxLevel: false,
  };
}

/* =========================================================
   COMPONENT
========================================================= */

function StudentHome({
  profile,
  onLogout,
  onNavigate,
}) {
  /* =======================================================
     1. THÔNG TIN NGƯỜI DÙNG
  ======================================================= */

  const username =
    profile?.username ||
    profile?.account ||
    "Học sinh";

  const profileId =
    profile?.id || null;

  const initialExp =
    Math.max(
      0,
      Number(profile?.exp ?? 0)
    );

  const initialLevel =
    getLevelFromExp(initialExp);

  const initialStudySeconds =
    Math.max(
      0,
      Number(
        profile?.total_study_seconds ?? 0
      )
    );

  /* =======================================================
     2. STATE
  ======================================================= */

  const [activeMenu, setActiveMenu] =
    useState("home");

  const [totalExp, setTotalExp] =
    useState(initialExp);

  const [level, setLevel] =
    useState(initialLevel);

  const [totalStudySeconds, setTotalStudySeconds] =
    useState(initialStudySeconds);

  const [showLevelUp, setShowLevelUp] =
    useState(false);

  const [levelUpNumber, setLevelUpNumber] =
    useState(initialLevel);

  /* =======================================================
     3. REFS
  ======================================================= */

  const totalExpRef =
    useRef(initialExp);

  const levelRef =
    useRef(initialLevel);

  const studySecondsRef =
    useRef(initialStudySeconds);

  const savingRef = useRef(false);

// Số giây đã được xác nhận và lưu vào hệ thống.
// Luôn là bội số của 60.
const savedStudySecondsRef =
  useRef(initialStudySeconds);

// Số giây đang học nhưng chưa đủ 1 phút.
const pendingSecondsRef =
  useRef(0);
const sessionSecondsRef = useRef(0);
const sessionStartRef = useRef(
  Number(
    localStorage.getItem("study_session_start")
  ) || Date.now()
);

const lastTickRef = useRef(Date.now());

const dirtyRef = useRef(false);

  const profileIdRef =
    useRef(profileId);

  const timerRef =
    useRef(null);

  const autoSaveTimerRef =
    useRef(null);

  const levelUpTimeoutRef =
    useRef(null);

  const learningSectionRef =
    useRef(null);

  /* =======================================================
     4. MENU
  ======================================================= */

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
      id: "listening",
      icon: "🎧",
      label: "Luyện nghe",
    },
    {
      id: "speaking",
      icon: "🎤",
      label: "Luyện nói",
    },
    {
      id: "reading",
      icon: "📖",
      label: "Luyện đọc",
    },
    {
      id: "writing",
      icon: "✍️",
      label: "Luyện viết",
    },
    {
      id: "progress",
      icon: "📊",
      label: "Tiến độ học tập",
    },
  ];

  /* =======================================================
     5. ĐIỀU HƯỚNG
  ======================================================= */

 const handleMenu = (id) => {
  setActiveMenu(id);

  switch (id) {
    case "home":
      onNavigate("/student");
      break;

    case "alphabet":
      onNavigate("/alphabet");
      break;

    case "vocabulary":
      console.log("Từ vựng - đang phát triển");
      break;

    case "games":
      console.log("Trò chơi - đang phát triển");
      break;

    case "listening":
      console.log("Luyện nghe - đang phát triển");
      break;

    case "speaking":
      console.log("Luyện nói - đang phát triển");
      break;

    case "reading":
      console.log("Luyện đọc - đang phát triển");
      break;

    case "writing":
      console.log("Luyện viết - đang phát triển");
      break;

    case "progress":
      console.log("Tiến độ - đang phát triển");
      break;

    default:
      console.warn("Menu không xác định:", id);
  }
};

  /* =======================================================
     6. BẮT ĐẦU HỌC
  ======================================================= */

  const handleStartLearning = () => {
    setActiveMenu("home");

    if (learningSectionRef.current) {
      learningSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  /* =======================================================
     7. FORMAT TIME
  ======================================================= */

  const formatTime = (seconds) => {
    const safeSeconds =
      Math.max(
        0,
        Number(seconds) || 0
      );

    const hours =
      Math.floor(
        safeSeconds / 3600
      );

    const minutes =
      Math.floor(
        (safeSeconds % 3600) / 60
      );

    const secs =
      safeSeconds % 60;

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
  };

  /* =======================================================
     8. LẤY PROFILE MỚI NHẤT
  ======================================================= */

  useEffect(() => {
    if (!profileId) {
      return;
    }

    let cancelled = false;

    const loadProfile = async () => {
      const {
        data,
        error,
      } = await supabase
        .from("profiles")
        .select(
          "id, username, account, exp, level, total_study_seconds"
        )
        .eq("id", profileId)
        .single();

      if (error) {
        console.error(
          "Không thể tải profile:",
          error
        );
        return;
      }

      if (
        cancelled ||
        !data
      ) {
        return;
      }

      const latestExp =
        Math.max(
          0,
          Number(data.exp ?? 0)
        );

      const latestLevel =
        getLevelFromExp(
          latestExp
        );

   const supabaseStudySeconds =
  Math.max(
    0,
    Number(
      data.total_study_seconds ?? 0
    )
  );

// ==========================================
// KHÔI PHỤC PHIÊN HỌC TỪ LOCALSTORAGE
// ==========================================

const localStudySeconds =
  Math.max(
    0,
    Number(
      localStorage.getItem(
        "study_session_seconds"
      )
    ) || 0
  );

// Lấy số lớn hơn để không bị reset
const latestStudySeconds =
  Math.max(
    supabaseStudySeconds,
    localStudySeconds
  );

      totalExpRef.current =
        latestExp;

      levelRef.current =
        latestLevel;

      studySecondsRef.current =
        latestStudySeconds;

      profileIdRef.current =
        data.id;

      savedStudySecondsRef.current =
  latestStudySeconds;
pendingSecondsRef.current =
  Math.max(
    0,
    localStudySeconds -
      supabaseStudySeconds
  );

      dirtyRef.current =
        false;

      setTotalExp(
        latestExp
      );

      setLevel(
        latestLevel
      );

      setTotalStudySeconds(
        latestStudySeconds
      );

      setLevelUpNumber(
        latestLevel
      );

      console.log(
        "Đã tải dữ liệu Supabase:",
        {
          ...data,
          calculatedLevel:
            latestLevel,
        }
      );
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [profileId]);

  /* =======================================================
     9. LEVEL UP
  ======================================================= */

  const triggerLevelUp = (
    newLevel
  ) => {
    if (
      newLevel > MAX_LEVEL
    ) {
      return;
    }

    setLevelUpNumber(
      newLevel
    );

    setShowLevelUp(
      true
    );

    if (
      levelUpTimeoutRef.current
    ) {
      clearTimeout(
        levelUpTimeoutRef.current
      );
    }

    levelUpTimeoutRef.current =
      setTimeout(() => {
        setShowLevelUp(
          false
        );
      }, 5000);
  };

  /* =======================================================
10. CỘNG EXP
======================================================= */

const addExp = (amount) => {
  const safeAmount =
    Math.max(0, Number(amount) || 0);

  if (safeAmount <= 0) {
    return;
  }

  const oldExp =
    Number(totalExpRef.current) || 0;

  const newExp =
    oldExp + safeAmount;

  const oldLevel =
    getLevelFromExp(oldExp);

  const newLevel =
    getLevelFromExp(newExp);

  totalExpRef.current =
    newExp;

  levelRef.current =
    newLevel;

  dirtyRef.current =
    true;

  setTotalExp(newExp);
  setLevel(newLevel);

  console.log(
    `⭐ +${safeAmount} EXP | ${oldExp} → ${newExp}`
  );

  if (newLevel > oldLevel) {
    triggerLevelUp(newLevel);
  }
};


/* =======================================================
11. LƯU SUPABASE
======================================================= */

const saveProgress = async () => {
  const currentProfileId =
    profileIdRef.current;

  if (!currentProfileId) {
    return false;
  }

  if (savingRef.current) {
    return false;
  }

  if (!dirtyRef.current) {
    return true;
  }

  savingRef.current = true;

  const expToSave =
    Math.max(
      0,
      Number(totalExpRef.current) || 0
    );

  const levelToSave =
    getLevelFromExp(expToSave);

  // CHỈ lưu thời gian đã đủ phút.
  const studySecondsToSave =
    Math.max(
      0,
      Number(savedStudySecondsRef.current) || 0
    );

  try {
    const {
      data,
      error,
    } = await supabase
      .from("profiles")
      .update({
        exp: expToSave,
        level: levelToSave,
        total_study_seconds:
          studySecondsToSave,
        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        currentProfileId
      )
      .select(
        "id, username, exp, level, total_study_seconds"
      )
      .single();

    if (error) {
      console.error(
        "❌ Lỗi lưu tiến độ:",
        error
      );

      return false;
    }

    /*
     * Chỉ đánh dấu đã lưu nếu dữ liệu
     * hiện tại vẫn đúng với dữ liệu vừa lưu.
     */
    if (
      totalExpRef.current ===
        expToSave &&
      savedStudySecondsRef.current ===
        studySecondsToSave
    ) {
      dirtyRef.current = false;
    }

    console.log(
      "💾 ĐÃ LƯU:",
      {
        exp: expToSave,
        level: levelToSave,
        total_study_seconds:
          studySecondsToSave,
        pendingSeconds:
          pendingSecondsRef.current,
      }
    );

    return true;

  } catch (error) {
    console.error(
      "❌ saveProgress:",
      error
    );

    return false;

  } finally {
    savingRef.current = false;
  }
};

/* =======================================================
12. TIMER HỌC
- Chuyển trang vẫn tính thời gian
- Quay lại trang chủ sẽ cộng thời gian đã trôi qua
======================================================= */

useEffect(() => {
  if (!profileId) {
    return;
  }

  console.log("▶️ Bắt đầu theo dõi thời gian học");

  // ==========================================
  // KHÔI PHỤC THỜI GIAN PHIÊN
  // ==========================================

  const savedSessionSeconds =
    Number(
      localStorage.getItem(
        "study_session_seconds"
      )
    ) || 0;

  sessionSecondsRef.current =
    savedSessionSeconds;

  // ==========================================
  // KHÔI PHỤC THỜI ĐIỂM BẮT ĐẦU PHIÊN
  // ==========================================

  let sessionStart =
    Number(
      localStorage.getItem(
        "study_session_start"
      )
    );

  if (!sessionStart) {
    sessionStart = Date.now();

    localStorage.setItem(
      "study_session_start",
      String(sessionStart)
    );
  }

  sessionStartRef.current =
    sessionStart;

  // ==========================================
  // THỜI ĐIỂM TICK CUỐI
  // ==========================================

  lastTickRef.current =
    Date.now();

  // ==========================================
  // TÍNH THỜI GIAN ĐÃ TRÔI QUA
  // ==========================================

  const calculateElapsedTime = () => {
    const now = Date.now();

    const elapsedSeconds =
      Math.max(
        0,
        Math.floor(
          (now -
            lastTickRef.current) /
            1000
        )
      );

    if (elapsedSeconds <= 0) {
      return;
    }

    lastTickRef.current = now;

    // ========================================
    // CỘNG THỜI GIAN
    // ========================================

    pendingSecondsRef.current +=
      elapsedSeconds;

    sessionSecondsRef.current =
      savedStudySecondsRef.current +
      pendingSecondsRef.current;

    studySecondsRef.current =
      sessionSecondsRef.current;

    // ========================================
    // LƯU LOCALSTORAGE
    // ========================================

    localStorage.setItem(
      "study_session_seconds",
      String(
        sessionSecondsRef.current
      )
    );

    localStorage.setItem(
      "study_session_start",
      String(
        sessionStartRef.current
      )
    );

    // ========================================
    // HIỂN THỊ
    // ========================================

    setTotalStudySeconds(
      sessionSecondsRef.current
    );

    // ========================================
    // ĐỦ 1 PHÚT
    // ========================================

    if (
      pendingSecondsRef.current >= 60
    ) {

      const earnedMinutes =
        Math.floor(
          pendingSecondsRef.current /
            60
        );

      const earnedSeconds =
        earnedMinutes * 60;

      // ======================================
      // XÁC NHẬN THỜI GIAN
      // ======================================

      savedStudySecondsRef.current +=
        earnedSeconds;

      // ======================================
      // GIỮ LẠI GIÂY LẺ
      // ======================================

      pendingSecondsRef.current -=
        earnedSeconds;

      // ======================================
      // CỘNG EXP
      // ======================================

      const earnedExp =
        earnedMinutes *
        EXP_PER_MINUTE;

      console.log(
        "⏱️ ĐỦ PHÚT:",
        {
          minutes:
            earnedMinutes,

          earnedExp,

          totalSeconds:
            sessionSecondsRef.current,
        }
      );

      addExp(
        earnedExp
      );

      // ======================================
      // CẬP NHẬT HIỂN THỊ
      // ======================================

      sessionSecondsRef.current =
        savedStudySecondsRef.current +
        pendingSecondsRef.current;

      studySecondsRef.current =
        sessionSecondsRef.current;

      setTotalStudySeconds(
        sessionSecondsRef.current
      );

      // ======================================
      // LƯU SUPABASE
      // ======================================

      saveProgress();
    }
  };

  // ==========================================
  // CHẠY MỖI GIÂY
  // ==========================================

  timerRef.current =
    setInterval(
      calculateElapsedTime,
      1000
    );

  // ==========================================
  // CLEANUP
  // ==========================================

  return () => {

    if (
      timerRef.current
    ) {
      clearInterval(
        timerRef.current
      );

      timerRef.current =
        null;
    }

    // Lưu phiên hiện tại
    localStorage.setItem(
      "study_session_seconds",
      String(
        sessionSecondsRef.current
      )
    );

    localStorage.setItem(
      "study_session_start",
      String(
        sessionStartRef.current
      )
    );

    console.log(
      "⏹️ Rời StudentHome - GIỮ phiên:",
      sessionSecondsRef.current
    );
  };

}, [profileId]);
/* =======================================================
14. LƯU KHI RỜI TAB / F5
======================================================= */

useEffect(() => {

  if (!profileId) {
    return;
  }

  const saveCurrentSession = () => {

    const currentSeconds =
      Math.max(
        0,
        Number(
          sessionSecondsRef.current
        ) || 0
      );

    // Lưu phiên hiện tại
    localStorage.setItem(
      "study_session_seconds",
      String(currentSeconds)
    );

    localStorage.setItem(
      "study_session_start",
      String(
        sessionStartRef.current
      )
    );

    // Lưu phần đã đủ phút vào Supabase
    saveProgress();
  };

  const handleVisibility = () => {

    if (
      document.visibilityState ===
      "hidden"
    ) {
      saveCurrentSession();
    }
  };

  const handlePageHide = () => {
    saveCurrentSession();
  };

  document.addEventListener(
    "visibilitychange",
    handleVisibility
  );

  window.addEventListener(
    "pagehide",
    handlePageHide
  );

  return () => {

    document.removeEventListener(
      "visibilitychange",
      handleVisibility
    );

    window.removeEventListener(
      "pagehide",
      handlePageHide
    );
  };

}, [profileId]);


/* =======================================================
15. CLEANUP
======================================================= */

useEffect(() => {

  return () => {

    if (
      levelUpTimeoutRef.current
    ) {
      clearTimeout(
        levelUpTimeoutRef.current
      );
    }

    if (
      timerRef.current
    ) {
      clearInterval(
        timerRef.current
      );

      timerRef.current =
        null;
    }

  };

}, []);
  /* =======================================================
     16. EXP HIỆN TẠI
  ======================================================= */

  const expInfo =
    getLevelProgress(
      totalExp,
      level
    );

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
     17. RENDER
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

        {/* SIDEBAR */}

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
                    activeMenu ===
                    item.id
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
                onNavigate(
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
                🚪
              </span>

              <span>
                Đăng xuất
              </span>
            </button>

          </div>

        </aside>

        {/* MAIN */}

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

          {/* THỜI GIAN HỌC */}

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
            ref={learningSectionRef}
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
  onClick={() => handleMenu("alphabet")}
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
  onClick={() => handleMenu("vocabulary")}
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

              {/* TRÒ CHƠI */}

              <button
                type="button"
                className="learning-card"
                onClick={() =>
                  handleMenu("games")
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

              {/* LUYỆN NGHE */}

              <button
                type="button"
                className="learning-card"
                onClick={() =>
                  handleMenu("listening")
                }
              >

                <div className="learning-card-icon">
                  🎧
                </div>

                <div>

                  <h3>
                    Luyện nghe
                  </h3>

                  <p>
                    Nghe âm thanh và nhận
                    biết tiếng Khmer.
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

      {/* =================================================
          CSS PHẦN 2 ĐẶT Ở ĐÂY
      ================================================= */}

      <style>{`

        /* =========================================================
   STUDENT HOME - TONE VÀNG CHỦ ĐẠO
   ========================================================= */

* {
  box-sizing: border-box;
}

.student-app {
  min-height: 100vh;
  display: flex;
  background: #fffbeb;
  color: #1f2937;
  font-family: Inter, "Segoe UI", Arial, sans-serif;
}

/* =========================================================
   SIDEBAR
   ========================================================= */

.student-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 250px;

  display: flex;
  flex-direction: column;

  padding: 22px 16px;

  background: linear-gradient(
    180deg,
    #ffffff 0%,
    #fffdf5 100%
  );

  border-right: 1px solid #fde68a;

  z-index: 100;
}

.student-logo {
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 4px 8px 22px;

  border-bottom: 1px solid #fef3c7;
}

.student-logo-symbol {
  width: 46px;
  height: 46px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 14px;

  background: linear-gradient(
    135deg,
    #d97706,
    #f59e0b,
    #fbbf24
  );

  color: white;

  font-size: 25px;
  font-weight: 700;

  box-shadow:
    0 8px 18px rgba(245, 158, 11, 0.28);
}

.student-logo-title {
  font-size: 14px;
  font-weight: 800;

  color: #b45309;

  letter-spacing: 0.3px;
}

.student-logo-khmer {
  margin-top: 3px;

  font-size: 13px;
  color: #92400e;
}

/* =========================================================
   PROFILE
   ========================================================= */

.student-profile {
  display: flex;
  align-items: center;
  gap: 12px;

  margin: 20px 4px;

  padding: 12px;

  border-radius: 15px;

  background: #fffbeb;
  border: 1px solid #fde68a;
}

.student-avatar {
  width: 44px;
  height: 44px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: linear-gradient(
    135deg,
    #d97706,
    #f59e0b,
    #fbbf24
  );

  color: white;

  font-size: 18px;
  font-weight: 800;
}

.student-profile-info {
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 4px;
}

.student-profile-info strong {
  overflow: hidden;

  font-size: 14px;

  color: #1e293b;

  white-space: nowrap;
  text-overflow: ellipsis;
}

.student-profile-info span {
  font-size: 12px;
  font-weight: 700;

  color: #d97706;
}

/* =========================================================
   MENU
   ========================================================= */

.student-menu {
  flex: 1;

  overflow-y: auto;

  padding-right: 3px;
}

.student-menu-title {
  margin: 6px 10px 9px;

  font-size: 11px;
  font-weight: 800;

  color: #a16207;

  letter-spacing: 1px;
}

.student-menu-item {
  width: 100%;

  display: flex;
  align-items: center;

  gap: 12px;

  margin-bottom: 5px;
  padding: 11px 12px;

  border: 0;
  border-radius: 12px;

  background: transparent;

  color: #57534e;

  font-size: 14px;
  font-weight: 600;

  text-align: left;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.student-menu-item:hover {
  background: #fffbeb;
  color: #b45309;

  transform: translateX(2px);
}

.student-menu-item.active {
  background: linear-gradient(
    90deg,
    #fef3c7,
    #fffbeb
  );

  color: #b45309;

  font-weight: 800;

  box-shadow:
    inset 3px 0 0 #f59e0b;
}

.student-menu-icon {
  width: 24px;

  display: inline-flex;
  justify-content: center;

  font-size: 18px;
}

.student-sidebar-bottom {
  padding-top: 12px;

  border-top: 1px solid #fef3c7;
}

.student-menu-item.logout {
  color: #dc2626;
}

.student-menu-item.logout:hover {
  background: #fef2f2;
  color: #b91c1c;
}

/* =========================================================
   MAIN
   ========================================================= */

.student-main {
  width: calc(100% - 250px);

  min-height: 100vh;

  margin-left: 250px;

  padding: 30px 38px 60px;

  overflow-x: hidden;
}

/* =========================================================
   HEADER
   ========================================================= */

.student-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  margin-bottom: 24px;
}

.student-header h1 {
  margin: 0;

  font-size: 29px;
  line-height: 1.25;

  color: #451a03;
}

.student-header-khmer {
  margin: 5px 0 0;

  font-size: 18px;
  font-weight: 700;

  color: #d97706;
}

.student-header p {
  margin: 8px 0 0;

  font-size: 14px;

  color: #78716c;
}

.student-header-khmer-sub {
  margin-top: 4px !important;

  font-size: 13px !important;

  color: #a8a29e !important;
}

.student-header-user {
  display: flex;
  align-items: center;
  justify-content: center;
}

.student-header-avatar {
  width: 54px;
  height: 54px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: linear-gradient(
    135deg,
    #d97706,
    #f59e0b,
    #fbbf24
  );

  color: white;

  font-size: 21px;
  font-weight: 800;

  box-shadow:
    0 8px 20px rgba(245, 158, 11, 0.28);
}

/* =========================================================
   WELCOME
   ========================================================= */

.student-welcome {
  position: relative;

  min-height: 210px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  overflow: hidden;

  margin-bottom: 24px;
  padding: 32px 40px;

  border-radius: 24px;

  background: linear-gradient(
    135deg,
    #b45309 0%,
    #d97706 35%,
    #f59e0b 70%,
    #fbbf24 100%
  );

  color: white;

  box-shadow:
    0 15px 35px rgba(217, 119, 6, 0.22);
}

.student-welcome::before {
  content: "";

  position: absolute;

  width: 260px;
  height: 260px;

  right: 90px;
  top: -130px;

  border-radius: 50%;

  background: rgba(
    255,
    255,
    255,
    0.11
  );
}

.student-welcome::after {
  content: "";

  position: absolute;

  width: 180px;
  height: 180px;

  right: -50px;
  bottom: -90px;

  border-radius: 50%;

  background: rgba(
    255,
    255,
    255,
    0.11
  );
}

.student-welcome-content {
  position: relative;
  z-index: 2;

  max-width: 650px;
}

.student-welcome-khmer {
  margin-bottom: 5px;

  font-size: 17px;
  font-weight: 700;

  opacity: 0.92;
}

.student-welcome h2 {
  margin: 0;

  font-size: 28px;
  line-height: 1.25;
}

.student-welcome p {
  max-width: 580px;

  margin: 12px 0 20px;

  font-size: 14px;
  line-height: 1.7;

  color: rgba(
    255,
    255,
    255,
    0.9
  );
}

.student-primary-button {
  border: 0;
  border-radius: 11px;

  padding: 11px 18px;

  background: white;

  color: #b45309;

  font-size: 14px;
  font-weight: 800;

  cursor: pointer;

  box-shadow:
    0 7px 18px rgba(
      0,
      0,
      0,
      0.12
    );

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.student-primary-button:hover {
  transform: translateY(-2px);

  box-shadow:
    0 10px 22px rgba(
      0,
      0,
      0,
      0.17
    );
}

.student-welcome-symbol {
  position: relative;
  z-index: 2;

  margin-right: 40px;

  font-size: 130px;
  font-weight: 800;

  line-height: 1;

  color: rgba(
    255,
    255,
    255,
    0.17
  );

  user-select: none;
}

/* =========================================================
   STATISTICS
   ========================================================= */

.student-stat-grid {
  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: 16px;

  margin-bottom: 20px;
}

.student-stat-card {
  min-height: 92px;

  display: flex;
  align-items: center;

  gap: 13px;

  padding: 17px;

  border: 1px solid #fde68a;
  border-radius: 17px;

  background: white;

  box-shadow:
    0 5px 16px rgba(
      120,
      53,
      15,
      0.05
    );
}

.student-stat-icon {
  width: 45px;
  height: 45px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 13px;

  background: #fffbeb;

  color: #d97706;

  font-size: 21px;
}

.student-stat-card > div:last-child {
  min-width: 0;
}

.student-stat-card span {
  display: block;

  margin-bottom: 4px;

  font-size: 12px;
  color: #78716c;
}

.student-stat-card strong {
  display: block;

  font-size: 17px;
  color: #451a03;
}

/* =========================================================
   EXP
   ========================================================= */

.exp-stat-card {
  align-items: flex-start;
}

.exp-icon {
  background: #fef3c7;
  color: #d97706;
}

.exp-stat-content {
  width: 100%;
}

.exp-stat-header,
.exp-stat-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 8px;
}

.exp-stat-header strong {
  font-size: 13px;

  color: #d97706;
}

.exp-progress-track {
  width: 100%;
  height: 8px;

  margin: 8px 0;

  overflow: hidden;

  border-radius: 999px;

  background: #fef3c7;
}

.exp-progress-fill {
  position: relative;

  height: 100%;

  border-radius: inherit;

  background: linear-gradient(
    90deg,
    #d97706,
    #f59e0b,
    #fbbf24
  );

  transition:
    width 0.5s ease;
}

.exp-progress-shine {
  position: absolute;

  top: 0;
  left: 0;

  width: 35%;
  height: 100%;

  background: linear-gradient(
    90deg,
    transparent,
    rgba(
      255,
      255,
      255,
      0.55
    ),
    transparent
  );

  animation:
    expShine 2.5s infinite;
}

@keyframes expShine {
  0% {
    transform: translateX(-120%);
  }

  100% {
    transform: translateX(350%);
  }
}

.exp-stat-footer span {
  margin: 0;

  font-size: 10px;
  color: #a8a29e;
}

/* =========================================================
   THỜI GIAN HỌC
   ========================================================= */

.online-learning-card {
  display: flex;
  align-items: center;

  gap: 17px;

  margin-bottom: 25px;
  padding: 19px 22px;

  border: 1px solid #fde68a;
  border-radius: 18px;

  background: linear-gradient(
    90deg,
    #fffbeb,
    #ffffff
  );

  box-shadow:
    0 5px 18px rgba(
      245,
      158,
      11,
      0.08
    );
}

.online-learning-icon {
  width: 52px;
  height: 52px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 15px;

  background: #fef3c7;

  font-size: 25px;
}

.online-learning-content {
  flex: 1;
}

.online-learning-title {
  font-size: 12px;
  font-weight: 700;

  color: #78716c;
}

.online-learning-time {
  margin-top: 3px;

  font-size: 25px;
  font-weight: 800;

  color: #92400e;

  font-variant-numeric: tabular-nums;
}

.online-learning-note {
  margin-top: 3px;

  font-size: 11px;

  color: #a8a29e;
}

.online-learning-note strong {
  margin-left: 5px;

  color: #d97706;
}

.online-learning-status {
  display: flex;
  align-items: center;

  gap: 7px;

  padding: 7px 11px;

  border-radius: 999px;

  background: #fffbeb;

  color: #b45309;

  border: 1px solid #fde68a;

  font-size: 12px;
  font-weight: 700;
}

.online-dot {
  width: 10px;
  height: 10px;

  border-radius: 50%;

  background: #0dcc1a;

  box-shadow:
    0 0 0 4px
    rgba(
      245,
      158,
      11,
      0.13
    );
}

/* =========================================================
   SECTION
   ========================================================= */

.student-section {
  margin-top: 25px;
}

.learning-section-target {
  scroll-margin-top: 25px;
}

.student-section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 14px;
}

.student-section-heading h2 {
  margin: 0;

  font-size: 20px;

  color: #451a03;
}

.student-section-heading p {
  margin: 5px 0 0;

  font-size: 13px;

  color: #78716c;
}

/* =========================================================
   LEARNING CARDS
   ========================================================= */

.student-learning-grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 15px;
}

.learning-card {
  position: relative;

  display: grid;

  grid-template-columns:
    52px 1fr auto;

  align-items: center;

  gap: 14px;

  width: 100%;

  min-height: 118px;

  padding: 18px;

  border: 1px solid #fde68a;
  border-radius: 18px;

  background: white;

  text-align: left;

  cursor: pointer;

  box-shadow:
    0 5px 16px rgba(
      120,
      53,
      15,
      0.05
    );

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.learning-card:hover {
  transform: translateY(-3px);

  border-color: #fbbf24;

  box-shadow:
    0 12px 25px rgba(
      217,
      119,
      6,
      0.13
    );
}

.learning-card-icon {
  width: 52px;
  height: 52px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 15px;

  background: #fffbeb;

  color: #d97706;

  font-size: 25px;
  font-weight: 800;
}

.learning-card h3 {
  margin: 0 0 5px;

  font-size: 16px;

  color: #451a03;
}

.learning-card p {
  margin: 0;

  font-size: 12px;
  line-height: 1.5;

  color: #78716c;
}

.learning-arrow {
  font-size: 23px;

  color: #d6d3d1;

  transition:
    transform 0.2s ease,
    color 0.2s ease;
}

.learning-card:hover .learning-arrow {
  color: #d97706;

  transform: translateX(4px);
}

/* =========================================================
   DAILY GOAL
   ========================================================= */

.daily-goal-card {
  padding: 21px;

  border: 1px solid #fde68a;
  border-radius: 18px;

  background: white;

  box-shadow:
    0 5px 16px rgba(
      120,
      53,
      15,
      0.05
    );
}

.daily-goal-top {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;
}

.daily-goal-top strong {
  font-size: 14px;

  color: #451a03;
}

.daily-goal-top p {
  margin: 5px 0 0;

  font-size: 12px;

  color: #78716c;
}

.daily-goal-percent {
  font-size: 22px;
  font-weight: 800;

  color: #d97706;
}

.progress-track {
  width: 100%;
  height: 10px;

  margin-top: 15px;

  overflow: hidden;

  border-radius: 999px;

  background: #fef3c7;
}

.progress-fill {
  height: 100%;

  border-radius: inherit;

  background: linear-gradient(
    90deg,
    #d97706,
    #f59e0b,
    #fbbf24
  );

  transition:
    width 0.4s ease;
}

.daily-goal-bottom {
  margin-top: 10px;

  font-size: 12px;

  color: #a8a29e;
}

/* =========================================================
   LEVEL UP
   ========================================================= */

.level-up-overlay {
  position: fixed;

  inset: 0;

  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background:
    rgba(
      69,
      26,
      3,
      0.68
    );

  backdrop-filter:
    blur(7px);

  animation:
    overlayIn 0.25s ease;
}

@keyframes overlayIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.level-up-confetti {
  position: absolute;

  top: 16%;

  width: 100%;

  text-align: center;

  font-size: 30px;

  letter-spacing: 14px;

  animation:
    confettiFloat 1.5s
    ease-in-out
    infinite;
}

@keyframes confettiFloat {
  0%,
  100% {
    transform:
      translateY(0);
  }

  50% {
    transform:
      translateY(-10px);
  }
}

.level-up-card {
  position: relative;

  width: min(
    430px,
    100%
  );

  padding: 38px 30px 30px;

  border: 1px solid
    rgba(
      255,
      255,
      255,
      0.5
    );

  border-radius: 28px;

  background:
    linear-gradient(
      180deg,
      #ffffff,
      #fffbeb
    );

  text-align: center;

  box-shadow:
    0 30px 80px rgba(
      0,
      0,
      0,
      0.25
    );

  animation:
    levelUpCardIn
    0.45s
    cubic-bezier(
      0.175,
      0.885,
      0.32,
      1.275
    );
}

@keyframes levelUpCardIn {
  from {
    opacity: 0;

    transform:
      scale(0.7)
      translateY(30px);
  }

  to {
    opacity: 1;

    transform:
      scale(1)
      translateY(0);
  }
}

.level-up-icon {
  width: 82px;
  height: 82px;

  margin: 0 auto 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background:
    linear-gradient(
      135deg,
      #fef3c7,
      #fbbf24
    );

  font-size: 43px;

  box-shadow:
    0 10px 25px
    rgba(
      245,
      158,
      11,
      0.3
    );

  animation:
    trophyPulse
    1.2s
    infinite;
}

@keyframes trophyPulse {
  0%,
  100% {
    transform:
      scale(1);
  }

  50% {
    transform:
      scale(1.08);
  }
}

.level-up-small {
  font-size: 11px;
  font-weight: 800;

  letter-spacing: 2px;

  color: #78716c;
}

.level-up-card h2 {
  margin: 5px 0;

  font-size: 32px;

  color: #d97706;
}

.level-up-number {
  margin: 8px 0;

  font-size: 25px;
  font-weight: 900;

  color: #f59e0b;
}

.level-up-card p {
  margin: 10px 0;

  font-size: 14px;

  color: #57534e;
}

.level-up-khmer {
  margin-top: 8px;

  font-size: 14px;
  font-weight: 700;

  color: #d97706;
}

.level-up-button {
  margin-top: 22px;

  padding: 12px 23px;

  border: 0;
  border-radius: 12px;

  background:
    linear-gradient(
      135deg,
      #d97706,
      #f59e0b,
      #fbbf24
    );

  color: white;

  font-size: 14px;
  font-weight: 800;

  cursor: pointer;

  box-shadow:
    0 8px 18px
    rgba(
      217,
      119,
      6,
      0.25
    );

  transition:
    transform 0.2s ease;
}

.level-up-button:hover {
  transform:
    translateY(-2px);
}

/* =========================================================
   SCROLLBAR
   ========================================================= */

.student-menu::-webkit-scrollbar {
  width: 5px;
}

.student-menu::-webkit-scrollbar-track {
  background: transparent;
}

.student-menu::-webkit-scrollbar-thumb {
  border-radius: 999px;

  background: #fcd34d;
}

/* =========================================================
   RESPONSIVE - TABLET
   ========================================================= */

@media (max-width: 1100px) {
  .student-sidebar {
    width: 220px;
  }

  .student-main {
    width: calc(100% - 220px);

    margin-left: 220px;

    padding:
      25px 25px 50px;
  }

  .student-stat-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

/* =========================================================
   RESPONSIVE - MOBILE
   ========================================================= */

@media (max-width: 760px) {
  .student-app {
    display: block;
  }

  .student-sidebar {
    position: relative;

    width: 100%;
    height: auto;

    min-height: 0;

    padding: 12px;

    border-right: 0;
    border-bottom: 1px solid #fde68a;
  }

  .student-logo {
    padding-bottom: 12px;
  }

  .student-profile {
    margin:
      12px 0;
  }

  .student-menu {
    display: flex;

    gap: 6px;

    overflow-x: auto;
    overflow-y: hidden;

    padding-bottom: 4px;
  }

  .student-menu-title {
    display: none;
  }

  .student-menu-item {
    width: auto;

    flex-shrink: 0;

    margin-bottom: 0;

    padding:
      9px 11px;
  }

  .student-menu-item span:last-child {
    display: none;
  }

  .student-sidebar-bottom {
    display: flex;

    gap: 6px;

    padding-top: 8px;
  }

  .student-sidebar-bottom
  .student-menu-item {
    flex: 1;
  }

  .student-main {
    width: 100%;

    margin-left: 0;

    padding:
      20px 15px 40px;
  }

  .student-header {
    align-items: flex-start;
  }

  .student-header h1 {
    font-size: 23px;
  }

  .student-header-khmer {
    font-size: 16px;
  }

  .student-header-user {
    display: none;
  }

  .student-welcome {
    min-height: 0;

    padding: 25px 22px;
  }

  .student-welcome h2 {
    font-size: 22px;
  }

  .student-welcome-symbol {
    display: none;
  }

  .student-stat-grid {
    grid-template-columns:
      1fr;
  }

  .student-learning-grid {
    grid-template-columns:
      1fr;
  }

  .online-learning-card {
    align-items: flex-start;

    flex-wrap: wrap;
  }

  .online-learning-status {
    width: 100%;

    justify-content: center;
  }

  .level-up-confetti {
    top: 10%;

    font-size: 21px;

    letter-spacing: 5px;
  }
}

/* =========================================================
   RESPONSIVE - SMALL PHONE
   ========================================================= */

@media (max-width: 430px) {
  .student-main {
    padding:
      16px 11px 30px;
  }

  .student-header h1 {
    font-size: 21px;
  }

  .student-header p {
    font-size: 12px;
  }

  .student-welcome {
    border-radius: 18px;

    padding: 22px 18px;
  }

  .student-welcome h2 {
    font-size: 20px;
  }

  .student-welcome p {
    font-size: 13px;
  }

  .student-stat-card {
    padding: 14px;
  }

  .learning-card {
    grid-template-columns:
      45px 1fr auto;

    padding: 14px;
  }

  .learning-card-icon {
    width: 45px;
    height: 45px;

    font-size: 21px;
  }

  .level-up-card {
    padding:
      30px 20px 24px;
  }
}


      `}</style>
    </>
  );
}

export default StudentHome;