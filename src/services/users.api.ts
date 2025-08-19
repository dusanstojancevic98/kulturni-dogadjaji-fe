import { api } from "@src/services/api";
import type { User } from "@src/store/auth/auth.state";

export type Profile = Pick<User, "id" | "email" | "name" | "role"> & {
  isActive: boolean;
};

export const getMe = async (): Promise<Profile> => {
  const res = await api.get("/users/me");
  return res.data as Profile;
};

export const updateMe = async (data: {
  name?: string;
  email?: string;
}): Promise<Profile> => {
  const res = await api.patch("/users/me", data);
  return res.data as Profile;
};

export const changePassword = async (payload: {
  currentPassword: string;
  newPassword: string;
}) => {
  const res = await api.post("/users/me/password", payload);
  return res.data as { ok: true };
};
