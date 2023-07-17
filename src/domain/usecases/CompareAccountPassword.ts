import { Account } from "../models";

export namespace CompareAccountPassword {
  export type Request = {
    password: Account["password"];
    hash: string;
  };

  export type Response = Promise<boolean>;

  export interface Protocol {
    comparePassword(request: CompareAccountPassword.Request): CompareAccountPassword.Response
  }
}