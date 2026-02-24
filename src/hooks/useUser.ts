export type TUser = {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
  phone?: string;
  address?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
};