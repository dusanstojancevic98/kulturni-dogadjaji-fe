import { authController } from "@src/store/auth/auth.controller";
import axios from "axios";
import { tryRefreshToken } from "./refreshToken";

export interface ApiError {
  message: string;
  statusCode?: number;
}

export const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = authController.getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        const config = err.config;
        config.headers.Authorization = `Bearer ${authController.getAccessToken()}`;
        return api(config);
      }
    }

    return Promise.reject(err);
  }
);

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
