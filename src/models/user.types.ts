import type { UserRole } from "@src/store/auth/auth.state";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
};
