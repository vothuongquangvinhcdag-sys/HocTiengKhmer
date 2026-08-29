import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "../../supabase";
import "./AdminHome.css";

/* =========================================================
   CẤU HÌNH
========================================================= */

const LEVEL_EXP = {
  1: 0,
  2: 100,
  3: 200,
  4: 400,
  5: 800,
  6: 1600,
  7: 3200,
  8: 6400,
  9: 12800,
  10: 25600,
};

const TOTAL_GAMES = 5;

const ACCOUNT_MIN_LENGTH = 6;
const ACCOUNT_MAX_LENGTH = 20;

const MIN_PASSWORD_LENGTH = 6;

const PAGE_SIZE_OPTIONS = [10, 15, 20, 30];

/* =========================================================
   LEVEL
========================================================= */

function getLevelFromExp(exp) {
  const safeExp = Math.max(0, Number(exp) || 0);

  if (safeExp < LEVEL_EXP[2]) return 1;
  if (safeExp < LEVEL_EXP[3]) return 2;
  if (safeExp < LEVEL_EXP[4]) return 3;
  if (safeExp < LEVEL_EXP[5]) return 4;
  if (safeExp < LEVEL_EXP[6]) return 5;
  if (safeExp < LEVEL_EXP[7]) return 6;
  if (safeExp < LEVEL_EXP[8]) return 7;
  if (safeExp < LEVEL_EXP[9]) return 8;
  if (safeExp < LEVEL_EXP[10]) return 9;

  return 10;
}

/* =========================================================
   FORMAT THỜI GIAN
========================================================= */

function formatStudyTime(seconds) {
  const safeSeconds = Math.max(0, Number(seconds) || 0);

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;

  if (hours > 0) {
    return `${hours} giờ ${minutes} phút`;
  }

  if (minutes > 0) {
    return `${minutes} phút ${remainingSeconds} giây`;
  }

  return `${remainingSeconds} giây`;
}

/* =========================================================
   KIỂM TRA GAME HOÀN THÀNH
========================================================= */

function isGameProgressCompleted(row) {
  if (!row) {
    return false;
  }

  if (row.completed === true) {
    return true;
  }

  return (
    row.stage1_completed === true &&
    row.stage2_completed === true &&
    row.stage3_completed === true &&
    row.stage4_completed === true
  );
}

/* =========================================================
   TẠO MAP GAME PROGRESS

   user_id → Set(game_id)
========================================================= */

function buildGameProgressMap(rows) {
  const map = new Map();

  for (const row of rows || []) {
    const userId = String(row.user_id || "");
    const gameId = Number(row.game_id);

    if (!userId || !Number.isInteger(gameId)) {
      continue;
    }

    if (gameId < 1 || gameId > TOTAL_GAMES) {
      continue;
    }

    if (!isGameProgressCompleted(row)) {
      continue;
    }

    if (!map.has(userId)) {
      map.set(userId, new Set());
    }

    map.get(userId).add(gameId);
  }

  return map;
}

/* =========================================================
   SỐ GAME HOÀN THÀNH
========================================================= */

function getCompletedGameCount(student, gameProgressMap) {
  if (!student) {
    return 0;
  }

  const completedGames = gameProgressMap.get(String(student.id));

  if (!completedGames) {
    return 0;
  }

  return Math.min(TOTAL_GAMES, completedGames.size);
}

/* =========================================================
   ADMIN HOME
========================================================= */

