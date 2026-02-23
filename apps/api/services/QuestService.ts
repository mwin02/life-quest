import { QuestRepo } from "@/repos/quest-repo";
import { IQuestInsert, IQuestUpdate } from "@/types/database";

import { SupabaseClient } from "@supabase/supabase-js";
import { get } from "http";

export function createQuestService(userId: string, client: SupabaseClient) {
  const questRepo = new QuestRepo(client);

  return {
    async getMyQuests() {
      return questRepo.findByUser(userId);
    },

    async getQuestsByAdventure(adventureId: string) {
      return questRepo.findByAdventure(adventureId);
    },

    async createQuest(input: Omit<IQuestInsert, "user_id">) {
      // Force the user_id to be the authenticated user
      return questRepo.create({ ...input, user_id: userId });
    },

    async updateQuest(questId: string, input: IQuestUpdate) {
      // App-level ownership check (RLS also blocks this, but
      // this gives a clear error message)
      const quest = await questRepo.findById(questId);
      if (!quest) throw new Error("Quest not found");
      if (quest.user_id !== userId) throw new Error("Forbidden");

      return questRepo.update(questId, input);
    },

    async deleteQuest(questId: string) {
      const quest = await questRepo.findById(questId);
      if (!quest) throw new Error("Quest not found");
      if (quest.user_id !== userId) throw new Error("Forbidden");

      return questRepo.delete(questId);
    },
  };
}
