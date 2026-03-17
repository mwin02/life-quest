import { SupabaseClient } from "@supabase/supabase-js";
import { ModelMessage } from "ai";
import { AgentMessageRepo } from "@/repos/agent-message-repo";

export function createConversationService(userId: string, client: SupabaseClient) {
  const repo = new AgentMessageRepo(client);

  return {
    async getHistory(): Promise<ModelMessage[]> {
      const rows = await repo.findByUser(userId);
      return rows.map((row) => ({ role: row.role, content: row.content } as ModelMessage));
    },

    async saveMessages(messages: ModelMessage[]): Promise<void> {
      await repo.insertMany(
        messages.map((m) => ({
          user_id: userId,
          role: m.role as "user" | "assistant" | "tool",
          content: m.content,
        })),
      );
    },
  };
}
