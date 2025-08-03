import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialAuthState, type User } from "@src/store/auth/auth.state";

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
        authInitialized: boolean;
      }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.authInitialized = action.payload.authInitialized;
    },
    logout: () => {
      return { ...initialAuthState, authInitialized: true };
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
