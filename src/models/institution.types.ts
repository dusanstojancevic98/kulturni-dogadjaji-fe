export type InstitutionType = "MUSEUM" | "GALLERY" | "THEATER";

export const InstitutionTypeLabels: Record<InstitutionType, string> = {
  MUSEUM: "Muzej",
  GALLERY: "Galerija",
  THEATER: "Pozorište",
};

export type Institution = {
  id: string;
  name: string;
  description: string;
  type: InstitutionType;
  address: string;
  contactEmail: string;
  imageUrl: string;
  _count?: { events: number };
  events?: Array<{
    id: string;
    title: string;
    dateTime: string;
    imageUrl: string;
    type: string;
  }>;
};

export type InstitutionOption = { id: string; name: string };

export type InstitutionFilters = {
  q?: string;
  type?: InstitutionType;
  page?: number;
  pageSize?: number;
};

export type PaginatedInstitutions = {
  items: Institution[];
  total: number;
  page: number;
  pageSize: number;
};
