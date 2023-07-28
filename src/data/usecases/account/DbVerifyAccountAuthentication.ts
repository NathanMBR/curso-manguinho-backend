import { VerifyAccountAuthentication } from "../../../domain/usecases";
import { TokenVerifier } from "../../protocols";

export class DbVerifyAccountAuthentication implements VerifyAccountAuthentication.Protocol {
  constructor(
    private readonly tokenVerifier: TokenVerifier.Protocol
  ) {}

  verify(request: VerifyAccountAuthentication.Request): VerifyAccountAuthentication.Response {
    const tokenVerifierResponse = this.tokenVerifier.verify(request);

    if (!tokenVerifierResponse.isValid)
      return {
        isAuthenticationValid: false,
        error: tokenVerifierResponse.error
      };

    return {
      isAuthenticationValid: true,
      authenticationData: tokenVerifierResponse.tokenData
    };
  }
}