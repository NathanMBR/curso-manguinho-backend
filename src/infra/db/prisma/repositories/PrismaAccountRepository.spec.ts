import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import { prisma } from "../prisma";
import { PrismaAccountRepository } from "./PrismaAccountRepository";

interface GetSUTEnvironmentResponse {
  SUT: PrismaAccountRepository
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  const SUT = new PrismaAccountRepository();
  
  return {
    SUT
  };
};

describe("Prisma Account Repository", () => {
  it("should successfully add an account", async () => {
    const { SUT } = getSUTEnvironment();

    const accountData = {
      name: "Test Name",
      email: "test@email.com",
      password: "test1234"
    };

    jest.spyOn(prisma.account, "create").mockImplementationOnce(
      () => Promise.resolve(accountData) as any
    );

    const account = await SUT.add(accountData);
    expect(account).toEqual(accountData);
  });

  it("should pass account data to prisma", async () => {
    const { SUT } = getSUTEnvironment();

    const accountData = {
      name: "Test Name",
      email: "test@email.com",
      password: "test1234"
    };

    const createSpy = jest.spyOn(prisma.account, "create");

    createSpy.mockImplementationOnce(
      () => Promise.resolve(accountData) as any
    );

    await SUT.add(accountData);

    expect(createSpy).toBeCalledWith(
      {
        data: accountData
      }
    );
  });

  it("should repass prisma errors to upper level", async () => {
    const { SUT } = getSUTEnvironment();

    const accountData = {
      name: "Test Name",
      email: "test@email.com",
      password: "test1234"
    };

    jest.spyOn(prisma.account, "create").mockImplementationOnce(
      () => {
        throw new Error();
      }
    );

    const SUTResponse = SUT.add(accountData);
    await expect(SUTResponse).rejects.toThrow();
  });
});