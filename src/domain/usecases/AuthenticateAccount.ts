import { Account } from "../models";

export namespace AuthenticateAccount {
  export type Request = Account;

  export type Response = string;

  export interface Protocol {
    authenticate(request: AuthenticateAccount.Request): AuthenticateAccount.Response;
  }
}