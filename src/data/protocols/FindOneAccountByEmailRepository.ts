import { RepositoryAccount } from "../models";

export namespace FindOneAccountByEmailRepository {
  export type Request = {
    email: string;
  };

  export type Response = Promise<RepositoryAccount | null>;

  export interface Protocol {
    findOneByEmail(account: FindOneAccountByEmailRepository.Request): FindOneAccountByEmailRepository.Response;
  }
}