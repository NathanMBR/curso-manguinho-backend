import { ValidationResponse } from "../models";

export namespace SignUpValidator {
  export type Request = unknown;

  export type Response = ValidationResponse;

  export interface Protocol {
    validate(data: SignUpValidator.Request): SignUpValidator.Response;
  }
}