import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  Institution,
  InstitutionFilters,
  InstitutionWithDistance,
} from "@src/models/institution.types";
import {
  initialInstitutionsState,
  type NearParams,
} from "@src/store/institutions/institutions.state";

const slice = createSlice({
  name: "institutions",
  initialState: initialInstitutionsState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setData(
      state,
      action: PayloadAction<{ items: Institution[]; total: number }>
    ) {
      state.items = action.payload.items;
      state.total = action.payload.total;
    },
    setFilters(state, action: PayloadAction<InstitutionFilters>) {
      state.filters = action.payload;
    },

    setInstitution(
      state,
      action: PayloadAction<{ id: string; institution: Institution }>
    ) {
      state.byId[action.payload.id] = action.payload.institution;
    },
    patchInstitution(
      state,
      action: PayloadAction<{ id: string; patch: Partial<Institution> }>
    ) {
      const existing = state.byId[action.payload.id];
      if (existing)
        state.byId[action.payload.id] = {
          ...existing,
          ...action.payload.patch,
        };
      state.items = state.items.map((inst) =>
        inst.id === action.payload.id
          ? { ...inst, ...action.payload.patch }
          : inst
      );
    },
    upsertIntoList(state, action: PayloadAction<Institution>) {
      const exists = state.items.some((i) => i.id === action.payload.id);
      state.items = exists
        ? state.items.map((i) =>
            i.id === action.payload.id ? action.payload : i
          )
        : [action.payload, ...state.items];
      if (!exists) state.total += 1;
    },
    removeFromList(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
      state.total = Math.max(0, state.total - 1);
    },

    setNearLoading(state, action: PayloadAction<boolean>) {
      state.nearLoading = action.payload;
    },
    setNearError(state, action: PayloadAction<string | null>) {
      state.nearError = action.payload;
    },
    setNearData(
      state,
      action: PayloadAction<{
        params: NearParams;
        items: InstitutionWithDistance[];
      }>
    ) {
      state.nearParams = action.payload.params;
      state.nearItems = action.payload.items;
    },
  },
});

export const institutionsReducer = slice.reducer;
export const institutionsActions = slice.actions;
