import { Account } from "../../models";

export namespace FindOneAccount {
  export type Request = {
    id: string;
  }

  export type Response = Promise<Account | null>;

  export interface Protocol {
    findOne(account: FindOneAccount.Request): FindOneAccount.Response;
  }
}