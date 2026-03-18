import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepo } from "./base-repo";
import {
  IStreakLog,
  IStreakLogInsert,
  IStreakLogUpdate,
} from "@/types/IStreakLog";

export class StreakLogRepo extends BaseRepo<
  IStreakLog,
  IStreakLogInsert,
  IStreakLogUpdate
> {
  constructor(client: SupabaseClient) {
    super(client, "streak_logs");
  }

  // find all streak logs for a quest, newest first
  async findByQuest(questId: string): Promise<IStreakLog[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("quest_id", questId)
      .order("completed_at", { ascending: false });

    if (error)
      throw new Error(`[streak_logs] findByQuest failed: ${error.message}`);
    return data as IStreakLog[];
  }

  // find streak logs for a quest completed on or after a given ISO date string
  async findSinceDate(questId: string, since: string): Promise<IStreakLog[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("quest_id", questId)
      .gte("completed_at", since);

    if (error)
      throw new Error(`[streak_logs] findSinceDate failed: ${error.message}`);
    return data as IStreakLog[];
  }
}
