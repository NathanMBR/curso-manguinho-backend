import {
  Controller,
  EmailValidator
} from "../protocols";
import {
  MissingParamError,
  InvalidParamError,
  InternalServerError
} from "../errors";
import { HttpResponseHelper } from "../helpers";
import { AddAccount } from "../../domain/usecases";

export class SignUpController implements Controller.Protocol {
  constructor(
    private readonly emailValidator: EmailValidator.Protocol,
    private readonly addAccount: AddAccount.Contract
  ) {}

  handle(httpRequest: Controller.Request) {
    try {
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


      const { name, email, password } = httpRequest.body;
      const account = this.addAccount.add(
        {
          name,
          email,
          password
        }
      ) as Partial<ReturnType<typeof this.addAccount.add>>;

      delete account.password;

      return HttpResponseHelper.ok(account);
    } catch(error) {
      // console.error(error);
      
      return HttpResponseHelper.internalServerError(
        new InternalServerError()
      );
    }
  }
}