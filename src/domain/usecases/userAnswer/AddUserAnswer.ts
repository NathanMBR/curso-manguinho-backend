import { UserAnswer } from "../../models";

export namespace AddUserAnswer {
  export type Request = {
    accountId: string;
    userAnswers: Array<Omit<UserAnswer, "id" | "accountId">>;
  };

  export type Response = Promise<void>;

  export interface Protocol {
    add(request: AddUserAnswer.Request): AddUserAnswer.Response;
  }
}
