import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(
  data: Record<string, unknown>,
  status = 200
) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

Deno.serve(async (req: Request) => {
  // =====================================================
  // CORS
  // =====================================================

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  // =====================================================
  // CHỈ CHO PHÉP POST
  // =====================================================

  if (req.method !== "POST") {
    return json(
      {
        error: "Chỉ hỗ trợ phương thức POST.",
      },
      405
    );
  }

  try {
    // =====================================================
    // LẤY ACCESS TOKEN
    // =====================================================

    const authorization =
      req.headers.get("Authorization");

    if (!authorization) {
      return json(
        {
          error: "Bạn chưa đăng nhập.",
        },
        401
      );
    }

    const token = authorization
      .replace(/^Bearer\s+/i, "")
      .trim();

    if (!token) {
      return json(
        {
          error: "Phiên đăng nhập không hợp lệ.",
        },
        401
      );
    }

    // =====================================================
    // SUPABASE ENVIRONMENT
    // =====================================================

    const supabaseUrl =
      Deno.env.get("SUPABASE_URL");

    const supabaseAnonKey =
      Deno.env.get("SUPABASE_ANON_KEY");

    const supabaseServiceRoleKey =
      Deno.env.get(
        "SUPABASE_SERVICE_ROLE_KEY"
      );

    if (
      !supabaseUrl ||
      !supabaseAnonKey ||
      !supabaseServiceRoleKey
    ) {
      console.error(
        "Thiếu biến môi trường Supabase."
      );

      return json(
        {
          error: "Thiếu cấu hình Supabase.",
        },
        500
      );
    }

    // =====================================================
    // CLIENT XÁC THỰC ADMIN
    // =====================================================

    const userClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        },
      }
    );

    const {
      data: userData,
      error: userError,
    } =
      await userClient.auth.getUser(token);

    if (
      userError ||
      !userData?.user
    ) {
      return json(
        {
          error:
            "Phiên đăng nhập đã hết hạn.",
        },
        401
      );
    }

    const adminId =
      userData.user.id;

    // =====================================================
    // ADMIN CLIENT
    // SERVICE ROLE CHỈ DÙNG SERVER-SIDE
    // =====================================================

    const adminClient = createClient(
      supabaseUrl,
      supabaseServiceRoleKey
    );

    // =====================================================
    // KIỂM TRA QUYỀN ADMIN
    // =====================================================

    const {
      data: adminProfile,
      error: adminProfileError,
    } =
      await adminClient
        .from("profiles")
        .select("id, role")
        .eq("id", adminId)
        .maybeSingle();

    if (
      adminProfileError ||
      !adminProfile ||
      adminProfile.role !== "admin"
    ) {
      return json(
        {
          error:
            "Bạn không có quyền Admin.",
        },
        403
      );
    }

    // =====================================================
    // ĐỌC DỮ LIỆU REQUEST
    // =====================================================

    let body: {
      userId?: unknown;
      newPassword?: unknown;
    };

    try {
      body = await req.json();
    } catch {
      return json(
        {
          error:
            "Dữ liệu gửi lên không hợp lệ.",
        },
        400
      );
    }

    const userId = body?.userId;
    const newPassword =
      body?.newPassword;

    // =====================================================
    // KIỂM TRA USER ID
    // =====================================================

    if (
      typeof userId !== "string" ||
      !userId.trim()
    ) {
      return json(
        {
          error:
            "Chưa chọn tài khoản học sinh.",
        },
        400
      );
    }

    // =====================================================
    // KIỂM TRA MẬT KHẨU
    // =====================================================

    if (
      typeof newPassword !== "string" ||
      newPassword.length < 6
    ) {
      return json(
        {
          error:
            "Mật khẩu phải có ít nhất 6 ký tự.",
        },
        400
      );
    }

    // =====================================================
    // TÌM TÀI KHOẢN
    // =====================================================

    const {
      data: targetUser,
      error: targetUserError,
    } =
      await adminClient
        .from("profiles")
        .select(
          "id, username, account, email, role"
        )
        .eq("id", userId)
        .maybeSingle();

    if (
      targetUserError ||
      !targetUser
    ) {
      console.error(
        "Không tìm thấy profile:",
        targetUserError
      );

      return json(
        {
          error:
            "Không tìm thấy tài khoản.",
        },
        404
      );
    }

    // =====================================================
    // KHÔNG CHO RESET ADMIN
    // =====================================================

    if (
      targetUser.role === "admin"
    ) {
      return json(
        {
          error:
            "Không thể reset mật khẩu tài khoản Admin.",
        },
        403
      );
    }

    // =====================================================
    // RESET PASSWORD
    // =====================================================

    const {
      error: resetError,
    } =
      await adminClient.auth.admin.updateUserById(
        targetUser.id,
        {
          password: newPassword,
        }
      );

    if (resetError) {
      console.error(
        "Reset password error:",
        resetError
      );

      return json(
        {
          error:
            resetError.message ||
            "Không thể reset mật khẩu.",
        },
        400
      );
    }

    // =====================================================
    // THÀNH CÔNG
    // =====================================================

    return json({
      success: true,
      message:
        "Đã reset mật khẩu thành công.",
      userId: targetUser.id,
      username:
        targetUser.username,
    });
  } catch (error) {
    console.error(
      "admin-reset-password error:",
      error
    );

    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra.",
      },
      500
    );
  }
});