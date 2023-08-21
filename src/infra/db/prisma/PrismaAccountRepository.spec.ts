import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";
import { PrismaClient } from "@prisma/client";

import { PrismaAccountRepository } from "./PrismaAccountRepository";

const prisma = new PrismaClient();

interface GetSUTEnvironmentResponse {
  SUT: PrismaAccountRepository
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  const SUT = new PrismaAccountRepository(
    prisma
  );

  return {
    SUT
  };
};

const returnAccountFunction: () => any = async () => Promise.resolve(
  {
    name: "Test Name",
    email: "test@email.com",
    password: "test1234"
  }
);

jest.spyOn(prisma.account, "create").mockImplementation(returnAccountFunction);
jest.spyOn(prisma.account, "findUnique").mockImplementation(returnAccountFunction);
jest.spyOn(prisma.account, "findFirst").mockImplementation(returnAccountFunction);

describe("Prisma AddAccount Repository", () => {
  it("should successfully add an account", async () => {
    const { SUT } = getSUTEnvironment();

    const accountData = {
      name: "Test Name",
      email: "test@email.com",
      password: "test1234"
    };

    const SUTResponse = await SUT.add(accountData);
    expect(SUTResponse).toEqual(accountData);
  });

  it("should pass account data to prisma", async () => {
    const { SUT } = getSUTEnvironment();

    const createSpy = jest.spyOn(prisma.account, "create");

    const accountData = {
      name: "Test Name",
      email: "test@email.com",
      password: "test1234"
    };

    await SUT.add(accountData);

    expect(createSpy).toBeCalledWith(
      {
        data: accountData
      }
    );
  });

  it("should repass prisma errors to upper level", async () => {
    const { SUT } = getSUTEnvironment();

    jest.spyOn(prisma.account, "create").mockImplementationOnce(
      () => {
        throw new Error();
      }
    );

    const accountData = {
      name: "Test Name",
      email: "test@email.com",
      password: "test1234"
    };

    const SUTResponse = SUT.add(accountData);
    await expect(SUTResponse).rejects.toThrow();
  });
});

describe("Prisma FindOneAccount Repository", () => {
  it("should successfully find an account", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      id: "test-id"
    };

    const SUTResponse = await SUT.findOne(SUTRequest);

    const expectedResponse = {
      name: "Test Name",
      email: "test@email.com",
      password: "test1234"
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should pass search data to prisma account find unique call", async () => {
    const { SUT } = getSUTEnvironment();

    const findUniqueSpy = jest.spyOn(prisma.account, "findUnique");

    const SUTRequest = {
      id: "test-id"
    };

    await SUT.findOne(SUTRequest);

    const expectedCall = {
      where: {
        id: SUTRequest.id
      }
    };

    expect(findUniqueSpy).toBeCalledWith(expectedCall);
  });

  it("should repass prisma account find unique errors to upper level", async () => {
    const { SUT } = getSUTEnvironment();

    jest.spyOn(prisma.account, "findUnique").mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = {
      id: "test-id"
    };

    const SUTResponse = SUT.findOne(SUTRequest);
    await expect(SUTResponse).rejects.toThrow();
  });
});

describe("Prisma FindOneAccountByEmail Repository", () => {
  it("should successfully find an account by email", async () => {
    const { SUT } = getSUTEnvironment();

    const searchData = {
      email: "search@email.com"
    };

    const accountData = {
      name: "Test Name",
      email: "test@email.com",
      password: "test1234"
    };

    const SUTResponse = await SUT.findOneByEmail(searchData);
    expect(SUTResponse).toEqual(accountData);
  });

  it("should pass search data to prisma", async () => {
    const { SUT } = getSUTEnvironment();

    const findFirstSpy = jest.spyOn(prisma.account, "findFirst");

    const searchData = {
      email: "search@email.com"
    };
    await SUT.findOneByEmail(searchData);

    expect(findFirstSpy).toBeCalledWith(
      {
        where: {
          email: searchData.email
        }
      }
    );
  });

  it("should repass prisma errors to upper level", async () => {
    const { SUT } = getSUTEnvironment();

    jest.spyOn(prisma.account, "findFirst").mockImplementationOnce(
      () => {
        throw new Error()
      }
    );

    const searchData = {
      email: "search@email.com"
    };

    const SUTResponse = SUT.findOneByEmail(searchData);
    await expect(SUTResponse).rejects.toThrow();
  });
});
