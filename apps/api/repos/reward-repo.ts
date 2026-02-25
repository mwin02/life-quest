import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepo } from "./base-repo";
import { IReward, IRewardInsert, IRewardUpdate } from "@/types/IReward";

export class RewardRepo extends BaseRepo<
  IReward,
  IRewardInsert,
  IRewardUpdate
> {
  constructor(client: SupabaseClient) {
    super(client, "rewards");
  }

  // find all rewards for user
  async findByUser(userId: string): Promise<IReward[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(`[rewards] findByUser failed: ${error.message}`);
    return data as IReward[];
  }
}
