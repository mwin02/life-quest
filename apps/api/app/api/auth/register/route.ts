import { createAdminClient } from "@/lib/supabase/server";
import { validatePassword } from "@/lib/util";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const adminClient = createAdminClient();
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

    const { data, error } = await adminClient.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true, // Automatically confirm the email for testing purposes
      user_metadata: {
        name: body.name,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ id: data.user.id }, { status: 201 });
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
