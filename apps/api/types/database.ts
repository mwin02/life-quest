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
  user_id: string;
}

export type IAdventureInsert = Omit<IAdventure, "id" | "created_at">;
export type IAdventureUpdate = Partial<IAdventureInsert>;

export interface IQuest {
  user_id: string;
  adventure_id: string;
}

export type IQuestInsert = Omit<IQuest, "id" | "created_at">;
export type IQuestUpdate = Partial<IQuestInsert>;
