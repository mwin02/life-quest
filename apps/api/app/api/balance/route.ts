import { getAuthenticatedUser } from "@/lib/auth";
import { createCoinLedgerService } from "@/services/CoinLedgerService";
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
  const ledgerService = createCoinLedgerService(user.id, supabase);
  try {
    const balance = await ledgerService.getCurrentBalance();
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
      balance,
    });
  } catch (err) {
    console.error("Error fetching adventures:", err);
    return NextResponse.json(
      { error: "Failed to fetch adventures" },
      { status: 500 },
    );
  }
}
