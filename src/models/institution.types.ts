export type Institution = {
  id: string;
  name: string;
  description: string;
  type: "MUSEUM" | "GALLERY" | "THEATER";
  address: string;
  contactEmail: string;
  imageUrl: string;
};

export type InstitutionOption = { id: string; name: string };
