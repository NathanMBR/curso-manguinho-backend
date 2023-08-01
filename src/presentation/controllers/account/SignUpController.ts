import {
  Controller,
  Validator
} from "../../protocols";
import {
  FindOneAccountByEmail,
  AddAccount
} from "../../../domain/usecases";
import {
  EmailAlreadyExistsError,
  ValidationError
} from "../../errors";
import { SignUpRequest } from "../../models";
import { HttpResponseHelper } from "../../helpers";

export class SignUpController implements Controller.Protocol {
  constructor(
    private readonly signUpValidator: Validator.Protocol<SignUpRequest>,
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
    } = requestValidation.data;

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

    return HttpResponseHelper.created(sanitizedAccount);
  }
}