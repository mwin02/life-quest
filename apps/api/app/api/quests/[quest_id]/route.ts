import { getAuthenticatedUser } from "@/lib/auth";
import { createQuestService } from "@/services/QuestService";

import { NextResponse } from "next/server";

export async function GET(
  request: Request,
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

  const questService = createQuestService(user.id, supabase);

  try {
    const quest = await questService.getQuest(quest_id);
    return NextResponse.json({ success: true, quest });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "Quest not found") {
        return NextResponse.json({ error: "Quest not found" }, { status: 404 });
      }
      if (err.message === "Forbidden") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }
    console.error("Error fetching quest:", err);
    return NextResponse.json(
      { error: "Failed to fetch quest" },
      { status: 500 },
    );
  }
}
