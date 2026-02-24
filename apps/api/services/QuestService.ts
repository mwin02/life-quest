import { QuestRepo } from "@/repos/quest-repo";
import { IQuest, IQuestInsert, IQuestUpdate } from "@/types/IQuest";

import { SupabaseClient } from "@supabase/supabase-js";

export function createQuestService(userId: string, client: SupabaseClient) {
  const questRepo = new QuestRepo(client);

  return {
    async getMyQuests(): Promise<IQuest[]> {
      return questRepo.findByUser(userId);
    },

    async getQuestsByAdventure(adventureId: string): Promise<IQuest[]> {
      return questRepo.findByAdventure(adventureId);
    },

    async createQuest(input: Omit<IQuestInsert, "user_id">): Promise<IQuest> {
      // Force the user_id to be the authenticated user
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

    async deleteQuest(questId: string): Promise<void> {
      const quest = await questRepo.findById(questId);
      if (!quest) throw new Error("Quest not found");
      if (quest.user_id !== userId) throw new Error("Forbidden");

      return questRepo.delete(questId);
    },
  };
}
