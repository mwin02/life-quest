import { tool } from "ai";
import { z } from "zod";
import { SupabaseClient } from "@supabase/supabase-js";
import { createAdventureService } from "@/services/AdventureService";
import { createQuestService } from "@/services/QuestService";
import { createRewardService } from "@/services/RewardService";
import { createCoinLedgerService } from "@/services/CoinLedgerService";
import { createUserService } from "@/services/UserService";

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
  start_date: z.string().describe("ISO date string"),
  end_date: z
    .string()
    .describe("ISO date string — keep tasks short (days, not weeks)"),
  reward: z
    .number()
    .describe(
      "Coin reward: ~10-30 for small tasks, ~50-100 for medium, ~150-300 for milestones",
    ),
});

const updateQuestSchema = z.object({
  quest_id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  start_date: z.string().optional().describe("ISO date string"),
  end_date: z.string().optional().describe("ISO date string"),
  reward: z.number().optional(),
  status: z.enum(["active", "inactive", "finished"]).optional(),
});

const completeQuestSchema = z.object({
  quest_id: z.string(),
});

const createRewardSchema = z.object({
  name: z.string().describe("What the reward is (e.g. 'New headphones')"),
  description: z.string().optional(),
  cost: z
    .number()
    .describe(
      "Coin cost to redeem — should feel meaningful relative to the work required to earn it",
    ),
});

export function createAgentTools(userId: string, supabase: SupabaseClient) {
  const adventureService = createAdventureService(userId, supabase);
  const questService = createQuestService(userId, supabase);
  const rewardService = createRewardService(userId, supabase);
  const ledgerService = createCoinLedgerService(userId, supabase);
  const userService = createUserService(userId, supabase);

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

        return { profile, active_adventure: { adventure, quests, rewards, balance } };
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
        const adventure = await adventureService.createAdventure({ name, description, end_date });
        await userService.updateMyProfile({ current_adventure_id: adventure.id });
        return adventure;
      },
    }),

    create_quest: tool({
      description:
        "Create a quest within the user's active adventure. Only call this when the user has an active adventure and has agreed on the details.",
      inputSchema: createQuestSchema,
      execute: async ({
        name,
        description,
        start_date,
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
          start_date,
          end_date,
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

    complete_quest: tool({
      description:
        "Mark a quest as complete and award the user its coin reward. Only call this when the user confirms they finished the task.",
      inputSchema: completeQuestSchema,
      execute: async ({ quest_id }: z.infer<typeof completeQuestSchema>) => {
        await questService.completeQuest(quest_id);
        const new_balance = await ledgerService.getCurrentBalance();
        return { success: true, new_balance };
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
      }: z.infer<typeof createRewardSchema>) => {
        return rewardService.createReward({
          name,
          description,
          cost,
          status: "unredeemed",
        });
      },
    }),
  };
}
