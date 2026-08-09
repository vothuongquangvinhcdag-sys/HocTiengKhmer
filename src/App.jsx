import { useEffect, useState } from "react";
import { supabase } from "./supabase";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

import StudentHome from "./pages/student/StudentHome";
import Alphabet from "./pages/student/alphabet/Alphabet";

function App() {
  // ==========================================
  // ĐƯỜNG DẪN HIỆN TẠI
  // ==========================================
  const [path, setPath] = useState(window.location.pathname);

  // ==========================================
  // SESSION + PROFILE
  // ==========================================
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // THEO DÕI BACK / FORWARD
  // ==========================================
  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // ==========================================
  // HÀM CHUYỂN TRANG
  // ==========================================
  const navigate = (newPath) => {
    window.history.pushState({}, "", newPath);
    setPath(newPath);
  };

  // ==========================================
  // LẤY PROFILE
  // ==========================================
  const loadProfile = async (userId) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, account, email, role, level, exp")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Load profile error:", error);
      return;
    }

    setProfile(data);
  };

  // ==========================================
  // KIỂM TRA SESSION SUPABASE
  // ==========================================
  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        setSession(currentSession);

        if (currentSession?.user) {
          await loadProfile(currentSession.user.id);
        }
      } catch (error) {
        console.error("Load session error:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!mounted) return;

        setSession(newSession);

        if (newSession?.user) {
          await loadProfile(newSession.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ==========================================
  // ĐĂNG XUẤT
  // ==========================================
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(
        "Đăng xuất thất bại!\n\n" +
          error.message
      );
      return;
    }

    setSession(null);
    setProfile(null);

    navigate("/");
  };

  // ==========================================
  // ĐANG KIỂM TRA TÀI KHOẢN
  // ==========================================
  if (loading) {
    return (
      <div className="login-page">
        <div className="login-decoration decoration-left">
          ◈
        </div>

        <div className="login-decoration decoration-right">
          ◇
        </div>

        <div className="login-card">
          <div className="login-logo">
            <div className="khmer-symbol">
              ក
            </div>
          </div>

          <h1>HỌC TIẾNG KHMER</h1>

          <p className="login-khmer">
            រៀនភាសាខ្មែរ
          </p>

          <p className="login-subtitle">
            Đang kiểm tra tài khoản...
          </p>
        </div>

        <div className="login-footer">
          HỌC TIẾNG KHMER • រៀនភាសាខ្មែរ
        </div>
      </div>
    );
  }

  // ==========================================
  // TRANG ĐĂNG KÝ
  // ==========================================
  if (path === "/register") {
    return (
      <Register
        navigate={navigate}
      />
    );
  }

  // ==========================================
  // TRANG QUÊN MẬT KHẨU
  // ==========================================
  if (path === "/forgot-password") {
    return (
      <ForgotPassword
        navigate={navigate}
      />
    );
  }

  // ==========================================
  // CHƯA ĐĂNG NHẬP
  // ==========================================
  if (!session) {
    return (
      <Login
        navigate={navigate}
      />
    );
  }
 // ==========================================
// TRANG BẢNG CHỮ CÁI
// ==========================================
if (path === "/alphabet") {
  return (
    <Alphabet
      profile={profile}
      onNavigate={navigate}
    />
  );
}

// ==========================================
// TRANG NGƯỜI HỌC
// ==========================================
if (path === "/student") {
  return (
    <StudentHome
      profile={profile}
      onLogout={handleLogout}
      onNavigate={navigate}
    />
  );
}

// ==========================================
// MẶC ĐỊNH
// ==========================================
return (
  <StudentHome
    profile={profile}
    onLogout={handleLogout}
    onNavigate={navigate}
  />
);
}

export default App;
