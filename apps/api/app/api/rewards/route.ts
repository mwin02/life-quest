import { getAuthenticatedUser } from "@/lib/auth";
import { createRewardService } from "@/services/RewardService";
import { isIRewardInsert } from "@/types/IReward";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Authenticate the user — this also gives us a Supabase client
  // that is scoped to the user's token, so RLS policies apply.
  const { user, supabase, error } = await getAuthenticatedUser(request);
  if (error || !user || !supabase) {
    return NextResponse.json(
      { error: error || "Unauthorized" },
      { status: 401 },
    );
  }
  const rewardService = createRewardService(user.id, supabase);
  try {
    const rewards = await rewardService.getMyRewards();
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
      rewards,
    });
  } catch (err) {
    console.error("Error fetching rewards:", err);
    return NextResponse.json(
      { error: "Failed to fetch rewards" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const { user, supabase, error } = await getAuthenticatedUser(request);
  if (error || !user || !supabase) {
    return NextResponse.json(
      { error: error || "Unauthorized" },
      { status: 401 },
    );
  }
  const rewardService = createRewardService(user.id, supabase);

  try {
    const body = await request.json();
    isIRewardInsert(body);
    const newReward = await rewardService.createReward(body);

    return NextResponse.json({ success: true, reward: newReward });
  } catch (err) {
    console.error("Error creating reward:", err);
    return NextResponse.json(
      {
        error: `Failed to create reward: ${err instanceof Error ? err.message : "Unknown error"}`,
      },
      { status: 500 },
    );
  }
}
