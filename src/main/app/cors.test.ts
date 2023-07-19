import { FastifyInstance } from "fastify";
import supertest from "supertest";
import {
  describe,
  beforeAll,
  afterAll,
  it
} from "@jest/globals";

import { createApp } from "./createApp";

describe("CORS Test", () => {
  let app: FastifyInstance;
  let request: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    app = await createApp();
    request = supertest(app.server);

    app.get("/test", (_request, response) => response.send());
  
    await app.listen();
  });
  
  afterAll(async () => {
    await app.close();
  });

  it("should enable access from any origin", async () => {
    await request
      .get("/test")
      .expect("access-control-allow-origin", "*");
  });
});