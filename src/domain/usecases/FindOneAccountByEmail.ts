import { Account } from "../models";

export namespace FindOneAccountByEmail {
  export type Request = {
    email: string;
  };

  export type Response = Promise<Account | null>;

  export interface Protocol {
    findOneByEmail(account: FindOneAccountByEmail.Request): FindOneAccountByEmail.Response;
  }
}