import { Account } from "../models";

export namespace AddAccount {
  export type Request = {
    name: string;
    email: string;
    password: string;
  };

  export type Response = Account;

  export interface Contract {
    add(account: AddAccount.Request): AddAccount.Response;
  }
}