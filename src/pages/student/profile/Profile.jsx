import { useEffect, useState } from "react";
import { supabase } from "../../../supabase";
import "./Profile.css";

/* =========================================================
   PROFILE
   QUẢN LÝ TÀI KHOẢN
========================================================= */

/* =========================================================
   NGÂN HÀNG ẢNH ĐẠI DIỆN
   ---------------------------------------------------------
   Ảnh được đặt trong:

   public/avatars/

   Ví dụ:
   public/avatars/avatar-01.png
   public/avatars/avatar-02.png
   ...
========================================================= */

const AVATAR_BANK = [
  {
    id: "avatar-01",
    src: "/avatars/avatar-01.png",
    name: "Avatar 01",
  },
  {
    id: "avatar-02",
    src: "/avatars/avatar-02.png",
    name: "Avatar 02",
  },
  {
    id: "avatar-03",
    src: "/avatars/avatar-03.png",
    name: "Avatar 03",
  },
  {
    id: "avatar-04",
    src: "/avatars/avatar-04.png",
    name: "Avatar 04",
  },
  {
    id: "avatar-05",
    src: "/avatars/avatar-05.png",
    name: "Avatar 05",
  },
  {
    id: "avatar-06",
    src: "/avatars/avatar-06.png",
    name: "Avatar 06",
  },
  {
    id: "avatar-07",
    src: "/avatars/avatar-07.png",
    name: "Avatar 07",
  },
  {
    id: "avatar-08",
    src: "/avatars/avatar-08.png",
    name: "Avatar 08",
  },
];

