import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AdminUser } from "@src/models/user.types";
import {
  initialAdminUsersState,
  type AdminUsersFilters,
} from "@src/store/adminUsers/adminUsers.state";

const slice = createSlice({
  name: "adminUsers",
  initialState: initialAdminUsersState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setData(
      state,
      action: PayloadAction<{ items: AdminUser[]; total: number }>
    ) {
      state.items = action.payload.items;
      state.total = action.payload.total;
    },
    setFilters(state, a: PayloadAction<Partial<AdminUsersFilters>>) {
      state.filters = { ...state.filters, ...a.payload };
    },
  },
});

export const adminUsersReducer = slice.reducer;
export const adminUsersActions = slice.actions;
