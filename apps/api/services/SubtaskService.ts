import { SupabaseClient } from "@supabase/supabase-js";
import { QuestRepo } from "@/repos/quest-repo";
import { SubtaskRepo } from "@/repos/subtask-repo";
import { ISubtask, ISubtaskInsert } from "@/types/ISubtask";

export function createSubtaskService(userId: string, client: SupabaseClient) {
  const questRepo = new QuestRepo(client);
  const subtaskRepo = new SubtaskRepo(client);

  return {
    async createSubtask(
      questId: string,
      input: Pick<ISubtaskInsert, "name" | "description" | "order">,
    ): Promise<ISubtask> {
      const quest = await questRepo.findById(questId);
      if (!quest) throw new Error("Quest not found");
      if (quest.user_id !== userId) throw new Error("Forbidden");
      if (quest.type !== "progressive")
        throw new Error("Subtasks can only be added to progressive quests");

      return subtaskRepo.create({
        quest_id: questId,
        name: input.name,
        description: input.description,
        order: input.order,
        status: "pending",
      });
    },

    async markSubtaskComplete(subtaskId: string): Promise<void> {
      const subtask = await subtaskRepo.findById(subtaskId);
      if (!subtask) throw new Error("Subtask not found");

      const quest = await questRepo.findById(subtask.quest_id);
      if (!quest) throw new Error("Quest not found");
      if (quest.user_id !== userId) throw new Error("Forbidden");
      if (subtask.status === "completed")
        throw new Error("Subtask already completed");

      await subtaskRepo.update(subtaskId, {
        status: "completed",
        completed_at: new Date().toISOString(),
      });

      // Auto-complete the quest if all subtasks are now done
      const allSubtasks = await subtaskRepo.findByQuest(quest.id);
      const allDone = allSubtasks.every(
        (s) => s.id === subtaskId || s.status === "completed",
      );
      if (allDone && quest.status !== "completed") {
        const { createQuestService } = await import("./QuestService");
        await createQuestService(userId, client).completeQuest(quest.id);
      }
    },

    async getSubtasks(questId: string): Promise<ISubtask[]> {
      const quest = await questRepo.findById(questId);
      if (!quest) throw new Error("Quest not found");
      if (quest.user_id !== userId) throw new Error("Forbidden");
      return subtaskRepo.findByQuest(questId);
    },
  };
}
