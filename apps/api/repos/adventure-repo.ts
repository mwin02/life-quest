import {
  IAdventure,
  IAdventureInsert,
  IAdventureUpdate,
} from "@/types/database";
import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepo } from "./base-repo";

export class AdventureRepo extends BaseRepo<
  IAdventure,
  IAdventureInsert,
  IAdventureUpdate
> {
  constructor(client: SupabaseClient) {
    super(client, "adventures");
  }

  // find all adventures for user
  async findByUser(userId: string): Promise<IAdventure[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error)
      throw new Error(`[adventures] findByUser failed: ${error.message}`);
    return data as IAdventure[];
  }
}
