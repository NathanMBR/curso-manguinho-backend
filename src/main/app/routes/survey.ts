import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRegisterOptions,
  HookHandlerDoneFunction
} from "fastify";

import {
  makeAddSurveyController,
  makeFindManySurveysController,
  makeFindOneSurveyController,

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
  const findManySurveysController = makeFindManySurveysController();
  const findOneSurveyController = makeFindOneSurveyController();

  const authenticationMiddleware = makeAuthenticationMiddleware();
  const adminMiddleware = makeAdminMiddleware();

  const addSurveyRoute = fastifyRouteAdapter(
    addSurveyController,
    authenticationMiddleware,
    adminMiddleware
  );

  const findManySurveysRoute = fastifyRouteAdapter(
    findManySurveysController,
    authenticationMiddleware
  );

  const findOneSurveyRoute = fastifyRouteAdapter(
    findOneSurveyController,
    authenticationMiddleware
  );

  app.post("/", addSurveyRoute);
  app.get("/", findManySurveysRoute);
  app.get("/:id", findOneSurveyRoute);

  return done();
};
