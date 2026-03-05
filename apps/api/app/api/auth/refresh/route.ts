import { NextRequest, NextResponse } from "next/server";
import { createNewClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { refresh_token } = await request.json();

    if (!refresh_token) {
      return NextResponse.json(
        { error: "Refresh token is required." },
        { status: 400 },
      );
    }

    const supabase = createNewClient();

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (!data.session) {
      return NextResponse.json(
        { error: "Unable to refresh session." },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
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
      { status: 200 },
    );
  } catch (err) {
    console.error("Refresh error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
