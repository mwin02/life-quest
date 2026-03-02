import { getAuthenticatedUser } from "@/lib/auth";
import { createQuestService } from "@/services/QuestService";
import { isIQuestInsert } from "@/types/IQuest";
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
  const questService = createQuestService(user.id, supabase);
  try {
    const quests = await questService.getMyQuests();
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
      quests,
    });
  } catch (err) {
    console.error("Error fetching quests:", err);
    return NextResponse.json(
      { error: "Failed to fetch quests" },
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
  const questService = createQuestService(user.id, supabase);

  try {
    const body = await request.json();
    isIQuestInsert(body);
    const newQuest = await questService.createQuest(body);

    return NextResponse.json({ success: true, quest: newQuest });
  } catch (err) {
    console.error("Error creating quest:", err);
    return NextResponse.json(
      {
        error: `Failed to create quest: ${err instanceof Error ? err.message : "Unknown error"}`,
      },
      { status: 500 },
    );
  }
}
