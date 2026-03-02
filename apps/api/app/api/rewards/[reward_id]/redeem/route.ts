import { getAuthenticatedUser } from "@/lib/auth";
import { createRewardService } from "@/services/RewardService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reward_id: string }> },
) {
  const { reward_id } = await params;
  const { user, supabase, error } = await getAuthenticatedUser(request);
  if (error || !user || !supabase) {
    return NextResponse.json(
      { error: error || "Unauthorized" },
      { status: 401 },
    );
  }
  const rewardService = await createRewardService(user.id, supabase);
  try {
    await rewardService.redeemReward(reward_id);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Error && err.message === "Reward already redeemed") {
      return NextResponse.json({
        success: false,
        error: "Reward already redeemed",
      });
    }
    console.error("Error redeeming reward:", err);
    return NextResponse.json(
      { error: "Failed to redeem reward" },
      { status: 500 },
    );
  }
}
