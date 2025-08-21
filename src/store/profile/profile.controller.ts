import { featureFlags } from "@src/config/featureFlags";
import { changePassword, getMe, updateMe } from "@src/services/users.api";
import { authController } from "@src/store/auth/auth.controller";
import type { User } from "@src/store/auth/auth.state";
import { store as reduxStore } from "@src/store/redux/store";
import { profileActions as reduxProfileActions } from "../redux/slices/profile.slice";
import { profileStore as zustandProfileStore } from "../zustand/profile.store";

export const profileController = {
  getState: () =>
    featureFlags.useRedux
      ? reduxStore.getState().profile
      : zustandProfileStore.getState(),

  async loadProfile() {
    if (featureFlags.useRedux) {
      reduxStore.dispatch(reduxProfileActions.setLoading(true));
      try {
        const user = await getMe();
        reduxStore.dispatch(reduxProfileActions.setProfile(user));
        reduxStore.dispatch(reduxProfileActions.setError(null));
        if (user)
          authController.setAuth(
            user,
            authController.getAccessToken() ?? "",
            authController.getRefreshToken() ?? ""
          );
      } catch {
        reduxStore.dispatch(
          reduxProfileActions.setError("Greška pri učitavanju profila")
        );
      } finally {
        reduxStore.dispatch(reduxProfileActions.setLoading(false));
      }
    } else {
      const zustandActions = zustandProfileStore.getState();
      zustandActions.setLoading(true);
      try {
        const user = await getMe();
        zustandActions.setProfile(user);
        zustandActions.setError(null);
        if (user)
          authController.setAuth(
            user,
            authController.getAccessToken() ?? "",
            authController.getRefreshToken() ?? ""
          );
      } catch {
        zustandActions.setError("Greška pri učitavanju profila");
      } finally {
        zustandActions.setLoading(false);
      }
    }
  },

  async updateProfile(patch: Partial<User>) {
    if (featureFlags.useRedux) {
      reduxStore.dispatch(reduxProfileActions.setUpdating(true));
      try {
        const updated = await updateMe(patch);
        reduxStore.dispatch(reduxProfileActions.patchProfileLocal(updated));
        reduxStore.dispatch(reduxProfileActions.setUpdateError(null));
        const current = profileController.getState().profile;
        if (current)
          authController.setAuth(
            current,
            authController.getAccessToken() ?? "",
            authController.getRefreshToken() ?? ""
          );
      } catch {
        reduxStore.dispatch(
          reduxProfileActions.setUpdateError("Greška pri izmeni profila")
        );
      } finally {
        reduxStore.dispatch(reduxProfileActions.setUpdating(false));
      }
    } else {
      const zustandActions = zustandProfileStore.getState();
      zustandActions.setUpdating(true);
      try {
        const updated = await updateMe(patch);
        zustandActions.patchProfileLocal(updated);
        zustandActions.setUpdateError(null);
        const current = profileController.getState().profile;
        if (current)
          authController.setAuth(
            current,
            authController.getAccessToken() ?? "",
            authController.getRefreshToken() ?? ""
          );
      } catch {
        zustandActions.setUpdateError("Greška pri izmeni profila");
      } finally {
        zustandActions.setUpdating(false);
      }
    }
  },
  async changePassword(params: {
    currentPassword: string;
    newPassword: string;
  }) {
    if (featureFlags.useRedux) {
      reduxStore.dispatch(reduxProfileActions.setChangingPassword(true));
      try {
        await changePassword(params);
        reduxStore.dispatch(reduxProfileActions.setChangePasswordError(null));
      } catch {
        reduxStore.dispatch(
          reduxProfileActions.setChangePasswordError(
            "Greška pri promeni lozinke"
          )
        );
      } finally {
        reduxStore.dispatch(reduxProfileActions.setChangingPassword(false));
      }
    } else {
      const zustandActions = zustandProfileStore.getState();
      zustandActions.setChangingPassword(true);
      try {
        await changePassword(params);
        zustandActions.setChangePasswordError(null);
      } catch {
        zustandActions.setChangePasswordError("Greška pri promeni lozinke");
      } finally {
        zustandActions.setChangingPassword(false);
      }
    }
  },
};
