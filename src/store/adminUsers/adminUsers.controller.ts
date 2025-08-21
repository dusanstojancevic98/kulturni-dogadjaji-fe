import { featureFlags } from "@src/config/featureFlags";
import { useAppSelector } from "@src/hooks/redux/useAppSelector";
import {
  createUser,
  deleteUser,
  listUsers,
  updateUser,
  type QueryUsers,
  type UpdateUserPayload,
} from "@src/services/adminUsers.api";
import { store as reduxStore } from "@src/store/redux/store";
import type { UserRole } from "../auth/auth.state";
import { adminUsersActions } from "../redux/slices/adminUsers.slice";
import { adminUsersStore } from "../zustand/adminUsers.store";

export const adminUsersController = {
  getState: () =>
    featureFlags.useRedux
      ? reduxStore.getState().adminUsers
      : adminUsersStore.getState(),

  setFilters: (p: Partial<QueryUsers>) => {
    if (featureFlags.useRedux) {
      reduxStore.dispatch(adminUsersActions.setFilters(p));
    } else {
      adminUsersStore.getState().setFilters(p);
    }
  },

  load: async () => {
    const inst = adminUsersController.getState();
    const params: QueryUsers = inst.filters;

    if (featureFlags.useRedux) {
      reduxStore.dispatch(adminUsersActions.setLoading(true));
      try {
        const res = await listUsers(params);
        reduxStore.dispatch(
          adminUsersActions.setData({ items: res.items, total: res.total })
        );
        reduxStore.dispatch(adminUsersActions.setError(null));
      } catch {
        reduxStore.dispatch(adminUsersActions.setError("Greška"));
      } finally {
        reduxStore.dispatch(adminUsersActions.setLoading(false));
      }
    } else {
      const state = adminUsersStore.getState();
      state.setLoading(true);
      try {
        const res = await listUsers(params);
        state.setData(res.items, res.total);
        state.setError(null);
      } catch {
        state.setError("Greška");
      } finally {
        state.setLoading(false);
      }
    }
  },

  create: async (params: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    isActive?: boolean;
  }) => {
    await createUser(params);
    await adminUsersController.load();
  },
  update: async (id: string, params: UpdateUserPayload) => {
    await updateUser(id, params);
    await adminUsersController.load();
  },
  remove: async (id: string) => {
    await deleteUser(id);
    await adminUsersController.load();
  },
};

export const useAdminUsers = () => {
  const redux = useAppSelector((state) => state.adminUsers);
  const zustand = adminUsersStore();
  return featureFlags.useRedux ? redux : zustand;
};
