import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "../../supabase";
import "./AdminHome.css";

/* =========================================================
   CẤU HÌNH LEVEL
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

/* =========================================================
   CẤU HÌNH PHÂN TRANG
========================================================= */

const PAGE_SIZE_OPTIONS = [10, 15, 20, 30];

/* =========================================================
   LEVEL TỪ EXP
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
   LẤY SỐ GAME ĐÃ HOÀN THÀNH

   Hỗ trợ:
   - completed_games: 3
   - games_completed: 3
   - game_completed: 3
   - completedGames: 3
   - gamesCompleted: 3

   Hoặc:
   - [1,2,3]
   - ["1","2","3"]

   Hoặc:
   - { 1: true, 2: true, 3: true }
========================================================= */

function getCompletedGameCount(student) {
  if (!student) return 0;

  const possibleValues = [
    student.completed_games,
    student.games_completed,
    student.game_completed,
    student.completedGames,
    student.gamesCompleted,
  ];

  for (const value of possibleValues) {
    if (value === null || value === undefined) {
      continue;
    }

    /* =====================================================
       SỐ
    ===================================================== */

    if (typeof value === "number") {
      return Math.min(
        TOTAL_GAMES,
        Math.max(0, Math.floor(value))
      );
    }

    /* =====================================================
       CHUỖI
    ===================================================== */

    if (
      typeof value === "string" &&
      value.trim() !== ""
    ) {
      const numericValue = Number(value);

      if (Number.isFinite(numericValue)) {
        return Math.min(
          TOTAL_GAMES,
          Math.max(0, Math.floor(numericValue))
        );
      }

      try {
        const parsed = JSON.parse(value);

        if (Array.isArray(parsed)) {
          return Math.min(
            TOTAL_GAMES,
            parsed.length
          );
        }

        if (
          parsed &&
          typeof parsed === "object"
        ) {
          return Math.min(
            TOTAL_GAMES,
            Object.values(parsed).filter(Boolean).length
          );
        }
      } catch {
        // Không phải JSON
      }
    }

    /* =====================================================
       MẢNG
    ===================================================== */

    if (Array.isArray(value)) {
      return Math.min(
        TOTAL_GAMES,
        value.length
      );
    }

    /* =====================================================
       OBJECT
    ===================================================== */

    if (
      typeof value === "object" &&
      value !== null
    ) {
      return Math.min(
        TOTAL_GAMES,
        Object.values(value).filter(Boolean).length
      );
    }
  }

  return 0;
}

/* =========================================================
   FORMAT GAME
========================================================= */

function formatGameProgress(student) {
  const completed =
    getCompletedGameCount(student);

  return `${completed}/${TOTAL_GAMES}`;
}

/* =========================================================
   FORMAT THỜI GIAN
========================================================= */

function formatStudyTime(seconds) {
  const safeSeconds = Math.max(
    0,
    Number(seconds) || 0
  );

  const hours = Math.floor(
    safeSeconds / 3600
  );

  const minutes = Math.floor(
    (safeSeconds % 3600) / 60
  );

  const remainingSeconds =
    safeSeconds % 60;

  if (hours > 0) {
    return `${hours} giờ ${minutes} phút`;
  }

  if (minutes > 0) {
    return `${minutes} phút ${remainingSeconds} giây`;
  }

  return `${remainingSeconds} giây`;
}

/* =========================================================
   ADMIN HOME
========================================================= */

