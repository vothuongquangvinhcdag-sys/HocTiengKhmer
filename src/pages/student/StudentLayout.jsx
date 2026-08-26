import "./StudentLayout.css";

/* =========================================================
   STUDENT LAYOUT
   LAYOUT CHUNG CHO TOÀN BỘ TRANG HỌC SINH

   Sidebar cố định bên trái.
   Nội dung từng trang nằm bên phải thông qua children.
========================================================= */

function StudentLayout({
  profile,
  navigate,
  onLogout,
  activeMenu = "home",
  children,
}) {
  /* =======================================================
     USER
  ======================================================= */

  const username =
    profile?.username ||
    profile?.account ||
    "Học sinh";

  /* =======================================================
     LEVEL
  ======================================================= */

  const getLevelFromExp = (exp) => {
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
  };

  const level = getLevelFromExp(
    profile?.exp ?? 0
  );

  /* =======================================================
     MENU
  ======================================================= */

  const menuItems = [
    {
      id: "home",
      icon: "🏠",
      label: "Trang chủ",
      path: "/student",
    },
    {
      id: "alphabet",
      icon: "ក",
      label: "Bảng chữ cái",
      path: "/alphabet",
      khmer: true,
    },
    {
      id: "vocabulary",
      icon: "📚",
      label: "Từ vựng",
      path: "/vocabulary",
    },
    {
      id: "games",
      icon: "🎮",
      label: "Trò chơi",
      path: "/game",
    },
    {
      id: "communication",
      icon: "💬",
      label: "Giao tiếp",
      path: "/communication",
    },
    {
      id: "progress",
      icon: "📊",
      label: "Tiến độ học tập",
      path: "/progress",
    },
  ];

  /* =======================================================
     ĐIỀU HƯỚNG
  ======================================================= */

  const handleMenu = (item) => {
    if (!item?.path) return;

    navigate(item.path);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="student-layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="student-sidebar">

        {/* =================================================
            LOGO
        ================================================= */}

        <div className="student-logo">

          <div className="student-logo-symbol">
            <span className="khmer-text">
              ក
            </span>
          </div>

          <div className="student-logo-text">

            <div className="student-logo-title">
              HỌC TIẾNG KHMER
            </div>

            <div className="student-logo-khmer khmer-text">
              រៀនភាសាខ្មែរ
            </div>

          </div>

        </div>

        {/* =================================================
            PROFILE
        ================================================= */}

        <div className="student-profile">

          <div className="student-avatar">

            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Ảnh đại diện"
              />
            ) : (
              <span>
                {username
                  .charAt(0)
                  .toUpperCase()}
              </span>
            )}

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

        {/* =================================================
            MENU
        ================================================= */}

        <nav className="student-menu">

          <div className="student-menu-title">
            HỌC TẬP
          </div>

          {menuItems.map((item) => (

            <button
              key={item.id}
              type="button"
              className={
                activeMenu === item.id
                  ? "student-menu-item active"
                  : "student-menu-item"
              }
              onClick={() =>
                handleMenu(item)
              }
            >

              <span className="student-menu-icon">

                {item.khmer ? (
                  <span className="khmer-text">
                    {item.icon}
                  </span>
                ) : (
                  item.icon
                )}

              </span>

              <span>
                {item.label}
              </span>

            </button>

          ))}

        </nav>

        {/* =================================================
            BOTTOM MENU
        ================================================= */}

        <div className="student-sidebar-bottom">

          {/* TÀI KHOẢN */}

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

          {/* ĐĂNG XUẤT */}

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
          MAIN CONTENT
      ================================================= */}

      <main className="student-main">
        {children}
      </main>

    </div>
  );
}

export default StudentLayout;