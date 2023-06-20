import { AddAccount } from "../../domain/usecases";

export namespace AddAccountRepository {
  export type Request = AddAccount.Request;

  export type Response = AddAccount.Response;

  export interface Protocol {
    add(account: AddAccountRepository.Request): AddAccountRepository.Response;
  }
}