export interface CoinLedgerMeta {
  quest_id?: string;
  reward_id?: string;
  reason: string;
}

export interface ICoinLedger {
  id: string;
  created_at: string;
  user_id: string;
  amount: number;
  meta: CoinLedgerMeta;
}

export function isICoinLedger(value: unknown): value is ICoinLedger {
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

  isICoinLedgerInsert(value);

  return true;
}

export function isICoinLedgerInsert(
  value: unknown,
): value is ICoinLedgerInsert {
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
  if (typeof obj.amount !== "number") {
    throw new Error(`Expected amount to be a number, got ${typeof obj.amount}`);
  }

  isICoinLedgerMeta(obj.meta);

  return true;
}

export function isICoinLedgerMeta(value: unknown): value is CoinLedgerMeta {
  if (typeof value !== "object" || value === null) {
    throw new Error(
      `Expected meta to be an object, got ${value === null ? "null" : typeof value}`,
    );
  }

  const meta = value as Record<string, unknown>;

  if (meta.quest_id !== undefined && typeof meta.quest_id !== "string") {
    throw new Error(
      `Expected meta.quest_id to be a string or undefined, got ${typeof meta.quest_id}`,
    );
  }
  if (meta.reward_id !== undefined && typeof meta.reward_id !== "string") {
    throw new Error(
      `Expected meta.reward_id to be a string or undefined, got ${typeof meta.reward_id}`,
    );
  }
  if (typeof meta.reason !== "string") {
    throw new Error(
      `Expected meta.reason to be a string, got ${typeof meta.reason}`,
    );
  }

  return true;
}

export type ICoinLedgerInsert = Omit<ICoinLedger, "id" | "created_at">;
export type ICoinLedgerUpdate = Partial<ICoinLedgerInsert>;
