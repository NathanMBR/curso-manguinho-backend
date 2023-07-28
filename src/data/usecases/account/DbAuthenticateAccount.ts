import { AuthenticateAccount } from "../../../domain/usecases";
import { TokenSigner } from "../../protocols";

export class DbAuthenticateAccount implements AuthenticateAccount.Protocol {
  constructor(
    private readonly tokenSigner: TokenSigner.Protocol
  ) {}

  authenticate(request: AuthenticateAccount.Request): AuthenticateAccount.Response {
    const {
      id,
      name,
      email,
      type
    } = request;

    const token = this.tokenSigner.sign(
      {
        id,
        data: {
          name,
          email,
          type
        }
      }
    );

    return token;
  }
}