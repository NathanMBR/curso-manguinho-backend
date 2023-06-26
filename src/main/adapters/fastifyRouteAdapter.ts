import { FastifyRequest, FastifyReply } from "fastify";

import { Controller } from "../../presentation/protocols";

export const fastifyRouteAdapter = (controller: Controller.Protocol) => {
  const fastifyRoute = async (
    request: FastifyRequest,
    response: FastifyReply
  ) => {
    const httpRequest: Controller.Request = {
      body: request.body
    };

    const controllerResponse = await controller.handle(httpRequest);
    return response
      .status(controllerResponse.statusCode)
      .send(controllerResponse.body);
  };

  return fastifyRoute;
};