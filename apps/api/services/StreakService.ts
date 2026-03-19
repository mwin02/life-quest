import { SupabaseClient } from "@supabase/supabase-js";
import { QuestRepo } from "@/repos/quest-repo";
import { StreakLogRepo } from "@/repos/streak-log-repo";
import { createCoinLedgerService } from "./CoinLedgerService";

export function createStreakService(userId: string, client: SupabaseClient) {
  const questRepo = new QuestRepo(client);
  const streakLogRepo = new StreakLogRepo(client);

  return {
    async completeRepeatableQuest(questId: string): Promise<void> {
      const quest = await questRepo.findById(questId);
      if (!quest) throw new Error("Quest not found");
      if (quest.user_id !== userId) throw new Error("Forbidden");
      if (quest.type !== "repeatable")
        throw new Error("Quest is not repeatable");
      if (quest.status !== "active") throw new Error("Quest is not active");

      // Guard against double-completion within the current repeat period
      const periodStart = new Date();
      periodStart.setDate(periodStart.getDate() - quest.repeat_period!);
      const recent = await streakLogRepo.findSinceDate(
        questId,
        periodStart.toISOString(),
      );
      if (recent.length > 0)
        throw new Error("Quest already completed within the current period");

      const ledgerService = createCoinLedgerService(userId, client);
      await ledgerService.addToLedger({
        amount: quest.reward,
        adventure_id: quest.adventure_id,
        meta: { reason: "quest_reward", quest_id: quest.id },
      });
      await streakLogRepo.create({
        quest_id: questId,
        user_id: userId,
        completed_at: new Date().toISOString(),
      });
    },

    async getCurrentStreak(questId: string): Promise<number> {
      const quest = await questRepo.findById(questId);
      if (!quest) throw new Error("Quest not found");
      if (quest.user_id !== userId) throw new Error("Forbidden");
      if (quest.type !== "repeatable")
        throw new Error("Quest is not repeatable");

      const logs = await streakLogRepo.findByQuest(questId);
      if (logs.length === 0) return 0;

      // Walk backwards through period windows starting from now,
      // counting consecutive periods that contain at least one completion.
      const periodMs = quest.repeat_period! * 24 * 60 * 60 * 1000;
      let streak = 0;
      let windowEnd = Date.now();

      for (let i = 0; i < logs.length; ) {
        const windowStart = windowEnd - periodMs;
        const completionsInWindow = logs.filter((l) => {
          const t = new Date(l.completed_at).getTime();
          return t >= windowStart && t < windowEnd;
        });

        if (completionsInWindow.length === 0) break;

        streak++;
        windowEnd = windowStart;
        i += completionsInWindow.length;
      }

      return streak;
    },
  };
}
