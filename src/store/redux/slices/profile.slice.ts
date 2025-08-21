import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@src/store/auth/auth.state";
import { initialProfileState } from "@src/store/profile/profile.state";

const profileSlice = createSlice({
  name: "profile",
  initialState: initialProfileState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setProfile(state, action: PayloadAction<User | null>) {
      state.profile = action.payload;
    },

    setUpdating(state, action: PayloadAction<boolean>) {
      state.updating = action.payload;
    },
    setUpdateError(state, action: PayloadAction<string | null>) {
      state.updateError = action.payload;
    },

    setChangingPassword(state, action: PayloadAction<boolean>) {
      state.changingPassword = action.payload;
    },
    setChangePasswordError(state, action: PayloadAction<string | null>) {
      state.changePasswordError = action.payload;
    },

    setUploadingAvatar(state, action: PayloadAction<boolean>) {
      state.uploadingAvatar = action.payload;
    },
    setUploadAvatarError(state, action: PayloadAction<string | null>) {
      state.uploadAvatarError = action.payload;
    },

    patchProfileLocal(state, action: PayloadAction<Partial<User>>) {
      if (state.profile)
        state.profile = { ...state.profile, ...action.payload };
    },
  },
});

export const profileReducer = profileSlice.reducer;
export const profileActions = profileSlice.actions;