function Profile({
  profile,
  session,
  navigate,
  onProfileUpdated,
}) {
  /* =======================================================
     USERNAME
  ======================================================= */

  const [editingUsername, setEditingUsername] =
    useState(false);

  const [usernameInput, setUsernameInput] =
    useState(profile?.username || "");

  const [usernameLoading, setUsernameLoading] =
    useState(false);

  /* =======================================================
     PASSWORD
  ======================================================= */

  const [editingPassword, setEditingPassword] =
    useState(false);

  const [oldPassword, setOldPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [passwordLoading, setPasswordLoading] =
    useState(false);

  const [showOldPassword, setShowOldPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  /* =======================================================
     AVATAR
  ======================================================= */

  const [avatarModalOpen, setAvatarModalOpen] =
    useState(false);

  const [selectedAvatar, setSelectedAvatar] =
    useState(profile?.avatar_url || "");

  const [avatarLoading, setAvatarLoading] =
    useState(false);

  /* =======================================================
     PROFILE DATA
  ======================================================= */

  const username =
    profile?.username ||
    profile?.account ||
    "Học sinh";

  const account =
    profile?.account || "";

  const email =
    profile?.email ||
    session?.user?.email ||
    "";

  const avatarUrl =
    profile?.avatar_url || "";

  /* =======================================================
     ĐỒNG BỘ PROFILE
  ======================================================= */

  useEffect(() => {
    setUsernameInput(
      profile?.username || ""
    );
  }, [profile?.username]);

  useEffect(() => {
    setSelectedAvatar(
      profile?.avatar_url || ""
    );
  }, [profile?.avatar_url]);

  /* =======================================================
     QUAY LẠI
  ======================================================= */

  const handleBack = () => {
    navigate("/student");
  };

  /* =======================================================
     USERNAME
  ======================================================= */

  const handleStartUsernameEdit = () => {
    setUsernameInput(username);
    setEditingUsername(true);
  };

  const handleCancelUsername = () => {
    setUsernameInput(username);
    setEditingUsername(false);
  };

  const handleSaveUsername = async () => {
    const finalUsername =
      usernameInput.trim();

    if (!finalUsername) {
      alert(
        "Tên người dùng không được để trống."
      );

      return;
    }

    if (finalUsername === username) {
      setEditingUsername(false);
      return;
    }

    if (!session?.user?.id) {
      alert(
        "Không xác định được tài khoản."
      );

      return;
    }

    try {
      setUsernameLoading(true);

      const {
        error,
      } = await supabase
        .from("profiles")
        .update({
          username: finalUsername,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          session.user.id
        );

      if (error) {
        throw error;
      }

      alert(
        "Đổi tên người dùng thành công!"
      );

      setEditingUsername(false);

      if (onProfileUpdated) {
        await onProfileUpdated();
      }
    } catch (error) {
      console.error(
        "❌ Lỗi đổi tên người dùng:",
        error
      );

      alert(
        "ĐỔI TÊN THẤT BẠI!\n\n" +
          (
            error?.message ||
            "Lỗi không xác định."
          )
      );
    } finally {
      setUsernameLoading(false);
    }
  };

  /* =======================================================
     PASSWORD
  ======================================================= */

  const resetPasswordForm = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleStartPasswordEdit = () => {
    resetPasswordForm();
    setEditingPassword(true);
  };

  const handleCancelPassword = () => {
    resetPasswordForm();
    setEditingPassword(false);
  };

  const handleSavePassword = async () => {
    if (!oldPassword) {
      alert(
        "Vui lòng nhập mật khẩu cũ."
      );

      return;
    }

    if (!newPassword) {
      alert(
        "Vui lòng nhập mật khẩu mới."
      );

      return;
    }

    if (newPassword.length < 6) {
      alert(
        "Mật khẩu mới phải có ít nhất 6 ký tự."
      );

      return;
    }

    if (!confirmPassword) {
      alert(
        "Vui lòng xác nhận mật khẩu mới."
      );

      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      alert(
        "Mật khẩu mới và xác nhận mật khẩu không giống nhau."
      );

      return;
    }

    if (
      oldPassword ===
      newPassword
    ) {
      alert(
        "Mật khẩu mới phải khác mật khẩu cũ."
      );

      return;
    }

    if (!email) {
      alert(
        "Không xác định được email tài khoản."
      );

      return;
    }

    try {
      setPasswordLoading(true);

      /* ================================================
         KIỂM TRA MẬT KHẨU CŨ
      ================================================= */

      const {
        error: verifyError,
      } =
        await supabase.auth.signInWithPassword({
          email,
          password: oldPassword,
        });

      if (verifyError) {
        alert(
          "Mật khẩu cũ không chính xác."
        );

        return;
      }

      /* ================================================
         ĐỔI MẬT KHẨU MỚI
      ================================================= */

      const {
        error: updateError,
      } =
        await supabase.auth.updateUser({
          password: newPassword,
        });

      if (updateError) {
        throw updateError;
      }

      alert(
        "Đổi mật khẩu thành công!"
      );

      resetPasswordForm();
      setEditingPassword(false);
    } catch (error) {
      console.error(
        "❌ Lỗi đổi mật khẩu:",
        error
      );

      alert(
        "ĐỔI MẬT KHẨU THẤT BẠI!\n\n" +
          (
            error?.message ||
            "Lỗi không xác định."
          )
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  /* =======================================================
     AVATAR
     MỞ NGÂN HÀNG ẢNH
  ======================================================= */

  const handleAvatarClick = () => {
    if (avatarLoading) {
      return;
    }

    setSelectedAvatar(
      avatarUrl || ""
    );

    setAvatarModalOpen(true);
  };

  /* =======================================================
     CHỌN AVATAR
  ======================================================= */

  const handleSelectAvatar = (
    avatar
  ) => {
    if (avatarLoading) {
      return;
    }

    setSelectedAvatar(
      avatar.src
    );
  };

  /* =======================================================
     HỦY CHỌN AVATAR
  ======================================================= */

  const handleCancelAvatar = () => {
    if (avatarLoading) {
      return;
    }

    setSelectedAvatar(
      avatarUrl || ""
    );

    setAvatarModalOpen(false);
  };

  /* =======================================================
     LƯU AVATAR
  ======================================================= */

  const handleSaveAvatar = async () => {
    if (!selectedAvatar) {
      alert(
        "Vui lòng chọn một ảnh đại diện."
      );

      return;
    }

    if (!session?.user?.id) {
      alert(
        "Không xác định được tài khoản."
      );

      return;
    }

    /* Không lưu nếu avatar không thay đổi */

    if (
      selectedAvatar ===
      avatarUrl
    ) {
      setAvatarModalOpen(false);
      return;
    }

    try {
      setAvatarLoading(true);

      const userId =
        session.user.id;

      /* ================================================
         LƯU ĐƯỜNG DẪN AVATAR
         KHÔNG UPLOAD FILE
      ================================================= */

      const {
        error,
      } = await supabase
        .from("profiles")
        .update({
          avatar_url:
            selectedAvatar,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          userId
        );

      if (error) {
        throw error;
      }

      setAvatarModalOpen(false);

      alert(
        "Đổi ảnh đại diện thành công!"
      );

      if (onProfileUpdated) {
        await onProfileUpdated();
      }
    } catch (error) {
      console.error(
        "❌ Lỗi đổi ảnh đại diện:",
        error
      );

      alert(
        "ĐỔI ẢNH ĐẠI DIỆN THẤT BẠI!\n\n" +
          (
            error?.message ||
            "Lỗi không xác định."
          )
      );
    } finally {
      setAvatarLoading(false);
    }
  };

  /* =======================================================
     AVATAR FALLBACK
  ======================================================= */

  const avatarLetter =
    username
      .charAt(0)
      .toUpperCase() ||
    "A";

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="profile-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="profile-header">

        <button
          type="button"
          className="profile-back-button"
          onClick={handleBack}
        >
          ← Quay lại trang chủ
        </button>

        <div className="profile-header-title">

          <h1>
            TÀI KHOẢN
          </h1>

          <p>
            Quản lý tài khoản
          </p>

        </div>

      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="profile-content">

        {/* =================================================
            AVATAR
        ================================================= */}

        <section className="profile-avatar-panel">

          <div className="profile-avatar">

            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Ảnh đại diện"
              />
            ) : (
              <span>
                {avatarLetter}
              </span>
            )}

          </div>

          <div className="profile-avatar-label">
            Ảnh đại diện
          </div>

          <button
            type="button"
            className="profile-avatar-button"
            onClick={
              handleAvatarClick
            }
            disabled={
              avatarLoading
            }
          >
            {avatarLoading
              ? "ĐANG CẬP NHẬT..."
              : "Đổi ảnh đại diện"}
          </button>

        </section>

        {/* =================================================
            ACCOUNT INFORMATION
        ================================================= */}

        <section className="profile-info-panel">

          <h2>
            THÔNG TIN TÀI KHOẢN
          </h2>

          {/* ===============================================
              USERNAME
          =============================================== */}

          <div className="profile-field">

            <label>
              Tên người dùng
            </label>

            {!editingUsername ? (
              <div className="profile-field-row">

                <div className="profile-readonly-input">
                  {username}
                </div>

                <button
                  type="button"
                  className="profile-change-button"
                  onClick={
                    handleStartUsernameEdit
                  }
                >
                  Thay đổi
                </button>

              </div>
            ) : (
              <div className="profile-edit-box">

                <input
                  type="text"
                  value={
                    usernameInput
                  }
                  onChange={(e) =>
                    setUsernameInput(
                      e.target.value
                    )
                  }
                  autoFocus
                  maxLength={100}
                  disabled={
                    usernameLoading
                  }
                />

                <div className="profile-action-row">

                  <button
                    type="button"
                    className="profile-cancel-button"
                    onClick={
                      handleCancelUsername
                    }
                    disabled={
                      usernameLoading
                    }
                  >
                    Hủy
                  </button>

                  <button
                    type="button"
                    className="profile-confirm-button"
                    onClick={
                      handleSaveUsername
                    }
                    disabled={
                      usernameLoading
                    }
                  >
                    {usernameLoading
                      ? "ĐANG LƯU..."
                      : "Xác nhận"}
                  </button>

                </div>

              </div>
            )}

          </div>

          {/* ===============================================
              ACCOUNT
          =============================================== */}

          <div className="profile-field">

            <label>
              Tên đăng nhập
            </label>

            <div className="profile-readonly-input disabled">
              {account}
            </div>

          </div>

          {/* ===============================================
              PASSWORD
          =============================================== */}

          <div className="profile-field">

            <label>
              Mật khẩu
            </label>

            {!editingPassword ? (
              <div className="profile-field-row">

                <div className="profile-readonly-input">
                  ••••••••••••••••
                </div>

                <button
                  type="button"
                  className="profile-change-button"
                  onClick={
                    handleStartPasswordEdit
                  }
                >
                  Thay đổi
                </button>

              </div>
            ) : (
              <div className="profile-password-box">

                {/* MẬT KHẨU CŨ */}

                <div className="profile-password-field">

                  <input
                    type={
                      showOldPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      oldPassword
                    }
                    onChange={(e) =>
                      setOldPassword(
                        e.target.value
                      )
                    }
                    placeholder="Mật khẩu cũ"
                    autoComplete="current-password"
                    disabled={
                      passwordLoading
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowOldPassword(
                        !showOldPassword
                      )
                    }
                  >
                    {showOldPassword
                      ? "Ẩn"
                      : "Hiện"}
                  </button>

                </div>

                {/* MẬT KHẨU MỚI */}

                <div className="profile-password-field">

                  <input
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      newPassword
                    }
                    onChange={(e) =>
                      setNewPassword(
                        e.target.value
                      )
                    }
                    placeholder="Mật khẩu mới"
                    autoComplete="new-password"
                    minLength={6}
                    disabled={
                      passwordLoading
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowNewPassword(
                        !showNewPassword
                      )
                    }
                  >
                    {showNewPassword
                      ? "Ẩn"
                      : "Hiện"}
                  </button>

                </div>

                {/* XÁC NHẬN MẬT KHẨU */}

                <div className="profile-password-field">

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      confirmPassword
                    }
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Xác nhận mật khẩu mới"
                    autoComplete="new-password"
                    minLength={6}
                    disabled={
                      passwordLoading
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >
                    {showConfirmPassword
                      ? "Ẩn"
                      : "Hiện"}
                  </button>

                </div>

                <div className="profile-action-row">

                  <button
                    type="button"
                    className="profile-cancel-button"
                    onClick={
                      handleCancelPassword
                    }
                    disabled={
                      passwordLoading
                    }
                  >
                    Hủy
                  </button>

                  <button
                    type="button"
                    className="profile-confirm-button"
                    onClick={
                      handleSavePassword
                    }
                    disabled={
                      passwordLoading
                    }
                  >
                    {passwordLoading
                      ? "ĐANG ĐỔI..."
                      : "Xác nhận"}
                  </button>

                </div>

              </div>
            )}

          </div>

          {/* ===============================================
              EMAIL
          =============================================== */}

          <div className="profile-field">

            <label>
              Email
            </label>

            <div className="profile-readonly-input disabled">
              {email}
            </div>

          </div>

        </section>

      </main>

      {/* =================================================
          AVATAR BANK MODAL
      ================================================= */}

      {avatarModalOpen && (
        <div
          className="profile-avatar-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              handleCancelAvatar();
            }
          }}
        >

          <div
            className="profile-avatar-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="avatar-bank-title"
          >

            {/* HEADER */}

            <div className="profile-avatar-modal-header">

              <div>

                <h3 id="avatar-bank-title">
                  ẢNH ĐẠI DIỆN
                </h3>

                <p>
                  Chọn ảnh đại diện của bạn
                </p>

              </div>

              <button
                type="button"
                className="profile-avatar-modal-close"
                onClick={
                  handleCancelAvatar
                }
                disabled={
                  avatarLoading
                }
                aria-label="Đóng"
              >
                ×
              </button>

            </div>

            {/* AVATAR PREVIEW */}

            <div className="profile-avatar-preview">

              <div className="profile-avatar-preview-image">

                {selectedAvatar ? (
                  <img
                    src={
                      selectedAvatar
                    }
                    alt="Avatar đang chọn"
                  />
                ) : (
                  <span>
                    {avatarLetter}
                  </span>
                )}

              </div>

              <div className="profile-avatar-preview-text">
                ẢNH ĐẠI DIỆN ĐANG CHỌN
              </div>

            </div>

            {/* AVATAR GRID */}

            <div className="profile-avatar-bank">

              {AVATAR_BANK.map(
                (avatar) => {

                  const isSelected =
                    selectedAvatar ===
                    avatar.src;

                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      className={
                        "profile-avatar-option" +
                        (
                          isSelected
                            ? " selected"
                            : ""
                        )
                      }
                      onClick={() =>
                        handleSelectAvatar(
                          avatar
                        )
                      }
                      disabled={
                        avatarLoading
                      }
                      title={
                        avatar.name
                      }
                    >

                      <img
                        src={
                          avatar.src
                        }
                        alt={
                          avatar.name
                        }
                      />

                      {isSelected && (
                        <span className="profile-avatar-check">
                          ✓
                        </span>
                      )}

                    </button>
                  );
                }
              )}

            </div>

            {/* ACTION */}

            <div className="profile-avatar-modal-actions">

              <button
                type="button"
                className="profile-cancel-button"
                onClick={
                  handleCancelAvatar
                }
                disabled={
                  avatarLoading
                }
              >
                Hủy
              </button>

              <button
                type="button"
                className="profile-confirm-button"
                onClick={
                  handleSaveAvatar
                }
                disabled={
                  avatarLoading ||
                  !selectedAvatar
                }
              >
                {avatarLoading
                  ? "ĐANG LƯU..."
                  : "Xác nhận"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Profile;