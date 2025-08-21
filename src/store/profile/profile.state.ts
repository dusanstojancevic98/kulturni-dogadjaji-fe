import type { User } from "@src/store/auth/auth.state";

export type ProfileState = {
  profile: User | null;
  loading: boolean;
  error: string | null;

  updating: boolean;
  updateError: string | null;

  changingPassword: boolean;
  changePasswordError: string | null;

  uploadingAvatar: boolean;
  uploadAvatarError: string | null;
};

export const initialProfileState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
  updating: false,
  updateError: null,
  changingPassword: false,
  changePasswordError: null,
  uploadingAvatar: false,
  uploadAvatarError: null,
};
