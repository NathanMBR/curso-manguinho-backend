import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import {
  RequiredAuthenticationError,
  InternalServerError
} from "../../errors";
import { FindManySurveys } from "../../../domain/usecases";
import { Validator } from "../../protocols";
import { FindManySurveysRequest } from "../../models";
import { FindManySurveysController } from "./FindManySurveysController";

interface GetSUTEnvironmentReturn {
  validator: Validator.Protocol<FindManySurveysRequest>;

  findManySurveys: FindManySurveys.Protocol;

  SUT: FindManySurveysController;
}

const globalDate = new Date();

const getSUTEnvironment = (): GetSUTEnvironmentReturn => {
  class ValidatorStub implements Validator.Protocol<FindManySurveysRequest> {
    validate(_request: Validator.Request): Validator.Response<FindManySurveysRequest> {
      return {
        isValid: true as const,
        data: {
          page: 1,
          quantity: 10
        }
      };
    }
  }
  const validator = new ValidatorStub();

  class FindManySurveysStub implements FindManySurveys.Protocol {
    async findMany(_request: FindManySurveys.Request): FindManySurveys.Response {
      return Promise.resolve(
        {
          quantityPerPage: 3,
          total: 9,
          currentPage: 2,
          lastPage: 3,
          data: [
            {
              id: "test-id-1",
              title: "Test Title 1",
              description: "test description 1",
              expiresAt: globalDate,
              accountId: "test-account-id-1",
            },

            {
              id: "test-id-2",
              title: "Test Title 2",
              description: "test description 2",
              expiresAt: globalDate,
              accountId: "test-account-id-2",
            },

            {
              id: "test-id-3",
              title: "Test Title 3",
              description: "test description 3",
              expiresAt: globalDate,
              accountId: "test-account-id-3",
            }
          ]
        }
      );
    }
  }
  const findManySurveys = new FindManySurveysStub();

  const findManySurveysController = new FindManySurveysController(
    validator,
    findManySurveys
  );

  return {
    validator,

    findManySurveys,

    SUT: findManySurveysController
  };
};

describe("FindManySurveys Controller", () => {
  it("should successfully handle request", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      authenticationData: {
        id: "test-account-id",
        type: "COMMON" as const
      },

      query: {
        page: 1,
        quantity: 10
      }
    };

    const SUTResponse = await SUT.handle(SUTRequest);

    const expectedResponse = {
      statusCode: 200,
      body: {
        quantityPerPage: 3,
        total: 9,
        currentPage: 2,
        lastPage: 3,
        data: [
          {
            id: "test-id-1",
            title: "Test Title 1",
            description: "test description 1",
            expiresAt: globalDate,
            accountId: "test-account-id-1",
          },

          {
            id: "test-id-2",
            title: "Test Title 2",
            description: "test description 2",
            expiresAt: globalDate,
            accountId: "test-account-id-2",
          },

          {
            id: "test-id-3",
            title: "Test Title 3",
            description: "test description 3",
            expiresAt: globalDate,
            accountId: "test-account-id-3",
          }
        ]
      }
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return 401 if authentication data is not defined", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      // authenticationData: {
      //   id: "test-account-id",
      //   type: "COMMON" as const
      // },

      query: {
        page: 1,
        quantity: 10
      }
    };

    const SUTResponse = await SUT.handle(SUTRequest);

    const expectedResponse = {
      statusCode: 401,
      body: new RequiredAuthenticationError()
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return 500 if validation returns error", async () => {
    const { SUT, validator } = getSUTEnvironment();

    jest.spyOn(validator, "validate").mockReturnValueOnce(
      {
        isValid: false as const,
        errorMessage: "Test error"
      }
    );

    const SUTRequest = {
      authenticationData: {
        id: "test-account-id",
        type: "COMMON" as const
      },

      query: {
        page: 1,
        quantity: 10
      }
    };

    const SUTResponse = await SUT.handle(SUTRequest);

    const expectedResponse = {
      statusCode: 500,
      body: new InternalServerError()
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should pass query parameters to find many surveys validator call", async () => {
    const { SUT, validator } = getSUTEnvironment();

    const validateSpy = jest.spyOn(validator, "validate");

    const SUTRequest = {
      authenticationData: {
        id: "test-account-id",
        type: "COMMON" as const
      },

      query: {
        page: 1,
        quantity: 10
      }
    };

    await SUT.handle(SUTRequest);

    const expectedCall = {
      page: 1,
      quantity: 10
    };

    expect(validateSpy).toHaveBeenCalledWith(expectedCall);
  });

  it("should pass query parameters to find many surveys call", async () => {
    const { SUT, findManySurveys } = getSUTEnvironment();

    const findManySpy = jest.spyOn(findManySurveys, "findMany");

    const SUTRequest = {
      authenticationData: {
        id: "test-account-id",
        type: "COMMON" as const
      },

      query: {
        page: 1,
        quantity: 10
      }
    };

    await SUT.handle(SUTRequest);

    const expectedCall = {
      page: 1,
      quantity: 10
    };

    expect(findManySpy).toHaveBeenCalledWith(expectedCall);
  });

  it("should repass find many surveys validator call errors to upper level", async () => {
    const { SUT, validator } = getSUTEnvironment();

    jest.spyOn(validator, "validate").mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = {
      authenticationData: {
        id: "test-account-id",
        type: "COMMON" as const
      },

      query: {
        page: 1,
        quantity: 10
      }
    };

    const SUTResponse = SUT.handle(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });

  it("should repass find many surveys call errors to upper level", async () => {
    const { SUT, findManySurveys } = getSUTEnvironment();

    jest.spyOn(findManySurveys, "findMany").mockImplementationOnce(
      async () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = {
      authenticationData: {
        id: "test-account-id",
        type: "COMMON" as const
      },

      query: {
        page: 1,
        quantity: 10
      }
    };

    const SUTResponse = SUT.handle(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });
});