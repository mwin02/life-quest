import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepo } from "./base-repo";
import { IUser, IUserInsert, IUserUpdate } from "@/types/IUser";

export class UserRepo extends BaseRepo<IUser, IUserInsert, IUserUpdate> {
  constructor(client: SupabaseClient) {
    super(client, "users");
  }
}
