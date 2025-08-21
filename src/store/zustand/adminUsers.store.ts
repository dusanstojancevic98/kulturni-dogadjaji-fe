import type { AdminUser } from "@src/models/user.types";
import { create } from "zustand";
import {
  initialAdminUsersState,
  type AdminUsersFilters,
  type AdminUsersState,
} from "../adminUsers/adminUsers.state";

type Actions = {
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
  setData: (items: AdminUser[], total: number) => void;
  setFilters: (p: Partial<AdminUsersFilters>) => void;
};

export const adminUsersStore = create<AdminUsersState & Actions>((set) => ({
  ...initialAdminUsersState,
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setData: (items, total) => set({ items, total }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
}));
