import { QuestRepo } from "@/repos/quest-repo";
import { IQuest, IQuestInsert, IQuestUpdate } from "@/types/IQuest";

import { SupabaseClient } from "@supabase/supabase-js";
import { createCoinLedgerService } from "./CoinLedgerService";
import { AdventureRepo } from "@/repos/adventure-repo";
import { SubtaskRepo } from "@/repos/subtask-repo";
import { StreakLogRepo } from "@/repos/streak-log-repo";

export function createQuestService(userId: string, client: SupabaseClient) {
  const questRepo = new QuestRepo(client);
  const subtaskRepo = new SubtaskRepo(client);
  const streakLogRepo = new StreakLogRepo(client);

  return {
    async getMyQuests(): Promise<IQuest[]> {
      return questRepo.findByUser(userId);
    },

    async getQuest(questId: string): Promise<IQuest> {
      const quest = await questRepo.findById(questId);
      if (!quest) throw new Error("Quest not found");
      if (quest.user_id !== userId) throw new Error("Forbidden");
      return quest;
    },

    async getQuestsByAdventure(adventureId: string): Promise<IQuest[]> {
      return questRepo.findByAdventure(adventureId);
    },

    async createQuest(input: Omit<IQuestInsert, "user_id">): Promise<IQuest> {
      // Force the user_id to be the authenticated user
      const adventureRepo = new AdventureRepo(client);
      const adventure = await adventureRepo.findById(input.adventure_id);
      if (!adventure) throw new Error("Adventure not found");
      if (adventure.user_id !== userId)
        throw new Error("Cannot create quest for another user's adventure");
      return questRepo.create({ ...input, user_id: userId });
    },

    async updateQuest(questId: string, input: IQuestUpdate): Promise<IQuest> {
      // App-level ownership check (RLS also blocks this, but
      // this gives a clear error message)
      const quest = await questRepo.findById(questId);
      if (!quest) throw new Error("Quest not found");
      if (quest.user_id !== userId) throw new Error("Forbidden");

      return questRepo.update(questId, input);
    },

    async completeQuest(questId: string): Promise<void> {
      const quest = await questRepo.findById(questId);
      if (!quest) throw new Error("Quest not found");
      if (quest.user_id !== userId) throw new Error("Forbidden");
      if (quest.status == "completed")
        throw new Error("Quest already finished");
      const ledgerService = createCoinLedgerService(userId, client);
      await ledgerService.addToLedger({
        amount: quest.reward,
        adventure_id: quest.adventure_id,
        meta: { reason: "quest_reward", quest_id: quest.id },
      });
      await questRepo.update(questId, { status: "completed" });
    },

    async deleteQuest(questId: string): Promise<void> {
      const quest = await questRepo.findById(questId);
      if (!quest) throw new Error("Quest not found");
      if (quest.user_id !== userId) throw new Error("Forbidden");

      return questRepo.delete(questId);
    },

    async markSubtaskComplete(subtaskId: string): Promise<void> {
      const subtask = await subtaskRepo.findById(subtaskId);
      if (!subtask) throw new Error("Subtask not found");

      const quest = await questRepo.findById(subtask.quest_id);
      if (!quest) throw new Error("Quest not found");
      if (quest.user_id !== userId) throw new Error("Forbidden");
      if (subtask.status === "completed")
        throw new Error("Subtask already completed");

      await subtaskRepo.update(subtaskId, {
        status: "completed",
        completed_at: new Date().toISOString(),
      });

      // Auto-complete the quest if all subtasks are now done
      const allSubtasks = await subtaskRepo.findByQuest(quest.id);
      const allDone = allSubtasks.every(
        (s) => s.id === subtaskId || s.status === "completed",
      );
      if (allDone && quest.status !== "completed") {
        await this.completeQuest(quest.id);
      }
    },

    async completeRepeatableQuest(questId: string): Promise<void> {
      const quest = await questRepo.findById(questId);
      if (!quest) throw new Error("Quest not found");
      if (quest.user_id !== userId) throw new Error("Forbidden");
      if (quest.type !== "repeatable")
        throw new Error("Quest is not repeatable");
      if (quest.status !== "active") throw new Error("Quest is not active");

      // Guard against double-completion within the current repeat period
      const periodStart = new Date();
      periodStart.setDate(periodStart.getDate() - quest.repeat_period);
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
      const periodMs = quest.repeat_period * 24 * 60 * 60 * 1000;
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
        // Advance i past all entries consumed in this window
        i += completionsInWindow.length;
      }

      return streak;
    },
  };
}
