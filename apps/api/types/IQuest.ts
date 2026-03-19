export type QuestStatus = "active" | "completed" | "abandoned" | "cancelled";

export interface IQuest {
  id: string;
  created_at: string;
  user_id: string;
  adventure_id: string;
  name: string;
  description?: string;
  start_date: string;
  type: "progressive" | "repeatable";
  end_date: string;
  reward: number;
  status: QuestStatus;
  repeat_period?: number; // in days, only for repeatable quests
}
export function isIQuest(value: unknown): value is IQuest {
  if (typeof value !== "object" || value === null) {
    throw new Error(
      `Expected an object, got ${value === null ? "null" : typeof value}`,
    );
  }

  const obj = value as Record<string, unknown>;

  if (typeof obj.id !== "string") {
    throw new Error(`Expected id to be a string, got ${typeof obj.id}`);
  }
  if (typeof obj.created_at !== "string") {
    throw new Error(
      `Expected created_at to be a string, got ${typeof obj.created_at}`,
    );
  }

  isIQuestInsert(value);

  return true;
}

export function isIQuestInsert(value: unknown): value is IQuestInsert {
  if (typeof value !== "object" || value === null) {
    throw new Error(
      `Expected an object, got ${value === null ? "null" : typeof value}`,
    );
  }

  const obj = value as Record<string, unknown>;

  if (typeof obj.user_id !== "string") {
    throw new Error(
      `Expected user_id to be a string, got ${typeof obj.user_id}`,
    );
  }
  if (typeof obj.type !== "string") {
    throw new Error(`Expected type to be a string, got ${typeof obj.type}`);
  }
  if (obj.type !== "progressive" && obj.type !== "repeatable") {
    throw new Error(
      `Expected type to be either "progressive" or "repeatable", got "${obj.type}"`,
    );
  }

  if (obj.type === "repeatable") {
    if (typeof obj.repeat_period !== "number" || obj.repeat_period < 1) {
      throw new Error(
        `Expected repeat_period to be a positive number for repeatable quests, got ${obj.repeat_period}`,
      );
    }
  }

  if (typeof obj.adventure_id !== "string") {
    throw new Error(
      `Expected adventure_id to be a string, got ${typeof obj.adventure_id}`,
    );
  }

  if (typeof obj.name !== "string") {
    throw new Error(`Expected name to be a string, got ${typeof obj.name}`);
  }
  if (obj.description !== undefined && typeof obj.description !== "string") {
    throw new Error(
      `Expected description to be a string or undefined, got ${typeof obj.description}`,
    );
  }

  if (typeof obj.start_date !== "string") {
    throw new Error(
      `Expected start_date to be a string, got ${typeof obj.start_date}`,
    );
  }
  if (typeof obj.end_date !== "string") {
    throw new Error(
      `Expected end_date to be a string, got ${typeof obj.end_date}`,
    );
  }

  if (typeof obj.reward !== "number") {
    throw new Error(`Expected reward to be a number, got ${typeof obj.reward}`);
  }

  if (typeof obj.status !== "string") {
    throw new Error(`Expected status to be a string, got ${typeof obj.status}`);
  }
  const validStatuses: QuestStatus[] = [
    "active",
    "completed",
    "abandoned",
    "cancelled",
  ];
  if (!validStatuses.includes(obj.status as QuestStatus)) {
    throw new Error(
      `Expected status to be one of "active", "completed", "abandoned", or "cancelled", got "${obj.status}"`,
    );
  }

  return true;
}

export type IQuestInsert = Omit<IQuest, "id" | "created_at">;
export type IQuestUpdate = Partial<IQuest>;
