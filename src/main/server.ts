import { createApp } from "./app";
import { PORT } from "./config";

const startServer = async (port: number) => {
  const app = await createApp();

  const address = await app.listen(
    {
      port
    }
  );

  console.log(`Server online at ${address}`);
};

startServer(PORT);