function AdminHome({
  profile,
  navigate,
  onLogout,
}) {
  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [error, setError] =
    useState("");

  /* =======================================================
     PHÂN TRANG
  ======================================================= */

  const [currentPage, setCurrentPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(10);

  /* =======================================================
     ĐỔI MẬT KHẨU
  ======================================================= */

  const [passwordModal, setPasswordModal] =
    useState(false);

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [resetLoading, setResetLoading] =
    useState(false);

  const [resetError, setResetError] =
    useState("");

  const [resetSuccess, setResetSuccess] =
    useState("");

  /* =======================================================
     TẠO TÀI KHOẢN
  ======================================================= */

  const [createModal, setCreateModal] =
    useState(false);

  const [createUsername, setCreateUsername] =
    useState("");

  const [createAccount, setCreateAccount] =
    useState("");

  const [createPassword, setCreatePassword] =
    useState("");

  const [createLoading, setCreateLoading] =
    useState(false);

  const [createError, setCreateError] =
    useState("");

  const [createSuccess, setCreateSuccess] =
    useState("");

  /* =======================================================
     XÓA TÀI KHOẢN
  ======================================================= */

  const [deleteModal, setDeleteModal] =
    useState(false);

  const [deleteStudent, setDeleteStudent] =
    useState(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const [deleteError, setDeleteError] =
    useState("");

  /* =======================================================
     TẢI DANH SÁCH PROFILE
  ======================================================= */

  const loadStudents = async () => {
    setLoading(true);
    setError("");

    const {
      data,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("*")
      .order("exp", {
        ascending: false,
      });

    if (profileError) {
      console.error(
        "Không thể tải profiles:",
        profileError
      );

      setError(
        "Không thể tải danh sách tài khoản."
      );

      setStudents([]);
      setLoading(false);

      return;
    }

    setStudents(data || []);
    setCurrentPage(1);
    setLoading(false);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  /* =======================================================
     CHỈ LẤY HỌC SINH
  ======================================================= */

  const studentList = useMemo(() => {
    return students.filter(
      (student) =>
        student.role === "student"
    );
  }, [students]);

  /* =======================================================
     TÌM KIẾM
  ======================================================= */

  const filteredStudents = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    if (!keyword) {
      return studentList;
    }

    return studentList.filter(
      (student) => {
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
      }
    );
  }, [studentList, search]);

  /* =======================================================
     TỰ ĐỘNG VỀ TRANG 1 KHI TÌM KIẾM
  ======================================================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize]);

  /* =======================================================
     THỐNG KÊ
  ======================================================= */

  const totalStudents =
    studentList.length;

  const totalExp =
    studentList.reduce(
      (total, student) =>
        total +
        Number(student.exp || 0),
      0
    );

  const totalStudySeconds =
    studentList.reduce(
      (total, student) =>
        total +
        Number(
          student.total_study_seconds || 0
        ),
      0
    );

  /* =======================================================
     THỐNG KÊ GAME

     Tổng số game hoàn thành của toàn bộ
     học sinh.
  ======================================================= */

  const totalCompletedGames =
    studentList.reduce(
      (total, student) =>
        total +
        getCompletedGameCount(student),
      0
    );

  /* =======================================================
     PHÂN TRANG DANH SÁCH
  ======================================================= */

  const totalFilteredStudents =
    filteredStudents.length;

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalFilteredStudents /
          pageSize
      )
    );

  /* =======================================================
     ĐẢM BẢO CURRENT PAGE HỢP LỆ
  ======================================================= */

  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  /* =======================================================
     DANH SÁCH ĐANG HIỂN THỊ
  ======================================================= */

  const paginatedStudents =
    useMemo(() => {
      const startIndex =
        (currentPage - 1) *
        pageSize;

      const endIndex =
        startIndex + pageSize;

      return filteredStudents.slice(
        startIndex,
        endIndex
      );
    }, [
      filteredStudents,
      currentPage,
      pageSize,
    ]);

  /* =======================================================
     CHỈ SỐ STT TRANG HIỆN TẠI
  ======================================================= */

  const pageStartIndex =
    totalFilteredStudents === 0
      ? 0
      : (currentPage - 1) *
          pageSize +
        1;

  const pageEndIndex =
    Math.min(
      currentPage * pageSize,
      totalFilteredStudents
    );

  /* =======================================================
     DANH SÁCH SỐ TRANG
  ======================================================= */

  const pageNumbers = useMemo(() => {
    const pages = [];

    if (totalPages <= 7) {
      for (
        let page = 1;
        page <= totalPages;
        page++
      ) {
        pages.push(page);
      }

      return pages;
    }

    pages.push(1);

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
  }, [
    currentPage,
    totalPages,
  ]);

  /* =======================================================
     ĐỌC LỖI EDGE FUNCTION
  ======================================================= */

  const getFunctionErrorMessage =
    async (
      functionError,
      defaultMessage
    ) => {
      let message =
        defaultMessage;

      try {
        if (
          functionError?.context &&
          typeof functionError.context
            .json === "function"
        ) {
          const responseData =
            await functionError.context.json();

          if (
            responseData?.error
          ) {
            message =
              responseData.error;
          }
        }
      } catch {
        // Không đọc được response JSON
      }

      return message;
    };

  /* =======================================================
     MỞ POPUP TẠO TÀI KHOẢN
  ======================================================= */

  const openCreateModal = () => {
    setCreateUsername("");
    setCreateAccount("");
    setCreatePassword("");

    setCreateError("");
    setCreateSuccess("");

    setCreateModal(true);
  };

  /* =======================================================
     ĐÓNG POPUP TẠO TÀI KHOẢN
  ======================================================= */

  const closeCreateModal = () => {
    if (createLoading) return;

    setCreateModal(false);

    setCreateUsername("");
    setCreateAccount("");
    setCreatePassword("");

    setCreateError("");
    setCreateSuccess("");
  };

  /* =======================================================
     TẠO TÀI KHOẢN
  ======================================================= */

  const handleCreateAccount =
    async (event) => {
      event.preventDefault();

      setCreateError("");
      setCreateSuccess("");

      const username =
        createUsername.trim();

      const account =
        createAccount.trim();

      if (!username) {
        setCreateError(
          "Vui lòng nhập tên học sinh."
        );
        return;
      }

      if (!account) {
        setCreateError(
          "Vui lòng nhập tài khoản."
        );
        return;
      }

      if (!createPassword) {
        setCreateError(
          "Vui lòng nhập mật khẩu."
        );
        return;
      }

      if (
        createPassword.length < 6
      ) {
        setCreateError(
          "Mật khẩu phải có ít nhất 6 ký tự."
        );
        return;
      }

      const duplicated =
        students.some(
          (student) =>
            String(
              student.account || ""
            )
              .trim()
              .toLowerCase() ===
            account.toLowerCase()
        );

      if (duplicated) {
        setCreateError(
          "Tài khoản này đã tồn tại."
        );
        return;
      }

      setCreateLoading(true);

      try {
        const {
          data,
          error: functionError,
        } =
          await supabase.functions.invoke(
            "admin-create-user",
            {
              body: {
                username,
                account,
                password:
                  createPassword,
              },
            }
          );

        if (functionError) {
          console.error(
            "Admin create user error:",
            functionError
          );

          const message =
            await getFunctionErrorMessage(
              functionError,
              "Không thể tạo tài khoản."
            );

          throw new Error(
            message
          );
        }

        if (!data?.success) {
          throw new Error(
            data?.error ||
              "Không thể tạo tài khoản."
          );
        }

        setCreateSuccess(
          "Đã tạo tài khoản học sinh thành công."
        );

        setCreateUsername("");
        setCreateAccount("");
        setCreatePassword("");

        await loadStudents();
      } catch (error) {
        console.error(
          "Create account:",
          error
        );

        setCreateError(
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi tạo tài khoản."
        );
      } finally {
        setCreateLoading(false);
      }
    };

  /* =======================================================
     MỞ POPUP XÓA
  ======================================================= */

  const openDeleteModal = (
    student
  ) => {
    if (!student) return;

    if (
      student.id === profile?.id
    ) {
      setError(
        "Không thể xóa tài khoản quản trị viên đang đăng nhập."
      );

      return;
    }

    setDeleteStudent(student);
    setDeleteError("");
    setDeleteModal(true);
  };

  /* =======================================================
     ĐÓNG POPUP XÓA
  ======================================================= */

  const closeDeleteModal = () => {
    if (deleteLoading) return;

    setDeleteModal(false);
    setDeleteStudent(null);
    setDeleteError("");
  };

  /* =======================================================
     XÓA TÀI KHOẢN
  ======================================================= */

  const handleDeleteAccount =
    async () => {
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
        } =
          await supabase.functions.invoke(
            "admin-delete-user",
            {
              body: {
                userId:
                  deleteStudent.id,
              },
            }
          );

        if (functionError) {
          console.error(
            "Admin delete user error:",
            functionError
          );

          const message =
            await getFunctionErrorMessage(
              functionError,
              "Không thể xóa tài khoản."
            );

          throw new Error(
            message
          );
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
      } catch (error) {
        console.error(
          "Delete account:",
          error
        );

        setDeleteError(
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi xóa tài khoản."
        );
      } finally {
        setDeleteLoading(false);
      }
    };

  /* =======================================================
     XUẤT EXCEL

     Luôn xuất TOÀN BỘ studentList,
     không phụ thuộc currentPage.
  ======================================================= */

  const exportExcel = () => {
    if (
      studentList.length === 0
    ) {
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

    const year =
      now.getFullYear();

    const fileName =
      `THONG KE HOC VIEN NGAY ${day}-${month}-${year}.xlsx`;

    /* =====================================================
       XUẤT TOÀN BỘ HỌC SINH
    ===================================================== */

    const exportData =
      studentList.map(
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
            formatGameProgress(
              student
            ),

          "Thời gian học":
            formatStudyTime(
              student.total_study_seconds
            ),

          "Thời gian học (giây)":
            Number(
              student.total_study_seconds ||
                0
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
      { wch: 32 },
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
     MỞ POPUP ĐỔI MẬT KHẨU
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

  /* =======================================================
     ĐÓNG POPUP ĐỔI MẬT KHẨU
  ======================================================= */

  const closePasswordModal = () => {
    if (resetLoading) return;

    setPasswordModal(false);
    setSelectedStudent(null);

    setNewPassword("");
    setConfirmPassword("");

    setResetError("");
    setResetSuccess("");
  };

  /* =======================================================
     RESET MẬT KHẨU
  ======================================================= */

  const handleResetPassword =
    async (event) => {
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
        newPassword.length < 6
      ) {
        setResetError(
          "Mật khẩu phải có ít nhất 6 ký tự."
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
        } =
          await supabase.functions.invoke(
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
            "Admin reset password error:",
            functionError
          );

          const message =
            await getFunctionErrorMessage(
              functionError,
              "Không thể đổi mật khẩu."
            );

          throw new Error(
            message
          );
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
      } catch (error) {
        console.error(
          "Reset password:",
          error
        );

        setResetError(
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi đổi mật khẩu."
        );
      } finally {
        setResetLoading(false);
      }
    };

  /* =======================================================
     KIỂM TRA ADMIN
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
     ADMIN DASHBOARD
  ======================================================= */

  return (
    <div className="admin-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="admin-header">

        <div className="admin-header-inner">

          <div className="admin-brand">

            <div className="admin-brand-title">

              <span className="admin-brand-logo">
                👑
              </span>

              Quản trị hệ thống

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

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="admin-main">

        {/* ===================================================
            TIÊU ĐỀ
        =================================================== */}

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

        {/* ===================================================
            THỐNG KÊ
        =================================================== */}

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

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (

          <div className="admin-error">
            ⚠️ {error}
          </div>

        )}

        {/* ===================================================
            DANH SÁCH HỌC SINH
        =================================================== */}

        <section className="student-list-card">

          <div className="student-list-header">

            <div className="student-list-heading-row">

              <div>

                <div className="student-list-title-row">

                  <div className="student-list-icon">
                    👨‍🎓
                  </div>

                  <h2>
                    Danh sách học viên
                  </h2>

                </div>

                <p className="student-list-description">

                  Có{" "}

                  <strong>
                    {totalStudents}
                  </strong>{" "}

                  tài khoản học viên

                </p>

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

            </div>

            {/* =================================================
                CÔNG CỤ ADMIN
            ================================================= */}

            <div className="admin-toolbar">

              <button
                type="button"
                onClick={
                  openCreateModal
                }
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

            {/* =================================================
                TÌM KIẾM
            ================================================= */}

            <div className="student-search-wrapper">

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="🔎  Tìm học viên, tài khoản hoặc email..."
                className="student-search-input"
              />

            </div>

            {/* =================================================
                ĐIỀU KHIỂN SỐ DÒNG / TRANG
            ================================================= */}

            <div className="student-pagination-top">

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
                            student
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
                                {
                                  student.username
                                }
                              </strong>

                            </td>

                            <td className="student-account">

                              {
                                student.account
                              }

                            </td>

                            <td className="student-email">

                              {
                                student.email ||
                                "—"
                              }

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

                            {/* =================================
                                GAME
                            ================================= */}

                            <td className="student-game text-center">

                              <span
                                className={`student-game-progress ${
                                  completedGames ===
                                  TOTAL_GAMES
                                    ? "game-complete"
                                    : completedGames >
                                      0
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

              {filteredStudents.length ===
                0 && (

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
                  PHÂN TRANG
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

              {createSuccess && (

                <div className="reset-success">
                  ✅ {createSuccess}
                </div>

              )}

              {createError && (

                <div className="reset-error">
                  ⚠️ {createError}
                </div>

              )}

              <label className="password-label">
                Tên học sinh
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
                placeholder="Nhập tên học sinh..."
                disabled={
                  createLoading
                }
                autoComplete="name"
                className="password-input"
              />

              <label className="password-label">
                Tài khoản
              </label>

              <input
                type="text"
                value={
                  createAccount
                }
                onChange={(event) =>
                  setCreateAccount(
                    event.target.value
                  )
                }
                placeholder="Nhập tài khoản..."
                disabled={
                  createLoading
                }
                autoComplete="username"
                className="password-input"
              />

              <label className="password-label">
                Mật khẩu
              </label>

              <input
                type="password"
                value={
                  createPassword
                }
                onChange={(event) =>
                  setCreatePassword(
                    event.target.value
                  )
                }
                placeholder="Nhập mật khẩu..."
                minLength={6}
                disabled={
                  createLoading
                }
                autoComplete="new-password"
                className="password-input"
              />

              <div className="password-help">
                Mật khẩu phải có ít nhất
                6 ký tự. Không cần xác
                nhận mật khẩu.
              </div>

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
                    selectedStudent?.email ||
                    ""}

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
                value={
                  newPassword
                }
                onChange={(event) =>
                  setNewPassword(
                    event.target.value
                  )
                }
                placeholder="Nhập mật khẩu mới..."
                minLength={6}
                disabled={
                  resetLoading
                }
                autoComplete="new-password"
                className="password-input"
              />

              <div className="password-help">
                Mật khẩu phải có ít nhất
                6 ký tự.
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
                minLength={6}
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