function AdminHome({ profile, navigate, onLogout }) {
  /* =======================================================
     DATA
  ======================================================= */

  const [students, setStudents] = useState([]);
  const [gameProgressMap, setGameProgressMap] = useState(new Map());

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  /* =======================================================
     PHÂN TRANG
  ======================================================= */

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /* =======================================================
     POPUP ĐỔI MẬT KHẨU
  ======================================================= */

  const [passwordModal, setPasswordModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  /* =======================================================
     POPUP TẠO TÀI KHOẢN
  ======================================================= */

  const [createModal, setCreateModal] = useState(false);

  const [createUsername, setCreateUsername] = useState("");
  const [createAccount, setCreateAccount] = useState("");
  const [createPassword, setCreatePassword] = useState("");

  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const [accountError, setAccountError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  /* =======================================================
     POPUP THÔNG BÁO TẠO TÀI KHOẢN THÀNH CÔNG
  ======================================================= */

  const [successModal, setSuccessModal] = useState(false);
  const [createdAccount, setCreatedAccount] = useState("");

  /* =======================================================
     POPUP XÓA TÀI KHOẢN
  ======================================================= */

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteStudent, setDeleteStudent] = useState(null);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  /* =======================================================
     ĐỌC LỖI EDGE FUNCTION
  ======================================================= */

  const getFunctionErrorMessage = async (
    functionError,
    defaultMessage
  ) => {
    try {
      if (
        functionError?.context &&
        typeof functionError.context.json === "function"
      ) {
        const responseData = await functionError.context.json();

        return responseData?.error || defaultMessage;
      }
    } catch {
      // Không đọc được response JSON.
    }

    return defaultMessage;
  };

  /* =======================================================
     TẢI DỮ LIỆU
  ======================================================= */

  const loadStudents = async () => {
    setLoading(true);
    setError("");

    try {
      const [profilesResult, gameProgressResult] = await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .eq("role", "student")
          .order("exp", {
            ascending: false,
          }),

        supabase
          .from("game_progress")
          .select(`
            user_id,
            game_id,
            stage1_completed,
            stage2_completed,
            stage3_completed,
            stage4_completed,
            completed
          `)
          .order("game_id", {
            ascending: true,
          }),
      ]);

      const {
        data: profileData,
        error: profileError,
      } = profilesResult;

      const {
        data: gameData,
        error: gameError,
      } = gameProgressResult;

      if (profileError) {
        console.error(
          "ADMIN - Profiles error:",
          profileError
        );

        throw new Error(
          "Không thể tải danh sách tài khoản."
        );
      }

      if (gameError) {
        console.error(
          "ADMIN - Game progress error:",
          gameError
        );

        throw new Error(
          "Không thể tải tiến độ game của học sinh."
        );
      }

      const nextStudents = profileData || [];

      const nextGameProgressMap =
        buildGameProgressMap(gameData || []);

      setStudents(nextStudents);
      setGameProgressMap(nextGameProgressMap);
      setCurrentPage(1);
    } catch (loadError) {
      console.error(
        "ADMIN - Load data error:",
        loadError
      );

      setStudents([]);
      setGameProgressMap(new Map());

      setError(
        loadError instanceof Error
          ? loadError.message
          : "Không thể tải dữ liệu hệ thống."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     KIỂM TRA ADMIN
  ======================================================= */

  useEffect(() => {
    if (!profile || profile.role !== "admin") {
      return;
    }

    loadStudents();
  }, [profile]);

  /* =======================================================
     TÌM KIẾM
  ======================================================= */

  const filteredStudents = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return students;
    }

    return students.filter((student) => {
      const username = String(
        student.username || ""
      ).toLowerCase();

      const account = String(
        student.account || ""
      ).toLowerCase();

      const email = String(
        student.email || ""
      ).toLowerCase();

      return (
        username.includes(keyword) ||
        account.includes(keyword) ||
        email.includes(keyword)
      );
    });
  }, [students, search]);

  /* =======================================================
     RESET TRANG
  ======================================================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize]);

  /* =======================================================
     THỐNG KÊ
  ======================================================= */

  const totalStudents = students.length;

  const totalExp = useMemo(() => {
    return students.reduce(
      (total, student) =>
        total + Number(student.exp || 0),
      0
    );
  }, [students]);

  const totalStudySeconds = useMemo(() => {
    return students.reduce(
      (total, student) =>
        total +
        Number(
          student.total_study_seconds || 0
        ),
      0
    );
  }, [students]);

  const totalCompletedGames = useMemo(() => {
    return students.reduce(
      (total, student) =>
        total +
        getCompletedGameCount(
          student,
          gameProgressMap
        ),
      0
    );
  }, [students, gameProgressMap]);

  /* =======================================================
     PHÂN TRANG
  ======================================================= */

  const totalFilteredStudents =
    filteredStudents.length;

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalFilteredStudents / pageSize
    )
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedStudents = useMemo(() => {
    const startIndex =
      (currentPage - 1) * pageSize;

    return filteredStudents.slice(
      startIndex,
      startIndex + pageSize
    );
  }, [
    filteredStudents,
    currentPage,
    pageSize,
  ]);

  const pageStartIndex =
    totalFilteredStudents === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;

  const pageEndIndex = Math.min(
    currentPage * pageSize,
    totalFilteredStudents
  );

  /* =======================================================
     SỐ TRANG
  ======================================================= */

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from(
        {
          length: totalPages,
        },
        (_, index) => index + 1
      );
    }

    const pages = [1];

    if (currentPage > 4) {
      pages.push("...");
    }

    const start = Math.max(
      2,
      currentPage - 1
    );

    const end = Math.min(
      totalPages - 1,
      currentPage + 1
    );

    for (
      let page = start;
      page <= end;
      page++
    ) {
      pages.push(page);
    }

    if (
      currentPage <
      totalPages - 3
    ) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  }, [currentPage, totalPages]);

  /* =======================================================
     TẠO TÀI KHOẢN
  ======================================================= */

  const resetCreateForm = () => {
    setCreateUsername("");
    setCreateAccount("");
    setCreatePassword("");

    setCreateError("");
    setAccountError("");
    setPasswordError("");
  };

  const openCreateModal = () => {
    resetCreateForm();
    setCreateModal(true);
  };

  const closeCreateModal = () => {
    if (createLoading) {
      return;
    }

    setCreateModal(false);
    resetCreateForm();
  };

  /* =======================================================
     KIỂM TRA TÀI KHOẢN TRÙNG
  ======================================================= */

  const accountAlreadyExists = (account) => {
    const normalizedAccount = String(
      account || ""
    )
      .trim()
      .toLowerCase();

    if (!normalizedAccount) {
      return false;
    }

    return students.some(
      (student) =>
        String(student.account || "")
          .trim()
          .toLowerCase() === normalizedAccount
    );
  };

  /* =======================================================
     KIỂM TRA TÀI KHOẢN KHI NHẬP
  ======================================================= */

  const handleAccountChange = (event) => {
    const value = event.target.value;

    setCreateAccount(value);
    setAccountError("");
    setCreateError("");
  };

  /* =======================================================
     KIỂM TRA TÀI KHOẢN KHI RỜI Ô
  ======================================================= */

  const handleAccountBlur = () => {
    const account = createAccount.trim();

    if (!account) {
      setAccountError(
        "Vui lòng nhập tài khoản."
      );
      return;
    }

    if (
      account.length <
      ACCOUNT_MIN_LENGTH ||
      account.length >
      ACCOUNT_MAX_LENGTH
    ) {
      setAccountError(
        `Tài khoản phải có từ ${ACCOUNT_MIN_LENGTH} đến ${ACCOUNT_MAX_LENGTH} ký tự.`
      );
      return;
    }

    if (accountAlreadyExists(account)) {
      setAccountError(
        "Tên tài khoản đã tồn tại."
      );
      return;
    }

    setAccountError("");
  };

  /* =======================================================
     KIỂM TRA MẬT KHẨU KHI NHẬP
  ======================================================= */

  const handleCreatePasswordChange = (
    event
  ) => {
    setCreatePassword(
      event.target.value
    );

    setPasswordError("");
    setCreateError("");
  };

  /* =======================================================
     KIỂM TRA MẬT KHẨU KHI RỜI Ô
  ======================================================= */

  const handleCreatePasswordBlur = () => {
    const password = createPassword;

    if (!password) {
      setPasswordError(
        "Vui lòng nhập mật khẩu."
      );
      return;
    }

    if (
      password.length <
      MIN_PASSWORD_LENGTH
    ) {
      setPasswordError(
        `Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự.`
      );
      return;
    }

    setPasswordError("");
  };

  /* =======================================================
     SUBMIT TẠO TÀI KHOẢN
  ======================================================= */

  const handleCreateAccount = async (
    event
  ) => {
    event.preventDefault();

    setCreateError("");

    const account =
      createAccount.trim();

    const username =
      createUsername.trim() || account;

    if (!account) {
      setAccountError(
        "Vui lòng nhập tài khoản."
      );
      return;
    }

    if (
      account.length <
        ACCOUNT_MIN_LENGTH ||
      account.length >
        ACCOUNT_MAX_LENGTH
    ) {
      setAccountError(
        `Tài khoản phải có từ ${ACCOUNT_MIN_LENGTH} đến ${ACCOUNT_MAX_LENGTH} ký tự.`
      );
      return;
    }

    if (accountAlreadyExists(account)) {
      setAccountError(
        "Tên tài khoản đã tồn tại."
      );
      return;
    }

    if (!createPassword) {
      setPasswordError(
        "Vui lòng nhập mật khẩu."
      );
      return;
    }

    if (
      createPassword.length <
      MIN_PASSWORD_LENGTH
    ) {
      setPasswordError(
        `Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự.`
      );
      return;
    }

    setCreateLoading(true);

    try {
      const {
        data,
        error: functionError,
      } = await supabase.functions.invoke(
        "admin-create-user",
        {
          body: {
            username,
            account,
            password: createPassword,
          },
        }
      );

      if (functionError) {
        console.error(
          "ADMIN - Create user error:",
          functionError
        );

        const message =
          await getFunctionErrorMessage(
            functionError,
            "Không thể tạo tài khoản."
          );

        throw new Error(message);
      }

      if (!data?.success) {
        throw new Error(
          data?.error ||
            "Không thể tạo tài khoản."
        );
      }

      const finalAccount =
        data?.account || account;

      setCreateModal(false);
      resetCreateForm();

      setCreatedAccount(finalAccount);
      setSuccessModal(true);

      await loadStudents();
    } catch (createAccountError) {
      console.error(
        "ADMIN - Create account:",
        createAccountError
      );

      setCreateError(
        createAccountError instanceof Error
          ? createAccountError.message
          : "Có lỗi xảy ra khi tạo tài khoản."
      );
    } finally {
      setCreateLoading(false);
    }
  };

  /* =======================================================
     XÓA TÀI KHOẢN
  ======================================================= */

  const openDeleteModal = (student) => {
    if (!student) {
      return;
    }

    if (student.id === profile?.id) {
      setError(
        "Không thể xóa tài khoản quản trị viên đang đăng nhập."
      );
      return;
    }

    setDeleteStudent(student);
    setDeleteError("");
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (deleteLoading) {
      return;
    }

    setDeleteModal(false);
    setDeleteStudent(null);
    setDeleteError("");
  };

  const handleDeleteAccount = async () => {
    if (!deleteStudent) {
      setDeleteError(
        "Chưa chọn tài khoản cần xóa."
      );
      return;
    }

    if (
      deleteStudent.id ===
      profile?.id
    ) {
      setDeleteError(
        "Không thể xóa tài khoản quản trị viên đang đăng nhập."
      );
      return;
    }

    setDeleteLoading(true);
    setDeleteError("");

    try {
      const {
        data,
        error: functionError,
      } = await supabase.functions.invoke(
        "admin-delete-user",
        {
          body: {
            userId: deleteStudent.id,
          },
        }
      );

      if (functionError) {
        console.error(
          "ADMIN - Delete user error:",
          functionError
        );

        const message =
          await getFunctionErrorMessage(
            functionError,
            "Không thể xóa tài khoản."
          );

        throw new Error(message);
      }

      if (!data?.success) {
        throw new Error(
          data?.error ||
            "Không thể xóa tài khoản."
        );
      }

      setDeleteModal(false);
      setDeleteStudent(null);
      setDeleteError("");

      await loadStudents();
    } catch (deleteAccountError) {
      console.error(
        "ADMIN - Delete account:",
        deleteAccountError
      );

      setDeleteError(
        deleteAccountError instanceof Error
          ? deleteAccountError.message
          : "Có lỗi xảy ra khi xóa tài khoản."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  /* =======================================================
     XUẤT EXCEL
  ======================================================= */

  const exportExcel = () => {
    if (students.length === 0) {
      setError(
        "Không có dữ liệu học sinh để xuất Excel."
      );
      return;
    }

    const now = new Date();

    const day = String(
      now.getDate()
    ).padStart(2, "0");

    const month = String(
      now.getMonth() + 1
    ).padStart(2, "0");

    const year = now.getFullYear();

    const fileName =
      `THONG KE HOC VIEN NGAY ${day}-${month}-${year}.xlsx`;

    const exportData = students.map(
      (student, index) => ({
        STT: index + 1,

        "Họ tên":
          student.username || "",

        "Tài khoản":
          student.account || "",

        Email:
          student.email || "",

        Level:
          getLevelFromExp(
            student.exp
          ),

        EXP:
          Number(
            student.exp || 0
          ),

        "Game hoàn thành":
          `${getCompletedGameCount(
            student,
            gameProgressMap
          )}/${TOTAL_GAMES}`,

        "Thời gian học":
          formatStudyTime(
            student.total_study_seconds
          ),

        "Thời gian học (giây)":
          Number(
            student.total_study_seconds || 0
          ),

        "Ngày tạo":
          student.created_at
            ? new Date(
                student.created_at
              ).toLocaleString(
                "vi-VN"
              )
            : "",
      })
    );

    const worksheet =
      XLSX.utils.json_to_sheet(
        exportData
      );

    worksheet["!cols"] = [
      { wch: 7 },
      { wch: 28 },
      { wch: 22 },
      { wch: 40 },
      { wch: 10 },
      { wch: 15 },
      { wch: 18 },
      { wch: 25 },
      { wch: 22 },
      { wch: 22 },
    ];

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "THỐNG KÊ HỌC VIÊN"
    );

    XLSX.writeFile(
      workbook,
      fileName
    );
  };

  /* =======================================================
     ĐỔI MẬT KHẨU
  ======================================================= */

  const openPasswordModal = (
    student
  ) => {
    setSelectedStudent(student);

    setNewPassword("");
    setConfirmPassword("");

    setResetError("");
    setResetSuccess("");

    setPasswordModal(true);
  };

  const closePasswordModal = () => {
    if (resetLoading) {
      return;
    }

    setPasswordModal(false);
    setSelectedStudent(null);

    setNewPassword("");
    setConfirmPassword("");

    setResetError("");
    setResetSuccess("");
  };

  const handleResetPassword = async (
    event
  ) => {
    event.preventDefault();

    setResetError("");
    setResetSuccess("");

    if (!selectedStudent) {
      setResetError(
        "Chưa chọn học sinh."
      );
      return;
    }

    if (!newPassword) {
      setResetError(
        "Vui lòng nhập mật khẩu mới."
      );
      return;
    }

    if (
      newPassword.length <
      MIN_PASSWORD_LENGTH
    ) {
      setResetError(
        `Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự.`
      );
      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setResetError(
        "Mật khẩu xác nhận không khớp."
      );
      return;
    }

    setResetLoading(true);

    try {
      const {
        data,
        error: functionError,
      } = await supabase.functions.invoke(
        "admin-reset-password",
        {
          body: {
            userId:
              selectedStudent.id,
            newPassword,
          },
        }
      );

      if (functionError) {
        console.error(
          "ADMIN - Reset password error:",
          functionError
        );

        const message =
          await getFunctionErrorMessage(
            functionError,
            "Không thể đổi mật khẩu."
          );

        throw new Error(message);
      }

      if (!data?.success) {
        throw new Error(
          data?.error ||
            "Không thể đổi mật khẩu."
        );
      }

      setResetSuccess(
        "Đã đổi mật khẩu thành công."
      );

      setNewPassword("");
      setConfirmPassword("");
    } catch (resetPasswordError) {
      console.error(
        "ADMIN - Reset password:",
        resetPasswordError
      );

      setResetError(
        resetPasswordError instanceof Error
          ? resetPasswordError.message
          : "Có lỗi xảy ra khi đổi mật khẩu."
      );
    } finally {
      setResetLoading(false);
    }
  };

  /* =======================================================
     ACCESS DENIED
  ======================================================= */

  if (
    !profile ||
    profile.role !== "admin"
  ) {
    return (
      <div className="admin-access-denied">

        <div className="admin-access-card">

          <div className="admin-access-icon">
            🚫
          </div>

          <h2>
            Không có quyền truy cập
          </h2>

          <p>
            Tài khoản của bạn không có
            quyền quản trị hệ thống.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/student")
            }
            className="admin-primary-button"
          >
            🏠 Về trang học
          </button>

        </div>

      </div>
    );
  }

  /* =======================================================
     DASHBOARD
  ======================================================= */

  return (
    <div className="admin-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="admin-header">

        <div className="admin-header-inner">

          <div className="admin-brand">

            <div className="admin-brand-title">

              <span className="admin-brand-logo">
                👑
              </span>

              <span>
                Quản trị hệ thống
              </span>

            </div>

            <div className="admin-greeting">
              Xin chào{" "}
              <strong>
                {profile.username}
              </strong>{" "}
              — Học Tiếng Khmer
            </div>

          </div>

          <div className="admin-header-actions">

            <button
              type="button"
              onClick={() =>
                navigate("/student")
              }
              className="admin-header-button admin-home-button"
            >
              🏠 Trang chủ
            </button>

            <button
              type="button"
              onClick={loadStudents}
              disabled={loading}
              className="admin-header-button admin-refresh-button"
            >
              🔄 Làm mới
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="admin-header-button admin-logout-button"
            >
              ➜ Đăng xuất
            </button>

          </div>

        </div>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="admin-main">

        <div className="admin-page-heading">

          <div className="admin-dashboard-label">
            ADMIN DASHBOARD
          </div>

          <h1>
            Tổng quan hệ thống
          </h1>

          <p>
            Theo dõi tình hình học tập
            và tài khoản học sinh.
          </p>

        </div>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="admin-stats-grid">

          <StatCard
            variant="students"
            icon="👨‍🎓"
            title="Học viên"
            value={totalStudents}
            description="Tài khoản học viên"
          />

          <StatCard
            variant="total-exp"
            icon="⭐"
            title="Tổng EXP"
            value={totalExp.toLocaleString(
              "vi-VN"
            )}
            description="EXP toàn bộ học sinh"
          />

          <StatCard
            variant="completed-games"
            icon="🎮"
            title="Game hoàn thành"
            value={totalCompletedGames}
            description="Tổng số game học sinh đã hoàn thành"
          />

          <StatCard
            variant="study-time"
            icon="⏱️"
            title="Tổng thời gian"
            value={formatStudyTime(
              totalStudySeconds
            )}
            description="Thời gian học tích lũy"
          />

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="admin-error">
            ⚠️ {error}
          </div>
        )}

        {/* =================================================
            STUDENT LIST
        ================================================= */}

        <section className="student-list-card">

          <div className="student-list-header">

            <div className="student-list-heading-row">

              <div className="student-list-title-area">

                <div className="student-list-title-row">

                  <div className="student-list-icon">
                    👨‍🎓
                  </div>

                  <h2>
                    Danh sách học viên
                  </h2>

                </div>

              </div>

              <div className="student-list-actions">

                <button
                  type="button"
                  onClick={openCreateModal}
                  className="admin-action-button admin-create-button"
                >
                  ➕ Thêm tài khoản
                </button>

                <button
                  type="button"
                  onClick={exportExcel}
                  className="admin-action-button admin-export-button"
                >
                  📊 Xuất Excel
                </button>

              </div>

            </div>

            {/* =================================================
                SEARCH + PAGE INFO
            ================================================= */}

            <div className="student-toolbar">

              <div className="student-search-wrapper">

                <span className="student-search-icon">
                  🔎
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Tìm học viên, tài khoản hoặc email..."
                  className="student-search-input"
                />

              </div>

              <div className="student-list-count">

                {totalFilteredStudents > 0 ? (
                  <>
                    Hiển thị{" "}
                    {pageStartIndex}–
                    {pageEndIndex}/
                    {totalFilteredStudents}
                  </>
                ) : (
                  <>
                    Hiển thị 0/
                    {totalStudents}
                  </>
                )}

              </div>

              <div className="student-page-size">

                <span>
                  Hiển thị
                </span>

                <select
                  value={pageSize}
                  onChange={(event) =>
                    setPageSize(
                      Number(
                        event.target.value
                      )
                    )
                  }
                  className="student-page-size-select"
                >

                  {PAGE_SIZE_OPTIONS.map(
                    (size) => (
                      <option
                        key={size}
                        value={size}
                      >
                        {size}
                      </option>
                    )
                  )}

                </select>

                <span>
                  tài khoản / trang
                </span>

              </div>

            </div>

          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (
            <div className="admin-loading">

              <div className="admin-loading-icon">
                ⏳
              </div>

              Đang tải danh sách học sinh...

            </div>
          ) : (
            <>

              {/* =================================================
                  TABLE
              ================================================= */}

              <div className="student-table-wrapper">

                <table className="student-table">

                  <thead>

                    <tr>

                      <th>
                        STT
                      </th>

                      <th>
                        Tên học viên
                      </th>

                      <th>
                        Tài khoản
                      </th>

                      <th>
                        Email
                      </th>

                      <th className="text-center">
                        Level
                      </th>

                      <th className="text-right">
                        EXP
                      </th>

                      <th className="text-center">
                        Game
                      </th>

                      <th className="text-right">
                        Thời gian học
                      </th>

                      <th className="text-center">
                        Thao tác
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {paginatedStudents.map(
                      (
                        student,
                        index
                      ) => {

                        const completedGames =
                          getCompletedGameCount(
                            student,
                            gameProgressMap
                          );

                        const globalIndex =
                          (currentPage - 1) *
                            pageSize +
                          index +
                          1;

                        return (
                          <tr
                            key={
                              student.id
                            }
                          >

                            <td>
                              <span className="student-index">
                                {globalIndex}
                              </span>
                            </td>

                            <td>

                              <strong className="student-name">
                                {student.username ||
                                  student.account ||
                                  "—"}
                              </strong>

                            </td>

                            <td className="student-account">
                              {student.account ||
                                "—"}
                            </td>

                            <td className="student-email">
                              {student.email ||
                                "—"}
                            </td>

                            <td className="text-center">

                              <span className="student-level">
                                Lv.{" "}
                                {getLevelFromExp(
                                  student.exp
                                )}
                              </span>

                            </td>

                            <td className="student-exp text-right">

                              ⭐{" "}
                              {Number(
                                student.exp ||
                                  0
                              ).toLocaleString(
                                "vi-VN"
                              )}

                            </td>

                            <td className="student-game text-center">

                              <span
                                className={`student-game-progress ${
                                  completedGames ===
                                  TOTAL_GAMES
                                    ? "game-complete"
                                    : completedGames > 0
                                    ? "game-learning"
                                    : "game-not-started"
                                }`}
                              >

                                🎮{" "}
                                {completedGames}/
                                {TOTAL_GAMES}

                              </span>

                            </td>

                            <td className="student-study-time text-right">

                              ⏱️{" "}
                              {formatStudyTime(
                                student.total_study_seconds
                              )}

                            </td>

                            <td className="text-center">

                              <div className="student-action-buttons">

                                <button
                                  type="button"
                                  onClick={() =>
                                    openPasswordModal(
                                      student
                                    )
                                  }
                                  className="password-button"
                                >
                                  🔑 Đổi mật khẩu
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    openDeleteModal(
                                      student
                                    )
                                  }
                                  className="delete-button"
                                >
                                  🗑️ Xóa
                                </button>

                              </div>

                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>

              {/* =================================================
                  EMPTY
              ================================================= */}

              {filteredStudents.length === 0 && (
                <div className="admin-empty">

                  <div className="admin-empty-icon">
                    🔎
                  </div>

                  <strong>
                    Không tìm thấy học sinh
                  </strong>

                  <div className="admin-empty-text">
                    Hãy thử lại với từ khóa
                    khác.
                  </div>

                </div>
              )}

              {/* =================================================
                  PAGINATION
              ================================================= */}

              {totalFilteredStudents > 0 &&
                totalPages > 1 && (
                  <div className="student-pagination">

                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage(
                          (page) =>
                            Math.max(
                              1,
                              page - 1
                            )
                        )
                      }
                      disabled={
                        currentPage === 1
                      }
                      className="student-pagination-button student-pagination-prev"
                    >
                      ‹ Trước
                    </button>

                    <div className="student-pagination-pages">

                      {pageNumbers.map(
                        (
                          page,
                          index
                        ) => {

                          if (
                            page ===
                            "..."
                          ) {
                            return (
                              <span
                                key={`ellipsis-${index}`}
                                className="student-pagination-ellipsis"
                              >
                                …
                              </span>
                            );
                          }

                          return (
                            <button
                              type="button"
                              key={page}
                              onClick={() =>
                                setCurrentPage(
                                  page
                                )
                              }
                              className={`student-pagination-page ${
                                currentPage ===
                                page
                                  ? "active"
                                  : ""
                              }`}
                            >
                              {page}
                            </button>
                          );
                        }
                      )}

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage(
                          (page) =>
                            Math.min(
                              totalPages,
                              page + 1
                            )
                        )
                      }
                      disabled={
                        currentPage ===
                        totalPages
                      }
                      className="student-pagination-button student-pagination-next"
                    >
                      Sau ›
                    </button>

                  </div>
                )}

            </>
          )}

        </section>

      </main>

      {/* =====================================================
          POPUP TẠO TÀI KHOẢN
      ===================================================== */}

      {createModal && (
        <div
          className="password-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeCreateModal();
            }
          }}
        >

          <div className="password-modal">

            <div className="password-modal-header">

              <div>

                <div className="password-modal-title">
                  ➕ Tạo tài khoản
                </div>

                <div className="password-modal-subtitle">
                  Quản trị viên
                </div>

              </div>

              <button
                type="button"
                onClick={
                  closeCreateModal
                }
                disabled={
                  createLoading
                }
                className="password-modal-close"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={
                handleCreateAccount
              }
              className="password-form"
            >

              {createError && (
                <div className="reset-error">
                  ⚠️ {createError}
                </div>
              )}

              {/* TÊN HỌC SINH */}

              <label className="password-label">
                Tên người dùng
              </label>

              <input
                type="text"
                value={
                  createUsername
                }
                onChange={(event) =>
                  setCreateUsername(
                    event.target.value
                  )
                }
                placeholder="Có thể bỏ trống"
                disabled={
                  createLoading
                }
                autoComplete="name"
                className="password-input"
              />

              <div className="password-help">
                Bỏ trống sẽ tự động lấy
                tên tài khoản.
              </div>

              {/* TÀI KHOẢN */}

              <label className="password-label">
                Tài khoản
              </label>

              <input
                type="text"
                value={
                  createAccount
                }
                onChange={
                  handleAccountChange
                }
                onBlur={
                  handleAccountBlur
                }
                placeholder="Tài khoản phải có từ 6 đến 20 ký tự"
                disabled={
                  createLoading
                }
                autoComplete="username"
                minLength={
                  ACCOUNT_MIN_LENGTH
                }
                maxLength={
                  ACCOUNT_MAX_LENGTH
                }
                className={`password-input ${
                  accountError
                    ? "input-error"
                    : ""
                }`}
              />

              {accountError && (
                <div className="password-help password-field-error">
                  ⚠️ {accountError}
                </div>
              )}

              {/* MẬT KHẨU */}

              <label className="password-label">
                Mật khẩu
              </label>

              <input
                type="password"
                value={
                  createPassword
                }
                onChange={
                  handleCreatePasswordChange
                }
                onBlur={
                  handleCreatePasswordBlur
                }
                placeholder="Mật khẩu phải có ít nhất 6 ký tự"
                minLength={
                  MIN_PASSWORD_LENGTH
                }
                disabled={
                  createLoading
                }
                autoComplete="new-password"
                className={`password-input ${
                  passwordError
                    ? "input-error"
                    : ""
                }`}
              />

              {passwordError && (
                <div className="password-help password-field-error">
                  ⚠️ {passwordError}
                </div>
              )}

              <div className="password-form-actions">

                <button
                  type="button"
                  onClick={
                    closeCreateModal
                  }
                  disabled={
                    createLoading
                  }
                  className="modal-cancel-button"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={
                    createLoading
                  }
                  className={`modal-submit-button ${
                    createLoading
                      ? "is-loading"
                      : ""
                  }`}
                >
                  {createLoading
                    ? "⏳ Đang tạo..."
                    : "➕ Tạo tài khoản"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =====================================================
          POPUP THÀNH CÔNG
      ===================================================== */}

      {successModal && (
        <div
          className="password-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSuccessModal(false);
            }
          }}
        >

          <div className="password-modal">

            <div className="password-modal-header">

              <div>

                <div className="password-modal-title">
                  THÔNG BÁO TỪ HỆ THỐNG
                </div>

                <div className="password-modal-subtitle">
                  Quản trị viên
                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSuccessModal(false)
                }
                className="password-modal-close"
              >
                ×
              </button>

            </div>

            <div className="delete-confirm-body">

              <div className="delete-warning-icon">
                ✅
              </div>

              <h3>
                Tạo tài khoản thành công!
              </h3>

              <p>
                Tài khoản{" "}
                <strong>
                  {createdAccount}
                </strong>{" "}
                đã được tạo thành công.
              </p>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          POPUP XÓA TÀI KHOẢN
      ===================================================== */}

      {deleteModal && (
        <div
          className="password-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeDeleteModal();
            }
          }}
        >

          <div className="password-modal delete-confirm-modal">

            <div className="password-modal-header">

              <div>

                <div className="password-modal-title">
                  🗑️ Xóa tài khoản
                </div>

                <div className="password-modal-subtitle">
                  Quản trị viên
                </div>

              </div>

              <button
                type="button"
                onClick={
                  closeDeleteModal
                }
                disabled={
                  deleteLoading
                }
                className="password-modal-close"
              >
                ×
              </button>

            </div>

            <div className="delete-confirm-body">

              <div className="delete-warning-icon">
                ⚠️
              </div>

              <h3>
                Bạn có chắc muốn xóa?
              </h3>

              <p>
                Tài khoản{" "}
                <strong>
                  {deleteStudent?.account ||
                    "—"}
                </strong>{" "}
                của học sinh{" "}
                <strong>
                  {deleteStudent?.username ||
                    "—"}
                </strong>{" "}
                sẽ bị xóa khỏi hệ thống.
              </p>

              <div className="delete-warning-note">
                ⚠️ Hành động này không thể
                hoàn tác.
              </div>

              {deleteError && (
                <div className="reset-error">
                  ⚠️ {deleteError}
                </div>
              )}

            </div>

            <div className="password-form-actions delete-actions">

              <button
                type="button"
                onClick={
                  closeDeleteModal
                }
                disabled={
                  deleteLoading
                }
                className="modal-cancel-button"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={
                  handleDeleteAccount
                }
                disabled={
                  deleteLoading
                }
                className={`modal-delete-button ${
                  deleteLoading
                    ? "is-loading"
                    : ""
                }`}
              >
                {deleteLoading
                  ? "⏳ Đang xóa..."
                  : "🗑️ Xóa tài khoản"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          POPUP ĐỔI MẬT KHẨU
      ===================================================== */}

      {passwordModal && (
        <div
          className="password-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closePasswordModal();
            }
          }}
        >

          <div className="password-modal">

            <div className="password-modal-header">

              <div>

                <div className="password-modal-title">
                  🔑 Đổi mật khẩu
                </div>

                <div className="password-modal-subtitle">
                  Quản trị viên
                </div>

              </div>

              <button
                type="button"
                onClick={
                  closePasswordModal
                }
                disabled={
                  resetLoading
                }
                className="password-modal-close"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={
                handleResetPassword
              }
              className="password-form"
            >

              <div className="selected-student">

                <div className="selected-student-label">
                  Tài khoản học sinh
                </div>

                <div className="selected-student-name">
                  👨‍🎓{" "}
                  {selectedStudent?.username ||
                    "—"}
                </div>

                <div className="selected-student-account">
                  {selectedStudent?.account ||
                    "—"}
                </div>

              </div>

              {resetSuccess && (
                <div className="reset-success">
                  ✅ {resetSuccess}
                </div>
              )}

              {resetError && (
                <div className="reset-error">
                  ⚠️ {resetError}
                </div>
              )}

              <label className="password-label">
                Mật khẩu mới
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(
                    event.target.value
                  )
                }
                placeholder="Nhập mật khẩu mới..."
                minLength={
                  MIN_PASSWORD_LENGTH
                }
                disabled={
                  resetLoading
                }
                autoComplete="new-password"
                className="password-input"
              />

              <div className="password-help">
                Mật khẩu phải có ít nhất{" "}
                {MIN_PASSWORD_LENGTH} ký tự.
              </div>

              <label className="password-label">
                Xác nhận mật khẩu
              </label>

              <input
                type="password"
                value={
                  confirmPassword
                }
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                placeholder="Nhập lại mật khẩu mới..."
                minLength={
                  MIN_PASSWORD_LENGTH
                }
                disabled={
                  resetLoading
                }
                autoComplete="new-password"
                className="password-input"
              />

              <div className="password-form-actions">

                <button
                  type="button"
                  onClick={
                    closePasswordModal
                  }
                  disabled={
                    resetLoading
                  }
                  className="modal-cancel-button"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={
                    resetLoading
                  }
                  className={`modal-submit-button ${
                    resetLoading
                      ? "is-loading"
                      : ""
                  }`}
                >
                  {resetLoading
                    ? "⏳ Đang xử lý..."
                    : "🔑 Đổi mật khẩu"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  variant,
  icon,
  title,
  value,
  description,
}) {
  return (
    <div
      className={`stat-card stat-card-${variant}`}
    >

      <div className="stat-card-accent" />

      <div className="stat-card-icon">
        {icon}
      </div>

      <div className="stat-card-title">
        {title}
      </div>

      <div className="stat-card-value">
        {value}
      </div>

      <div className="stat-card-description">
        {description}
      </div>

    </div>
  );
}

export default AdminHome;
