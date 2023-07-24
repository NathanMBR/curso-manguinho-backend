import { ValidationResponse } from "../../models";
import { AddSurveyRequest } from "../../../presentation/models";

export namespace AddSurveyValidator {
  export type Request = unknown;

  export type Response = ValidationResponse<AddSurveyRequest>;

  export interface Protocol {
    validate(data: AddSurveyValidator.Request): AddSurveyValidator.Response;
  }
}