import { ValidationResponse } from "../../models";
import { SignUpRequest } from "../../../presentation/models";

export namespace SignUpValidator {
  export type Request = unknown;

  export type Response = ValidationResponse<SignUpRequest>;

  export interface Protocol {
    validate(data: SignUpValidator.Request): SignUpValidator.Response;
  }
}