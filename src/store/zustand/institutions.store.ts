import type {
  Institution,
  InstitutionFilters,
  InstitutionWithDistance,
} from "@src/models/institution.types";
import {
  initialInstitutionsState,
  type InstitutionsState,
  type NearParams,
} from "@src/store/institutions/institutions.state";
import { create } from "zustand";

type InstitutionsActions = {
  setLoading: (value: boolean) => void;
  setError: (message: string | null) => void;
  setData: (items: Institution[], total: number) => void;
  setFilters: (filters: InstitutionFilters) => void;

  setInstitution: (id: string, institution: Institution) => void;
  patchInstitution: (id: string, patch: Partial<Institution>) => void;
  upsertIntoList: (institution: Institution) => void;
  removeFromList: (id: string) => void;

  setNearLoading: (value: boolean) => void;
  setNearError: (message: string | null) => void;
  setNearData: (params: NearParams, items: InstitutionWithDistance[]) => void;
};

export const institutionsStore = create<
  InstitutionsState & InstitutionsActions
>((set) => ({
  ...initialInstitutionsState,

  setLoading: (value) => set({ loading: value }),
  setError: (message) => set({ error: message }),
  setData: (items, total) => set({ items, total }),
  setFilters: (filters) => set({ filters }),

  setInstitution: (id, institution) =>
    set((state) => ({
      byId: { ...state.byId, [id]: institution },
    })),
  patchInstitution: (id, patch) =>
    set((state) => {
      const existing = state.byId[id];
      const byId = { ...state.byId };
      if (existing) byId[id] = { ...existing, ...patch };
      const items = state.items.map((inst) =>
        inst.id === id ? { ...inst, ...patch } : inst
      );
      return { byId, items };
    }),
  upsertIntoList: (institution) =>
    set((state) => {
      const exists = state.items.some((i) => i.id === institution.id);
      const items = exists
        ? state.items.map((i) => (i.id === institution.id ? institution : i))
        : [institution, ...state.items];
      return { items, total: exists ? state.total : state.total + 1 };
    }),
  removeFromList: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
      total: Math.max(0, state.total - 1),
    })),

  setNearLoading: (value) => set({ nearLoading: value }),
  setNearError: (message) => set({ nearError: message }),
  setNearData: (params, items) => set({ nearParams: params, nearItems: items }),
}));
