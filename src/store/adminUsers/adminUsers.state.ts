import type { AdminUser } from "@src/models/user.types";

export type AdminUsersFilters = {
  q?: string;
  role?: AdminUser["role"];
  isActive?: boolean;
  page: number;
  pageSize: number;
};

export type AdminUsersState = {
  items: AdminUser[];
  total: number;
  loading: boolean;
  error?: string | null;
  filters: AdminUsersFilters;
};

export const initialAdminUsersState: AdminUsersState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  filters: { page: 1, pageSize: 50 },
};
