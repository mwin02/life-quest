import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepo } from "./base-repo";
import { ISubtask, ISubtaskInsert, ISubtaskUpdate } from "@/types/ISubtask";

export class SubtaskRepo extends BaseRepo<
  ISubtask,
  ISubtaskInsert,
  ISubtaskUpdate
> {
  constructor(client: SupabaseClient) {
    super(client, "subtasks");
  }

  // find all subtasks for a quest, ordered by their display order
  async findByQuest(questId: string): Promise<ISubtask[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("quest_id", questId)
      .order("order", { ascending: true });

    if (error)
      throw new Error(`[subtasks] findByQuest failed: ${error.message}`);
    return data as ISubtask[];
  }
}
