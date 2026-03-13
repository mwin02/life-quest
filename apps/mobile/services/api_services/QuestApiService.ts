// services/api/QuestApiService.ts

import { apiRequest } from "../api";
import type { IQuest, IQuestInsert } from "@/types/IQuest";
import { BaseApiService } from "./BaseApiService";

interface QuestsResponse {
  success: boolean;
  user: { id: string; email: string };
  quests: IQuest[];
}

interface QuestResponse {
  success: boolean;
  quest: IQuest;
}

interface QuestCreateResponse {
  success: boolean;
  quest: IQuest;
}

interface QuestCompleteResponse {
  success: boolean;
  error?: string;
}

export class QuestApiService extends BaseApiService {
  async getAll() {
    return this.request<QuestsResponse>("/quests", {});
  }

  async getById(questId: string) {
    return this.request<QuestResponse>(`/quests/${questId}`, {});
  }

  async create(quest: IQuestInsert) {
    return this.request<QuestCreateResponse>("/quests", {
      method: "POST",
      body: quest as Record<string, unknown>,
    });
  }

  async complete(questId: string) {
    return this.request<QuestCompleteResponse>(
      `/quests/${questId}/complete`,
      {},
    );
  }
}
