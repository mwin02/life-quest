import { RewardRepo } from "@/repos/reward-repo";
import { IReward, IRewardInsert, IRewardUpdate } from "@/types/IReward";
import { SupabaseClient } from "@supabase/supabase-js";

export function createRewardService(userId: string, client: SupabaseClient) {
  const rewardRepo = new RewardRepo(client);

  return {
    async getMyRewards(): Promise<IReward[]> {
      return rewardRepo.findByUser(userId);
    },

    async createReward(
      input: Omit<IRewardInsert, "user_id">,
    ): Promise<IReward> {
      // Force the user_id to be the authenticated user
      return rewardRepo.create({ ...input, user_id: userId });
    },

    async updateReward(
      rewardId: string,
      input: IRewardUpdate,
    ): Promise<IReward> {
      // App-level ownership check (RLS also blocks this, but
      // this gives a clear error message)
      const reward = await rewardRepo.findById(rewardId);
      if (!reward) throw new Error("Reward not found");
      if (reward.user_id !== userId) throw new Error("Forbidden");

      return rewardRepo.update(rewardId, input);
    },

    async deleteReward(rewardId: string): Promise<void> {
      const reward = await rewardRepo.findById(rewardId);
      if (!reward) throw new Error("Reward not found");
      if (reward.user_id !== userId) throw new Error("Forbidden");

      return rewardRepo.delete(rewardId);
    },
  };
}
