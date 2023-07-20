import {
  Controller,
  Validator
} from "../protocols";
import {
  FindOneAccountByEmail,
  AddAccount
} from "../../domain/usecases";
import { HttpResponseHelper } from "../helpers";
import {
  EmailAlreadyExistsError,
  ValidationError
} from "../errors";

export class SignUpController implements Controller.Protocol {
  constructor(
    private readonly signUpValidator: Validator.Protocol,
    private readonly findOneAccountByEmail: FindOneAccountByEmail.Protocol,
    private readonly addAccount: AddAccount.Protocol
  ) {}

  async handle(httpRequest: Controller.Request) {
    const requestValidation = this.signUpValidator.validate(httpRequest.body);

    if (!requestValidation.isValid)
      return HttpResponseHelper.badRequest(
        new ValidationError(requestValidation.errorMessage)
      );

    const {
      name,
      email,
      password
    } = httpRequest.body;

    const doesEmailAlreadyExist = await this.findOneAccountByEmail.findOneByEmail(
      {
        email
      }
    );

    if (doesEmailAlreadyExist)
      return HttpResponseHelper.badRequest(
        new EmailAlreadyExistsError()
      );

    const account = await this.addAccount.add(
      {
        name,
        email,
        password
      }
    );

    const sanitizedAccount: Omit<typeof account, "password"> = {
      id: account.id,
      name: account.name,
      email: account.email,
      type: account.type
    };

    return HttpResponseHelper.ok(sanitizedAccount);
  }
}