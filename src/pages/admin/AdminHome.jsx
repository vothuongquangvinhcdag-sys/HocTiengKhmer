import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../supabase";

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
   ADMIN HOME
========================================================= */

function AdminHome({
  profile,
  navigate,
  onLogout,
}) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  /* =======================================================
     ĐỔI MẬT KHẨU
  ======================================================= */

  const [passwordModal, setPasswordModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

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
      .select(
        "id, username, account, email, role, level, exp, total_study_seconds, created_at, updated_at"
      )
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
        const username =
          String(
            student.username || ""
          ).toLowerCase();

        const account =
          String(
            student.account || ""
          ).toLowerCase();

        const email =
          String(
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

  const averageExp =
    totalStudents > 0
      ? Math.round(
          totalExp / totalStudents
        )
      : 0;

  /* =======================================================
     FORMAT THỜI GIAN
  ======================================================= */

  const formatStudyTime = (seconds) => {
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
  };

  /* =======================================================
     MỞ POPUP ĐỔI MẬT KHẨU
  ======================================================= */

  const openPasswordModal = (student) => {
    setSelectedStudent(student);

    setNewPassword("");
    setConfirmPassword("");

    setResetError("");
    setResetSuccess("");

    setPasswordModal(true);
  };

  /* =======================================================
     ĐÓNG POPUP
  ======================================================= */

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

  /* =======================================================
     RESET MẬT KHẨU
  ======================================================= */

  const handleResetPassword = async (event) => {
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

    if (newPassword.length < 6) {
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
              newPassword:
                newPassword,
            },
          }
        );

      if (functionError) {
        console.error(
          "Admin reset password error:",
          functionError
        );

        let message =
          "Không thể đổi mật khẩu.";

        try {
          if (
            functionError.context &&
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
          // Bỏ qua lỗi đọc response
        }

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
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f1f5f9",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            padding: "45px",
            borderRadius: "22px",
            textAlign: "center",
            boxShadow:
              "0 15px 40px rgba(15,23,42,0.12)",
            border:
              "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              fontSize: "55px",
              marginBottom: "15px",
            }}
          >
            🚫
          </div>

          <h2
            style={{
              margin:
                "0 0 10px",
              color: "#111827",
            }}
          >
            Không có quyền truy cập
          </h2>

          <p
            style={{
              color: "#64748b",
              marginBottom: "25px",
            }}
          >
            Tài khoản của bạn không
            có quyền quản trị hệ thống.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/student")
            }
            style={
              buttonPrimaryStyle
            }
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
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#111827",
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <header
        style={{
          background:
            "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
          color: "#ffffff",
          padding:
            "24px 40px",
          boxShadow:
            "0 5px 20px rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            maxWidth: "1500px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: "25px",
            flexWrap: "wrap",
          }}
        >
          {/* LOGO */}

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                fontSize: "30px",
                fontWeight: "900",
                letterSpacing:
                  "-0.5px",
              }}
            >
              <span
                style={{
                  width: "54px",
                  height: "54px",
                  borderRadius: "15px",
                  background:
                    "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  fontSize: "28px",
                  boxShadow:
                    "0 7px 20px rgba(37,99,235,0.35)",
                }}
              >
                👑
              </span>

              Quản trị hệ thống
            </div>

            <div
              style={{
                marginTop: "8px",
                marginLeft: "68px",
                color: "#cbd5e1",
                fontSize: "15px",
              }}
            >
              Xin chào{" "}
              <strong
                style={{
                  color: "#ffffff",
                }}
              >
                {profile.username}
              </strong>{" "}
              — Học Tiếng Khmer
            </div>
          </div>

          {/* =================================================
              NÚT HEADER
          ================================================= */}

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {/* TRANG CHỦ - ĐÃ LÀM SÁNG HƠN */}

            <button
              type="button"
              onClick={() =>
                navigate("/student")
              }
              style={
                buttonHomeStyle
              }
              onMouseEnter={(event) => {
                Object.assign(
                  event.currentTarget.style,
                  buttonHomeHoverStyle
                );
              }}
              onMouseLeave={(event) => {
                Object.assign(
                  event.currentTarget.style,
                  buttonHomeStyle
                );
              }}
            >
              🏠 Trang chủ
            </button>

            {/* LÀM MỚI */}

            <button
              type="button"
              onClick={
                loadStudents
              }
              style={
                buttonRefreshStyle
              }
            >
              🔄 Làm mới
            </button>

            {/* ĐĂNG XUẤT */}

            <button
              type="button"
              onClick={onLogout}
              style={
                buttonLogoutStyle
              }
            >
              🚪 Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

      <main
        style={{
          width: "100%",
          maxWidth: "1500px",
          margin: "0 auto",
          padding:
            "38px 30px 60px",
          boxSizing: "border-box",
        }}
      >
        {/* TIÊU ĐỀ */}

        <div
          style={{
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              padding:
                "6px 11px",
              borderRadius: "8px",
              background: "#e0e7ff",
              color: "#3730a3",
              fontSize: "12px",
              fontWeight: "900",
              letterSpacing: "1px",
            }}
          >
            ADMIN DASHBOARD
          </div>

          <h1
            style={{
              margin:
                "12px 0 5px",
              fontSize: "32px",
              fontWeight: "900",
              color: "#111827",
            }}
          >
            Tổng quan hệ thống
          </h1>

          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "15px",
            }}
          >
            Theo dõi tình hình học tập
            và tài khoản học sinh.
          </p>
        </div>

        {/* =================================================
            THỐNG KÊ
        ================================================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "18px",
            marginBottom: "30px",
          }}
        >
          <StatCard
            icon="👨‍🎓"
            title="Học sinh"
            value={totalStudents}
            description="Tài khoản học sinh"
            iconBackground="#dbeafe"
            iconColor="#2563eb"
            accent="#2563eb"
          />

          <StatCard
            icon="⭐"
            title="Tổng EXP"
            value={totalExp.toLocaleString(
              "vi-VN"
            )}
            description="EXP toàn bộ học sinh"
            iconBackground="#fef3c7"
            iconColor="#d97706"
            accent="#f59e0b"
          />

          <StatCard
            icon="🏆"
            title="EXP trung bình"
            value={averageExp.toLocaleString(
              "vi-VN"
            )}
            description="EXP trung bình mỗi học sinh"
            iconBackground="#ede9fe"
            iconColor="#7c3aed"
            accent="#8b5cf6"
          />

          <StatCard
            icon="⏱️"
            title="Tổng thời gian"
            value={formatStudyTime(
              totalStudySeconds
            )}
            description="Thời gian học tích lũy"
            iconBackground="#dcfce7"
            iconColor="#16a34a"
            accent="#22c55e"
          />
        </div>

        {/* ERROR */}

        {error && (
          <div
            style={{
              background: "#fef2f2",
              border:
                "1px solid #fecaca",
              color: "#991b1b",
              padding:
                "16px 18px",
              borderRadius: "14px",
              marginBottom: "20px",
              fontWeight: "700",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* =================================================
            DANH SÁCH HỌC SINH
        ================================================= */}

        <section
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            overflow: "hidden",
            border:
              "1px solid #e2e8f0",
            boxShadow:
              "0 10px 30px rgba(15,23,42,0.07)",
          }}
        >
          {/* TITLE */}

          <div
            style={{
              padding:
                "27px 28px",
              borderBottom:
                "1px solid #e5e7eb",
              background:
                "linear-gradient(to bottom, #ffffff, #f8fafc)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "space-between",
                gap: "15px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "11px",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "13px",
                      background:
                        "#dbeafe",
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      fontSize: "22px",
                    }}
                  >
                    👨‍🎓
                  </div>

                  <h2
                    style={{
                      margin: 0,
                      color: "#111827",
                      fontSize: "23px",
                      fontWeight: "900",
                    }}
                  >
                    Danh sách học sinh
                  </h2>
                </div>

                <p
                  style={{
                    margin:
                      "9px 0 0 55px",
                    color: "#64748b",
                    fontSize: "14px",
                  }}
                >
                  Có{" "}
                  <strong
                    style={{
                      color: "#2563eb",
                    }}
                  >
                    {totalStudents}
                  </strong>{" "}
                  tài khoản học sinh
                </p>
              </div>

              <div
                style={{
                  padding:
                    "9px 14px",
                  borderRadius: "10px",
                  background:
                    "#eff6ff",
                  color: "#1d4ed8",
                  fontSize: "14px",
                  fontWeight: "800",
                  border:
                    "1px solid #dbeafe",
                }}
              >
                Hiển thị{" "}
                {filteredStudents.length}
                /
                {totalStudents}
              </div>
            </div>

            {/* SEARCH */}

            <div
              style={{
                marginTop: "20px",
              }}
            >
              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="🔎  Tìm học sinh, tài khoản hoặc email..."
                style={{
                  width: "100%",
                  padding:
                    "15px 18px",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius: "12px",
                  fontSize: "15px",
                  outline: "none",
                  boxSizing:
                    "border-box",
                  fontFamily:
                    "inherit",
                  color: "#111827",
                  background:
                    "#ffffff",
                  boxShadow:
                    "0 2px 5px rgba(15,23,42,0.04)",
                }}
              />
            </div>
          </div>

          {/* LOADING */}

          {loading ? (
            <div
              style={{
                padding:
                  "70px 20px",
                textAlign:
                  "center",
                color: "#64748b",
                fontWeight: "700",
                fontSize: "16px",
              }}
            >
              <div
                style={{
                  fontSize: "35px",
                  marginBottom:
                    "10px",
                }}
              >
                ⏳
              </div>

              Đang tải danh sách
              học sinh...
            </div>
          ) : (
            <>
              {/* TABLE */}

              <div
                style={{
                  width: "100%",
                  overflowX:
                    "auto",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    minWidth:
                      "1200px",
                    borderCollapse:
                      "collapse",
                    tableLayout:
                      "auto",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background:
                          "#f8fafc",
                      }}
                    >
                      <th
                        style={
                          thStyle
                        }
                      >
                        STT
                      </th>

                      <th
                        style={
                          thStyle
                        }
                      >
                        Học sinh
                      </th>

                      <th
                        style={
                          thStyle
                        }
                      >
                        Tài khoản
                      </th>

                      <th
                        style={
                          thStyle
                        }
                      >
                        Email
                      </th>

                      <th
                        style={{
                          ...thStyle,
                          textAlign:
                            "center",
                        }}
                      >
                        Level
                      </th>

                      <th
                        style={{
                          ...thStyle,
                          textAlign:
                            "right",
                        }}
                      >
                        EXP
                      </th>

                      <th
                        style={{
                          ...thStyle,
                          textAlign:
                            "right",
                        }}
                      >
                        Thời gian học
                      </th>

                      <th
                        style={{
                          ...thStyle,
                          textAlign:
                            "center",
                        }}
                      >
                        Thao tác
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredStudents.map(
                      (
                        student,
                        index
                      ) => (
                        <tr
                          key={
                            student.id
                          }
                          style={{
                            borderTop:
                              "1px solid #e5e7eb",
                          }}
                        >
                          <td
                            style={
                              tdStyle
                            }
                          >
                            <span
                              style={{
                                color:
                                  "#64748b",
                                fontWeight:
                                  "800",
                              }}
                            >
                              {index + 1}
                            </span>
                          </td>

                          <td
                            style={
                              tdStyle
                            }
                          >
                            <strong
                              style={{
                                color:
                                  "#111827",
                                fontSize:
                                  "15px",
                              }}
                            >
                              {
                                student.username
                              }
                            </strong>
                          </td>

                          <td
                            style={{
                              ...tdStyle,
                              color:
                                "#475569",
                            }}
                          >
                            {
                              student.account
                            }
                          </td>

                          <td
                            style={{
                              ...tdStyle,
                              color:
                                "#475569",
                            }}
                          >
                            {
                              student.email ||
                              "—"
                            }
                          </td>

                          <td
                            style={{
                              ...tdStyle,
                              textAlign:
                                "center",
                            }}
                          >
                            <span
                              style={{
                                display:
                                  "inline-block",
                                padding:
                                  "6px 12px",
                                borderRadius:
                                  "999px",
                                background:
                                  "#fef3c7",
                                color:
                                  "#92400e",
                                fontWeight:
                                  "900",
                                fontSize:
                                  "13px",
                                border:
                                  "1px solid #fde68a",
                              }}
                            >
                              Lv.{" "}
                              {getLevelFromExp(
                                student.exp
                              )}
                            </span>
                          </td>

                          <td
                            style={{
                              ...tdStyle,
                              textAlign:
                                "right",
                              fontWeight:
                                "900",
                              color:
                                "#b45309",
                              fontSize:
                                "15px",
                            }}
                          >
                            ⭐{" "}
                            {Number(
                              student.exp ||
                                0
                            ).toLocaleString(
                              "vi-VN"
                            )}
                          </td>

                          <td
                            style={{
                              ...tdStyle,
                              textAlign:
                                "right",
                              fontWeight:
                                "700",
                              color:
                                "#15803d",
                            }}
                          >
                            ⏱️{" "}
                            {formatStudyTime(
                              student.total_study_seconds
                            )}
                          </td>

                          <td
                            style={{
                              ...tdStyle,
                              textAlign:
                                "center",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                openPasswordModal(
                                  student
                                )
                              }
                              style={
                                buttonPasswordStyle
                              }
                            >
                              🔑 Đổi mật khẩu
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* EMPTY */}

              {filteredStudents.length ===
                0 && (
                <div
                  style={{
                    padding:
                      "65px 20px",
                    textAlign:
                      "center",
                    color:
                      "#64748b",
                    fontSize:
                      "15px",
                  }}
                >
                  <div
                    style={{
                      fontSize:
                        "42px",
                      marginBottom:
                        "10px",
                    }}
                  >
                    🔎
                  </div>

                  <strong
                    style={{
                      color:
                        "#334155",
                    }}
                  >
                    Không tìm thấy học sinh
                  </strong>

                  <div
                    style={{
                      marginTop:
                        "5px",
                    }}
                  >
                    Hãy thử lại với từ khóa khác.
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* =================================================
          POPUP ĐỔI MẬT KHẨU
      ================================================= */}

      {passwordModal && (
        <div
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closePasswordModal();
            }
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background:
              "rgba(15,23,42,0.62)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            boxSizing:
              "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "500px",
              background: "#ffffff",
              borderRadius: "22px",
              boxShadow:
                "0 25px 70px rgba(0,0,0,0.30)",
              overflow: "hidden",
            }}
          >
            {/* MODAL HEADER */}

            <div
              style={{
                background:
                  "linear-gradient(135deg, #111827, #1f2937)",
                color: "#ffffff",
                padding:
                  "22px 25px",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "space-between",
                gap: "15px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize:
                      "20px",
                    fontWeight:
                      "900",
                  }}
                >
                  🔑 Đổi mật khẩu
                </div>

                <div
                  style={{
                    marginTop:
                      "5px",
                    color:
                      "#cbd5e1",
                    fontSize:
                      "13px",
                  }}
                >
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
                style={{
                  width: "38px",
                  height: "38px",
                  border: "none",
                  borderRadius:
                    "10px",
                  background:
                    "rgba(255,255,255,0.10)",
                  color:
                    "#ffffff",
                  fontSize:
                    "22px",
                  cursor:
                    resetLoading
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                ×
              </button>
            </div>

            {/* MODAL BODY */}

            <form
              onSubmit={
                handleResetPassword
              }
              style={{
                padding: "27px",
              }}
            >
              {/* USER */}

              <div
                style={{
                  background:
                    "#f8fafc",
                  border:
                    "1px solid #e2e8f0",
                  borderRadius:
                    "14px",
                  padding:
                    "15px 17px",
                  marginBottom:
                    "20px",
                }}
              >
                <div
                  style={{
                    fontSize:
                      "12px",
                    fontWeight:
                      "800",
                    color:
                      "#64748b",
                    textTransform:
                      "uppercase",
                    letterSpacing:
                      "0.5px",
                  }}
                >
                  Tài khoản học sinh
                </div>

                <div
                  style={{
                    marginTop:
                      "5px",
                    fontSize:
                      "17px",
                    fontWeight:
                      "900",
                    color:
                      "#111827",
                  }}
                >
                  👨‍🎓{" "}
                  {selectedStudent?.username ||
                    "—"}
                </div>

                <div
                  style={{
                    marginTop:
                      "3px",
                    fontSize:
                      "13px",
                    color:
                      "#64748b",
                  }}
                >
                  {selectedStudent?.account ||
                    selectedStudent?.email ||
                    ""}
                </div>
              </div>

              {/* SUCCESS */}

              {resetSuccess && (
                <div
                  style={{
                    background:
                      "#f0fdf4",
                    border:
                      "1px solid #bbf7d0",
                    color:
                      "#166534",
                    padding:
                      "13px 15px",
                    borderRadius:
                      "12px",
                    marginBottom:
                      "17px",
                    fontWeight:
                      "700",
                    fontSize:
                      "14px",
                  }}
                >
                  ✅ {resetSuccess}
                </div>
              )}

              {/* ERROR */}

              {resetError && (
                <div
                  style={{
                    background:
                      "#fef2f2",
                    border:
                      "1px solid #fecaca",
                    color:
                      "#991b1b",
                    padding:
                      "13px 15px",
                    borderRadius:
                      "12px",
                    marginBottom:
                      "17px",
                    fontWeight:
                      "700",
                    fontSize:
                      "14px",
                  }}
                >
                  ⚠️ {resetError}
                </div>
              )}

              {/* PASSWORD */}

              <label
                style={{
                  display:
                    "block",
                  marginBottom:
                    "7px",
                  color:
                    "#334155",
                  fontSize:
                    "14px",
                  fontWeight:
                    "800",
                }}
              >
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
                style={
                  inputStyle
                }
              />

              <div
                style={{
                  marginTop:
                    "7px",
                  marginBottom:
                    "18px",
                  color:
                    "#94a3b8",
                  fontSize:
                    "12px",
                }}
              >
                Mật khẩu phải có ít nhất
                6 ký tự.
              </div>

              {/* CONFIRM */}

              <label
                style={{
                  display:
                    "block",
                  marginBottom:
                    "7px",
                  color:
                    "#334155",
                  fontSize:
                    "14px",
                  fontWeight:
                    "800",
                }}
              >
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
                style={
                  inputStyle
                }
              />

              {/* BUTTONS */}

              <div
                style={{
                  display: "flex",
                  gap: "11px",
                  marginTop:
                    "25px",
                }}
              >
                <button
                  type="button"
                  onClick={
                    closePasswordModal
                  }
                  disabled={
                    resetLoading
                  }
                  style={{
                    flex: 1,
                    padding:
                      "14px 18px",
                    border:
                      "1px solid #cbd5e1",
                    borderRadius:
                      "12px",
                    background:
                      "#ffffff",
                    color:
                      "#475569",
                    fontWeight:
                      "800",
                    fontSize:
                      "14px",
                    cursor:
                      resetLoading
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={
                    resetLoading
                  }
                  style={{
                    flex: 1.4,
                    padding:
                      "14px 18px",
                    border: "none",
                    borderRadius:
                      "12px",
                    background:
                      resetLoading
                        ? "#94a3b8"
                        : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    color:
                      "#ffffff",
                    fontWeight:
                      "900",
                    fontSize:
                      "14px",
                    cursor:
                      resetLoading
                        ? "not-allowed"
                        : "pointer",
                    boxShadow:
                      "0 5px 15px rgba(37,99,235,0.25)",
                  }}
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
  icon,
  title,
  value,
  description,
  iconBackground,
  iconColor,
  accent,
}) {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#ffffff",
        borderRadius: "18px",
        padding: "23px",
        border:
          "1px solid #e2e8f0",
        boxShadow:
          "0 8px 25px rgba(15,23,42,0.06)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: accent,
        }}
      />

      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "15px",
          background:
            iconBackground,
          color: iconColor,
          display: "flex",
          alignItems: "center",
          justifyContent:
            "center",
          fontSize: "27px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          marginTop: "15px",
          color: "#64748b",
          fontSize: "14px",
          fontWeight: "800",
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: "4px",
          color: "#111827",
          fontSize: "28px",
          fontWeight: "900",
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: "5px",
          color: "#94a3b8",
          fontSize: "13px",
        }}
      >
        {description}
      </div>
    </div>
  );
}

/* =========================================================
   TABLE STYLE
========================================================= */

const thStyle = {
  padding: "16px 14px",
  textAlign: "left",
  fontSize: "13px",
  color: "#475569",
  fontWeight: "900",
  whiteSpace: "nowrap",
  textTransform: "uppercase",
  letterSpacing: "0.3px",
};

const tdStyle = {
  padding: "16px 14px",
  fontSize: "14px",
  color: "#334155",
  whiteSpace: "nowrap",
};

/* =========================================================
   INPUT STYLE
========================================================= */

const inputStyle = {
  width: "100%",
  padding: "14px 15px",
  border:
    "1px solid #cbd5e1",
  borderRadius: "11px",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  color: "#111827",
  background: "#ffffff",
};

/* =========================================================
   BUTTON STYLE
========================================================= */

/* NÚT TRANG CHỦ - SÁNG HƠN */

const buttonHomeStyle = {
  padding: "15px 23px",
  border:
    "1px solid rgba(255,255,255,0.28)",
  borderRadius: "12px",
  background:
    "linear-gradient(135deg, #3b82f6, #2563eb)",
  color: "#ffffff",
  fontWeight: "900",
  fontSize: "15px",
  cursor: "pointer",
  fontFamily: "inherit",
  minHeight: "50px",
  boxShadow:
    "0 6px 18px rgba(37,99,235,0.35)",
  transition:
    "all 0.2s ease",
};

const buttonHomeHoverStyle = {
  background:
    "linear-gradient(135deg, #60a5fa, #3b82f6)",
  transform:
    "translateY(-2px)",
  boxShadow:
    "0 9px 24px rgba(37,99,235,0.48)",
};

/* LÀM MỚI */

const buttonRefreshStyle = {
  padding: "15px 23px",
  border: "none",
  borderRadius: "12px",
  background:
    "linear-gradient(135deg, #ffffff, #f1f5f9)",
  color: "#1d4ed8",
  fontWeight: "900",
  fontSize: "15px",
  cursor: "pointer",
  fontFamily: "inherit",
  minHeight: "50px",
  boxShadow:
    "0 5px 15px rgba(0,0,0,0.18)",
};

/* ĐĂNG XUẤT */

const buttonLogoutStyle = {
  padding: "15px 23px",
  border: "none",
  borderRadius: "12px",
  background:
    "linear-gradient(135deg, #dc2626, #b91c1c)",
  color: "#ffffff",
  fontWeight: "900",
  fontSize: "15px",
  cursor: "pointer",
  fontFamily: "inherit",
  minHeight: "50px",
  boxShadow:
    "0 5px 15px rgba(127,29,29,0.25)",
};

/* ĐỔI MẬT KHẨU */

const buttonPasswordStyle = {
  padding: "9px 13px",
  border:
    "1px solid #bfdbfe",
  borderRadius: "9px",
  background: "#eff6ff",
  color: "#1d4ed8",
  fontWeight: "900",
  fontSize: "13px",
  cursor: "pointer",
  fontFamily: "inherit",
  whiteSpace: "nowrap",
};

/* NÚT VỀ TRANG HỌC */

const buttonPrimaryStyle = {
  padding: "13px 22px",
  border: "none",
  borderRadius: "11px",
  background:
    "linear-gradient(135deg, #2563eb, #1d4ed8)",
  color: "#ffffff",
  fontWeight: "800",
  fontSize: "15px",
  cursor: "pointer",
  fontFamily: "inherit",
};

export default AdminHome;
