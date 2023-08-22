import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRegisterOptions,
  HookHandlerDoneFunction
} from "fastify";

import {
  makeSignUpController,
  makeLogInController
} from "../../../factories";
import { fastifyRouteAdapter } from "../../../adapters";

export const accountRoutes = (
  app: FastifyInstance,
  _options: FastifyRegisterOptions<FastifyPluginOptions>,
  done: HookHandlerDoneFunction
) => {
  const signUpController = makeSignUpController();
  const logInController = makeLogInController();

  const signUpRoute = fastifyRouteAdapter(signUpController);
  const logInRoute = fastifyRouteAdapter(logInController);

  app.post("/signup", signUpRoute);
  app.post("/login", logInRoute);

  return done();
};
