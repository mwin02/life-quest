import { AdventureRepo } from "@/repos/adventure-repo";
import { IAdventureInsert, IAdventureUpdate } from "@/types/database";

import { SupabaseClient } from "@supabase/supabase-js";

export function createAdventureService(userId: string, client: SupabaseClient) {
  const adventureRepo = new AdventureRepo(client);

  return {
    async getMyAdventures() {
      return adventureRepo.findByUser(userId);
    },

    async createAdventure(input: Omit<IAdventureInsert, "user_id">) {
      // Force the user_id to be the authenticated user
      return adventureRepo.create({ ...input, user_id: userId });
    },

    async updateAdventure(adventureId: string, input: IAdventureUpdate) {
      // App-level ownership check (RLS also blocks this, but
      // this gives a clear error message)
      const adventure = await adventureRepo.findById(adventureId);
      if (!adventure) throw new Error("adventure not found");
      if (adventure.user_id !== userId) throw new Error("Forbidden");

      return adventureRepo.update(adventureId, input);
    },

    async deleteAdventure(adventureId: string) {
      const adventure = await adventureRepo.findById(adventureId);
      if (!adventure) throw new Error("adventure not found");
      if (adventure.user_id !== userId) throw new Error("Forbidden");

      return adventureRepo.delete(adventureId);
    },
  };
}
