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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  /* =========================================================
     VALIDATION ERROR
  ========================================================= */

  const [accountError, setAccountError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  /* =========================================================
     EMAIL DOMAIN ĐƯỢC CHẤP NHẬN
  ========================================================= */

  const allowedEmailDomains = [
    "gmail.com",
    "angiang.edu.vn",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
  ];

  /* =========================================================
     ĐIỀU HƯỚNG
  ========================================================= */

  const goToLogin = () => {
    window.history.pushState({}, "", "/");

    window.dispatchEvent(
      new PopStateEvent("popstate")
    );
  };

  const goToStudentHome = () => {
    window.history.pushState({}, "", "/student");

    window.dispatchEvent(
      new PopStateEvent("popstate")
    );
  };

  /* =========================================================
     KIỂM TRA TÀI KHOẢN

     Dùng RPC check_account_exists

     Chạy khi:
     - Người dùng rời khỏi ô tài khoản
     - Người dùng bấm ĐĂNG KÝ

     Yêu cầu:
     - Không được để trống
     - Tối thiểu 6 ký tự
     - Không được trùng tài khoản
  ========================================================= */

  const checkAccount = async () => {
    const finalAccount = account.trim();

    /* -------------------------------------------------------
       TÀI KHOẢN TRỐNG
    ------------------------------------------------------- */

    if (!finalAccount) {
      setAccountError(
        "Vui lòng nhập tài khoản."
      );

      return false;
    }

    /* -------------------------------------------------------
       TÀI KHOẢN DƯỚI 6 KÝ TỰ
    ------------------------------------------------------- */

    if (finalAccount.length < 6) {
      setAccountError(
        "Tài khoản phải có ít nhất 6 ký tự."
      );

      return false;
    }

    /* -------------------------------------------------------
       KIỂM TRA TÀI KHOẢN TRONG SUPABASE
    ------------------------------------------------------- */

    try {
      const { data, error } =
        await supabase.rpc(
          "check_account_exists",
          {
            p_account: finalAccount,
          }
        );

      if (error) {
        console.error(
          "Check account error:",
          error
        );

        /*
          Nếu RPC bị lỗi thì không báo sai
          rằng tài khoản đã tồn tại.
        */

        return true;
      }

      /* -----------------------------------------------------
         TÀI KHOẢN ĐÃ TỒN TẠI
      ----------------------------------------------------- */

      if (data === true) {
        setAccountError(
          "Tên tài khoản đã tồn tại."
        );

        return false;
      }

      /* -----------------------------------------------------
         TÀI KHOẢN HỢP LỆ
      ----------------------------------------------------- */

      setAccountError("");

      return true;
    } catch (error) {
      console.error(
        "Account validation error:",
        error
      );

      return true;
    }
  };

  /* =========================================================
     KIỂM TRA MẬT KHẨU
  ========================================================= */

  const checkPassword = () => {
    if (!password) {
      setPasswordError(
        "Vui lòng nhập mật khẩu."
      );

      return false;
    }

    if (password.length < 6) {
      setPasswordError(
        "Mật khẩu phải có ít nhất 6 ký tự."
      );

      return false;
    }

    setPasswordError("");

    return true;
  };

  /* =========================================================
     KIỂM TRA XÁC NHẬN MẬT KHẨU
  ========================================================= */

  const checkConfirmPassword = () => {
    if (!confirmPassword) {
      setConfirmPasswordError(
        "Vui lòng xác nhận mật khẩu."
      );

      return false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError(
        "Mật khẩu không trùng khớp."
      );

      return false;
    }

    setConfirmPasswordError("");

    return true;
  };

  /* =========================================================
     KIỂM TRA EMAIL

     Dùng RPC:
       check_email_exists

     Chạy khi:
       - Rời khỏi ô Email
       - Bấm ĐĂNG KÝ
  ========================================================= */

  const checkEmail = async () => {
    const finalEmail =
      email.trim().toLowerCase();

    /* -------------------------------------------------------
       EMAIL TRỐNG
    ------------------------------------------------------- */

    if (!finalEmail) {
      setEmailError(
        "Vui lòng nhập email."
      );

      return false;
    }

    /* -------------------------------------------------------
       KIỂM TRA ĐỊNH DẠNG
    ------------------------------------------------------- */

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(finalEmail)) {
      setEmailError(
        "Email phải có dạng @gmail.com, @angiang.edu.vn,..."
      );

      return false;
    }

    /* -------------------------------------------------------
       KIỂM TRA DOMAIN
    ------------------------------------------------------- */

    const domain =
      finalEmail.split("@")[1];

    if (
      !allowedEmailDomains.includes(domain)
    ) {
      setEmailError(
        "Email phải có dạng @gmail.com, @angiang.edu.vn,..."
      );

      return false;
    }

    /* -------------------------------------------------------
       KIỂM TRA EMAIL TRONG SUPABASE AUTH

       Gọi RPC:
         check_email_exists
    ------------------------------------------------------- */

    try {
      const { data, error } =
        await supabase.rpc(
          "check_email_exists",
          {
            p_email: finalEmail,
          }
        );

      if (error) {
        console.error(
          "Check email error:",
          error
        );

        /*
          RPC lỗi thì không báo sai
          "Email đã tồn tại".
        */

        return true;
      }

      /* -----------------------------------------------------
         EMAIL ĐÃ TỒN TẠI
      ----------------------------------------------------- */

      if (data === true) {
        setEmailError(
          "Email đã tồn tại."
        );

        return false;
      }

      /* -----------------------------------------------------
         EMAIL CHƯA TỒN TẠI
      ----------------------------------------------------- */

      setEmailError("");

      return true;
    } catch (error) {
      console.error(
        "Email validation error:",
        error
      );

      return true;
    }
  };

  /* =========================================================
     ĐĂNG KÝ
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const finalAccount =
      account.trim();

    const finalUsername =
      username.trim() ||
      finalAccount;

    const finalEmail =
      email.trim().toLowerCase();

    /* =======================================================
       KIỂM TRA TOÀN BỘ FORM
    ======================================================= */

    const accountValid =
      await checkAccount();

    const passwordValid =
      checkPassword();

    const confirmPasswordValid =
      checkConfirmPassword();

    const emailValid =
      await checkEmail();

    /* -------------------------------------------------------
       CÓ LỖI → DỪNG
    ------------------------------------------------------- */

    if (
      !accountValid ||
      !passwordValid ||
      !confirmPasswordValid ||
      !emailValid
    ) {
      return;
    }

    /* =======================================================
       BẮT ĐẦU ĐĂNG KÝ SUPABASE AUTH
    ======================================================= */

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

      /* =====================================================
         SUPABASE AUTH ERROR
      ===================================================== */

      if (error) {
        console.error(
          "Supabase Auth Error:",
          error
        );

        const errorMessage =
          error.message?.toLowerCase() ||
          "";

        /* ---------------------------------------------------
           EMAIL ĐÃ TỒN TẠI

           Không alert.
           Hiện lỗi dưới ô Email.
        --------------------------------------------------- */

        if (
          errorMessage.includes(
            "already registered"
          ) ||
          errorMessage.includes(
            "already exists"
          ) ||
          errorMessage.includes(
            "user already registered"
          ) ||
          errorMessage.includes(
            "email already"
          ) ||
          errorMessage.includes(
            "email address already"
          )
        ) {
          setEmailError(
            "Email đã tồn tại."
          );

          return;
        }

        /* ---------------------------------------------------
           LỖI KHÁC
        --------------------------------------------------- */

        alert(
          "ĐĂNG KÝ THẤT BẠI\n\n" +
            error.message
        );

        return;
      }

      /* =====================================================
         KHÔNG TẠO ĐƯỢC USER
      ===================================================== */

      if (!data?.user) {
        alert(
          "Không tạo được tài khoản."
        );

        return;
      }

      /* =====================================================
         ĐĂNG KÝ THÀNH CÔNG

         Lưu thông tin để StudentHome
         hiển thị bảng thông báo.
      ===================================================== */

      try {
        sessionStorage.setItem(
          "registration_success",
          JSON.stringify({
            username: finalUsername,
            account: finalAccount,
          })
        );
      } catch (storageError) {
        console.warn(
          "Không thể lưu thông báo đăng ký:",
          storageError
        );
      }

      /* =====================================================
         RESET FORM
      ===================================================== */

      setUsername("");
      setAccount("");
      setPassword("");
      setConfirmPassword("");
      setEmail("");

      setAccountError("");
      setPasswordError("");
      setConfirmPasswordError("");
      setEmailError("");

      setShowPassword(false);
      setShowConfirmPassword(false);

      /* =====================================================
         ĐIỀU HƯỚNG STUDENT HOME
      ===================================================== */

      goToStudentHome();

    } catch (error) {
      console.error(
        "Register Error:",
        error
      );

      alert(
        "ĐĂNG KÝ THẤT BẠI!\n\n" +
          (
            error?.message ||
            "Lỗi không xác định."
          )
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

      {/* DECORATION */}

      <div className="register-decoration register-decoration-left">
        ◈
      </div>

      <div className="register-decoration register-decoration-right">
        ◇
      </div>

      {/* REGISTER CARD */}

      <main className="register-card">

        {/* LOGO */}

        <div className="register-logo">
          <div className="register-logo-symbol register-khmer">
            ក
          </div>
        </div>

        {/* TITLE */}

        <h1 className="register-title-khmer">
          ចុះឈ្មោះ
        </h1>

        <p className="register-title">
          ĐĂNG KÝ
        </p>

        <p className="register-subtitle">
          Tạo tài khoản học tiếng Khmer
        </p>

        {/* FORM */}

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
                setUsername(
                  e.target.value
                )
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
              className={
                `register-input ${
                  accountError
                    ? "register-input-error"
                    : ""
                }`
              }
              type="text"
              value={account}
              onChange={(e) => {
                setAccount(
                  e.target.value
                );

                setAccountError("");
              }}
              onBlur={checkAccount}
              placeholder="Tối thiểu 6 ký tự"
              autoComplete="username"
              minLength={6}
              required
            />

            {accountError && (
              <small className="register-error-message">
                {accountError}
              </small>
            )}

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
                className={
                  `register-input register-password-input ${
                    passwordError
                      ? "register-input-error"
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
                  const value =
                    e.target.value;

                  setPassword(value);
                  setPasswordError("");

                  if (confirmPassword) {
                    if (
                      value !==
                      confirmPassword
                    ) {
                      setConfirmPasswordError(
                        "! Mật khẩu không trùng khớp."
                      );
                    } else {
                      setConfirmPasswordError(
                        ""
                      );
                    }
                  }
                }}
                onBlur={checkPassword}
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
                    (previous) =>
                      !previous
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

            {passwordError && (
              <small className="register-error-message">
                {passwordError}
              </small>
            )}

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
                className={
                  `register-input register-password-input ${
                    confirmPasswordError
                      ? "register-input-error"
                      : ""
                  }`
                }
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={
                  confirmPassword
                }
                onChange={(e) => {
                  setConfirmPassword(
                    e.target.value
                  );

                  setConfirmPasswordError(
                    ""
                  );
                }}
                onBlur={
                  checkConfirmPassword
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
                    (previous) =>
                      !previous
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

            {confirmPasswordError && (
              <small className="register-error-message">
                {
                  confirmPasswordError
                }
              </small>
            )}

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
              className={
                `register-input ${
                  emailError
                    ? "register-input-error"
                    : ""
                }`
              }
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(
                  e.target.value
                );

                setEmailError("");
              }}
              onBlur={checkEmail}
              placeholder="Nhập email"
              autoComplete="email"
              required
            />

            {emailError && (
              <small className="register-error-message">
                {emailError}
              </small>
            )}

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

        {/* =================================================
            LOGIN LINK
        ================================================= */}

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
