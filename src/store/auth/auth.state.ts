export type User = {
  id: string;
  email: string;
  name: string;
};

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  authInitialized: boolean;
}

const userRaw = localStorage.getItem("user");
const refreshToken = localStorage.getItem("refreshToken");

export const initialAuthState: AuthState = {
  user: userRaw ? JSON.parse(userRaw) : null,
  accessToken: null,
  refreshToken: refreshToken || null,
  authInitialized: false,
};
