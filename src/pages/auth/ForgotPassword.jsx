import { useState } from "react";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // =========================================================
  // GỬI YÊU CẦU KHÔI PHỤC MẬT KHẨU
  // =========================================================
  const handleSubmit = (e) => {
    e.preventDefault();

    const finalEmail = email.trim().toLowerCase();

    if (!finalEmail) {
      alert("Vui lòng nhập email.");
      return;
    }

    setEmail(finalEmail);
    setSubmitted(true);
  };

  // =========================================================
  // QUAY LẠI ĐĂNG NHẬP
  // =========================================================
  const goToLogin = () => {
    window.history.pushState({}, "", "/");

    window.dispatchEvent(
      new PopStateEvent("popstate")
    );
  };

  return (
    <div className="login-page forgot-page">

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
          FORGOT PASSWORD CARD
      ===================================================== */}
      <main className="login-card forgot-card">

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
        <h1 className="login-khmer forgot-title-khmer">
          ភ្លេចពាក្យសម្ងាត់?
        </h1>


        {/* ===================================================
            VIETNAMESE TITLE
            DÙNG CLASS CHUẨN login-title
        =================================================== */}
        <p className="login-title forgot-title">
          QUÊN MẬT KHẨU?
        </p>


        {!submitted ? (
          <>
            {/* =================================================
                SUBTITLE
            ================================================= */}
            <p className="login-subtitle">
              Nhập email đã đăng ký để khôi phục mật khẩu
            </p>


            {/* =================================================
                FORM
            ================================================= */}
            <form
              className="login-form"
              onSubmit={handleSubmit}
            >

              <div className="login-form-group">

                <label
                  className="login-label"
                  htmlFor="forgot-email"
                >
                  Email
                </label>

                <input
                  id="forgot-email"
                  className="login-input"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Nhập email đã đăng ký"
                  autoComplete="email"
                  required
                />

              </div>


              {/* =================================================
                  SUBMIT BUTTON
              ================================================= */}
              <button
                type="submit"
                className="login-button"
              >
                GỬI YÊU CẦU
              </button>

            </form>
          </>
        ) : (

          /* ===================================================
             SUCCESS
          =================================================== */
          <div className="forgot-success">

            <div className="forgot-success-icon">
              ✓
            </div>

            <h2 className="forgot-success-title">
              Đã tiếp nhận yêu cầu
            </h2>

            <p className="forgot-success-text">
              Nếu email này đã được đăng ký,
              hướng dẫn khôi phục mật khẩu sẽ
              được gửi đến:
            </p>

            <strong className="forgot-email">
              {email}
            </strong>

            <p className="forgot-success-note">
              Hiện tại đây là giao diện thử nghiệm.
              Chức năng gửi email thật sẽ được kết nối
              sau khi hoàn thành hệ thống tài khoản.
            </p>

          </div>
        )}


        {/* ===================================================
            BACK TO LOGIN
        =================================================== */}
        <div className="login-links">

          <button
            type="button"
            className="login-link-button"
            onClick={goToLogin}
          >
            ← Quay lại đăng nhập
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

export default ForgotPassword;