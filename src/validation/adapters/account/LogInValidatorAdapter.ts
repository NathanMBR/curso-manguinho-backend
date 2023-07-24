import { Validator } from "../../../presentation/protocols";
import { LogInRequest } from "../../../presentation/models";
import { LogInValidator } from "../../protocols";
import { adaptValidatorResponse } from "../../helpers";

export class LogInValidatorAdapter implements Validator.Protocol<LogInRequest> {
  constructor(
    private readonly logInValidator: LogInValidator.Protocol
  ) {}

  validate(data: unknown): Validator.Response<LogInRequest> {
    const logInValidation = this.logInValidator.validate(data);

    return adaptValidatorResponse(logInValidation);
  };
}