import { streamText, stepCountIs, ModelMessage } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { createAgentTools } from "@/lib/agent/tools";
import { createConversationService } from "@/services/ConversationService";
import { SYSTEM_PROMPT } from "@/lib/agent/system-prompt";

export async function POST(request: Request) {
  const { user, supabase, error } = await getAuthenticatedUser(request);
  if (error || !user || !supabase) {
    return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 });
  }

  const { message } = await request.json();

  const conversationService = createConversationService(user.id, supabase);

  const history = await conversationService.getHistory();
  const userMessage: ModelMessage = { role: "user", content: message };

  // Persist the user message before the agent runs
  await conversationService.saveMessages([userMessage]);

  const tools = createAgentTools(user.id, supabase);

  const result = streamText({
    model: anthropic("claude-sonnet-4-6"),
    system: SYSTEM_PROMPT,
    messages: [...history, userMessage],
    tools,
    stopWhen: stepCountIs(5),
    onFinish: async (event) => {
      // Collect all messages generated across every step (tool calls, tool results, final reply)
      const responseMessages = event.steps.flatMap((step) => step.response.messages);
      await conversationService.saveMessages(responseMessages as ModelMessage[]);
    },
  });

  return result.toTextStreamResponse();
}
