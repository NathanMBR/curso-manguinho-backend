import { RepositoryAccount } from "../models";

export namespace AddAccountRepository {
  export type Request = {
    name: string;
    email: string;
    password: string;
  };

  export type Response = Promise<RepositoryAccount>;

  export interface Protocol {
    add(account: AddAccountRepository.Request): AddAccountRepository.Response;
  }
}