import {
  FastifyRequest,
  FastifyReply
} from "fastify";

import {
  Controller,
  Middleware
} from "../../presentation/protocols";

export const fastifyRouteAdapter = (
  controller: Controller.Protocol,
  ...middlewares: Array<Middleware.Protocol>
) => {
  const fastifyRoute = async (
    request: FastifyRequest,
    response: FastifyReply
  ): Promise<FastifyReply> => {
    let httpRequest: Controller.Request = {
      body: request.body
    };

    for (const middleware of middlewares) {
      const middlewareResponse = await middleware.handle(httpRequest);

      if (!middlewareResponse.success)
        return response
          .status(middlewareResponse.httpResponse.statusCode)
          .send(middlewareResponse.httpResponse.body);

      httpRequest = middlewareResponse.httpRequest;
    }

    const { statusCode, body } = await controller.handle(httpRequest);

    const isBodyAnError = body instanceof Error;
    if (isBodyAnError)
      return response
        .status(statusCode)
        .send(
          {
            error: body.name,
            message: body.message
          }
        );

    return response
      .status(statusCode)
      .send(body);
  };

  return fastifyRoute;
};