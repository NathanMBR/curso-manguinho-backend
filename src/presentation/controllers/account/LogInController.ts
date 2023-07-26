import {
  Controller,
  Validator
} from "../../protocols";
import {
  FindOneAccountByEmail,
  CompareAccountPassword,
  AuthenticateAccount
} from "../../../domain/usecases";
import {
  ValidationError,
  NotFoundError,
  InvalidPasswordError
} from "../../errors";
import { HttpResponseHelper } from "../../helpers";
import { LogInRequest } from "../../models";

export class LogInController implements Controller.Protocol {
  constructor(
    private readonly logInValidator: Validator.Protocol<LogInRequest>,
    private readonly findOneAccountByEmail: FindOneAccountByEmail.Protocol,
    private readonly compareAccountPassword: CompareAccountPassword.Protocol,
    private readonly authenticateAccount: AuthenticateAccount.Protocol
  ) {}

  async handle(httpRequest: Controller.Request): Controller.Response {
    const requestValidation = this.logInValidator.validate(httpRequest.body);

    if (!requestValidation.isValid)
      return HttpResponseHelper.badRequest(
        new ValidationError(requestValidation.errorMessage)
      );

    const {
      email,
      password
    } = requestValidation.data;

    const account = await this.findOneAccountByEmail.findOneByEmail(
      {
        email
      }
    );

    if (!account)
      return HttpResponseHelper.notFound(
        new NotFoundError("Account e-mail not found")
      );

    const doesPasswordMatch = await this.compareAccountPassword.comparePassword(
      {
        password,
        hash: account.password
      }
    );

    if (!doesPasswordMatch)
      return HttpResponseHelper.unauthorized(
        new InvalidPasswordError()
      );

    const authenticationToken = this.authenticateAccount.authenticate(account);

    const sanitizedAccount: Omit<typeof account, "password"> = {
      id: account.id,
      name: account.name,
      email: account.email,
      type: account.type
    };

    return HttpResponseHelper.ok(
      {
        token: authenticationToken,
        account: sanitizedAccount
      }
    );
  }
}