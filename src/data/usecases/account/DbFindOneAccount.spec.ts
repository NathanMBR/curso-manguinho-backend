import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import { FindOneAccountRepository } from "../../protocols";
import { DbFindOneAccount } from "./DbFindOneAccount";

interface GetSUTEnvironmentResponse {
  findOneAccountRepository: FindOneAccountRepository.Protocol;

  SUT: DbFindOneAccount;
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  class FindOneAccountRepositoryStub implements FindOneAccountRepository.Protocol {
    async findOne(_request: FindOneAccountRepository.Request): FindOneAccountRepository.Response {
      const account = {
        id: "test-id",
        name: "Test Name",
        email: "test@email.com",
        password: "test1234",
        type: "COMMON" as const
      };

      return Promise.resolve(account);
    }
  }

  const findOneAccountRepository = new FindOneAccountRepositoryStub();

  const dbFindOneAccount = new DbFindOneAccount(
    findOneAccountRepository
  );

  return {
    findOneAccountRepository,

    SUT: dbFindOneAccount
  };
};

describe("DbFindOneAccount UseCase", () => {
  it("should successfully find an account", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      id: "test-id"
    };

    const SUTResponse = await SUT.findOne(SUTRequest);

    const expectedResponse = {
      id: "test-id",
      name: "Test Name",
      email: "test@email.com",
      password: "test1234",
      type: "COMMON"
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return null if account isn't found", async () => {
    const { SUT, findOneAccountRepository } = getSUTEnvironment();

    jest.spyOn(findOneAccountRepository, "findOne").mockReturnValueOnce(
      Promise.resolve(null)
    );

    const SUTRequest = {
      id: "test-id"
    };

    const SUTResponse = await SUT.findOne(SUTRequest);

    expect(SUTResponse).toBeNull();
  });

  it("should pass id to find one account repository call", async () => {
    const { SUT, findOneAccountRepository } = getSUTEnvironment();

    const findOneSpy = jest.spyOn(findOneAccountRepository, "findOne");

    const SUTRequest = {
      id: "test-id"
    };

    await SUT.findOne(SUTRequest);

    const expectedCall = {
      id: "test-id"
    };

    expect(findOneSpy).toHaveBeenCalledWith(expectedCall);
  });

  it("should repass find one account repository errors to upper level", async () => {
    const { SUT, findOneAccountRepository } = getSUTEnvironment();

    jest.spyOn(findOneAccountRepository, "findOne").mockImplementationOnce(
      async () => {
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