import { SupabaseClient } from "@supabase/supabase-js";

export class BaseRepo<
  TRow,                             // Full row type (what you read)
  TInsert extends Record<string, unknown>,  // Insert type
  TUpdate extends Record<string, unknown>,  // Update type
> {
  constructor(
    protected client: SupabaseClient,
    protected table: string,
  ) {}

  async findAll(): Promise<TRow[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*");

    if (error) throw new Error(`[${this.table}] findAll failed: ${error.message}`);
    return data as TRow[];
  }

  async findById(id: string): Promise<TRow | null> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(`[${this.table}] findById failed: ${error.message}`);
    }
    return (data as TRow) ?? null;
  }

  async create(input: TInsert): Promise<TRow> {
    const { data, error } = await this.client
      .from(this.table)
      .insert(input)
      .select()
      .single();

    if (error) throw new Error(`[${this.table}] create failed: ${error.message}`);
    return data as TRow;
  }

  async update(id: string, input: TUpdate): Promise<TRow> {
    const { data, error } = await this.client
      .from(this.table)
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`[${this.table}] update failed: ${error.message}`);
    return data as TRow;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client
      .from(this.table)
      .delete()
      .eq("id", id);

    if (error) throw new Error(`[${this.table}] delete failed: ${error.message}`);
  }
}

export function createUserRepo<
  TRow,                             // Full row type (what you read)
  TInsert extends Record<string, unknown>,  // Insert type
  TUpdate extends Record<string, unknown>,  // Update type
>(
  client: SupabaseClient,
  table: string,
) {
  return new BaseRepo<TRow, TInsert, TUpdate>(client, table);
}