import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRegisterOptions,
  HookHandlerDoneFunction
} from "fastify";

import { accountRoutes } from "./account";

export const fastifyRoutes = async (
  app: FastifyInstance,
  _options: FastifyRegisterOptions<FastifyPluginOptions>,
  done: HookHandlerDoneFunction
) => {
  await app.register(accountRoutes, { prefix: "/account" });

  return done();
};