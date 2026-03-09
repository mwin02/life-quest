import { UserRepo } from "@/repos/user-repo";
import { IUser, IUserInsert, IUserUpdate } from "@/types/IUser";
import { SupabaseClient } from "@supabase/supabase-js";

export function createUserService(userId: string, client: SupabaseClient) {
  const userRepo = new UserRepo(client);

  return {
    async createUser(input: IUserInsert): Promise<IUser> {
      return userRepo.create(input);
    },

    async getMyProfile(): Promise<IUser> {
      const user = await userRepo.findById(userId);
      if (!user) throw new Error("User not found");
      return user;
    },

    async updateEmail(newEmail: string): Promise<IUser> {
      // In a real app, you'd want to validate the email format here
      return userRepo.update(userId, { email: newEmail });
    },

    async updateMyProfile(input: IUserUpdate): Promise<IUser> {
      // In a real app, you'd want to validate the input here
      return userRepo.update(userId, input);
    },
  };
}
