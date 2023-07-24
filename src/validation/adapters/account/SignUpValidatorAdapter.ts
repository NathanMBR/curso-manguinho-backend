import { Validator } from "../../../presentation/protocols";
import { SignUpRequest } from "../../../presentation/models";
import { SignUpValidator } from "../../protocols";
import { adaptValidatorResponse } from "../../helpers";

export class SignUpValidatorAdapter implements Validator.Protocol<SignUpRequest> {
  constructor(
    private readonly signUpValidator: SignUpValidator.Protocol
  ) {}

  validate(data: unknown): Validator.Response<SignUpRequest> {
    const signUpValidation = this.signUpValidator.validate(data);

    return adaptValidatorResponse(signUpValidation);
  };
}