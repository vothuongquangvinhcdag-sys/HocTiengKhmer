import { useState } from "react";
import { supabase } from "../../supabase";

function Login() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================
  // ĐĂNG NHẬP
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalAccount = account.trim();

    if (!finalAccount || !password.trim()) {
      alert(
        "Vui lòng nhập đầy đủ tài khoản và mật khẩu."
      );
      return;
    }

    try {
      setLoading(true);

      // =========================
      // 1. TÌM EMAIL THEO TÀI KHOẢN
      // =========================
      const {
        data: loginEmail,
        error: emailError,
      } = await supabase.rpc("get_login_email", {
        p_account: finalAccount,
      });

      if (emailError) {
        console.error(
          "Get login email error:",
          emailError
        );

        alert(
          "Không thể kiểm tra tài khoản.\n\n" +
            emailError.message
        );

        return;
      }

      // Không tìm thấy tài khoản
      if (!loginEmail) {
        alert(
          "Tài khoản không tồn tại.\n\n" +
            "Vui lòng kiểm tra lại tên tài khoản."
        );

        return;
      }

      // =========================
      // 2. ĐĂNG NHẬP SUPABASE
      // =========================
      const {
        data,
        error,
      } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: password,
      });

      if (error) {
        console.error(
          "Supabase login error:",
          error
        );

        alert(
          "ĐĂNG NHẬP THẤT BẠI!\n\n" +
            "Tài khoản hoặc mật khẩu không đúng."
        );

        return;
      }

      if (!data?.user) {
        alert(
          "Không thể đăng nhập tài khoản."
        );

        return;
      }

      // =========================
      // 3. ĐĂNG NHẬP THÀNH CÔNG
      // =========================
      alert(
        "ĐĂNG NHẬP THÀNH CÔNG! 🎉\n\n" +
          "Xin chào " +
          finalAccount +
          "!"
      );

      // =========================
      // 4. VỀ TRANG CHỦ
      // =========================
      window.history.pushState({}, "", "/");

      window.dispatchEvent(
        new PopStateEvent("popstate")
      );
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      alert(
        "ĐĂNG NHẬP THẤT BẠI!\n\n" +
          (error?.message ||
            "Lỗi không xác định.")
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ĐI ĐẾN ĐĂNG KÝ
  // =========================
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

  // =========================
  // QUÊN MẬT KHẨU
  // =========================
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

      {/* Trang trí */}
      <div className="login-decoration decoration-left">
        ◈
      </div>

      <div className="login-decoration decoration-right">
        ◇
      </div>

      {/* CARD */}
      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          <div className="khmer-symbol">
            ក
          </div>
        </div>

        {/* Tiêu đề */}
        <h1>HỌC TIẾNG KHMER</h1>

        <p className="login-khmer">
          រៀនភាសាខ្មែរ
        </p>

        <p className="login-subtitle">
          Cùng học tiếng Khmer mỗi ngày
        </p>

        <form onSubmit={handleSubmit}>

          {/* TÀI KHOẢN */}
          <div className="form-group">

            <label htmlFor="account">
              Tài khoản
            </label>

            <input
              id="account"
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

          {/* MẬT KHẨU */}
          <div className="form-group">

            <label htmlFor="login-password">
              Mật khẩu
            </label>

            <div className="password-input-wrapper">

              <input
                id="login-password"
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
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
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
                  : "👁️"}
              </button>

            </div>

          </div>

          {/* ĐĂNG NHẬP */}
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

        {/* LIÊN KẾT */}
        <div className="login-links">

          <button
            type="button"
            className="link-button"
            onClick={goToRegister}
          >
            Đăng ký ngay
          </button>

          <span className="link-separator">
            •
          </span>

          <button
            type="button"
            className="link-button"
            onClick={goToForgotPassword}
          >
            Quên mật khẩu?
          </button>

        </div>

      </div>

      {/* FOOTER */}
      <div className="login-footer">
        HỌC TIẾNG KHMER • រៀនភាសាខ្មែរ
      </div>

    </div>
  );
}

export default Login;
