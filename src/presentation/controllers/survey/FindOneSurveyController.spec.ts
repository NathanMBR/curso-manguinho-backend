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
import { FindOneSurvey } from "../../../domain/usecases";
import { Validator } from "../../protocols";
import { FindOneSurveyRequest } from "../../models";
import { FindOneSurveyController } from "./FindOneSurveyController";

interface GetSUTEnvironmentReturn {
  validator: Validator.Protocol<FindOneSurveyRequest>;

  findOneSurvey: FindOneSurvey.Protocol;

  SUT: FindOneSurveyController;
}

const globalDate = new Date();

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

  class FindOneSurveyStub implements FindOneSurvey.Protocol {
    async findOne(_request: FindOneSurvey.Request): FindOneSurvey.Response {
      return Promise.resolve(
        {
          id: "test-survey-id",
          title: "Test Survey Title",
          description: "test survey description",
          expiresAt: globalDate,
          accountId: "test-account-id",
          questions: [
            {
              id: "test-question-id",
              title: "Test Question Title",
              description: "test question description",
              type: "SINGLE",
              surveyId: "test-survey-id",
              answers: [
                {
                  id: "test-answer-id-1",
                  body: "test answer body 1",
                  questionId: "test-question-id"
                },

                {
                  id: "test-answer-id-2",
                  body: "test answer body 2",
                  questionId: "test-question-id"
                }
              ]
            }
          ]
        }
      );
    }
  }

  const validator = new ValidatorStub();
  const findOneSurvey = new FindOneSurveyStub();

  const findOneSurveyController = new FindOneSurveyController(
    validator,
    findOneSurvey
  );

  return {
    validator,

    findOneSurvey,

    SUT: findOneSurveyController
  }
};

describe("FindOneSurvey Controller", () => {
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
        id: "test-survey-id",
        title: "Test Survey Title",
        description: "test survey description",
        expiresAt: globalDate,
        accountId: "test-account-id",
        questions: [
          {
            id: "test-question-id",
            title: "Test Question Title",
            description: "test question description",
            type: "SINGLE",
            surveyId: "test-survey-id",
            answers: [
              {
                id: "test-answer-id-1",
                body: "test answer body 1",
                questionId: "test-question-id"
              },

              {
                id: "test-answer-id-2",
                body: "test answer body 2",
                questionId: "test-question-id"
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

  it("should return 400 if validations returns error", async () => {
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

  it("should return 404 if survey isn't found", async () => {
    const { SUT, findOneSurvey } = getSUTEnvironment();

    jest.spyOn(findOneSurvey, "findOne").mockReturnValueOnce(
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
      body: new NotFoundError('Survey with ID "test-id" not found')
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

  it("should pass id to find one survey call", async () => {
    const { SUT, findOneSurvey } = getSUTEnvironment();

    const findOneSpy = jest.spyOn(findOneSurvey, "findOne");

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
      id: "test-id"
    };

    expect(findOneSpy).toHaveBeenCalledWith(expectedCall);
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

  it("should repass find one survey call errors to upper level", async () => {
    const { SUT, findOneSurvey } = getSUTEnvironment();

    jest.spyOn(findOneSurvey, "findOne").mockImplementationOnce(
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
