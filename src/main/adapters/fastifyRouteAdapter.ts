import { FastifyRequest, FastifyReply } from "fastify";

import { Controller } from "../../presentation/protocols";

export const fastifyRouteAdapter = (controller: Controller.Protocol) => {
  const fastifyRoute = async (
    request: FastifyRequest,
    response: FastifyReply
  ): Promise<FastifyReply> => {
    const httpRequest: Controller.Request = {
      body: request.body
    };

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