import { createNewClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 },
      );
    }

    const supabase = createNewClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // If email confirmation is enabled in your Supabase dashboard,
    // data.session will be null until the user confirms their email.
    if (!data.session) {
      return NextResponse.json(
        {
          message:
            "Registration successful. Please check your email to confirm your account.",
          user: {
            id: data.user?.id,
            email: data.user?.email,
          },
        },
        { status: 201 },
      );
    }

    // If email confirmation is disabled, a session is returned immediately.
    return NextResponse.json(
      {
        message: "Registration successful.",
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
        },
        user: {
          id: data.user?.id,
          email: data.user?.email,
        },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
