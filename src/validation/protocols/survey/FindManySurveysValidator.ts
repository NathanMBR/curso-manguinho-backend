import { ValidationResponse } from "../../models";
import { FindManySurveysRequest } from "../../../presentation/models";

export namespace FindManySurveysValidator {
  export type Request = unknown;

  export type Response = ValidationResponse<FindManySurveysRequest>;

  export interface Protocol {
    validate(data: FindManySurveysValidator.Request): FindManySurveysValidator.Response;
  }
}