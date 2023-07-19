import {
  Controller,
  Validator
} from "../protocols";
import {
  FindOneAccountByEmail,
  CompareAccountPassword,
  AuthenticateAccount
} from "../../domain/usecases";
import {
  ValidationError,
  NotFoundError,
  InvalidPasswordError
} from "../errors";
import { HttpResponseHelper } from "../helpers";

export class LogInController implements Controller.Protocol {
  constructor(
    private readonly logInValidator: Validator.Protocol,
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
    } = httpRequest.body;

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

    const accountWithoutPassword: Omit<typeof account, "password"> = {
      id: account.id,
      name: account.name,
      email: account.email
    };

    return HttpResponseHelper.ok(
      {
        token: authenticationToken,
        account: accountWithoutPassword
      }
    );
  }
}