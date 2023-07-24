import { ValidationResponse } from "../../models";

export namespace AddSurveyValidator {
  export type Request = unknown;

  export type Response = ValidationResponse;

  export interface Protocol {
    validate(data: AddSurveyValidator.Request): AddSurveyValidator.Response;
  }
}