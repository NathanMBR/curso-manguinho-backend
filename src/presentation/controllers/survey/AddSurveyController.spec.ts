import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import {
  ValidationError,
  RequiredAuthenticationError
} from "../../errors";
import { AddSurvey } from "../../../domain/usecases";
import { Validator } from "../../protocols";
import { AddSurveyRequest } from "../../models";
import { AddSurveyController } from "./AddSurveyController";

interface GetSUTEnvironmentReturn {
  validator: Validator.Protocol<AddSurveyRequest>;

  addSurvey: AddSurvey.Protocol;

  SUT: AddSurveyController;
}

const globalDate = new Date();

const getSUTEnvironment = (): GetSUTEnvironmentReturn => {
  class ValidatorStub implements Validator.Protocol<AddSurveyRequest> {
    validate(_data: Validator.Request): Validator.Response<AddSurveyRequest> {
      return {
        isValid: true,
        data: {
          title: "Test Survey Title",
          description: "test survey description",
          expiresAt: globalDate,
          questions: [
            {
              title: "Test Question Title",
              description: "test question description",
              type: "SINGLE",
              answers: [
                {
                  body: "test answer body 1"
                },
    
                {
                  body: "test answer body 2"
                }
              ]
            }
          ]
        }
      };
    }
  }

  class AddSurveyStub implements AddSurvey.Protocol {
    async add(_survey: AddSurvey.Request): AddSurvey.Response {
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
                  id: "test-answer-id",
                  body: "test answer body 1",
                  questionId: "test-question-id"
                },
    
                {
                  id: "test-answer-id",
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

  const validatorStub = new ValidatorStub();
  const addSurveyStub = new AddSurveyStub();

  const addSurveyController = new AddSurveyController(
    validatorStub,
    addSurveyStub
  );

  return {
    validator: validatorStub,

    addSurvey: addSurveyStub,

    SUT: addSurveyController
  };
};

describe("AddSurvey Controller", () => {
  it("should successfully handle request", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      authenticationData: {
        id: "test-account-id",
        type: "COMMON" as const
      },

      body: {
        title: "Test Survey Title",
        description: "test survey description",
        expiresAt: globalDate.toISOString(),
        questions: [
          {
            title: "Test Question Title",
            description: "test question description",
            type: "SINGLE",
            answers: [
              {
                body: "test answer body 1",
              },
  
              {
                body: "test answer body 2",
              }
            ]
          }
        ]
      }
    };

    const SUTResponse = await SUT.handle(SUTRequest);

    const expectedResponse = {
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
              id: "test-answer-id",
              body: "test answer body 1",
              questionId: "test-question-id"
            },

            {
              id: "test-answer-id",
              body: "test answer body 2",
              questionId: "test-question-id"
            }
          ]
        }
      ]
    };

    expect(SUTResponse.statusCode).toBe(201);
    expect(SUTResponse.body).toEqual(expectedResponse);
  });

  it("should return 400 if body is invalid", async () => {
    const { SUT, validator } = getSUTEnvironment();

    const SUTRequest = {
      authenticationData: {
        id: "test-account-id",
        type: "COMMON" as const
      },

      body: {
        title: "Test Survey Title",
        description: "test survey description",
        expiresAt: globalDate.toISOString(),
        questions: [
          {
            title: "Test Question Title",
            description: "test question description",
            type: "SINGLE",
            answers: [
              {
                body: "test answer body 1",
              },
  
              {
                body: "test answer body 2",
              }
            ]
          }
        ]
      }
    };

    jest.spyOn(validator, "validate").mockReturnValueOnce(
      {
        isValid: false,
        errorMessage: "Test error"
      }
    );

    const SUTResponse = await SUT.handle(SUTRequest);

    expect(SUTResponse.statusCode).toBe(400);
    expect(SUTResponse.body).toEqual(new ValidationError("Test error"));
  });

  it("should return 401 if authentication data is not defined", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      // authenticationData: {
      //   id: "test-account-id",
      //   type: "COMMON" as const
      // },

      body: {
        title: "Test Survey Title",
        description: "test survey description",
        expiresAt: globalDate.toISOString(),
        questions: [
          {
            title: "Test Question Title",
            description: "test question description",
            type: "SINGLE",
            answers: [
              {
                body: "test answer body 1",
              },
  
              {
                body: "test answer body 2",
              }
            ]
          }
        ]
      }
    };

    const SUTResponse = await SUT.handle(SUTRequest);

    expect(SUTResponse.statusCode).toBe(401);
    expect(SUTResponse.body).toEqual(new RequiredAuthenticationError());
  });

  it("should pass request body to add survey validator call", async () => {
    const { SUT, validator } = getSUTEnvironment();

    const SUTRequest = {
      authenticationData: {
        id: "test-account-id",
        type: "COMMON" as const
      },

      body: {
        title: "Test Survey Title",
        description: "test survey description",
        expiresAt: globalDate.toISOString(),
        questions: [
          {
            title: "Test Question Title",
            description: "test question description",
            type: "SINGLE",
            answers: [
              {
                body: "test answer body 1",
              },
  
              {
                body: "test answer body 2",
              }
            ]
          }
        ]
      }
    };

    const validateSpy = jest.spyOn(validator, "validate");

    await SUT.handle(SUTRequest);

    expect(validateSpy).toHaveBeenCalledWith(SUTRequest.body);
  });

  it("should pass request body to add survey call", async () => {
    const { SUT, addSurvey } = getSUTEnvironment();

    const SUTRequest = {
      authenticationData: {
        id: "test-account-id",
        type: "COMMON" as const
      },

      body: {
        title: "Test Survey Title",
        description: "test survey description",
        expiresAt: globalDate.toISOString(),
        questions: [
          {
            title: "Test Question Title",
            description: "test question description",
            type: "SINGLE",
            answers: [
              {
                body: "test answer body 1",
              },
  
              {
                body: "test answer body 2",
              }
            ]
          }
        ]
      }
    };

    const addSpy = jest.spyOn(addSurvey, "add");

    await SUT.handle(SUTRequest);

    expect(addSpy).toHaveBeenCalledWith(
      {
        title: "Test Survey Title",
        description: "test survey description",
        expiresAt: globalDate,
        accountId: SUTRequest.authenticationData.id,
        questions: [
          {
            title: "Test Question Title",
            description: "test question description",
            type: "SINGLE",
            answers: [
              {
                body: "test answer body 1",
              },
  
              {
                body: "test answer body 2",
              }
            ]
          }
        ]
      }
    );
  });

  it("should repass add survey validator call errors to upper level", async () => {
    const { SUT, validator } = getSUTEnvironment();

    const SUTRequest = {
      authenticationData: {
        id: "test-account-id",
        type: "COMMON" as const
      },

      body: {
        title: "Test Survey Title",
        description: "test survey description",
        expiresAt: globalDate.toISOString(),
        questions: [
          {
            title: "Test Question Title",
            description: "test question description",
            type: "SINGLE",
            answers: [
              {
                body: "test answer body 1",
              },
  
              {
                body: "test answer body 2",
              }
            ]
          }
        ]
      }
    };

    jest.spyOn(validator, "validate").mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTResponse = SUT.handle(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });

  it("should repass add survey call errors to upper level", async () => {
    const { SUT, addSurvey } = getSUTEnvironment();

    const SUTRequest = {
      authenticationData: {
        id: "test-account-id",
        type: "COMMON" as const
      },

      body: {
        title: "Test Survey Title",
        description: "test survey description",
        expiresAt: globalDate.toISOString(),
        questions: [
          {
            title: "Test Question Title",
            description: "test question description",
            type: "SINGLE",
            answers: [
              {
                body: "test answer body 1",
              },
  
              {
                body: "test answer body 2",
              }
            ]
          }
        ]
      }
    };

    jest.spyOn(addSurvey, "add").mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTResponse = SUT.handle(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });
});