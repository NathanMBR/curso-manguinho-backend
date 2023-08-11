import { RepositoryUserAnswer } from "../../../models";

export namespace AddUserAnswerRepository {
  export type Request = Omit<RepositoryUserAnswer, "id" | "accountId">;

  export type Response = Promise<RepositoryUserAnswer>;

  export interface Protocol {
    add(request: AddUserAnswerRepository.Request): AddUserAnswerRepository.Response;
  }
}
