import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRegisterOptions,
  HookHandlerDoneFunction
} from "fastify";

import { accountRoutes } from "./account";
import { surveyRoutes } from "./survey";

export const fastifyRoutes = async (
  app: FastifyInstance,
  _options: FastifyRegisterOptions<FastifyPluginOptions>,
  done: HookHandlerDoneFunction
) => {
  await app.register(accountRoutes, { prefix: "/account" });
  await app.register(surveyRoutes, { prefix: "/survey" });

  return done();
};
