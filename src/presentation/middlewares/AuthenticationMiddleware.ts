import { Middleware } from "../protocols";
import { VerifyAccountAuthentication } from "../../domain/usecases"
import { HttpResponseHelper } from "../helpers";
import {
  MissingAuthenticationError,
  InvalidAuthenticationError
} from "../errors";

export class AuthenticationMiddleware implements Middleware.Protocol {
  constructor(
    private readonly verifyAccountAuthentication: VerifyAccountAuthentication.Protocol
  ) {}

  async handle(httpRequest: Middleware.Request): Middleware.Response {
    if (!httpRequest.headers || !httpRequest.headers.authorization)
      return Promise.resolve(
        {
          success: false,
          httpResponse: HttpResponseHelper.unauthorized(
            new MissingAuthenticationError()
          )
        }
      );

      const [
        authenticationType,
        authenticationToken
      ] = httpRequest.headers.authorization.split(" ");

      if (authenticationType !== "Bearer")
        return Promise.resolve(
          {
            success: false,
            httpResponse: HttpResponseHelper.unauthorized(
              new InvalidAuthenticationError("Authentication token must be a Bearer token")
            )
          }
        );

      if (!authenticationToken)
        return Promise.resolve(
          {
            success: false,
            httpResponse: HttpResponseHelper.unauthorized(
              new MissingAuthenticationError()
            )
          }
        )

      const verifyAccountAuthenticationResponse = this.verifyAccountAuthentication.verify(
        {
          token: authenticationToken
        }
      );

      if (!verifyAccountAuthenticationResponse.isAuthenticationValid)
        return Promise.resolve(
          {
            success: false,
            httpResponse: HttpResponseHelper.unauthorized(
              new InvalidAuthenticationError("Authentication token is invalid, expired or not allowed yet")
            )
          }
        );

      return Promise.resolve(
        {
          success: true,
          httpRequest: {
            ...httpRequest,
            authenticationData: {
              id: verifyAccountAuthenticationResponse.authenticationData.sub,
              email: verifyAccountAuthenticationResponse.authenticationData.email,
              type: verifyAccountAuthenticationResponse.authenticationData.type
            }
          }
        }
      );
  }
}