import fastify from "fastify";
import cors from "@fastify/cors";

import { FASTIFY_LOGGER } from "../config";

export const createApp = async () => {
  const app = fastify(
    {
      logger: FASTIFY_LOGGER
    }
  );

  await app.register(cors);

  return app;
};