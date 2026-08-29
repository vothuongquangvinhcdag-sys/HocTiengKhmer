import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":
    "POST, OPTIONS",
};

function json(
  data: Record<string, unknown>,
  status = 200
) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type":
          "application/json",
      },
    }
  );
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
        error:
          "Chỉ hỗ trợ phương thức POST.",
      },
      405
    );
  }

  try {
    // =====================================================
    // ACCESS TOKEN
    // =====================================================

    const authorization =
      req.headers.get(
        "Authorization"
      );

    if (!authorization) {
      return json(
        {
          error:
            "Bạn chưa đăng nhập.",
        },
        401
      );
    }

    const token = authorization
      .replace(
        /^Bearer\s+/i,
        ""
      )
      .trim();

    if (!token) {
      return json(
        {
          error:
            "Phiên đăng nhập không hợp lệ.",
        },
        401
      );
    }

    // =====================================================
    // ENV
    // =====================================================

    const supabaseUrl =
      Deno.env.get(
        "SUPABASE_URL"
      );

    const supabaseAnonKey =
      Deno.env.get(
        "SUPABASE_ANON_KEY"
      );

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
          error:
            "Thiếu cấu hình Supabase.",
        },
        500
      );
    }

    // =====================================================
    // CLIENT XÁC THỰC ADMIN
    // =====================================================

    const userClient =
      createClient(
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
      await userClient.auth.getUser(
        token
      );

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
    // =====================================================

    const adminClient =
      createClient(
        supabaseUrl,
        supabaseServiceRoleKey
      );

    // =====================================================
    // KIỂM TRA QUYỀN ADMIN
    // =====================================================

    const {
      data: adminProfile,
      error:
        adminProfileError,
    } =
      await adminClient
        .from("profiles")
        .select("id, role")
        .eq("id", adminId)
        .maybeSingle();

    if (
      adminProfileError ||
      !adminProfile ||
      adminProfile.role !==
        "admin"
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
    // ĐỌC BODY
    // =====================================================

    let body: {
      username?: unknown;
      account?: unknown;
      password?: unknown;
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

    // =====================================================
    // ACCOUNT
    // =====================================================

    if (
      typeof body?.account !==
        "string" ||
      !body.account.trim()
    ) {
      return json(
        {
          error:
            "Vui lòng nhập tài khoản.",
        },
        400
      );
    }

    const finalAccount =
      body.account.trim();

    if (
      finalAccount.length < 6
    ) {
      return json(
        {
          error:
            "Tài khoản phải có ít nhất 6 ký tự.",
        },
        400
      );
    }

    // =====================================================
    // PASSWORD
    // =====================================================

    if (
      typeof body?.password !==
        "string" ||
      body.password.length < 6
    ) {
      return json(
        {
          error:
            "Mật khẩu phải có ít nhất 6 ký tự.",
        },
        400
      );
    }

    const password =
      body.password;

    // =====================================================
    // USERNAME
    // =====================================================

    const finalUsername =
      typeof body?.username ===
        "string" &&
      body.username.trim()
        ? body.username.trim()
        : finalAccount;

    // =====================================================
    // EMAIL NỘI BỘ
    // =====================================================

    const internalEmail =
      `${finalAccount}@hoc-tieng-khmer.local`;

    // =====================================================
    // KIỂM TRA ACCOUNT TRONG PROFILES
    //
    // Chỉ ở đây mới trả về:
    // "Tên tài khoản đã tồn tại."
    // =====================================================

    const {
      data: existingProfile,
      error:
        existingProfileError,
    } =
      await adminClient
        .from("profiles")
        .select("id, account")
        .eq(
          "account",
          finalAccount
        )
        .maybeSingle();

    if (existingProfileError) {
      console.error(
        "Check existing account error:",
        existingProfileError
      );

      return json(
        {
          error:
            "Không thể kiểm tra tài khoản.",
        },
        500
      );
    }

    if (existingProfile) {
      return json(
        {
          error:
            "Tên tài khoản đã tồn tại.",
        },
        409
      );
    }

    // =====================================================
    // KIỂM TRA AUTH EMAIL
    // =====================================================

    let existingAuthUser =
      null;

    try {
      const {
        data: authUsers,
        error:
          authListError,
      } =
        await adminClient.auth.admin.listUsers(
          {
            page: 1,
            perPage: 1000,
          }
        );

      if (authListError) {
        console.error(
          "List Auth users error:",
          authListError
        );
      } else {
        existingAuthUser =
          authUsers?.users?.find(
            (user) =>
              user.email?.toLowerCase() ===
              internalEmail.toLowerCase()
          );
      }
    } catch (error) {
      console.error(
        "Check Auth email error:",
        error
      );
    }

    if (existingAuthUser) {
      return json(
        {
          error:
            "Tên tài khoản đã tồn tại.",
        },
        409
      );
    }

    // =====================================================
    // TẠO AUTH USER
    // =====================================================

    const {
      data: createdUserData,
      error:
        createUserError,
    } =
      await adminClient.auth.admin.createUser(
        {
          email:
            internalEmail,

          password,

          email_confirm:
            true,

          user_metadata: {
            username:
              finalUsername,

            account:
              finalAccount,
          },
        }
      );

    if (
      createUserError ||
      !createdUserData?.user
    ) {
      console.error(
        "Create Auth user error:",
        createUserError
      );

      const errorMessage =
        createUserError?.message ||
        "";

      const lowerError =
        errorMessage.toLowerCase();

      // ===================================================
      // CHỈ NHẬN DIỆN DUPLICATE AUTH
      // ===================================================

      if (
        lowerError.includes(
          "already registered"
        ) ||
        lowerError.includes(
          "already exists"
        ) ||
        lowerError.includes(
          "already been registered"
        ) ||
        lowerError.includes(
          "duplicate"
        )
      ) {
        return json(
          {
            error:
              "Tên tài khoản đã tồn tại.",
          },
          409
        );
      }

      return json(
        {
          error:
            errorMessage ||
            "Không thể tạo tài khoản.",
        },
        400
      );
    }

    const newUser =
      createdUserData.user;

    console.log(
      "Auth user created:",
      newUser.id
    );

    // =====================================================
    // ĐỢI TRIGGER PROFILE
    //
    // Supabase có thể tạo profiles
    // thông qua database trigger.
    // =====================================================

    let profileReady =
      false;

    let currentProfile =
      null;

    for (
      let attempt = 0;
      attempt < 5;
      attempt++
    ) {
      const {
        data: foundProfile,
        error:
          findProfileError,
      } =
        await adminClient
          .from("profiles")
          .select(
            "id, username, account, email, role, level, exp, total_study_seconds"
          )
          .eq(
            "id",
            newUser.id
          )
          .maybeSingle();

      if (findProfileError) {
        console.error(
          "Find created profile error:",
          findProfileError
        );
      }

      if (foundProfile) {
        currentProfile =
          foundProfile;

        profileReady = true;

        break;
      }

      // Đợi trigger hoàn thành
      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            300
          )
      );
    }

    // =====================================================
    // NẾU TRIGGER ĐÃ TẠO PROFILE
    //
    // UPDATE PROFILE THAY VÌ INSERT
    // =====================================================

    if (profileReady) {
      console.log(
        "Profile đã được tạo bởi trigger. Cập nhật profile:",
        newUser.id
      );

      const {
        data: updatedProfile,
        error:
          updateProfileError,
      } =
        await adminClient
          .from("profiles")
          .update({
            username:
              finalUsername,

            account:
              finalAccount,

            email:
              internalEmail,

            role:
              "student",

            level:
              currentProfile?.level ??
              1,

            exp:
              currentProfile?.exp ??
              0,

            total_study_seconds:
              currentProfile?.total_study_seconds ??
              0,
          })
          .eq(
            "id",
            newUser.id
          )
          .select(
            "id, username, account, email, role, level, exp, total_study_seconds"
          )
          .single();

      if (
        updateProfileError ||
        !updatedProfile
      ) {
        console.error(
          "Update profile error:",
          updateProfileError
        );

        // Rollback Auth user
        await adminClient.auth.admin.deleteUser(
          newUser.id
        );

        return json(
          {
            error:
              "Không thể cập nhật hồ sơ tài khoản.",
          },
          500
        );
      }

      return json(
        {
          success: true,

          message:
            "Đã tạo tài khoản học sinh thành công.",

          userId:
            newUser.id,

          username:
            updatedProfile.username,

          account:
            updatedProfile.account,

          email:
            updatedProfile.email,

          role:
            updatedProfile.role,

          level:
            updatedProfile.level,

          exp:
            updatedProfile.exp,

          total_study_seconds:
            updatedProfile.total_study_seconds,
        },
        201
      );
    }

    // =====================================================
    // TRƯỜNG HỢP KHÔNG CÓ TRIGGER
    //
    // Tự tạo profile.
    // =====================================================

    console.log(
      "Không tìm thấy profile do trigger. Tự tạo profile:",
      newUser.id
    );

    const {
      data: newProfile,
      error:
        profileInsertError,
    } =
      await adminClient
        .from("profiles")
        .insert({
          id:
            newUser.id,

          username:
            finalUsername,

          account:
            finalAccount,

          email:
            internalEmail,

          role:
            "student",

          level:
            1,

          exp:
            0,

          total_study_seconds:
            0,
        })
        .select(
          "id, username, account, email, role, level, exp, total_study_seconds"
        )
        .single();

    if (
      profileInsertError ||
      !newProfile
    ) {
      console.error(
        "Create profile error:",
        profileInsertError
      );

      // ===================================================
      // KHÔNG ĐƯỢC GỌI LỖI ID DUPLICATE
      // LÀ "TÀI KHOẢN TỒN TẠI"
      // ===================================================

      const errorCode =
        profileInsertError?.code;

      // Nếu vẫn là duplicate ID do race condition,
      // thử đọc profile lại.
      if (
        errorCode ===
        "23505"
      ) {
        const {
          data: raceProfile,
        } =
          await adminClient
            .from("profiles")
            .select(
              "id, username, account, email, role, level, exp, total_study_seconds"
            )
            .eq(
              "id",
              newUser.id
            )
            .maybeSingle();

        if (raceProfile) {
          console.log(
            "Profile vừa được trigger tạo. Sử dụng profile đó."
          );

          return json(
            {
              success: true,

              message:
                "Đã tạo tài khoản học sinh thành công.",

              userId:
                newUser.id,

              username:
                raceProfile.username,

              account:
                raceProfile.account,

              email:
                raceProfile.email,

              role:
                raceProfile.role,

              level:
                raceProfile.level,

              exp:
                raceProfile.exp,

              total_study_seconds:
                raceProfile.total_study_seconds,
            },
            201
          );
        }
      }

      // ===================================================
      // ROLLBACK
      // ===================================================

      const {
        error:
          rollbackError,
      } =
        await adminClient.auth.admin.deleteUser(
          newUser.id
        );

      if (rollbackError) {
        console.error(
          "Rollback Auth user error:",
          rollbackError
        );
      }

      return json(
        {
          error:
            "Không thể tạo hồ sơ tài khoản.",
        },
        500
      );
    }

    // =====================================================
    // THÀNH CÔNG
    // =====================================================

    return json(
      {
        success: true,

        message:
          "Đã tạo tài khoản học sinh thành công.",

        userId:
          newUser.id,

        username:
          newProfile.username,

        account:
          newProfile.account,

        email:
          newProfile.email,

        role:
          newProfile.role,

        level:
          newProfile.level,

        exp:
          newProfile.exp,

        total_study_seconds:
          newProfile.total_study_seconds,
      },
      201
    );
  } catch (error) {
    console.error(
      "admin-create-user error:",
      error
    );

    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi tạo tài khoản.",
      },
      500
    );
  }
});