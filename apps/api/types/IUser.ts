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
