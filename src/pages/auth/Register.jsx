import { useState } from "react";
import { supabase } from "../../supabase";
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  /* =========================================================
     VỀ TRANG LOGIN
  ========================================================= */

  const goToLogin = () => {
    window.history.pushState({}, "", "/");

    window.dispatchEvent(
      new PopStateEvent("popstate")
    );
  };

  /* =========================================================
     ĐĂNG KÝ
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalAccount = account.trim();

    const finalUsername =
      username.trim() || finalAccount;

    const finalEmail =
      email.trim().toLowerCase();

    /* =====================================================
       KIỂM TRA DỮ LIỆU
    ===================================================== */

    if (!finalAccount) {
      alert("Vui lòng nhập tài khoản.");
      return;
    }

    if (password.length < 6) {
      alert(
        "Mật khẩu phải có ít nhất 6 ký tự."
      );
      return;
    }

    if (password !== confirmPassword) {
      alert(
        "Mật khẩu xác nhận không trùng khớp."
      );
      return;
    }

    if (!finalEmail) {
      alert("Vui lòng nhập email.");
      return;
    }

    /* =====================================================
       SUPABASE
    ===================================================== */

    try {
      setLoading(true);

      const { data, error } =
        await supabase.auth.signUp({
          email: finalEmail,
          password: password,

          options: {
            data: {
              username: finalUsername,
              account: finalAccount,
            },
          },
        });

      if (error) {
        console.error(
          "Supabase Auth Error:",
          error
        );

        alert(
          "ĐĂNG KÝ THẤT BẠI!\n\n" +
            error.message
        );

        return;
      }

      if (!data?.user) {
        alert(
          "Không tạo được tài khoản."
        );

        return;
      }

      /* ===================================================
         THÀNH CÔNG
      =================================================== */

      alert(
        "ĐĂNG KÝ THÀNH CÔNG! 🎉\n\n" +
          "Tên người dùng: " +
          finalUsername +
          "\n" +
          "Tài khoản: " +
          finalAccount +
          "\n" +
          "Email: " +
          finalEmail
      );

      /* ===================================================
         RESET FORM
      =================================================== */

      setUsername("");
      setAccount("");
      setPassword("");
      setConfirmPassword("");
      setEmail("");

      setShowPassword(false);
      setShowConfirmPassword(false);

      goToLogin();
    } catch (error) {
      console.error(
        "Register Error:",
        error
      );

      alert(
        "ĐĂNG KÝ THẤT BẠI!\n\n" +
          (error?.message ||
            "Lỗi không xác định.")
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="register-page">

      {/* =====================================================
          DECORATION
      ===================================================== */}

      <div className="register-decoration register-decoration-left">
        ◈
      </div>

      <div className="register-decoration register-decoration-right">
        ◇
      </div>

      {/* =====================================================
          REGISTER CARD
      ===================================================== */}

      <main className="register-card">

        {/* ===================================================
            LOGO
        =================================================== */}

        <div className="register-logo">
          <div className="register-logo-symbol register-khmer">
            ក
          </div>
        </div>

        {/* ===================================================
            TITLE
        =================================================== */}

        <h1 className="register-title-khmer">
          ចុះឈ្មោះ
        </h1>

        <p className="register-title">
          ĐĂNG KÝ
        </p>

        <p className="register-subtitle">
          Tạo tài khoản học tiếng Khmer
        </p>

        {/* ===================================================
            FORM
        =================================================== */}

        <form
          className="register-form"
          onSubmit={handleSubmit}
        >

          {/* =================================================
              TÊN NGƯỜI DÙNG
          ================================================= */}

          <div className="register-form-group">

            <label
              htmlFor="register-username"
              className="register-label"
            >
              Tên người dùng
            </label>

            <input
              id="register-username"
              className="register-input"
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="Có thể bỏ trống"
              autoComplete="name"
            />

            <small className="register-form-note">
              Nếu bỏ trống, tên tài khoản sẽ được sử dụng.
            </small>

          </div>

          {/* =================================================
              TÀI KHOẢN
          ================================================= */}

          <div className="register-form-group">

            <label
              htmlFor="register-account"
              className="register-label"
            >
              Tài khoản
              <span className="register-required">
                *
              </span>
            </label>

            <input
              id="register-account"
              className="register-input"
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

          <div className="register-form-group">

            <label
              htmlFor="register-password"
              className="register-label"
            >
              Mật khẩu
              <span className="register-required">
                *
              </span>
            </label>

            <div className="register-password-wrapper">

              <input
                id="register-password"
                className="register-input register-password-input"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Tối thiểu 6 ký tự"
                autoComplete="new-password"
                minLength={6}
                required
              />

              <button
                type="button"
                className="register-password-toggle"
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
              XÁC NHẬN MẬT KHẨU
          ================================================= */}

          <div className="register-form-group">

            <label
              htmlFor="register-confirm-password"
              className="register-label"
            >
              Xác nhận mật khẩu
              <span className="register-required">
                *
              </span>
            </label>

            <div className="register-password-wrapper">

              <input
                id="register-confirm-password"
                className="register-input register-password-input"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                placeholder="Nhập lại mật khẩu"
                autoComplete="new-password"
                minLength={6}
                required
              />

              <button
                type="button"
                className="register-password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    (previous) => !previous
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? "Ẩn mật khẩu xác nhận"
                    : "Hiện mật khẩu xác nhận"
                }
              >
                {showConfirmPassword
                  ? "🙈"
                  : "👁"}
              </button>

            </div>

          </div>

          {/* =================================================
              EMAIL
          ================================================= */}

          <div className="register-form-group">

            <label
              htmlFor="register-email"
              className="register-label"
            >
              Email
              <span className="register-required">
                *
              </span>
            </label>

            <input
              id="register-email"
              className="register-input"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Nhập email"
              autoComplete="email"
              required
            />

          </div>

          {/* =================================================
              BUTTON
          ================================================= */}

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading
              ? "ĐANG ĐĂNG KÝ..."
              : "TẠO TÀI KHOẢN"}
          </button>

        </form>

        {/* ===================================================
            LOGIN LINK
        =================================================== */}

        <div className="register-links">

          <button
            type="button"
            className="register-link-button"
            onClick={goToLogin}
          >
            ← Quay lại đăng nhập
          </button>

        </div>

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="register-footer">

        <span>
          HỌC TIẾNG KHMER
        </span>

        <span className="register-footer-dot">
          •
        </span>

        <span className="register-footer-khmer">
          រៀនភាសាខ្មែរ
        </span>

      </footer>

    </div>
  );
}

export default Register;