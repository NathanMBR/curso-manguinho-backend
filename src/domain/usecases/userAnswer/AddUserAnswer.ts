import { UserAnswer } from "../../models";

export namespace AddUserAnswer {
  export type Request = Omit<UserAnswer, "id">;

  export type Response = Promise<UserAnswer>;

  export interface Protocol {
    add(request: AddUserAnswer.Request): AddUserAnswer.Response;
  }
}
