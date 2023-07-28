import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRegisterOptions,
  HookHandlerDoneFunction
} from "fastify";

import {
  makeAddSurveyController,
  makeAuthenticationMiddleware,
  makeAdminMiddleware
} from "../../factories";
import { fastifyRouteAdapter } from "../../adapters";

export const surveyRoutes = (
  app: FastifyInstance,
  _options: FastifyRegisterOptions<FastifyPluginOptions>,
  done: HookHandlerDoneFunction
) => {
  const addSurveyController = makeAddSurveyController();

  const authenticationMiddleware = makeAuthenticationMiddleware();
  const adminMiddleware = makeAdminMiddleware();

  const addSurveyRoute = fastifyRouteAdapter(
    addSurveyController,
    authenticationMiddleware,
    adminMiddleware
  );

  app.post("/", addSurveyRoute);

  return done();
};