import { IQuest, IQuestInsert, IQuestUpdate } from "@/types/IQuest";
import { BaseRepo } from "./base-repo";
import { SupabaseClient } from "@supabase/supabase-js";

export class QuestRepo extends BaseRepo<IQuest, IQuestInsert, IQuestUpdate> {
  constructor(client: SupabaseClient) {
    super(client, "quests");
  }

  async findByUser(userId: string): Promise<IQuest[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(`[quests] findByUser failed: ${error.message}`);

    return data as IQuest[];
  }

  async findByAdventure(adventureId: string): Promise<IQuest[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("adventure_id", adventureId)
      .order("created_at", { ascending: false });

    if (error)
      throw new Error(`[quests] findByAdventure failed: ${error.message}`);

    return data as IQuest[];
  }
}
