import { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Vui lòng nhập email.");
      return;
    }

    setSubmitted(true);
  };

  const goToLogin = () => {
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

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
          <div className="khmer-symbol">ក</div>
        </div>

        <h1>QUÊN MẬT KHẨU?</h1>

        <p className="login-khmer">
          ភ្លេចពាក្យសម្ងាត់?
        </p>

        {!submitted ? (
          <>
            <p className="login-subtitle">
              Nhập email đã đăng ký để khôi phục mật khẩu
            </p>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label htmlFor="forgot-email">
                  Email
                </label>

                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email đã đăng ký"
                  autoComplete="email"
                  required
                />
              </div>

              <button
                type="submit"
                className="login-button"
              >
                GỬI YÊU CẦU
              </button>

            </form>
          </>
        ) : (
          <div className="forgot-success">

            <div className="success-icon">
              ✓
            </div>

            <h2>Đã tiếp nhận yêu cầu</h2>

            <p>
              Nếu email này đã được đăng ký,
              hướng dẫn khôi phục mật khẩu sẽ
              được gửi đến:
            </p>

            <strong>{email}</strong>

            <p className="success-note">
              Hiện tại đây là giao diện thử nghiệm.
              Chức năng gửi email thật sẽ được kết nối
              sau khi hoàn thành hệ thống tài khoản.
            </p>

          </div>
        )}

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

export default ForgotPassword;