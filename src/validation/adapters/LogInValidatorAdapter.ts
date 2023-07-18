import { Validator } from "../../presentation/protocols";
import { LogInValidator } from "../protocols";
import { adaptValidatorResponse } from "../helpers";

export class LogInValidatorAdapter implements Validator.Protocol {
  constructor(
    private readonly logInValidator: LogInValidator.Protocol
  ) {}

  validate(data: unknown): Validator.Response {
    const logInValidation = this.logInValidator.validate(data);

    return adaptValidatorResponse(logInValidation);
  };
}