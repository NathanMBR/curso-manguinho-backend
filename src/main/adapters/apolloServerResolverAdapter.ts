import { GraphQLError } from "graphql";

import {
  Controller,
  Middleware
} from "../../presentation/protocols";

export const apolloServerResolverAdapter = async (
  httpRequest: Controller.Request,
  controller: Controller.Protocol,
  ...middlewares: Array<Middleware.Protocol>
) => {
  for (const middleware of middlewares) {
    const middlewareResponse = await middleware.handle(httpRequest);

    if (!middlewareResponse.success)
      throw new GraphQLError(
        middlewareResponse.httpResponse.body.message,
        {
          extensions: {
            http: {
              status: middlewareResponse.httpResponse.statusCode
            }
          }
        }
      );

    httpRequest = middlewareResponse.httpRequest;
  }

  const httpResponse = await controller.handle(httpRequest);

  const isBodyAnError = httpResponse.body instanceof Error;
  if (isBodyAnError)
    throw new GraphQLError(
      httpResponse.body.message,
      {
        extensions: {
          http: {
            status: httpResponse.statusCode
          }
        }
      }
    );

  return httpResponse.body;
};
