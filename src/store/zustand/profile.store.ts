import type { User } from "@src/store/auth/auth.state";
import {
  initialProfileState,
  type ProfileState,
} from "@src/store/profile/profile.state";
import { create } from "zustand";

type ProfileActions = {
  setLoading: (value: boolean) => void;
  setError: (message: string | null) => void;
  setProfile: (user: User | null) => void;

  setUpdating: (value: boolean) => void;
  setUpdateError: (message: string | null) => void;

  setChangingPassword: (value: boolean) => void;
  setChangePasswordError: (message: string | null) => void;

  setUploadingAvatar: (value: boolean) => void;
  setUploadAvatarError: (message: string | null) => void;

  patchProfileLocal: (patch: Partial<User>) => void;
};

export const profileStore = create<ProfileState & ProfileActions>(
  (set, get) => ({
    ...initialProfileState,

    setLoading: (value) => set({ loading: value }),
    setError: (message) => set({ error: message }),
    setProfile: (user) => set({ profile: user }),

    setUpdating: (value) => set({ updating: value }),
    setUpdateError: (message) => set({ updateError: message }),

    setChangingPassword: (value) => set({ changingPassword: value }),
    setChangePasswordError: (message) => set({ changePasswordError: message }),

    setUploadingAvatar: (value) => set({ uploadingAvatar: value }),
    setUploadAvatarError: (message) => set({ uploadAvatarError: message }),

    patchProfileLocal: (patch) => {
      const current = get().profile;
      if (current) set({ profile: { ...current, ...patch } });
    },
  })
);
