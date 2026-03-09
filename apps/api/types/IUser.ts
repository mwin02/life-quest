export interface IUser {
  id: string;
  name: string;
  email: string;
  created_at: string;
  current_adventure_id: string | null;
}

// What's required when creating (id and created_at are auto-generated)
export type IUserInsert = Omit<IUser, "created_at">;

// What's allowed when updating (everything is optional)
export type IUserUpdate = Partial<IUserInsert>;
