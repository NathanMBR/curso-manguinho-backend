import {
  PORT,
  prisma
} from "./config";
import { createApp } from "./app";

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
