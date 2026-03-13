// hooks/useApiServices.ts

import { AdventureApiService } from "@/services/api_services/AdventureApiService";
import { CoinApiService } from "@/services/api_services/CoinApiService";
import { QuestApiService } from "@/services/api_services/QuestApiService";
import { RewardApiService } from "@/services/api_services/RewardApiService";
import { getAccessToken } from "@/services/token-storage";
import { useMemo } from "react";

export function useApiServices() {
  return useMemo(
    () => ({
      adventureService: new AdventureApiService(getAccessToken),
      questService: new QuestApiService(getAccessToken),
      rewardService: new RewardApiService(getAccessToken),
      coinService: new CoinApiService(getAccessToken),
    }),
    [],
  );
}
