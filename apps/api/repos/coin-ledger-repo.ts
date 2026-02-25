import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepo } from "./base-repo";
import {
  ICoinLedger,
  ICoinLedgerInsert,
  ICoinLedgerUpdate,
} from "@/types/ICoinLedger";

export class CoinLedgerRepo extends BaseRepo<
  ICoinLedger,
  ICoinLedgerInsert,
  ICoinLedgerUpdate
> {
  constructor(client: SupabaseClient) {
    super(client, "coin_ledgers");
  }

  // find all coin ledgers for user
  async findByUser(userId: string): Promise<ICoinLedger[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error)
      throw new Error(`[coin_ledgers] findByUser failed: ${error.message}`);
    return data as ICoinLedger[];
  }
}
