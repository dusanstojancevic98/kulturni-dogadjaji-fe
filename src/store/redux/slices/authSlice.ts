import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type AuthState, initialAuthState } from "@src/store/auth/auth.state";

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState["user"]>) => {
      state.user = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
    },
    logout: () => initialAuthState,
  },
});

export const { setUser, setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;
