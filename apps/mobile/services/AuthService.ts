import { apiRequest } from "./api";
import {
  saveTokens,
  getRefreshToken,
  clearTokens,
  getAccessToken,
} from "./token-storage";
import type { IUser } from "@/types/IUser";

// ---- Types ----

interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

interface AuthResponse {
  message?: string;
  session?: Session;
  user: IUser;
}

interface MeResponse {
  user: IUser;
}

export abstract class AuthService {
  static async register(
    email: string,
    password: string,
    name: string,
  ): Promise<{ user: IUser | null; error: string | null }> {
    const { data, error } = await apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: { email, password, name },
    });

    if (error || !data) {
      return { user: null, error: error || "Registration failed." };
    }

    // If email confirmation is enabled, there won't be a session yet.
    // The user needs to check their email first.
    if (data.session) {
      await saveTokens(data.session.access_token, data.session.refresh_token);
    }

    return { user: data.user, error: null };
  }

  static async login(
    email: string,
    password: string,
  ): Promise<{ user: IUser | null; error: string | null }> {
    const { data, error } = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: { email, password },
    });

    if (error || !data?.session) {
      return { user: null, error: error || "Login failed." };
    }

    await saveTokens(data.session.access_token, data.session.refresh_token);

    return { user: data.user, error: null };
  }

  static async refreshSession(): Promise<boolean> {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) return false;

    const { data, error } = await apiRequest<AuthResponse>("/auth/refresh", {
      method: "POST",
      body: { refresh_token: refreshToken },
    });

    if (error || !data?.session) {
      // Refresh token is invalid — force logout.
      await clearTokens();
      return false;
    }

    await saveTokens(data.session.access_token, data.session.refresh_token);
    return true;
  }

  static async getMe(): Promise<{
    user: IUser | null;
    error: string | null;
  }> {
    const token = await getAccessToken();

    if (!token) {
      return { user: null, error: "Not authenticated." };
    }

    const { data, error, status } = await apiRequest<MeResponse>("/auth/me", {
      method: "GET",
      token,
    });

    // If the token is expired, try refreshing and retrying once.
    if (status === 401) {
      const refreshed = await AuthService.refreshSession();
      if (!refreshed) {
        return { user: null, error: "Session expired. Please log in again." };
      }

      const newToken = await getAccessToken();
      const retry = await apiRequest<MeResponse>("/auth/me", {
        method: "GET",
        token: newToken,
      });

      if (retry.error || !retry.data) {
        return { user: null, error: retry.error || "Failed to fetch user." };
      }

      return { user: retry.data.user, error: null };
    }

    if (error || !data) {
      return { user: null, error: error || "Failed to fetch user." };
    }

    return { user: data.user, error: null };
  }

  static async logout(): Promise<void> {
    await clearTokens();
  }
}

// ---- Auth functions ----
