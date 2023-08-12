import {
  UserAnswer,
  Survey
} from "../../models";

export namespace AddUserAnswer {
  export type Request = {
    survey: Survey;
    accountId: string;
    userAnswers: Array<Omit<UserAnswer, "id" | "accountId">>;
  };

  type SuccessfulResponse = {
    success: true;
  };

  type FailureResponse = {
    success: false;
    errorMessage: string;
  };

  type PossibleResponses = SuccessfulResponse | FailureResponse;

  export type Response = Promise<PossibleResponses>;

  export interface Protocol {
    add(request: AddUserAnswer.Request): AddUserAnswer.Response;
  }
}
