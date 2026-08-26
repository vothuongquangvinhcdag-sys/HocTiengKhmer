/* =========================================================
   LOGIN PAGE
   KHMER GOLD
========================================================= */

import { useState } from "react";
import { supabase } from "../../supabase";
import "./Login.css";

function Login() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================================================
  // ĐĂNG NHẬP
  // =========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalAccount = account.trim();

    if (!finalAccount || !password.trim()) {
      alert("Vui lòng nhập đầy đủ tài khoản và mật khẩu.");
      return;
    }

    try {
      setLoading(true);

      // =====================================================
      // 1. TÌM EMAIL THEO TÀI KHOẢN
      // =====================================================
      const { data: loginEmail, error: emailError } =
        await supabase.rpc("get_login_email", {
          p_account: finalAccount,
        });

      if (emailError) {
        console.error("Get login email error:", emailError);

        alert(
          "Không thể kiểm tra tài khoản.\n\n" +
            emailError.message
        );

        return;
      }

      if (!loginEmail) {
        alert(
          "Tài khoản không tồn tại.\n\n" +
            "Vui lòng kiểm tra lại tên tài khoản."
        );

        return;
      }

      // =====================================================
      // 2. ĐĂNG NHẬP SUPABASE
      // =====================================================
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: loginEmail,
          password,
        });

      if (error) {
        console.error("Supabase login error:", error);

        alert(
          "ĐĂNG NHẬP THẤT BẠI!\n\n" +
            "Tài khoản hoặc mật khẩu không đúng."
        );

        return;
      }

      if (!data?.user) {
        alert("Không thể đăng nhập tài khoản.");
        return;
      }

      // =====================================================
      // 3. ĐĂNG NHẬP THÀNH CÔNG
      // =====================================================
      alert(
        "ĐĂNG NHẬP THÀNH CÔNG! 🎉\n\n" +
          "Xin chào " +
          finalAccount +
          "!"
      );

      // =====================================================
      // 4. VỀ TRANG CHỦ
      // =====================================================
      window.history.pushState({}, "", "/");

      window.dispatchEvent(
        new PopStateEvent("popstate")
      );
    } catch (error) {
      console.error("Login error:", error);

      alert(
        "ĐĂNG NHẬP THẤT BẠI!\n\n" +
          (error?.message || "Lỗi không xác định.")
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // ĐĂNG KÝ
  // =========================================================
  const goToRegister = () => {
    window.history.pushState({}, "", "/register");

    window.dispatchEvent(
      new PopStateEvent("popstate")
    );
  };

  // =========================================================
  // QUÊN MẬT KHẨU
  // =========================================================
  const goToForgotPassword = () => {
    window.history.pushState(
      {},
      "",
      "/forgot-password"
    );

    window.dispatchEvent(
      new PopStateEvent("popstate")
    );
  };

  return (
    <div className="login-page">

      {/* =====================================================
          TRANG TRÍ
      ===================================================== */}
      <div className="login-decoration login-decoration-left">
        ✦
      </div>

      <div className="login-decoration login-decoration-right">
        ✦
      </div>


      {/* =====================================================
          LOGIN CARD
      ===================================================== */}
      <main className="login-card">

        {/* ===================================================
            LOGO
        =================================================== */}
        <div className="login-logo">
          <div className="login-logo-symbol login-khmer">
            ក
          </div>
        </div>


        {/* ===================================================
            KHMER MAIN TITLE
            រៀនភាសាខ្មែរ

            DÙNG KHMER OS THƯỜNG
        =================================================== */}
        <h1 className="login-title-khmer">
          រៀនភាសាខ្មែរ
        </h1>


        {/* ===================================================
            VIETNAMESE TITLE
        =================================================== */}
        <h2 className="login-title">
          HỌC TIẾNG KHMER
        </h2>


        {/* ===================================================
            SUBTITLE
        =================================================== */}
        <p className="login-subtitle">
          Cùng học tiếng Khmer mỗi ngày
        </p>


        {/* ===================================================
            FORM
        =================================================== */}
        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          {/* =================================================
              TÀI KHOẢN
          ================================================= */}
          <div className="login-form-group">

            <label
              htmlFor="account"
              className="login-label"
            >
              Tài khoản
            </label>

            <input
              id="account"
              className="login-input"
              type="text"
              value={account}
              onChange={(e) =>
                setAccount(e.target.value)
              }
              placeholder="Nhập tài khoản"
              autoComplete="username"
              required
            />

          </div>


          {/* =================================================
              MẬT KHẨU
          ================================================= */}
          <div className="login-form-group">

            <label
              htmlFor="login-password"
              className="login-label"
            >
              Mật khẩu
            </label>

            <div className="login-password-wrapper">

              <input
                id="login-password"
                className="login-input login-password-input"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="login-password-toggle"
                onClick={() =>
                  setShowPassword(
                    (previous) => !previous
                  )
                }
                aria-label={
                  showPassword
                    ? "Ẩn mật khẩu"
                    : "Hiện mật khẩu"
                }
              >
                {showPassword ? "🙈" : "👁"}
              </button>

            </div>

          </div>


          {/* =================================================
              ĐĂNG NHẬP
          ================================================= */}
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "ĐANG ĐĂNG NHẬP..."
              : "ĐĂNG NHẬP"}
          </button>

        </form>


        {/* ===================================================
            LINKS
        =================================================== */}
        <div className="login-links">

          <button
            type="button"
            className="login-link-button"
            onClick={goToRegister}
          >
            Đăng ký ngay
          </button>

          <span className="login-link-separator">
            •
          </span>

          <button
            type="button"
            className="login-link-button"
            onClick={goToForgotPassword}
          >
            Quên mật khẩu
          </button>

        </div>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="login-footer">

        <span>
          HỌC TIẾNG KHMER
        </span>

        <span className="login-footer-dot">
          •
        </span>

        <span className="login-footer-khmer">
          រៀនភាសាខ្មែរ
        </span>

      </footer>

    </div>
  );
}

export default Login;