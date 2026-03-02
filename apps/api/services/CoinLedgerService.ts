import { CoinLedgerRepo } from "@/repos/coin-ledger-repo";
import { ICoinLedger, ICoinLedgerInsert } from "@/types/ICoinLedger";
import { SupabaseClient } from "@supabase/supabase-js";

export function createCoinLedgerService(
  userId: string,
  client: SupabaseClient,
) {
  const rewardRepo = new CoinLedgerRepo(client);

  return {
    async getCurrentBalance(): Promise<number> {
      const rewards = await rewardRepo.findByUser(userId);
      return rewards.reduce((sum, reward) => sum + reward.amount, 0);
    },

    async getLedgerEntries(): Promise<ICoinLedger[]> {
      return rewardRepo.findByUser(userId);
    },

    async addToLedger(
      input: Omit<ICoinLedgerInsert, "user_id">,
    ): Promise<ICoinLedger> {
      // Force the user_id to be the authenticated user
      return rewardRepo.create({ ...input, user_id: userId });
    },
  };
}
