import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import {
  RequiredAuthenticationError,
  ValidationError,
  NotFoundError
} from "../../errors";
import { GetSurveyResult } from "../../../domain/usecases";
import { Validator } from "../../protocols";
import { FindOneSurveyRequest } from "../../models";
import { GetSurveyResultController } from "./GetSurveyResultController";

interface GetSUTEnvironmentReturn {
  validator: Validator.Protocol<FindOneSurveyRequest>;

  getSurveyResult: GetSurveyResult.Protocol;

  SUT: GetSurveyResultController;
}

const getSUTEnvironment = (): GetSUTEnvironmentReturn => {
  class ValidatorStub implements Validator.Protocol<FindOneSurveyRequest> {
    validate(_request: Validator.Request): Validator.Response<FindOneSurveyRequest> {
      return {
        isValid: true as const,
        data: {
          id: "test-id"
        }
      };
    }
  }

  class GetSurveyResultStub implements GetSurveyResult.Protocol {
    async get(_request: GetSurveyResult.Request): GetSurveyResult.Response {
      return Promise.resolve(
        {
          survey: {
            id: "test-survey-id",
            title: "Test Survey Title"
          },

          timesAnswered: 5,

          questions: [
            {
              question: {
                id: "test-question-id",
                title: "Test Question Title",
                type: "SINGLE"
              },
              answers: [
                {
                  answer: {
                    id: "test-answer-id-1",
                    body: "test answer body 1"
                  },
                  percentage: 40
                },

                {
                  answer: {
                    id: "test-answer-id-2",
                    body: "test answer body 2"
                  },
                  percentage: 60
                }
              ]
            }
          ]
        }
      );
    }
  }

  const validator = new ValidatorStub();
  const getSurveyResult = new GetSurveyResultStub();

  const getSurveyResultController = new GetSurveyResultController(
    validator,
    getSurveyResult
  );

  return {
    validator,

    getSurveyResult,

    SUT: getSurveyResultController
  };
};

describe("GetSurveyResult Controller", () => {
  it("should successfully handle request", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      authenticationData: {
        id: "test-account-id",
        type: "COMMON" as const
      },

      params: {
        id: "test-survey-id"
      }
    };

    const SUTResponse = await SUT.handle(SUTRequest);

    const expectedResponse = {
      statusCode: 200,
      body: {
        survey: {
          id: "test-survey-id",
          title: "Test Survey Title"
        },

        timesAnswered: 5,

        questions: [
          {
            question: {
              id: "test-question-id",
              title: "Test Question Title",
              type: "SINGLE"
            },
            answers: [
              {
                answer: {
                  id: "test-answer-id-1",
                  body: "test answer body 1"
                },
                percentage: 40
              },

              {
                answer: {
                  id: "test-answer-id-2",
                  body: "test answer body 2"
                },
                percentage: 60
              }
            ]
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

      params: {
        id: "test-survey-id"
      }
    };

    const SUTResponse = await SUT.handle(SUTRequest);

    const expectedResponse = {
      statusCode: 401,
      body: new RequiredAuthenticationError()
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return 400 if validator returns error", async () => {
    const { SUT, validator } = getSUTEnvironment();

    jest.spyOn(validator, "validate").mockReturnValueOnce(
      {
        isValid: false,
        errorMessage: "Test error"
      }
    );

    const SUTRequest = {
      authenticationData: {
        id: "test-account-id",
        type: "COMMON" as const
      },

      params: {
        id: "test-survey-id"
      }
    };

    const SUTResponse = await SUT.handle(SUTRequest);

    const expectedResponse = {
      statusCode: 400,
      body: new ValidationError("Test error")
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return 404 if get survey result returns null", async () => {
    const { SUT, getSurveyResult } = getSUTEnvironment();

    jest.spyOn(getSurveyResult, "get").mockReturnValueOnce(
      Promise.resolve(null)
    );

    const SUTRequest = {
      authenticationData: {
        id: "test-account-id",
        type: "COMMON" as const
      },

      params: {
        id: "test-survey-id"
      }
    };

    const SUTResponse = await SUT.handle(SUTRequest);

    const expectedResponse = {
      statusCode: 404,
      body: new NotFoundError(`Survey with ID "test-id" not found`)
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should pass url params to find one survey validator call", async () => {
    const { SUT, validator } = getSUTEnvironment();

    const validateSpy = jest.spyOn(validator, "validate");

    const SUTRequest = {
      authenticationData: {
        id: "test-account-id",
        type: "COMMON" as const
      },

      params: {
        id: "test-survey-id"
      }
    };

    await SUT.handle(SUTRequest);

    const expectedCall = SUTRequest.params;

    expect(validateSpy).toHaveBeenCalledWith(expectedCall);
  });

  it("should pass id to get survey result call", async () => {
    const { SUT, getSurveyResult } = getSUTEnvironment();

    const getSpy = jest.spyOn(getSurveyResult, "get");

    const SUTRequest = {
      authenticationData: {
        id: "test-account-id",
        type: "COMMON" as const
      },

      params: {
        id: "test-survey-id"
      }
    };

    await SUT.handle(SUTRequest);

    const expectedCall = {
      surveyId: "test-id"
    };

    expect(getSpy).toHaveBeenCalledWith(expectedCall);
  });

  it("should repass find one survey validator call errors to upper level", async () => {
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

      params: {
        id: "test-survey-id"
      }
    };

    const SUTResponse = SUT.handle(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });

  it("should repass get survey result call errors to upper level", async () => {
    const { SUT, getSurveyResult } = getSUTEnvironment();

    jest.spyOn(getSurveyResult, "get").mockImplementationOnce(
      async () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = {
      authenticationData: {
        id: "test-account-id",
        type: "COMMON" as const
      },

      params: {
        id: "test-survey-id"
      }
    };

    const SUTResponse = SUT.handle(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });
});
