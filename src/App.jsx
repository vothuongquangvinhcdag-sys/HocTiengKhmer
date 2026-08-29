import { useEffect, useState } from "react";
import { supabase } from "./supabase";

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
  const safeExp =
    Math.max(
      0,
      Number(exp) || 0
    );

  if (
    safeExp <
    LEVEL_EXP[2]
  ) {
    return 1;
  }

  if (
    safeExp <
    LEVEL_EXP[3]
  ) {
    return 2;
  }

  if (
    safeExp <
    LEVEL_EXP[4]
  ) {
    return 3;
  }

  if (
    safeExp <
    LEVEL_EXP[5]
  ) {
    return 4;
  }

  if (
    safeExp <
    LEVEL_EXP[6]
  ) {
    return 5;
  }

  if (
    safeExp <
    LEVEL_EXP[7]
  ) {
    return 6;
  }

  if (
    safeExp <
    LEVEL_EXP[8]
  ) {
    return 7;
  }

  if (
    safeExp <
    LEVEL_EXP[9]
  ) {
    return 8;
  }

  if (
    safeExp <
    LEVEL_EXP[10]
  ) {
    return 9;
  }

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

  const navigate = (
    newPath
  ) => {
    if (
      newPath ===
      window.location.pathname
    ) {
      setPath(newPath);
      return;
    }

    window.history.pushState(
      {},
      "",
      newPath
    );

    setPath(newPath);
  };


  useEffect(() => {
    const handlePopState = () => {
      setPath(
        window.location.pathname
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

  const loadProfile = async (
    userId
  ) => {
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

    const safeExp =
      Math.max(
        0,
        Number(
          data.exp ?? 0
        )
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
     KHỞI ĐỘNG AUTH
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const initialize =
      async () => {

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
          data?.session ||
          null;

        setSession(
          currentSession
        );


        /* =================================================
           CÓ USER
        ================================================= */

        if (
          currentSession?.user?.id
        ) {
          const userId =
            currentSession.user.id;

          /*
            QUAN TRỌNG:

            Gán đúng Supabase user.id
            cho Game Progress.

            Hàm này đồng thời bắt đầu
            hydrate progress từ Supabase.
          */

          const progressPromise =
            setGameProgressUser(
              userId
            );

          /*
            Tải profile.
          */

          const loadedProfile =
            await loadProfile(
              userId
            );

          /*
            Đảm bảo Game Progress đã
            được hydrate trước khi
            kết thúc initialization.
          */

          if (
            progressPromise
          ) {
            await progressPromise;
          }

          if (!mounted) {
            return;
          }

          if (
            loadedProfile &&
            (
              window.location.pathname === "/" ||
              window.location.pathname === "/login" ||
              window.location.pathname === "/register"
            )
          ) {
            const target =
              loadedProfile.role ===
              "admin"
                ? "/admin"
                : "/student";

            window.history.replaceState(
              {},
              "",
              target
            );

            setPath(
              target
            );
          }
        }


        /* =================================================
           CHƯA ĐĂNG NHẬP
        ================================================= */

        if (!currentSession) {

          /*
            Chỉ xóa context.

            KHÔNG xóa dữ liệu
            trên Supabase.
          */

          clearGameProgressUser();

          if (
            window.location.pathname !== "/login" &&
            window.location.pathname !== "/register" &&
            window.location.pathname !== "/forgot-password"
          ) {
            window.history.replaceState(
              {},
              "",
              "/login"
            );

            setPath(
              "/login"
            );
          }
        }

        setLoading(false);
      };


    initialize();


    /* =====================================================
       AUTH STATE CHANGE
    ===================================================== */

    const {
      data:
        authListener,
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
            newSession ||
            null
          );


          /* ===============================================
             CÓ USER
          =============================================== */

          if (
            newSession?.user?.id
          ) {
            const userId =
              newSession.user.id;

            /*
              Chuyển Game Progress
              sang đúng tài khoản.
            */

            const progressPromise =
              setGameProgressUser(
                userId
              );

            const loadedProfile =
              await loadProfile(
                userId
              );

            if (
              progressPromise
            ) {
              await progressPromise;
            }

            if (!mounted) {
              return;
            }

            if (
              loadedProfile &&
              (
                event === "SIGNED_IN" ||
                event === "INITIAL_SESSION"
              )
            ) {
              if (
                window.location.pathname === "/" ||
                window.location.pathname === "/login" ||
                window.location.pathname === "/register"
              ) {
                const target =
                  loadedProfile.role ===
                  "admin"
                    ? "/admin"
                    : "/student";

                window.history.replaceState(
                  {},
                  "",
                  target
                );

                setPath(
                  target
                );
              }
            }
          }


          /* ===============================================
             KHÔNG CÓ USER
          =============================================== */

          else {

            clearGameProgressUser();

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
  ======================================================= */

  const refreshProfile =
    async () => {
      if (
        !session?.user?.id
      ) {
        return;
      }

      await loadProfile(
        session.user.id
      );
    };


  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout =
    async () => {

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
        QUAN TRỌNG:

        Chỉ clear user context.

        KHÔNG xóa:
        game_progress trên Supabase.
      */

      clearGameProgressUser();


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

      setPath(
        "/login"
      );
    };


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div
        style={{
          minHeight:
            "100vh",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          fontFamily:
            "Arial, sans-serif",

          background:
            "#fffbeb",

          color:
            "#92400e",

          fontSize:
            "18px",

          fontWeight:
            "700",
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

    if (
      path ===
      "/register"
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
      path ===
      "/forgot-password"
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

  if (!profile) {
    return (
      <div
        style={{
          minHeight:
            "100vh",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          background:
            "#fffbeb",

          color:
            "#92400e",

          fontFamily:
            "Arial, sans-serif",

          fontWeight:
            "700",
        }}
      >
        Đang tải thông tin tài khoản...
      </div>
    );
  }


  /* =======================================================
     ADMIN
  ======================================================= */

  if (
    profile.role ===
    "admin"
  ) {
    if (
      path ===
      "/admin"
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

    window.history.replaceState(
      {},
      "",
      "/admin"
    );

    setPath(
      "/admin"
    );

    return null;
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
    path ===
    "/alphabet"
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
    path ===
    "/vocabulary"
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
    path ===
      "/admin" &&
    profile.role !==
      "admin"
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
    path.startsWith(
      "/game/"
    )
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
    path ===
    "/communication"
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
    path ===
    "/progress"
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
    path ===
    "/student/profile"
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
     TRANG CHƯA LÀM
  ======================================================= */

  return (
    <div
      style={{
        minHeight:
          "100vh",

        padding:
          "40px",

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