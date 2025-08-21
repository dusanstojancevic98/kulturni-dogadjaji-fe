import { featureFlags } from "@src/config/featureFlags";
import { store as reduxStore } from "@src/store/redux/store";
import { institutionsStore as zustandInstitutionsStore } from "@src/store/zustand/institutions.store";

import {
  createInstitution,
  deleteInstitution,
  getInstitutionById,
  getInstitutions,
  getInstitutionsNear,
  updateInstitution,
  type CreateInstitutionPayload,
} from "@src/services/institutions.api";

import { useAppSelector } from "@src/hooks/redux/useAppSelector";
import type {
  Institution,
  InstitutionFilters,
} from "@src/models/institution.types";
import type { NearParams } from "@src/store/institutions/institutions.state";
import { institutionsActions } from "../redux/slices/institutions.slice";

export const institutionsController = {
  getState: () =>
    featureFlags.useRedux
      ? reduxStore.getState().institutions
      : zustandInstitutionsStore.getState(),

  setFilters: (filters: InstitutionFilters) => {
    if (featureFlags.useRedux) {
      reduxStore.dispatch(institutionsActions.setFilters(filters));
    } else {
      zustandInstitutionsStore.getState().setFilters(filters);
    }
  },

  async loadList() {
    const { filters } = institutionsController.getState();

    if (featureFlags.useRedux) {
      reduxStore.dispatch(institutionsActions.setLoading(true));
      try {
        const response = await getInstitutions(filters);
        reduxStore.dispatch(
          institutionsActions.setData({
            items: response.items,
            total: response.total,
          })
        );
        reduxStore.dispatch(institutionsActions.setError(null));
      } catch {
        reduxStore.dispatch(
          institutionsActions.setError("Greška pri učitavanju institucija")
        );
      } finally {
        reduxStore.dispatch(institutionsActions.setLoading(false));
      }
    } else {
      const zustandActions = zustandInstitutionsStore.getState();
      zustandActions.setLoading(true);
      try {
        const response = await getInstitutions(filters);
        zustandActions.setData(response.items, response.total);
        zustandActions.setError(null);
      } catch {
        zustandActions.setError("Greška pri učitavanju institucija");
      } finally {
        zustandActions.setLoading(false);
      }
    }
  },

  async ensureDetailLoaded(institutionId: string) {
    const current = institutionsController.getState().byId[institutionId];
    if (current) return current;
    const fetched = await getInstitutionById(institutionId);
    if (featureFlags.useRedux) {
      reduxStore.dispatch(
        institutionsActions.setInstitution({
          id: institutionId,
          institution: fetched,
        })
      );
    } else {
      zustandInstitutionsStore
        .getState()
        .setInstitution(institutionId, fetched);
    }
    return fetched;
  },

  setDetailLocal(institutionId: string, patch: Partial<Institution>) {
    if (featureFlags.useRedux) {
      reduxStore.dispatch(
        institutionsActions.patchInstitution({ id: institutionId, patch })
      );
    } else {
      zustandInstitutionsStore
        .getState()
        .patchInstitution(institutionId, patch);
    }
  },

  async create(payload: CreateInstitutionPayload) {
    const created = await createInstitution(payload);
    if (featureFlags.useRedux) {
      reduxStore.dispatch(institutionsActions.upsertIntoList(created));
      reduxStore.dispatch(
        institutionsActions.setInstitution({
          id: created.id,
          institution: created,
        })
      );
    } else {
      const zustandActions = zustandInstitutionsStore.getState();
      zustandActions.upsertIntoList(created);
      zustandActions.setInstitution(created.id, created);
    }
    return created;
  },

  async update(institutionId: string, payload: Partial<Institution>) {
    const updated = await updateInstitution(institutionId, payload);
    if (featureFlags.useRedux) {
      reduxStore.dispatch(
        institutionsActions.patchInstitution({
          id: institutionId,
          patch: updated,
        })
      );
    } else {
      zustandInstitutionsStore
        .getState()
        .patchInstitution(institutionId, updated);
    }
    return updated;
  },

  async remove(institutionId: string) {
    await deleteInstitution(institutionId);
    if (featureFlags.useRedux) {
      reduxStore.dispatch(institutionsActions.removeFromList(institutionId));
    } else {
      zustandInstitutionsStore.getState().removeFromList(institutionId);
    }
  },

  async loadNear(params: NearParams) {
    if (featureFlags.useRedux) {
      reduxStore.dispatch(institutionsActions.setNearLoading(true));
      try {
        const items = await getInstitutionsNear(
          params.lat,
          params.lng,
          params.radiusKm
        );
        reduxStore.dispatch(institutionsActions.setNearData({ params, items }));
        reduxStore.dispatch(institutionsActions.setNearError(null));
      } catch {
        reduxStore.dispatch(
          institutionsActions.setNearError("Greška pri učitavanju lokacija")
        );
      } finally {
        reduxStore.dispatch(institutionsActions.setNearLoading(false));
      }
    } else {
      const zustandActions = zustandInstitutionsStore.getState();
      zustandActions.setNearLoading(true);
      try {
        const items = await getInstitutionsNear(
          params.lat,
          params.lng,
          params.radiusKm
        );
        zustandActions.setNearData(params, items);
        zustandActions.setNearError(null);
      } catch {
        zustandActions.setNearError("Greška pri učitavanju lokacija");
      } finally {
        zustandActions.setNearLoading(false);
      }
    }
  },
};

export const useInstitutions = () => {
  const redux = useAppSelector((state) => state.institutions);
  const zustand = zustandInstitutionsStore();
  return featureFlags.useRedux ? redux : zustand;
};
