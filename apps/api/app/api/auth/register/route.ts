import { createAdminClient, createNewClient } from "@/lib/supabase/server";
import { validatePassword } from "@/lib/util";
import { createUserService } from "@/services/UserService";
import { NextRequest, NextResponse } from "next/server";

// Set REQUIRE_EMAIL_CONFIRM=true in production to require email verification.
// Leave unset (or any other value) for testing — users are confirmed immediately.
const EMAIL_CONFIRM_REQUIRED = process.env.REQUIRE_EMAIL_CONFIRM === "true";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.email || !body.password || !body.name) {
      return NextResponse.json(
        { error: "Email, password, and name are required." },
        { status: 400 },
      );
    }

    const { valid, errors } = validatePassword(body.password);
    if (!valid) {
      return NextResponse.json(
        { error: `Invalid Password. ${errors.join(", ")}` },
        { status: 400 },
      );
    }

    const adminClient = createAdminClient();

    const { data, error } = await adminClient.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: !EMAIL_CONFIRM_REQUIRED,
      user_metadata: { name: body.name },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Fetch the profile created by the DB trigger.
    const userService = createUserService(data.user.id, adminClient);
    const userProfile = await userService.getMyProfile();

    // In testing mode (no email confirm), sign in immediately to issue a session.
    if (!EMAIL_CONFIRM_REQUIRED) {
      const anonClient = createNewClient();
      const { data: signInData, error: signInError } =
        await anonClient.auth.signInWithPassword({
          email: body.email,
          password: body.password,
        });

      if (!signInError && signInData.session) {
        return NextResponse.json(
          {
            user: userProfile,
            session: {
              access_token: signInData.session.access_token,
              refresh_token: signInData.session.refresh_token,
              expires_at: signInData.session.expires_at,
            },
          },
          { status: 201 },
        );
      }
    }

    // Email confirmation required (or sign-in failed) — return user without session.
    return NextResponse.json({ user: userProfile }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 400 },
      );
    }
  }
}
