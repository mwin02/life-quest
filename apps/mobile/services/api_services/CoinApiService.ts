// services/api/CoinApiService.ts

import { apiRequest } from "../api";
import { BaseApiService } from "./BaseApiService";

interface BalanceResponse {
  success: boolean;
  user: { id: string; email: string };
  balance: number;
}

export class CoinApiService extends BaseApiService {
  async getBalance() {
    return this.request<BalanceResponse>("/balance", {});
  }
}
