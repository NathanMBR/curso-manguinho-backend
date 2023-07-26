import { RepositoryAccount } from "../../../models";

export namespace FindOneAccountRepository {
  export type Request = {
    id: string;
  };

  export type Response = Promise<RepositoryAccount | null>;

  export interface Protocol {
    findOne(account: FindOneAccountRepository.Request): FindOneAccountRepository.Response;
  }
}