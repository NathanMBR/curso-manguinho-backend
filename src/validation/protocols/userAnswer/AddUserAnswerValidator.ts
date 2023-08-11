import { ValidationResponse } from "../../models";
import { AddUserAnswerRequest } from "../../../presentation/models";

export namespace AddUserAnswerValidator {
  export type Request = unknown;

  export type Response = ValidationResponse<AddUserAnswerRequest>;

  export interface Protocol {
    validate(data: AddUserAnswerValidator.Request): AddUserAnswerValidator.Response;
  }
}
