import { QuestRepo } from "@/repos/quest-repo";
import { IQuest, IQuestInsert, IQuestUpdate } from "@/types/IQuest";

import { SupabaseClient } from "@supabase/supabase-js";
import { createCoinLedgerService } from "./CoinLedgerService";
import { AdventureRepo } from "@/repos/adventure-repo";

export function createQuestService(userId: string, client: SupabaseClient) {
  const questRepo = new QuestRepo(client);

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
      if (input.type === "repeatable" && !input.repeat_period)
        throw new Error("repeat_period is required for repeatable quests");
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
  };
}
