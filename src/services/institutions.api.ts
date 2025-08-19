import type {
  Institution,
  InstitutionFilters,
  InstitutionOption,
  PaginatedInstitutions,
} from "@src/models/institution.types";
import { api } from "@src/services/api";

export const getInstitutions = async (
  page = 1,
  pageSize = 12,
  filters: Omit<InstitutionFilters, "page" | "pageSize"> = {}
): Promise<PaginatedInstitutions> => {
  const res = await api.get("/institutions", {
    params: { page, pageSize, ...filters },
  });
  return res.data as PaginatedInstitutions;
};

export const getInstitutionById = async (id: string): Promise<Institution> => {
  const res = await api.get(`/institutions/${id}`);
  return res.data as Institution;
};

export const createInstitution = async (
  payload: Omit<Institution, "id" | "_count" | "events">
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
