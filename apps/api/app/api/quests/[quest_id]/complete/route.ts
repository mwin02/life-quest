import { getAuthenticatedUser } from "@/lib/auth";
import { createQuestService } from "@/services/QuestService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ quest_id: string }> },
) {
  const { quest_id } = await params;
  const { user, supabase, error } = await getAuthenticatedUser(request);
  if (error || !user || !supabase) {
    return NextResponse.json(
      { error: error || "Unauthorized" },
      { status: 401 },
    );
  }
  const questService = await createQuestService(user.id, supabase);
  try {
    await questService.completeQuest(quest_id);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Error && err.message === "Quest already finished") {
      return NextResponse.json({
        success: false,
        error: "Quest already finished",
      });
    }
    console.error("Error completing quest:", err);
    return NextResponse.json(
      { error: "Failed to complete quest" },
      { status: 500 },
    );
  }
}
