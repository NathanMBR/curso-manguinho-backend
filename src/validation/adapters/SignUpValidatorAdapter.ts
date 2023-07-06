import { Validator } from "../../presentation/protocols";
import { ValidationError } from "../../presentation/errors";
import { SignUpValidator } from "../protocols";

export class SignUpValidatorAdapter implements Validator.Protocol {
  constructor(
    private readonly signUpValidator: SignUpValidator.Protocol
  ) {}

  validate(data: unknown): Validator.Response {
    const signUpValidation = this.signUpValidator.validate(data);

    if (!signUpValidation.isValid)
      return {
        isValid: false,
        error: new ValidationError(signUpValidation.errors[0])
      } as const;

    return {
      isValid: true
    } as const;
  };
}