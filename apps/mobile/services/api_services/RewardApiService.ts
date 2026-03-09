// services/api/RewardApiService.ts

import { apiRequest } from "../api";
import type { IReward, IRewardInsert } from "@/types/IReward";
import { BaseApiService } from "./BaseApiService";

interface RewardsResponse {
  success: boolean;
  user: { id: string; email: string };
  rewards: IReward[];
}

interface RewardCreateResponse {
  success: boolean;
  reward: IReward;
}

interface RewardRedeemResponse {
  success: boolean;
  error?: string;
}

export class RewardApiService extends BaseApiService {
  async getAll() {
    return this.request<RewardsResponse>("/rewards");
  }

  async create(reward: IRewardInsert) {
    return this.request<RewardCreateResponse>("/rewards", {
      method: "POST",
      body: reward as Record<string, unknown>,
    });
  }

  async redeem(rewardId: string) {
    return this.request<RewardRedeemResponse>(`/rewards/${rewardId}/redeem`);
  }
}
