import { RepositoryUserAnswer } from "../../../models";

export namespace AddUserAnswerRepository {
  export type Request = {
    accountId: string;
    surveyId: string;
    userAnswers: Array<Omit<RepositoryUserAnswer, "id" | "accountId">>;
  };

  export type Response = Promise<void>;

  export interface Protocol {
    add(request: AddUserAnswerRepository.Request): AddUserAnswerRepository.Response;
  }
}
