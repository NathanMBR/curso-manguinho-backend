import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRegisterOptions,
  HookHandlerDoneFunction
} from "fastify";

import { fastifyRouteAdapter } from "../../adapters";
import { makeSignUpController } from "../../factories";

export const accountRoutes = (
  app: FastifyInstance,
  _options: FastifyRegisterOptions<FastifyPluginOptions>,
  done: HookHandlerDoneFunction
) => {
  const signUpController = makeSignUpController();

  const signUpRoute = fastifyRouteAdapter(signUpController);

  app.post("/signup", signUpRoute);

  return done();
};