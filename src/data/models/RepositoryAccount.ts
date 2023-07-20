export type RepositoryAccountType = "COMMON" | "ADMIN";

export interface RepositoryAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  type: RepositoryAccountType;
};