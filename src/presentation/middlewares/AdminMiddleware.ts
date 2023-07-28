import { Middleware } from "../protocols";
import { HttpResponseHelper } from "../helpers";
import {
  MissingAuthenticationError,
  PermissionDeniedError
} from "../errors";

export class AdminMiddleware implements Middleware.Protocol {
  async handle(httpRequest: Middleware.Request): Middleware.Response {
    const { authenticationData } = httpRequest;

    if (!authenticationData)
      return Promise.resolve(
        {
          success: false,
          httpResponse: HttpResponseHelper.unauthorized(
            new MissingAuthenticationError()
          )
        }
      );

    if (authenticationData.type !== "ADMIN")
      return Promise.resolve(
        {
          success: false,
          httpResponse: HttpResponseHelper.forbidden(
            new PermissionDeniedError()
          )
        }
      );

    return Promise.resolve(
      {
        success: true,
        httpRequest
      }
    );
  }
}