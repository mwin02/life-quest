// services/api/AdventureApiService.ts

import type { IAdventure, IAdventureInsert } from "@/types/IAdventure";
import { apiRequest } from "../api";
import { BaseApiService } from "./BaseApiService";

interface AdventuresResponse {
  success: boolean;
  user: { id: string; email: string };
  adventures: IAdventure[];
}

interface AdventureCreateResponse {
  success: boolean;
  adventure: IAdventure;
}

export class AdventureApiService extends BaseApiService {
  async getAll() {
    return this.request<AdventuresResponse>("/adventures", {});
  }

  async create(adventure: IAdventureInsert) {
    return this.request<AdventureCreateResponse>("/adventures", {
      method: "POST",
      body: adventure as Record<string, unknown>,
    });
  }
}
