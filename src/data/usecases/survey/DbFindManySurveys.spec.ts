import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import {
  FindManySurveysRepository,
  CountManySurveysRepository
} from "../../protocols";
import { DbFindManySurveys } from "./DbFindManySurveys";

interface GetSUTEnvironmentResponse {
  findManySurveysRepository: FindManySurveysRepository.Protocol;
  countManySurveysRepository: CountManySurveysRepository.Protocol;

  SUT: DbFindManySurveys;
}

const globalDate = new Date();

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  class FindManySurveysRepositoryStub implements FindManySurveysRepository.Protocol {
    async findMany(_request: FindManySurveysRepository.Request) {
      const surveys: Awaited<FindManySurveysRepository.Response> = [
        {
          id: "test-survey-id-1",
          title: "Test Survey Title 1",
          description: "test survey description 1",
          accountId: "test-account-id-1",
          expiresAt: globalDate
        },

        {
          id: "test-survey-id-2",
          title: "Test Survey Title 2",
          description: "test survey description 2",
          accountId: "test-account-id-2",
          expiresAt: globalDate
        }
      ];

      return Promise.resolve(surveys);
    }
  }

  class CountManySurveysRepositoryStub implements CountManySurveysRepository.Protocol {
    async countMany() {
      return Promise.resolve(100);
    }
  }

  const findManySurveysRepository = new FindManySurveysRepositoryStub();
  const countManySurveysRepository = new CountManySurveysRepositoryStub();
  const dbFindManySurveys = new DbFindManySurveys(
    findManySurveysRepository,
    countManySurveysRepository
  );

  return {
    findManySurveysRepository,
    countManySurveysRepository,

    SUT: dbFindManySurveys
  };
};

describe("DbFindManySurveys UseCase", () => {
  it("should successfully find many surveys", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      page: 1,
      quantity: 50
    };

    const SUTResponse = await SUT.findMany(SUTRequest);

    const expectedResponse = {
      quantityPerPage: 50,
      total: 100,
      currentPage: 1,
      lastPage: 2,
      data: [
        {
          id: "test-survey-id-1",
          title: "Test Survey Title 1",
          description: "test survey description 1",
          accountId: "test-account-id-1",
          expiresAt: globalDate
        },

        {
          id: "test-survey-id-2",
          title: "Test Survey Title 2",
          description: "test survey description 2",
          accountId: "test-account-id-2",
          expiresAt: globalDate
        }
      ]
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should pass take and skip data to find many surveys repository call", async () => {
    const { SUT, findManySurveysRepository } = getSUTEnvironment();

    const findManySpy = jest.spyOn(findManySurveysRepository, "findMany");

    const SUTRequest = {
      page: 1,
      quantity: 50
    };

    await SUT.findMany(SUTRequest);

    const expectedCall = {
      take: 50,
      skip: 0
    };

    expect(findManySpy).toHaveBeenCalledWith(expectedCall);
  });

  it("should pass take and skip data to count many surveys repository call", async () => {
    const { SUT, countManySurveysRepository } = getSUTEnvironment();

    const countManySpy = jest.spyOn(countManySurveysRepository, "countMany");

    const SUTRequest = {
      page: 1,
      quantity: 50
    };

    await SUT.findMany(SUTRequest);

    const expectedCall = {
      take: 50,
      skip: 0
    };

    expect(countManySpy).toHaveBeenCalledWith(expectedCall);
  });

  it("should repass find many surveys repository errors to upper level", async () => {
    const { SUT, findManySurveysRepository } = getSUTEnvironment();

    jest.spyOn(findManySurveysRepository, "findMany").mockImplementationOnce(
      async () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = {
      page: 1,
      quantity: 50
    };

    const SUTResponse = SUT.findMany(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });

  it("should repass count many surveys repository errors to upper level", async () => {
    const { SUT, countManySurveysRepository } = getSUTEnvironment();

    jest.spyOn(countManySurveysRepository, "countMany").mockImplementationOnce(
      async () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = {
      page: 1,
      quantity: 50
    };

    const SUTResponse = SUT.findMany(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });
});