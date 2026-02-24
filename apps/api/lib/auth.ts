import { SupabaseClient, User } from "@supabase/supabase-js";
import { extractTokenFromRequest } from "./util";
import { createUserClient } from "./supabase/server";

export interface AuthResult {
  user: User | null;
  supabase: SupabaseClient | null;
  error: string | null;
}

/**
 * Extracts and verifies the user session from the Authorization header.
 * Returns both the authenticated user AND a Supabase client initialized
 * with that user's token, so downstream queries respect RLS policies.
 */
export async function getAuthenticatedUser(
  request: Request,
): Promise<AuthResult> {
  const token = extractTokenFromRequest(request);
  if (!token) {
    return {
      user: null,
      supabase: null,
      error: "Missing or invalid Authorization header",
    };
  }

  const supabase = createUserClient(token);

  // Verify the token and retrieve the user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return {
      user: null,
      supabase: null,
      error: error?.message || "Invalid or expired token",
    };
  }

  return {
    user,
    supabase,
    error: null,
  };
}
