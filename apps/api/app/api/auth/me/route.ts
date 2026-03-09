import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { createUserService } from "@/services/UserService";

export async function GET(request: NextRequest) {
  const { user, supabase, error } = await getAuthenticatedUser(request);
  if (error || !user || !supabase) {
    return NextResponse.json(
      { error: error || "Unauthorized" },
      { status: 401 },
    );
  }
  const userService = createUserService(user.id, supabase);
  const userProfile = await userService.getMyProfile();
  return NextResponse.json({
    user: {
      ...userProfile,
    },
  });
}
