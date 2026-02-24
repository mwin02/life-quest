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

export function isIAdventure(value: unknown): value is IAdventure {
  if (typeof value !== "object" || value === null) return false;

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.id === "string" &&
    typeof obj.user_id === "string" &&
    typeof obj.created_at === "string" &&
    typeof obj.name === "string" &&
    typeof obj.end_date === "string" &&
    (obj.description === undefined || typeof obj.description === "string")
  );
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
  if (typeof value !== "object" || value === null) return false;

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.id === "string" &&
    typeof obj.created_at === "string" &&
    typeof obj.user_id === "string" &&
    typeof obj.adventure_id === "string" &&
    typeof obj.name === "string" &&
    (obj.description === undefined || typeof obj.description === "string") &&
    typeof obj.start_date === "string" &&
    typeof obj.end_date === "string"
  );
}

export type IQuestInsert = Omit<IQuest, "id" | "created_at">;
export type IQuestUpdate = Partial<IQuestInsert>;
