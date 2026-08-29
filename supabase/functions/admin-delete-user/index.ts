import { createClient } from "npm:@supabase/supabase-js@2";

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
      console.error(
        "Get current user error:",
        userError
      );

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
      console.error(
        "Admin permission error:",
        adminProfileError
      );

      return json(
        {
          error:
            "Bạn không có quyền Admin.",
        },
        403
      );
    }

    // =====================================================
    // ĐỌC REQUEST BODY
    // =====================================================

    let body: {
      userId?: unknown;
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
            "Chưa chọn tài khoản cần xóa.",
        },
        400
      );
    }

    const targetUserId =
      userId.trim();

    // =====================================================
    // KHÔNG CHO ADMIN TỰ XÓA MÌNH
    // =====================================================

    if (targetUserId === adminId) {
      return json(
        {
          error:
            "Không thể xóa tài khoản quản trị viên đang đăng nhập.",
        },
        403
      );
    }

    // =====================================================
    // TÌM PROFILE CẦN XÓA
    // =====================================================

    const {
      data: targetProfile,
      error: targetProfileError,
    } =
      await adminClient
        .from("profiles")
        .select(
          "id, username, account, email, role"
        )
        .eq("id", targetUserId)
        .maybeSingle();

    if (targetProfileError) {
      console.error(
        "Find target profile error:",
        targetProfileError
      );

      return json(
        {
          error:
            "Không thể tìm tài khoản cần xóa.",
        },
        500
      );
    }

    if (!targetProfile) {
      return json(
        {
          error:
            "Không tìm thấy tài khoản.",
        },
        404
      );
    }

    // =====================================================
    // KHÔNG CHO XÓA ADMIN
    // =====================================================

    if (
      targetProfile.role === "admin"
    ) {
      return json(
        {
          error:
            "Không thể xóa tài khoản Admin.",
        },
        403
      );
    }

    // =====================================================
    // XÓA AUTH USER
    // =====================================================

    const {
      error: deleteAuthError,
    } =
      await adminClient.auth.admin.deleteUser(
        targetUserId
      );

    if (deleteAuthError) {
      console.error(
        "Delete Auth user error:",
        deleteAuthError
      );

      return json(
        {
          error:
            deleteAuthError.message ||
            "Không thể xóa tài khoản.",
        },
        400
      );
    }

    // =====================================================
    // XÓA PROFILE
    // =====================================================

    const {
      error: deleteProfileError,
    } =
      await adminClient
        .from("profiles")
        .delete()
        .eq("id", targetUserId);

    if (deleteProfileError) {
      console.error(
        "Delete profile error:",
        deleteProfileError
      );

      return json(
        {
          success: true,
          warning:
            "Tài khoản Auth đã được xóa nhưng hồ sơ profile chưa xóa hoàn toàn.",
          userId: targetUserId,
          username:
            targetProfile.username,
          account:
            targetProfile.account,
        },
        200
      );
    }

    // =====================================================
    // THÀNH CÔNG
    // =====================================================

    return json({
      success: true,
      message:
        "Đã xóa tài khoản học sinh thành công.",
      userId: targetUserId,
      username:
        targetProfile.username,
      account:
        targetProfile.account,
    });
  } catch (error) {
    console.error(
      "admin-delete-user error:",
      error
    );

    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi xóa tài khoản.",
      },
      500
    );
  }
});