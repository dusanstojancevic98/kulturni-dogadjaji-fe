import type { AdminUser } from "@src/models/user.types";
import { api, type Paginated } from "@src/services/api";

export type QueryUsers = {
  q?: string;
  role?: AdminUser["role"];
  isActive?: boolean;
  page?: number;
  pageSize?: number;
};

export const listUsers = async (
  params: QueryUsers = {}
): Promise<Paginated<AdminUser>> => {
  const res = await api.get("/admin/users", { params });
  return res.data as Paginated<AdminUser>;
};

export const createUser = async (payload: {
  name: string;
  email: string;
  password: string;
  role?: AdminUser["role"];
  isActive?: boolean;
}): Promise<AdminUser> => {
  const res = await api.post("/admin/users", payload);
  return res.data as AdminUser;
};

export type UpdateUserPayload = Partial<
  Pick<AdminUser, "name" | "email" | "role" | "isActive">
>;

export const updateUser = async (
  id: string,
  payload: UpdateUserPayload
): Promise<AdminUser> => {
  const res = await api.patch(`/admin/users/${id}`, payload);
  return res.data as AdminUser;
};

export const deleteUser = async (id: string): Promise<{ ok: true }> => {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data as { ok: true };
};
