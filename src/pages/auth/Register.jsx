import { useState } from "react";
import { supabase } from "../../supabase";

function Register() {
  const [username, setUsername] = useState("");
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const goToLogin = () => {
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalAccount = account.trim();
    const finalUsername =
      username.trim() || finalAccount;
    const finalEmail =
      email.trim().toLowerCase();

    if (!finalAccount) {
      alert("Vui lòng nhập tài khoản.");
      return;
    }

    if (password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (!finalEmail) {
      alert("Vui lòng nhập email.");
      return;
    }

    try {
      setLoading(true);

      // Tạo tài khoản Supabase
      // Thông tin username và account
      // sẽ được Trigger dùng để tạo profiles
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

      setUsername("");
      setAccount("");
      setPassword("");
      setEmail("");

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

  return (
    <div className="login-page">

      <div className="login-decoration decoration-left">
        ◈
      </div>

      <div className="login-decoration decoration-right">
        ◇
      </div>

      <div className="login-card register-card">

        <div className="login-logo">
          <div className="khmer-symbol">
            ក
          </div>
        </div>

        <h1>ĐĂNG KÝ</h1>

        <p className="login-khmer">
          ចុះឈ្មោះ
        </p>

        <p className="login-subtitle">
          Tạo tài khoản học tiếng Khmer
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="username">
              Tên người dùng
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="Có thể bỏ trống"
              autoComplete="name"
            />

            <small className="form-note">
              Nếu bỏ trống, tên tài khoản sẽ được sử dụng.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="account">
              Tài khoản{" "}
              <span className="required">
                *
              </span>
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

          <div className="form-group">
            <label htmlFor="password">
              Mật khẩu{" "}
              <span className="required">
                *
              </span>
            </label>

            <div className="password-input-wrapper">

              <input
                id="password"
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

          <div className="form-group">
            <label htmlFor="email">
              Email{" "}
              <span className="required">
                *
              </span>
            </label>

            <input
              id="email"
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

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "ĐANG ĐĂNG KÝ..."
              : "TẠO TÀI KHOẢN"}
          </button>

        </form>

        <div className="login-links">

          <button
            type="button"
            className="link-button"
            onClick={goToLogin}
          >
            ← Quay lại đăng nhập
          </button>

        </div>

      </div>

      <div className="login-footer">
        HỌC TIẾNG KHMER • រៀនភាសាខ្មែរ
      </div>

    </div>
  );
}

export default Register;
