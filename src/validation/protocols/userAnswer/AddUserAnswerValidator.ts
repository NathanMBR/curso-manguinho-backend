import { ValidationResponse } from "../../models";
import { AddSurveyRequest } from "../../../presentation/models";

export namespace AddUserAnswerValidator {
  export type Request = unknown;

  export type Response = ValidationResponse<AddSurveyRequest>;

  export interface Protocol {
    validate(data: AddUserAnswerValidator.Request): AddUserAnswerValidator.Response;
  }
}
