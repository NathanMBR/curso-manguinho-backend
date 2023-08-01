import {
  describe,
  beforeAll,
  afterAll,
  it,
  expect
} from "@jest/globals";
import { FastifyInstance } from "fastify";
import supertest from "supertest";

import { prisma } from "../../infra/db";
import { createApp } from "./createApp";

describe("CORS Test", () => {
  let app: FastifyInstance;
  let request: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    await prisma.$connect();

    app = await createApp();
    request = supertest(app.server);

    app.get("/test", (_request, response) => response.send());
  
    await app.listen();
  });
  
  afterAll(async () => {
    await app.close();

    await prisma.$disconnect();
  });

  it("should enable access from any origin", async () => {
    const response = await request.get("/test");

    expect(response.headers["access-control-allow-origin"]).toBe("*");
  });
});