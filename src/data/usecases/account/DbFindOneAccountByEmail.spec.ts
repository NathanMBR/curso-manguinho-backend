import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import { DbFindOneAccountByEmail } from "./DbFindOneAccountByEmail";
import { FindOneAccountByEmailRepository } from "../../protocols";

interface GetSUTEnvironmentResponse {
  findOneAccountByEmailRepository: FindOneAccountByEmailRepository.Protocol;

  SUT: DbFindOneAccountByEmail;
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  class FindOneAccountByEmailRepositoryStub implements FindOneAccountByEmailRepository.Protocol {
    findOneByEmail(_search: FindOneAccountByEmailRepository.Request): FindOneAccountByEmailRepository.Response {
      const account = {
        id: "test_id",
        name: "Test Name",
        email: "test@email.com",
        password: "test1234",
        type: "COMMON"
      } as const;

      return Promise.resolve(account);
    }
  }

  const findOneAccountByEmailRepository = new FindOneAccountByEmailRepositoryStub();

  const SUT = new DbFindOneAccountByEmail(
    findOneAccountByEmailRepository
  );

  return {
    findOneAccountByEmailRepository,

    SUT
  };
};

describe("DbFindOneAccountByEmail UseCase", () => {
  it("should successfully find an account by email", async () => {
    const { SUT } = getSUTEnvironment();

    const searchData = {
      email: "search@email.com"
    };
    const SUTResponse = await SUT.findOneByEmail(searchData);

    expect(SUTResponse).toEqual(
      {
        id: "test_id",
        name: "Test Name",
        email: "test@email.com",
        password: "test1234",
        type: "COMMON"
      }
    );
  });

  it("should return null if account isn't found", async () => {
    const { SUT, findOneAccountByEmailRepository } = getSUTEnvironment();

    jest.spyOn(findOneAccountByEmailRepository, "findOneByEmail").mockImplementationOnce(
      async () => Promise.resolve(null)
    );

    const searchData = {
      email: "search@email.com"
    };
    const SUTResponse = await SUT.findOneByEmail(searchData);
    expect(SUTResponse).toBeNull();
  });

  it("should pass email to find one account by email repository call", async () => {
    const { SUT, findOneAccountByEmailRepository } = getSUTEnvironment();

    const findOneByEmailSpy = jest.spyOn(findOneAccountByEmailRepository, "findOneByEmail");

    const searchData = {
      email: "search@email.com"
    };
    await SUT.findOneByEmail(searchData);

    expect(findOneByEmailSpy).toHaveBeenCalledWith(
      {
        email: searchData.email
      }
    );
  });

  it("should repass find one account by email repository errors to upper level", async () => {
    const { SUT, findOneAccountByEmailRepository } = getSUTEnvironment();

    jest.spyOn(findOneAccountByEmailRepository, "findOneByEmail").mockImplementationOnce(
      async () => {
        throw new Error();
      }
    );

    const searchData = {
      email: "search@email.com"
    };
    const SUTResponse = SUT.findOneByEmail(searchData);
    await expect(SUTResponse).rejects.toThrow();
  });
});