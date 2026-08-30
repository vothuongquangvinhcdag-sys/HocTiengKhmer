import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import "./App.css";

import {
  setGameProgressUser,
  clearGameProgressUser,
} from "./pages/student/game/data/gameProgress";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

import StudentHome from "./pages/student/StudentHome";
import Alphabet from "./pages/student/alphabet/Alphabet";
import Vocabulary from "./pages/student/vocabulary/vocabulary";
import Game from "./pages/student/game/Game";
import Communication from "./pages/student/communication/Communication";
import Progress from "./pages/student/progress/Progress";
import Profile from "./pages/student/profile/Profile";

import AdminHome from "./pages/admin/AdminHome";

/* =========================================================
   LEVEL EXP
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
   LEVEL TỪ EXP
========================================================= */

function getLevelFromExp(exp) {
  const safeExp = Math.max(
    0,
    Number(exp) || 0
  );

  if (safeExp < LEVEL_EXP[2]) {
    return 1;
  }

  if (safeExp < LEVEL_EXP[3]) {
    return 2;
  }

  if (safeExp < LEVEL_EXP[4]) {
    return 3;
  }

  if (safeExp < LEVEL_EXP[5]) {
    return 4;
  }

  if (safeExp < LEVEL_EXP[6]) {
    return 5;
  }

  if (safeExp < LEVEL_EXP[7]) {
    return 6;
  }

  if (safeExp < LEVEL_EXP[8]) {
    return 7;
  }

  if (safeExp < LEVEL_EXP[9]) {
    return 8;
  }

  if (safeExp < LEVEL_EXP[10]) {
    return 9;
  }

  return 10;
}

/* =========================================================
   NORMALIZE ROUTE
========================================================= */

function normalizePath(pathname) {
  if (!pathname) {
    return "/";
  }

  const normalized = pathname.replace(/\/+$/, "");

  return normalized || "/";
}

/* =========================================================
   APP
========================================================= */

