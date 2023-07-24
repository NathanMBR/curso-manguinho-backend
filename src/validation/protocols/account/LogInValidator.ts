import { ValidationResponse } from "../../models";
import { LogInRequest } from "../../../presentation/models";

export namespace LogInValidator {
  export type Request = unknown;

  export type Response = ValidationResponse<LogInRequest>;

  export interface Protocol {
    validate(request: LogInValidator.Request): LogInValidator.Response;
  }
}