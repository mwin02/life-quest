import { getAuthenticatedUser } from "@/lib/auth";
import { createAdventureService } from "@/services/AdventureService";
import { isIAdventureInsert } from "@/types/IAdventure";

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
  const adventureService = createAdventureService(user.id, supabase);
  try {
    const adventures = await adventureService.getMyAdventures();
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
      adventures,
    });
  } catch (err) {
    console.error("Error fetching adventures:", err);
    return NextResponse.json(
      { error: "Failed to fetch adventures" },
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
  const adventureService = createAdventureService(user.id, supabase);

  try {
    const body = await request.json();
    isIAdventureInsert(body);

    const newAdventure = await adventureService.createAdventure(body);

    return NextResponse.json({ success: true, adventure: newAdventure });
  } catch (err) {
    console.error("Error creating adventure:", err);
    return NextResponse.json(
      {
        error: `Failed to create adventure: ${err instanceof Error ? err.message : "Unknown error"}`,
      },
      { status: 500 },
    );
  }
}
