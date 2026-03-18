export interface IStreakLog {
  id: string;
  quest_id: string;
  user_id: string;
  completed_at: string;
}

export type IStreakLogInsert = Omit<IStreakLog, "id">;
export type IStreakLogUpdate = Partial<IStreakLogInsert>;

export function isIStreakLogInsert(value: unknown): value is IStreakLogInsert {
  if (typeof value !== "object" || value === null) {
    throw new Error(
      `Expected an object, got ${value === null ? "null" : typeof value}`,
    );
  }

  const obj = value as Record<string, unknown>;

  if (typeof obj.quest_id !== "string") {
    throw new Error(
      `Expected quest_id to be a string, got ${typeof obj.quest_id}`,
    );
  }
  if (typeof obj.user_id !== "string") {
    throw new Error(
      `Expected user_id to be a string, got ${typeof obj.user_id}`,
    );
  }
  if (typeof obj.completed_at !== "string") {
    throw new Error(
      `Expected completed_at to be a string, got ${typeof obj.completed_at}`,
    );
  }

  return true;
}

export function isIStreakLog(value: unknown): value is IStreakLog {
  if (typeof value !== "object" || value === null) {
    throw new Error(
      `Expected an object, got ${value === null ? "null" : typeof value}`,
    );
  }

  const obj = value as Record<string, unknown>;

  if (typeof obj.id !== "string") {
    throw new Error(`Expected id to be a string, got ${typeof obj.id}`);
  }

  isIStreakLogInsert(value);

  return true;
}
