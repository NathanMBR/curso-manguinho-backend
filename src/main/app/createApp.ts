import fastify from "fastify";
import cors from "@fastify/cors";

import { FASTIFY_LOGGER } from "../config";
import { fastifyRoutes } from "./routes";

export const createApp = async () => {
  const app = fastify(
    {
      logger: FASTIFY_LOGGER
    }
  );

  await app.register(cors);
  await app.register(fastifyRoutes, { prefix: "/api" });

  return app;
};