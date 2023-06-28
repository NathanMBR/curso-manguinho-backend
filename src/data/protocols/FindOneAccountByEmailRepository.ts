import { FindOneAccountByEmail } from "../../domain/usecases";

export namespace FindOneAccountByEmailRepository {
  export type Request = FindOneAccountByEmail.Request;

  export type Response = FindOneAccountByEmail.Response;

  export interface Protocol {
    findOneByEmail(account: FindOneAccountByEmailRepository.Request): FindOneAccountByEmailRepository.Response;
  }
}