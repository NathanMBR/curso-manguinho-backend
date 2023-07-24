import { Validator } from "../../../presentation/protocols";
import { SignUpValidator } from "../../protocols";
import { adaptValidatorResponse } from "../../helpers";

export class SignUpValidatorAdapter implements Validator.Protocol {
  constructor(
    private readonly signUpValidator: SignUpValidator.Protocol
  ) {}

  validate(data: unknown): Validator.Response {
    const signUpValidation = this.signUpValidator.validate(data);

    return adaptValidatorResponse(signUpValidation);
  };
}