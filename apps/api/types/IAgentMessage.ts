import { ModelMessage } from "ai";

export interface IAgentMessage {
  id: string;
  created_at: string;
  user_id: string;
  role: "user" | "assistant" | "tool";
  content: ModelMessage["content"];
}

export type IAgentMessageInsert = Omit<IAgentMessage, "id" | "created_at">;
