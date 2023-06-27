import {
  Controller,
  EmailValidator
} from "../protocols";
import {
  MissingParamError,
  InvalidParamError
} from "../errors";
import { HttpResponseHelper } from "../helpers";
import { AddAccount } from "../../domain/usecases";

export class SignUpController implements Controller.Protocol {
  constructor(
    private readonly emailValidator: EmailValidator.Protocol,
    private readonly addAccount: AddAccount.Protocol
  ) {}

  async handle(httpRequest: Controller.Request) {
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
    const rawAccount = await this.addAccount.add(
      {
        name,
        email,
        password
      }
    );

    const account: Omit<typeof rawAccount, "password"> = {
      id: rawAccount.id,
      name: rawAccount.name,
      email: rawAccount.email
    };

    return HttpResponseHelper.ok(account);
  }
}