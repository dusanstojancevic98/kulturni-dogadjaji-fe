import type {
  Institution,
  InstitutionFilters,
  InstitutionOption,
  InstitutionWithDistance,
  PaginatedInstitutions,
} from "@src/models/institution.types";
import { api } from "@src/services/api";

export const getInstitutions = async (
  filters: InstitutionFilters = {}
): Promise<PaginatedInstitutions> => {
  const res = await api.get("/institutions", {
    params: { ...filters },
  });
  return res.data as PaginatedInstitutions;
};

export const getInstitutionById = async (id: string): Promise<Institution> => {
  const res = await api.get(`/institutions/${id}`);
  return res.data as Institution;
};

export type CreateInstitutionPayload = Omit<
  Institution,
  "id" | "_count" | "events"
>;

export const createInstitution = async (
  payload: CreateInstitutionPayload
): Promise<Institution> => {
  const res = await api.post("/institutions", payload);
  return res.data as Institution;
};

export const updateInstitution = async (
  id: string,
  payload: Partial<Omit<Institution, "id" | "_count" | "events">>
): Promise<Institution> => {
  const res = await api.put(`/institutions/${id}`, payload);
  return res.data as Institution;
};

export const deleteInstitution = async (id: string): Promise<{ ok: true }> => {
  const res = await api.delete(`/institutions/${id}`);
  return res.data as { ok: true };
};

export const getInstitutionsSelect = async (
  q?: string
): Promise<InstitutionOption[]> => {
  const res = await api.get("/institutions/select", { params: { q } });
  return res.data as InstitutionOption[];
};

export const getInstitutionsNear = async (
  lat: number,
  lng: number,
  radiusKm = 10
): Promise<InstitutionWithDistance[]> => {
  const res = await api.get("/institutions/near", {
    params: { lat, lng, radiusKm },
  });
  return res.data as InstitutionWithDistance[];
};
