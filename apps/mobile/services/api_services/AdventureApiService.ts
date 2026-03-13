// services/api/AdventureApiService.ts

import type { IAdventure, IAdventureInsert } from "@/types/IAdventure";
import { apiRequest } from "../api";
import { BaseApiService } from "./BaseApiService";

interface AdventuresResponse {
  success: boolean;
  user: { id: string; email: string };
  adventures: IAdventure[];
}

interface AdventureResponse {
  success: boolean;
  adventure: IAdventure;
}

interface AdventureCreateResponse {
  success: boolean;
  adventure: IAdventure;
}

export class AdventureApiService extends BaseApiService {
  async getAll() {
    return this.request<AdventuresResponse>("/adventures", {});
  }

  async getById(adventureId: string) {
    return this.request<AdventureResponse>(`/adventures/${adventureId}`, {});
  }

  async create(adventure: IAdventureInsert) {
    return this.request<AdventureCreateResponse>("/adventures", {
      method: "POST",
      body: adventure as Record<string, unknown>,
    });
  }
}
