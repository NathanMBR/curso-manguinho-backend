import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRegisterOptions,
  HookHandlerDoneFunction
} from "fastify";

import { makeAddSurveyController } from "../../factories";
import { fastifyRouteAdapter } from "../../adapters";

export const surveyRoutes = (
  app: FastifyInstance,
  _options: FastifyRegisterOptions<FastifyPluginOptions>,
  done: HookHandlerDoneFunction
) => {
  const addSurveyController = makeAddSurveyController();

  const addSurveyRoute = fastifyRouteAdapter(addSurveyController);

  app.post("/", addSurveyRoute);

  return done();
};