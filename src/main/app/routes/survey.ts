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
  makeAddSurveyAnswerController,

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
  const addSurveyAnswerController = makeAddSurveyAnswerController();

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

  const addSurveyAnswerRoute = fastifyRouteAdapter(
    addSurveyAnswerController,
    authenticationMiddleware
  );

  app.post("/", addSurveyRoute);
  app.get("/", findManySurveysRoute);
  app.get("/:id", findOneSurveyRoute);
  app.post("/:id/answer", addSurveyAnswerRoute);

  return done();
};
