import { tool } from "ai";
import { z } from "zod";
import { SupabaseClient } from "@supabase/supabase-js";
import { createAdventureService } from "@/services/AdventureService";
import { createQuestService } from "@/services/QuestService";
import { createRewardService } from "@/services/RewardService";
import { createCoinLedgerService } from "@/services/CoinLedgerService";
import { createUserService } from "@/services/UserService";
import { createStreakService } from "@/services/StreakService";
import { createSubtaskService } from "@/services/SubtaskService";

const createAdventureSchema = z.object({
  name: z.string().describe("Short, motivating name for the goal"),
  description: z
    .string()
    .optional()
    .describe("Optional context or why this matters"),
  end_date: z
    .string()
    .describe("Target completion date as an ISO date string, e.g. 2026-06-01"),
});

const createQuestSchema = z.object({
  name: z.string().describe("Clear, action-oriented task name"),
  description: z.string().optional(),
  type: z
    .enum(["progressive", "repeatable"])
    .describe("progressive = multi-step project, repeatable = daily habit"),
  repeat_period: z
    .number()
    .optional()
    .describe(
      "For repeatable quests only: number of days before it can be completed again (e.g. 1 for daily)",
    ),
  start_date: z.string().describe("ISO date string"),
  end_date: z
    .string()
    .describe(
      "ISO date string — keep progressive quests short (days to weeks, not months)",
    ),
  reward: z
    .number()
    .describe(
      "Progressive: 10-300 coins based on effort (awarded on full completion only). " +
        "Repeatable: 5-15 coins base reward per completion.",
    ),
});

const updateQuestSchema = z.object({
  quest_id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  start_date: z.string().optional().describe("ISO date string"),
  repeat_period: z.number().optional().describe("Only for repeatable quests"),
  end_date: z.string().optional().describe("ISO date string"),
  reward: z.number().optional(),
  status: z.enum(["active", "completed", "abandoned", "cancelled"]).optional(),
});

const createSubtaskSchema = z.object({
  quest_id: z
    .string()
    .describe("The progressive quest this subtask belongs to"),
  name: z.string().describe("Specific, completable action"),
  description: z.string().optional(),
  order: z.number().describe("Sequence position within the quest (1-based)"),
});

const createRewardSchema = z.object({
  name: z.string().describe("What the reward is (e.g. 'New headphones')"),
  description: z.string().optional(),
  cost: z
    .number()
    .describe(
      "Coin cost — priced so total rewards = 130-150% of total earnable coins",
    ),
  size: z
    .enum(["small", "medium", "large"])
    .describe("Reward tier: small (treat), medium (event), large (milestone)"),
});

export function createAgentTools(userId: string, supabase: SupabaseClient) {
  const adventureService = createAdventureService(userId, supabase);
  const questService = createQuestService(userId, supabase);
  const rewardService = createRewardService(userId, supabase);
  const ledgerService = createCoinLedgerService(userId, supabase);
  const userService = createUserService(userId, supabase);
  const subtaskService = createSubtaskService(userId, supabase);
  const streakService = createStreakService(userId, supabase);

  return {
    get_user_context: tool({
      description:
        "Fetch the user's profile and current state. If the user has an active adventure, returns that adventure with its quests, rewards, and coin balance. If not, returns only the profile so you know to help them create one. Always call this at the start of every session.",
      inputSchema: z.object({}),
      execute: async () => {
        const profile = await userService.getMyProfile();

        if (!profile.current_adventure_id) {
          return { profile, active_adventure: null };
        }

        const [adventure, quests, rewards, balance] = await Promise.all([
          adventureService.getAdventure(profile.current_adventure_id),
          questService.getQuestsByAdventure(profile.current_adventure_id),
          rewardService.getMyRewards(),
          ledgerService.getCurrentBalance(),
        ]);

        const enrichedQuests = await Promise.all(
          quests.map(async (quest) => {
            if (quest.type === "progressive") {
              const subtasks = await subtaskService.getSubtasks(quest.id);
              return { ...quest, subtasks };
            } else {
              const streakState = await streakService.getCurrentStreak(
                quest.id,
              );
              return { ...quest, streak: streakState };
            }
          }),
        );

        return {
          profile,
          active_adventure: {
            adventure,
            quests: enrichedQuests,
            rewards,
            balance,
          },
        };
      },
    }),

    create_adventure: tool({
      description:
        "Create a new adventure (the user's one active goal) and set it as their active adventure. Only call this when the user has no active adventure and has agreed on the details.",
      inputSchema: createAdventureSchema,
      execute: async ({
        name,
        description,
        end_date,
      }: z.infer<typeof createAdventureSchema>) => {
        const adventure = await adventureService.createAdventure({
          name,
          description,
          end_date,
        });
        await userService.updateMyProfile({
          current_adventure_id: adventure.id,
        });
        return adventure;
      },
    }),

    create_quest: tool({
      description:
        "Create a quest within the active adventure. For progressive quests, follow up with create_subtask. " +
        "For repeatable quests, the quest itself defines the daily habit.",
      inputSchema: createQuestSchema,
      execute: async ({
        name,
        description,
        type,
        start_date,
        repeat_period,
        end_date,
        reward,
      }: z.infer<typeof createQuestSchema>) => {
        const profile = await userService.getMyProfile();
        if (!profile.current_adventure_id) {
          throw new Error("No active adventure. Create an adventure first.");
        }
        return questService.createQuest({
          adventure_id: profile.current_adventure_id,
          name,
          description,
          type,
          start_date,
          end_date,
          repeat_period,
          reward,
          status: "active",
        });
      },
    }),

    update_quest: tool({
      description:
        "Update a quest's details. Used when renegotiating difficulty, schedule, or reward pacing after mutual agreement.",
      inputSchema: updateQuestSchema,
      execute: async ({
        quest_id,
        ...updates
      }: z.infer<typeof updateQuestSchema>) => {
        return questService.updateQuest(quest_id, updates);
      },
    }),

    create_subtask: tool({
      description:
        "Add a subtask to a progressive quest. Subtasks are the daily unit of work. " +
        "Create them in sequence order when setting up a progressive quest.",
      inputSchema: createSubtaskSchema,
      execute: async ({
        quest_id,
        name,
        description,
        order,
      }: z.infer<typeof createSubtaskSchema>) => {
        return subtaskService.createSubtask(quest_id, {
          name,
          description,
          order,
        });
      },
    }),

    get_current_date: tool({
      description:
        "Get the current date as an ISO string. Use this for any date calculations or comparisons, never the system date, to ensure consistency with the user's timezone and avoid clock skew issues.",
      inputSchema: z.object({}),
      execute: async () => {
        return new Date().toISOString();
      },
    }),

    create_reward: tool({
      description:
        "Create a locked reward the user can redeem by spending coins. Define these upfront as part of the commitment contract.",
      inputSchema: createRewardSchema,
      execute: async ({
        name,
        description,
        cost,
        size,
      }: z.infer<typeof createRewardSchema>) => {
        const profile = await userService.getMyProfile();
        return rewardService.createReward({
          name,
          description,
          cost,
          status: "unpurchased",
          size,
          adventure_id: profile.current_adventure_id!,
        });
      },
    }),
  };
}
