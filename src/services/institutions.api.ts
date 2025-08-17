import type {
  Institution,
  InstitutionOption,
} from "@src/models/institution.types";
import { api } from "@src/services/api";

export const getInstitutions = async (): Promise<Institution[]> => {
  const res = await api.get("/institutions");
  return Array.isArray(res.data) ? res.data : res.data.items ?? [];
};

export const getInstitutionsSelect = async (
  q?: string
): Promise<InstitutionOption[]> => {
  const res = await api.get("/institutions/select", { params: { q } });
  return res.data as InstitutionOption[];
};
