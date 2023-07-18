import { ValidationResponse } from "../models";

export namespace LogInValidator {
  export type Request = unknown;

  export type Response = ValidationResponse;

  export interface Protocol {
    validate(request: LogInValidator.Request): LogInValidator.Response;
  }
}