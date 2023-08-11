import { ValidationResponse } from "../../models";
import { FindOneSurveyRequest } from "../../../presentation/models";

export namespace FindOneSurveyValidator {
  export type Request = unknown;

  export type Response = ValidationResponse<FindOneSurveyRequest>;

  export interface Protocol {
    validate(data: FindOneSurveyValidator.Request): FindOneSurveyValidator.Response;
  }
}
