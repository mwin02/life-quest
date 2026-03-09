export type RewardStatus = "claimed" | "unredeemed" | "hidden";

export interface IReward {
  id: string;
  created_at: string;
  user_id: string;
  name: string;
  description?: string;
  cost: number;
  status: RewardStatus;
}

export function isIReward(value: unknown): value is IReward {
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

  isIRewardInsert(value);

  return true;
}

export function isIRewardInsert(value: unknown): value is IRewardInsert {
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
  if (typeof obj.name !== "string") {
    throw new Error(`Expected name to be a string, got ${typeof obj.name}`);
  }
  if (obj.description !== undefined && typeof obj.description !== "string") {
    throw new Error(
      `Expected description to be a string or undefined, got ${typeof obj.description}`,
    );
  }
  if (typeof obj.cost !== "number") {
    throw new Error(`Expected cost to be a number, got ${typeof obj.cost}`);
  }

  const validStatuses: RewardStatus[] = ["claimed", "unredeemed", "hidden"];
  if (!validStatuses.includes(obj.status as RewardStatus)) {
    throw new Error(
      `Expected status to be one of ${validStatuses.join(", ")}, got ${obj.status}`,
    );
  }

  return true;
}

export type IRewardInsert = Omit<IReward, "id" | "created_at">;
export type IRewardUpdate = Partial<IRewardInsert>;
