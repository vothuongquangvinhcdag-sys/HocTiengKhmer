import { useEffect, useState } from "react";
import { supabase } from "./supabase";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

import StudentHome from "./pages/student/StudentHome";
import Alphabet from "./pages/student/alphabet/Alphabet";
import Vocabulary from "./pages/student/vocabulary/vocabulary";
/* =========================================================
   CẤU HÌNH LEVEL
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
   APP
========================================================= */

function App() {
  /* =======================================================
     ROUTE
  ======================================================= */

  const [path, setPath] = useState(
    window.location.pathname || "/"
  );

  const navigate = (newPath) => {
    if (newPath === window.location.pathname) {
      setPath(newPath);
      return;
    }

    window.history.pushState({}, "", newPath);
    setPath(newPath);
  };

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };
  }, []);

  /* =======================================================
     AUTH / PROFILE
  ======================================================= */

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  /* =======================================================
     LOAD PROFILE
  ======================================================= */

  const loadProfile = async (userId) => {
    if (!userId) {
      setProfile(null);
      return null;
    }

    const {
      data,
      error,
    } = await supabase
      .from("profiles")
      .select(
        "id, username, account, exp, level, total_study_seconds"
      )
      .eq("id", userId)
      .single();

    if (error) {
      console.error(
        "❌ Không thể tải profile:",
        error
      );

      return null;
    }

    if (!data) {
      return null;
    }

    const safeExp = Math.max(
      0,
      Number(data.exp ?? 0)
    );

    const safeLevel =
      getLevelFromExp(safeExp);

    const safeStudySeconds =
      Math.max(
        0,
        Number(
          data.total_study_seconds ?? 0
        )
      );

    const normalizedProfile = {
      ...data,
      exp: safeExp,
      level: safeLevel,
      total_study_seconds:
        safeStudySeconds,
    };

    setProfile(
      normalizedProfile
    );

    return normalizedProfile;
  };

  /* =======================================================
     KHỞI ĐỘNG AUTH
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      const {
        data,
        error,
      } =
        await supabase.auth.getSession();

      if (error) {
        console.error(
          "❌ Lỗi lấy session:",
          error
        );
      }

      if (!mounted) {
        return;
      }

      const currentSession =
        data?.session || null;

      setSession(
        currentSession
      );

      if (
        currentSession?.user?.id
      ) {
        await loadProfile(
          currentSession.user.id
        );
      }

      if (
        !currentSession &&
        window.location.pathname !==
          "/login" &&
        window.location.pathname !==
          "/register" &&
        window.location.pathname !==
          "/forgot-password"
      ) {
        window.history.replaceState(
          {},
          "",
          "/login"
        );

        setPath("/login");
      }

      setLoading(false);
    };

    initialize();

    /* =====================================================
       AUTH STATE CHANGE
    ===================================================== */

    const {
      data: authListener,
    } =
      supabase.auth.onAuthStateChange(
        async (
          event,
          newSession
        ) => {
          if (!mounted) {
            return;
          }

          setSession(
            newSession || null
          );

          if (
            newSession?.user?.id
          ) {
            await loadProfile(
              newSession.user.id
            );

            if (
              event ===
                "SIGNED_IN" ||
              event ===
                "INITIAL_SESSION"
            ) {
              if (
                window.location.pathname ===
                  "/" ||
                window.location.pathname ===
                  "/login" ||
                window.location.pathname ===
                  "/register"
              ) {
                window.history.replaceState(
                  {},
                  "",
                  "/student"
                );

                setPath(
                  "/student"
                );
              }
            }
          } else {
            setProfile(null);
          }
        }
      );

    return () => {
      mounted = false;

      authListener?.subscription?.unsubscribe();
    };
  }, []);

  /* =======================================================
     REFRESH PROFILE

     Alphabet gọi hàm này sau khi lưu Supabase.
  ======================================================= */

  const refreshProfile = async () => {
    if (!session?.user?.id) {
      return;
    }

    await loadProfile(
      session.user.id
    );
  };

  /* =======================================================
     ĐĂNG XUẤT

     Không có timer ở đây.

     Chỉ xóa phần thời gian lẻ đang lưu tạm
     của Alphabet.
  ======================================================= */

  const handleLogout =
    async () => {
      if (session?.user?.id) {
        try {
          localStorage.removeItem(
            `alphabet_study_${session.user.id}`
          );
        } catch (error) {
          console.warn(
            "Không thể xóa dữ liệu timer tạm:",
            error
          );
        }
      }

      const {
        error,
      } =
        await supabase.auth.signOut();

      if (error) {
        console.error(
          "❌ Lỗi đăng xuất:",
          error
        );
      }

      setProfile(null);
      setSession(null);

      window.history.replaceState(
        {},
        "",
        "/login"
      );

      setPath("/login");
    };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "Arial, sans-serif",
          background:
            "#fffbeb",
          color: "#92400e",
          fontSize: "18px",
          fontWeight: "700",
        }}
      >
        Đang tải hệ thống...
      </div>
    );
  }

  /* =======================================================
     CHƯA ĐĂNG NHẬP
  ======================================================= */

  if (!session) {
    if (path === "/register") {
      return (
        <Register
          navigate={navigate}
        />
      );
    }

    if (
      path ===
      "/forgot-password"
    ) {
      return (
        <ForgotPassword
          navigate={navigate}
        />
      );
    }

    return (
      <Login
        navigate={navigate}
      />
    );
  }

  /* =======================================================
     CHƯA CÓ PROFILE
  ======================================================= */

  if (!profile) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "#fffbeb",
          color: "#92400e",
          fontFamily:
            "Arial, sans-serif",
          fontWeight: "700",
        }}
      >
        Đang tải thông tin tài khoản...
      </div>
    );
  }

  /* =======================================================
     STUDENT HOME

     QUAN TRỌNG:
     Không có timer ở đây.

     StudentHome chỉ:
     - Hiển thị EXP
     - Hiển thị Level
     - Hiển thị tổng thời gian
  ======================================================= */

  if (
    path === "/" ||
    path === "/student"
  ) {
    return (
      <StudentHome
        profile={profile}
        navigate={navigate}
        onLogout={handleLogout}
      />
    );
  }

  /* =======================================================
     ALPHABET

     ĐÂY LÀ TRANG DUY NHẤT CÓ TIMER.
  ======================================================= */

  if (path === "/alphabet") {
    return (
      <Alphabet
        profile={profile}
        session={session}
        navigate={navigate}
        onLogout={handleLogout}
        onProgressUpdated={
          refreshProfile
        }
      />
    );
  }
if (path === "/vocabulary") {
  return (
    <Vocabulary
      profile={profile}
      session={session}
      navigate={navigate}
      onLogout={handleLogout}
      onProgressUpdated={
        refreshProfile
      }
    />
  );
}
  /* =======================================================
     TRANG CHƯA LÀM
  ======================================================= */

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        fontFamily:
          "Arial, sans-serif",
        background:
          "#fffbeb",
      }}
    >
      <h2>
        Trang đang được phát triển
      </h2>

      <p>
        Đường dẫn:{" "}
        <strong>
          {path}
        </strong>
      </p>

      <button
        type="button"
        onClick={() =>
          navigate(
            "/student"
          )
        }
      >
        ← Về trang học
      </button>
    </div>
  );
}

export default App;