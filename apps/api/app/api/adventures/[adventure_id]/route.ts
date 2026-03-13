import { getAuthenticatedUser } from "@/lib/auth";
import { createAdventureService } from "@/services/AdventureService";

import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ adventure_id: string }> },
) {
  const { adventure_id } = await params;
  const { user, supabase, error } = await getAuthenticatedUser(request);
  if (error || !user || !supabase) {
    return NextResponse.json(
      { error: error || "Unauthorized" },
      { status: 401 },
    );
  }

  const adventureService = createAdventureService(user.id, supabase);

  try {
    const adventure = await adventureService.getAdventure(adventure_id);
    return NextResponse.json({ success: true, adventure });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "adventure not found") {
        return NextResponse.json(
          { error: "Adventure not found" },
          { status: 404 },
        );
      }
      if (err.message === "Forbidden") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }
    console.error("Error fetching adventure:", err);
    return NextResponse.json(
      { error: "Failed to fetch adventure" },
      { status: 500 },
    );
  }
}
