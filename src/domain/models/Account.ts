export type AccountType = "COMMON" | "ADMIN";

export interface Account {
  id: string;
  name: string;
  email: string;
  password: string;
  type: AccountType;
}