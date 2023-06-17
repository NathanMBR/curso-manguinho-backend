import {
  Controller,
  EmailValidator
} from "../protocols";
import {
  MissingParamError,
  InvalidParamError
} from "../errors";
import { HttpResponseHelper } from "../helpers";

export class SignUpController implements Controller.Protocol {
  constructor(
    private readonly emailValidator: EmailValidator.Protocol
  ) {}

  handle(httpRequest: Controller.Request) {
    const requiredFields = [
      "name",
      "email",
      "password"
    ];

    for (const requiredField of requiredFields) {
      const fieldToCheck = httpRequest.body[requiredField];

      if (!fieldToCheck)
        return HttpResponseHelper.badRequest(
          new MissingParamError(requiredField)
        );
    }

    const isEmailValid = this.emailValidator.isValid(httpRequest.body.email);
    if (!isEmailValid)
      return HttpResponseHelper.badRequest(
        new InvalidParamError("email")
      );

    return HttpResponseHelper.ok("ok");
  }
}