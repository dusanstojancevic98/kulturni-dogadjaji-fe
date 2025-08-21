import type {
  Institution,
  InstitutionFilters,
  InstitutionWithDistance,
} from "@src/models/institution.types";

export type NearParams = {
  lat: number;
  lng: number;
  radiusKm: number;
};
export type InstitutionsState = {
  items: Institution[];
  total: number;
  loading: boolean;
  error?: string | null;
  filters: InstitutionFilters;

  byId: Record<string, Institution | undefined>;

  nearItems: InstitutionWithDistance[];
  nearParams?: NearParams;
  nearLoading: boolean;
  nearError?: string | null;
};

export const initialInstitutionsState: InstitutionsState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  filters: {
    page: 1,
    pageSize: 12,
  },
  byId: {},
  nearItems: [],
  nearParams: undefined,
  nearLoading: false,
  nearError: null,
};
