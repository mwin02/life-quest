export interface IUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  created_at: string;
}

// What's required when creating (id and created_at are auto-generated)
export type IUserInsert = Omit<IUser, "id" | "created_at">;

// What's allowed when updating (everything is optional)
export type IUserUpdate = Partial<IUserInsert>;

export interface IAdventure {
  id: string;
  user_id: string;
  created_at: string;
  name: string;
  end_date: string;
  description?: string;
}

export function isIAdventureInsert(value: unknown): value is IAdventureInsert {
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
  if (typeof obj.end_date !== "string") {
    throw new Error(
      `Expected end_date to be a string, got ${typeof obj.end_date}`,
    );
  }
  if (obj.description !== undefined && typeof obj.description !== "string") {
    throw new Error(
      `Expected description to be a string or undefined, got ${typeof obj.description}`,
    );
  }

  return true;
}

export function isIAdventure(value: unknown): value is IAdventure {
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

  isIAdventureInsert(value);

  return true;
}

export type IAdventureInsert = Omit<IAdventure, "id" | "created_at">;
export type IAdventureUpdate = Partial<IAdventureInsert>;

export interface IQuest {
  id: string;
  created_at: string;
  user_id: string;
  adventure_id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
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

  return true;
}

export type IQuestInsert = Omit<IQuest, "id" | "created_at">;
export type IQuestUpdate = Partial<IQuestInsert>;
