import { apiRequest, type ApiResponse } from "../api";

type TokenGetter = () => Promise<string | null>;

export class BaseApiService {
  constructor(protected getToken: TokenGetter) {}

  protected async request<T>(
    endpoint: string,
    options: {
      method?: "GET" | "POST" | "PUT" | "DELETE";
      body?: Record<string, unknown>;
    } = {},
  ): Promise<ApiResponse<T>> {
    const token = await this.getToken();
    return apiRequest<T>(endpoint, { ...options, token });
  }
}
