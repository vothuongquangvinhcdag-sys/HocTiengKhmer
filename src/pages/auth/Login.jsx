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

  /* =========================================================
     VALIDATION ERROR
  ========================================================= */

  const [accountError, setAccountError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  /* =========================================================
     ĐĂNG NHẬP
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const finalAccount = account.trim();

    /* =======================================================
       RESET LỖI CŨ
    ======================================================= */

    setAccountError("");
    setPasswordError("");

    /* =======================================================
       KIỂM TRA TÀI KHOẢN
    ======================================================= */

    if (!finalAccount) {
      setAccountError("Vui lòng nhập tài khoản.");
    }

    /* =======================================================
       KIỂM TRA MẬT KHẨU
    ======================================================= */

    if (!password) {
      setPasswordError("Vui lòng nhập mật khẩu.");
    }

    /* =======================================================
       NẾU FORM CHƯA ĐẦY ĐỦ → DỪNG
    ======================================================= */

    if (!finalAccount || !password) {
      return;
    }

    try {
      setLoading(true);

      /* =====================================================
         1. TÌM EMAIL THEO TÀI KHOẢN

         Dùng RPC giống hệ thống hiện tại.
      ===================================================== */

      const {
        data: loginEmail,
        error: emailError,
      } = await supabase.rpc(
        "get_login_email",
        {
          p_account: finalAccount,
        }
      );

      /* =====================================================
         LỖI KHI KIỂM TRA TÀI KHOẢN
      ===================================================== */

      if (emailError) {
        console.error(
          "Get login email error:",
          emailError
        );

        setAccountError(
          "Không thể kiểm tra tài khoản. Vui lòng thử lại."
        );

        return;
      }

      /* =====================================================
         TÀI KHOẢN KHÔNG TỒN TẠI

         Hiện ngay dưới ô Tài khoản.
      ===================================================== */

      if (!loginEmail) {
        setAccountError(
          "Tài khoản không tồn tại."
        );

        return;
      }

      /* =====================================================
         2. ĐĂNG NHẬP SUPABASE
      ===================================================== */

      const {
        data,
        error,
      } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });

      /* =====================================================
         SAI MẬT KHẨU / ĐĂNG NHẬP THẤT BẠI

         Không alert.
         Hiện ngay bên dưới ô Mật khẩu.
      ===================================================== */

      if (error) {
        console.error(
          "Supabase login error:",
          error
        );

        setPasswordError(
          "Tài khoản hoặc mật khẩu không đúng."
        );

        return;
      }

      /* =====================================================
         KHÔNG CÓ USER
      ===================================================== */

      if (!data?.user) {
        setPasswordError(
          "Không thể đăng nhập tài khoản."
        );

        return;
      }

      /* =====================================================
         3. ĐĂNG NHẬP THÀNH CÔNG

         Không alert.
         Đi thẳng về trang chủ.
      ===================================================== */

      window.history.pushState(
        {},
        "",
        "/"
      );

      window.dispatchEvent(
        new PopStateEvent("popstate")
      );

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      /* ===================================================
         LỖI KHÁC

         Không alert.
         Hiện dưới ô Mật khẩu.
      =================================================== */

      setPasswordError(
        "Đăng nhập thất bại. Vui lòng thử lại."
      );

    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     ĐĂNG KÝ
  ========================================================= */

  const goToRegister = () => {
    window.history.pushState(
      {},
      "",
      "/register"
    );

    window.dispatchEvent(
      new PopStateEvent("popstate")
    );
  };

  /* =========================================================
     QUÊN MẬT KHẨU
  ========================================================= */

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

  /* =========================================================
     UI
  ========================================================= */

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
          noValidate
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
              className={
                `login-input ${
                  accountError
                    ? "login-input-error"
                    : ""
                }`
              }
              type="text"
              value={account}
              onChange={(e) => {
                setAccount(e.target.value);

                /* Khi người dùng sửa lại tài khoản,
                   xóa lỗi cũ. */
                setAccountError("");
              }}
              placeholder="Nhập tài khoản"
              autoComplete="username"
            />

            {/* ---------------------------------------------
                ACCOUNT ERROR
            --------------------------------------------- */}

            {accountError && (
              <small className="login-error-message">
                {accountError}
              </small>
            )}

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
                className={
                  `login-input login-password-input ${
                    passwordError
                      ? "login-input-error"
                      : ""
                  }`
                }
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);

                  /* Khi người dùng nhập lại mật khẩu,
                     xóa lỗi cũ. */
                  setPasswordError("");
                }}
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
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
                {showPassword
                  ? "🙈"
                  : "👁"}
              </button>

            </div>

            {/* ---------------------------------------------
                PASSWORD ERROR
            --------------------------------------------- */}

            {passwordError && (
              <small className="login-error-message">
                {passwordError}
              </small>
            )}

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
