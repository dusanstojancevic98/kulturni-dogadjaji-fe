export type User = {
  id: string;
  email: string;
  name: string;
};

export interface AuthState {
  user: User | null;
  accessToken: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  accessToken: null,
};
