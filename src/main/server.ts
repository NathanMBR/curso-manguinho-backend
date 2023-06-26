import { createApp } from "./app";
import { PORT } from "./config";
import { prisma } from "../infra/db";

const startServer = async (port: number) => {
  await prisma.$connect();

  const app = await createApp();

  const address = await app.listen(
    {
      port
    }
  );

  console.log(`Server online at ${address}`);
};

startServer(PORT);