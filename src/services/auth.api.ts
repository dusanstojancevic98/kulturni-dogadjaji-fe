import type { User } from "@src/store/auth/auth.state";
import { isAxiosError } from "axios";
import api, { type ApiError } from "./api";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_roken: string;
  user: User;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>("/auth/login", payload);
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const apiError: ApiError = {
        message:
          error.response?.data?.message ||
          error.message ||
          "Unknown error occurred",
        statusCode: error.response?.status,
      };
      throw apiError;
    }
    throw error;
  }
}
