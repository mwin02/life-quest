import { SupabaseClient } from "@supabase/supabase-js";
import { IAgentMessage, IAgentMessageInsert } from "@/types/IAgentMessage";

export class AgentMessageRepo {
  constructor(private client: SupabaseClient) {}

  async findByUser(userId: string): Promise<IAgentMessage[]> {
    const { data, error } = await this.client
      .from("agent_messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) throw new Error(`[agent_messages] findByUser failed: ${error.message}`);
    return data as IAgentMessage[];
  }

  async insertMany(messages: IAgentMessageInsert[]): Promise<void> {
    const { error } = await this.client
      .from("agent_messages")
      .insert(messages);

    if (error) throw new Error(`[agent_messages] insertMany failed: ${error.message}`);
  }
}
