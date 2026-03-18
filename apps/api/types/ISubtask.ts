export interface ISubtask {
  id: string;
  quest_id: string;
  name: string;
  description?: string;
  order: number;
  status: "pending" | "completed" | "removed";
  completed_at?: string;
}

export type ISubtaskInsert = Omit<ISubtask, "id">;
export type ISubtaskUpdate = Partial<ISubtaskInsert>;

const VALID_STATUSES = ["pending", "completed", "removed"] as const;

export function isISubtaskInsert(value: unknown): value is ISubtaskInsert {
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
  if (typeof obj.name !== "string") {
    throw new Error(`Expected name to be a string, got ${typeof obj.name}`);
  }
  if (typeof obj.order !== "number") {
    throw new Error(`Expected order to be a number, got ${typeof obj.order}`);
  }
  if (!VALID_STATUSES.includes(obj.status as (typeof VALID_STATUSES)[number])) {
    throw new Error(
      `Expected status to be one of ${VALID_STATUSES.join(", ")}, got ${obj.status}`,
    );
  }
  if (obj.description !== undefined && typeof obj.description !== "string") {
    throw new Error(
      `Expected description to be a string or undefined, got ${typeof obj.description}`,
    );
  }
  if (obj.completed_at !== undefined && typeof obj.completed_at !== "string") {
    throw new Error(
      `Expected completed_at to be a string or undefined, got ${typeof obj.completed_at}`,
    );
  }

  return true;
}

export function isISubtask(value: unknown): value is ISubtask {
  if (typeof value !== "object" || value === null) {
    throw new Error(
      `Expected an object, got ${value === null ? "null" : typeof value}`,
    );
  }

  const obj = value as Record<string, unknown>;

  if (typeof obj.id !== "string") {
    throw new Error(`Expected id to be a string, got ${typeof obj.id}`);
  }

  isISubtaskInsert(value);

  return true;
}