function App() {
  /* =======================================================
     ROUTE
  ======================================================= */

  const [path, setPath] = useState(
    normalizePath(window.location.pathname)
  );

  const navigate = (newPath) => {
    const normalizedPath =
      normalizePath(newPath);

    if (
      normalizedPath ===
      normalizePath(window.location.pathname)
    ) {
      setPath(normalizedPath);
      return;
    }

    window.history.pushState(
      {},
      "",
      normalizedPath
    );

    setPath(normalizedPath);
  };

  useEffect(() => {
    const handlePopState = () => {
      setPath(
        normalizePath(
          window.location.pathname
        )
      );
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

  const [
    loading,
    setLoading,
  ] = useState(true);

  /*
    authReady dùng để đảm bảo App KHÔNG render
    route trung gian khi session/profile/path
    chưa đồng bộ xong.
  */

  const [
    authReady,
    setAuthReady,
  ] = useState(false);

  const [
    session,
    setSession,
  ] = useState(null);

  const [
    profile,
    setProfile,
  ] = useState(null);

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
        "id, username, account, email, role, exp, level, total_study_seconds, avatar_url"
      )
      .eq(
        "id",
        userId
      )
      .single();

    if (error) {
      console.error(
        "❌ Không thể tải profile:",
        error
      );

      setProfile(null);

      return null;
    }

    if (!data) {
      setProfile(null);

      return null;
    }

    const safeExp = Math.max(
      0,
      Number(data.exp ?? 0)
    );

    const safeLevel =
      getLevelFromExp(
        safeExp
      );

    const safeStudySeconds =
      Math.max(
        0,
        Number(
          data.total_study_seconds ?? 0
        )
      );

    const normalizedProfile = {
      ...data,

      role:
        data.role ||
        "student",

      exp:
        safeExp,

      level:
        safeLevel,

      total_study_seconds:
        safeStudySeconds,
    };

    setProfile(
      normalizedProfile
    );

    return normalizedProfile;
  };

  /* =======================================================
     AUTH PROCESS
  ======================================================= */

  const processSession = async (
    currentSession,
    options = {}
  ) => {
    const {
      redirectIfNeeded = true,
    } = options;

    /*
      Trong toàn bộ quá trình xử lý auth:

      authReady = false

      => App chỉ hiển thị loading.
      => Không thể rơi xuống Development Page.
    */

    setAuthReady(false);

    /* =====================================================
       CHƯA ĐĂNG NHẬP
    ===================================================== */

    if (
      !currentSession?.user?.id
    ) {
      clearGameProgressUser();

      setProfile(null);
      setSession(null);

      const currentPath =
        normalizePath(
          window.location.pathname
        );

      if (
        currentPath !== "/login" &&
        currentPath !== "/register" &&
        currentPath !== "/forgot-password"
      ) {
        window.history.replaceState(
          {},
          "",
          "/login"
        );

        setPath("/login");
      } else {
        setPath(currentPath);
      }

      setAuthReady(true);
      setLoading(false);

      return;
    }

    /* =====================================================
       CÓ USER
    ===================================================== */

    const userId =
      currentSession.user.id;

    try {
      /*
        Tải profile và GameProgress
        song song để nhanh hơn.
      */

      const [
        loadedProfile,
      ] = await Promise.all([
        loadProfile(userId),
        setGameProgressUser(userId),
      ]);

      /*
        Kiểm tra component còn mounted
        được xử lý ở useEffect bên ngoài.
      */

      if (!loadedProfile) {
        console.error(
          "❌ Không tìm thấy profile của user:",
          userId
        );

        setSession(
          currentSession
        );

        setAuthReady(true);
        setLoading(false);

        return;
      }

      /*
        QUAN TRỌNG:

        Chỉ set session sau khi profile
        đã tải xong.

        Nhờ vậy không có trạng thái:

        session = có
        profile = null
        path = cũ

        => không còn nhảy qua Development Page.
      */

      setSession(
        currentSession
      );

      /*
        Xác định trang đích.
      */

      const target =
        loadedProfile.role === "admin"
          ? "/admin"
          : "/student";

      const currentPath =
        normalizePath(
          window.location.pathname
        );

      /*
        Nếu đang ở các trang auth/root
        thì chuyển sang trang chính.

        Nếu user đã refresh trực tiếp
        /student hoặc /admin thì giữ nguyên.
      */

      if (
        redirectIfNeeded &&
        (
          currentPath === "/" ||
          currentPath === "/login" ||
          currentPath === "/register"
        )
      ) {
        window.history.replaceState(
          {},
          "",
          target
        );

        setPath(target);
      } else {
        /*
          Luôn đồng bộ path với URL hiện tại.
        */

        setPath(currentPath);
      }
    } catch (error) {
      console.error(
        "❌ Lỗi xử lý session:",
        error
      );

      setSession(
        currentSession
      );
    } finally {
      setAuthReady(true);
      setLoading(false);
    }
  };

  /* =======================================================
     KHỞI ĐỘNG AUTH
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        /*
          Lấy session hiện tại.
        */

        const {
          data,
          error,
        } = await supabase.auth.getSession();

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

        /*
          Không xử lý nếu component đã unmount.
        */

        await processSession(
          currentSession
        );
      } catch (error) {
        console.error(
          "❌ Lỗi khởi động Auth:",
          error
        );

        if (mounted) {
          setSession(null);
          setProfile(null);
          setAuthReady(true);
          setLoading(false);
        }
      }
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

          /*
            SIGNED_OUT
          */

          if (
            event ===
            "SIGNED_OUT"
          ) {
            clearGameProgressUser();

            setSession(null);
            setProfile(null);

            window.history.replaceState(
              {},
              "",
              "/login"
            );

            setPath(
              "/login"
            );

            setAuthReady(true);
            setLoading(false);

            return;
          }

          /*
            Các event có session:

            SIGNED_IN
            INITIAL_SESSION
            TOKEN_REFRESHED
            USER_UPDATED
          */

          if (
            newSession?.user?.id
          ) {
            await processSession(
              newSession,
              {
                /*
                  INITIAL_SESSION:
                  Nếu URL đã là /student thì
                  không ép chuyển lại.

                  SIGNED_IN:
                  Nếu đang ở login/register/root
                  thì chuyển /student hoặc /admin.
                */

                redirectIfNeeded: true,
              }
            );
          } else {
            /*
              Không có session.
            */

            clearGameProgressUser();

            setSession(null);
            setProfile(null);

            setAuthReady(true);
            setLoading(false);
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
     LOGOUT
  ======================================================= */

  const handleLogout = async () => {
    /*
      Xóa timer tạm Alphabet.
    */

    if (
      session?.user?.id
    ) {
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

    /*
      Chỉ clear context.
      KHÔNG xóa game_progress
      trên Supabase.
    */

    clearGameProgressUser();

    /*
      Đưa App về trạng thái loading
      trong lúc logout.
    */

    setAuthReady(false);
    setLoading(true);

    const {
      error,
    } = await supabase.auth.signOut();

    if (error) {
      console.error(
        "❌ Lỗi đăng xuất:",
        error
      );

      /*
        Nếu logout lỗi thì khôi phục UI.
      */

      setAuthReady(true);
      setLoading(false);

      return;
    }

    /*
      Auth listener sẽ xử lý SIGNED_OUT.
      Nhưng set trực tiếp ở đây để UI
      phản hồi ngay lập tức.
    */

    setProfile(null);
    setSession(null);

    window.history.replaceState(
      {},
      "",
      "/login"
    );

    setPath(
      "/login"
    );

    setAuthReady(true);
    setLoading(false);
  };

  /* =======================================================
     SYSTEM LOADING
  ======================================================= */

  /*
    Đây là phần QUAN TRỌNG NHẤT.

    Khi auth/profile/GameProgress đang xử lý,
    App KHÔNG render bất kỳ route nào.

    Vì vậy sẽ không có:

      Loading
        ↓
      Development Page
        ↓
      StudentHome

    mà chỉ có:

      Loading
        ↓
      StudentHome
  */

  if (
    loading ||
    !authReady
  ) {
    return (
      <div className="app-loading">
        <div className="app-loading-card">

          <div className="app-loading-crown">
            ⏳
          </div>

          <div className="app-loading-title">
            HỌC TIẾNG KHMER
          </div>

          <div className="app-loading-divider">
            <span />
            <i />
            <span />
          </div>

          <div className="app-loading-spinner">
            <div />
          </div>

          <div className="app-loading-text">
            Đang tải hệ thống...
          </div>

          <div className="app-loading-subtext">
            Vui lòng chờ trong giây lát
          </div>

        </div>
      </div>
    );
  }

  /* =======================================================
     CHƯA ĐĂNG NHẬP
  ======================================================= */

  if (!session) {
    if (
      path === "/register"
    ) {
      return (
        <Register
          navigate={
            navigate
          }
        />
      );
    }

    if (
      path === "/forgot-password"
    ) {
      return (
        <ForgotPassword
          navigate={
            navigate
          }
        />
      );
    }

    return (
      <Login
        navigate={
          navigate
        }
      />
    );
  }

  /* =======================================================
     CHƯA CÓ PROFILE
  ======================================================= */

  /*
    Trường hợp cực hiếm:
    session có nhưng profile chưa có.

    Không cho rơi xuống Development Page.
  */

  if (!profile) {
    return (
      <div className="app-loading">
        <div className="app-loading-card">

          <div className="app-loading-crown">
            ⏳
          </div>

          <div className="app-loading-title">
            HỌC TIẾNG KHMER
          </div>

          <div className="app-loading-divider">
            <span />
            <i />
            <span />
          </div>

          <div className="app-loading-spinner">
            <div />
          </div>

          <div className="app-loading-text">
            Đang tải hệ thống...
          </div>

          <div className="app-loading-subtext">
            Đang tải thông tin tài khoản...
          </div>

        </div>
      </div>
    );
  }

  /* =======================================================
     ADMIN
  ======================================================= */

  if (
    profile.role === "admin"
  ) {
    if (
      path === "/admin"
    ) {
      return (
        <AdminHome
          profile={
            profile
          }
          session={
            session
          }
          navigate={
            navigate
          }
          onLogout={
            handleLogout
          }
        />
      );
    }

    /*
      Admin chỉ được ở khu vực admin.
    */

    if (
      path !== "/admin"
    ) {
      window.history.replaceState(
        {},
        "",
        "/admin"
      );

      return (
        <AdminHome
          profile={
            profile
          }
          session={
            session
          }
          navigate={
            navigate
          }
          onLogout={
            handleLogout
          }
        />
      );
    }
  }

  /* =======================================================
     STUDENT HOME
  ======================================================= */

  if (
    path === "/" ||
    path === "/student"
  ) {
    return (
      <StudentHome
        profile={
          profile
        }
        session={
          session
        }
        navigate={
          navigate
        }
        onLogout={
          handleLogout
        }
        onProgressUpdated={
          refreshProfile
        }
      />
    );
  }

  /* =======================================================
     ALPHABET
  ======================================================= */

  if (
    path === "/alphabet"
  ) {
    return (
      <Alphabet
        profile={
          profile
        }
        session={
          session
        }
        navigate={
          navigate
        }
        onLogout={
          handleLogout
        }
        onProgressUpdated={
          refreshProfile
        }
      />
    );
  }

  /* =======================================================
     VOCABULARY
  ======================================================= */

  if (
    path === "/vocabulary"
  ) {
    return (
      <Vocabulary
        profile={
          profile
        }
        session={
          session
        }
        navigate={
          navigate
        }
        onLogout={
          handleLogout
        }
        onProgressUpdated={
          refreshProfile
        }
      />
    );
  }

  /* =======================================================
     ADMIN BLOCK
  ======================================================= */

  if (
    path === "/admin" &&
    profile.role !== "admin"
  ) {
    navigate(
      "/student"
    );

    return null;
  }

  /* =======================================================
     GAME
  ======================================================= */

  if (
    path === "/game" ||
    path.startsWith("/game/")
  ) {
    return (
      <Game
        profile={
          profile
        }
        session={
          session
        }
        navigate={
          navigate
        }
        onLogout={
          handleLogout
        }
        path={
          path
        }
      />
    );
  }

  /* =======================================================
     COMMUNICATION
  ======================================================= */

  if (
    path === "/communication"
  ) {
    return (
      <Communication
        profile={
          profile
        }
        session={
          session
        }
        navigate={
          navigate
        }
        onLogout={
          handleLogout
        }
        onProgressUpdated={
          refreshProfile
        }
      />
    );
  }

  /* =======================================================
     PROGRESS
  ======================================================= */

  if (
    path === "/progress"
  ) {
    return (
      <Progress
        profile={
          profile
        }
        session={
          session
        }
        navigate={
          navigate
        }
        onLogout={
          handleLogout
        }
        onProgressUpdated={
          refreshProfile
        }
      />
    );
  }

  /* =======================================================
     PROFILE
  ======================================================= */

  if (
    path === "/student/profile"
  ) {
    return (
      <Profile
        profile={
          profile
        }
        session={
          session
        }
        navigate={
          navigate
        }
        onProfileUpdated={
          refreshProfile
        }
      />
    );
  }

  /* =======================================================
     ROUTE KHÔNG TỒN TẠI
  ======================================================= */

  /*
    Nếu user nhập URL lạ thì đưa về Student
    thay vì hiển thị "Trang đang được phát triển".

    Điều này cũng giúp tránh cảm giác App bị lỗi
    khi route chưa được khai báo.
  */

  window.history.replaceState(
    {},
    "",
    "/student"
  );

  return (
    <StudentHome
      profile={
        profile
      }
      session={
        session
      }
      navigate={
        navigate
      }
      onLogout={
        handleLogout
      }
      onProgressUpdated={
        refreshProfile
      }
    />
  );
}

export default App;