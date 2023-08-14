import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import {
  RequiredAuthenticationError,
  ValidationError,
  NotFoundError,
  ExpiredContentError
} from "../../errors";
import {
  FindOneSurvey,
  AddUserAnswer
} from "../../../domain/usecases";
import {
  FindOneSurveyRequest,
  AddUserAnswerRequest
} from "../../models";
import { Validator } from "../../protocols";
import { AddSurveyAnswerController } from "./AddSurveyAnswerController";

const globalDate = new Date();

interface GetSUTEnvironmentReturn {
  findOneSurveyValidator: Validator.Protocol<FindOneSurveyRequest>;
  addUserAnswerValidator: Validator.Protocol<AddUserAnswerRequest>;

  findOneSurvey: FindOneSurvey.Protocol;
  addUserAnswer: AddUserAnswer.Protocol;

  SUT: AddSurveyAnswerController;
}

const getSUTEnvironment = (): GetSUTEnvironmentReturn => {
  class FindOneSurveyValidatorStub implements Validator.Protocol<FindOneSurveyRequest> {
    validate(_data: Validator.Request): Validator.Response<FindOneSurveyRequest> {
      return {
        isValid: true,
        data: {
          id: "test-id"
        }
      };
    }
  }

  class AddUserAnswerValidatorStub implements Validator.Protocol<AddUserAnswerRequest> {
    validate(_data: Validator.Request): Validator.Response<AddUserAnswerRequest> {
      return {
        isValid: true,
        data: [
          {
            questionId: "test-question-id",
            answerId: "test-answer-id"
          }
        ]
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

  class AddUserAnswerStub implements AddUserAnswer.Protocol {
    async add(_data: AddUserAnswer.Request): AddUserAnswer.Response {
      return Promise.resolve(
        {
          success: true
        }
      );
    }
  }

  const findOneSurveyValidator = new FindOneSurveyValidatorStub();
  const addUserAnswerValidator = new AddUserAnswerValidatorStub();
  const findOneSurvey = new FindOneSurveyStub();
  const addUserAnswer = new AddUserAnswerStub();

  const addSurveyAnswerController = new AddSurveyAnswerController(
    findOneSurveyValidator,
    addUserAnswerValidator,
    findOneSurvey,
    addUserAnswer
  );

  return {
    findOneSurveyValidator,
    addUserAnswerValidator,

    findOneSurvey,
    addUserAnswer,

    SUT: addSurveyAnswerController
  };
};

describe("AddSurveyAnswer Controller", () => {
  it("should successfully handle request", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      authenticationData: {
        id: "test-account-id",
        type: "COMMON" as const
      },

      params: {
        id: "test-survey-id"
      },

      body: [
        {
          questionId: "test-question-id",
          answerId: "test-answer-id"
        }
      ]
    };

    const SUTResponse = await SUT.handle(SUTRequest);

    const expectedResponse = {
      statusCode: 204,
      body: null
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
      },

      body: [
        {
          questionId: "test-question-id",
          answerId: "test-answer-id"
        }
      ]
    };

    const SUTResponse = await SUT.handle(SUTRequest);

    const expectedResponse = {
      statusCode: 401,
      body: new RequiredAuthenticationError()
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return 400 if find one survey validator returns error", async () => {
    const { SUT, findOneSurveyValidator } = getSUTEnvironment();

    jest.spyOn(findOneSurveyValidator, "validate").mockReturnValueOnce(
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
      },

      body: [
        {
          questionId: "test-question-id",
          answerId: "test-answer-id"
        }
      ]
    };

    const SUTResponse = await SUT.handle(SUTRequest);

    const expectedResponse = {
      statusCode: 400,
      body: new ValidationError("Test error")
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return 400 if add user answer validator returns error", async () => {
    const { SUT, addUserAnswerValidator } = getSUTEnvironment();

    jest.spyOn(addUserAnswerValidator, "validate").mockReturnValueOnce(
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
      },

      body: [
        {
          questionId: "test-question-id",
          answerId: "test-answer-id"
        }
      ]
    };

    const SUTResponse = await SUT.handle(SUTRequest);

    const expectedResponse = {
      statusCode: 400,
      body: new ValidationError("Test error")
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return 404 if find one survey returns null", async () => {
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
      },

      body: [
        {
          questionId: "test-question-id",
          answerId: "test-answer-id"
        }
      ]
    };

    const SUTResponse = await SUT.handle(SUTRequest);

    const expectedResponse = {
      statusCode: 404,
      body: new NotFoundError('Survey with ID "test-id" not found')
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return 403 if add user answer returns expired survey error", async () => {
    const { SUT, addUserAnswer } = getSUTEnvironment();

    jest.spyOn(addUserAnswer, "add").mockReturnValueOnce(
      Promise.resolve(
        {
          success: false,
          error: {
            type: "EXPIRED_SURVEY",
            message: "Test error"
          }
        }
      )
    );

    const SUTRequest = {
      authenticationData: {
        id: "test-account-id",
        type: "COMMON" as const
      },

      params: {
        id: "test-survey-id"
      },

      body: [
        {
          questionId: "test-question-id",
          answerId: "test-answer-id"
        }
      ]
    };

    const SUTResponse = await SUT.handle(SUTRequest);

    const expectedResponse = {
      statusCode: 403,
      body: new ExpiredContentError("Test error")
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return 400 if add user answer returns invalid payload error", async () => {
    const { SUT, addUserAnswer } = getSUTEnvironment();

    jest.spyOn(addUserAnswer, "add").mockReturnValueOnce(
      Promise.resolve(
        {
          success: false,
          error: {
            type: "INVALID_PAYLOAD",
            message: "Test error"
          }
        }
      )
    );

    const SUTRequest = {
      authenticationData: {
        id: "test-account-id",
        type: "COMMON" as const
      },

      params: {
        id: "test-survey-id"
      },

      body: [
        {
          questionId: "test-question-id",
          answerId: "test-answer-id"
        }
      ]
    };

    const SUTResponse = await SUT.handle(SUTRequest);

    const expectedResponse = {
      statusCode: 400,
      body: new ValidationError("Test error")
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should pass url params to find one survey validator call", async () => {
    const { SUT, findOneSurveyValidator } = getSUTEnvironment();

    const validateSpy = jest.spyOn(findOneSurveyValidator, "validate");

    const SUTRequest = {
      authenticationData: {
        id: "test-account-id",
        type: "COMMON" as const
      },

      params: {
        id: "test-survey-id"
      },

      body: [
        {
          questionId: "test-question-id",
          answerId: "test-answer-id"
        }
      ]
    };

    await SUT.handle(SUTRequest);

    const expectedCall = {
      id: "test-survey-id"
    };

    expect(validateSpy).toHaveBeenCalledWith(expectedCall);
  });

  it("should pass body to add user answer validator call", async () => {
    const { SUT, addUserAnswerValidator } = getSUTEnvironment();

    const validateSpy = jest.spyOn(addUserAnswerValidator, "validate");

    const SUTRequest = {
      authenticationData: {
        id: "test-account-id",
        type: "COMMON" as const
      },

      params: {
        id: "test-survey-id"
      },

      body: [
        {
          questionId: "test-question-id",
          answerId: "test-answer-id"
        }
      ]
    };

    await SUT.handle(SUTRequest);

    const expectedCall = SUTRequest.body;

    expect(validateSpy).toHaveBeenCalledWith(expectedCall);
  });

  it("should pass survey id to find one survey call", async () => {
    const { SUT, findOneSurvey } = getSUTEnvironment();

    const findOneSpy = jest.spyOn(findOneSurvey, "findOne");

    const SUTRequest = {
      authenticationData: {
        id: "test-account-id",
        type: "COMMON" as const
      },

      params: {
        id: "test-survey-id"
      },

      body: [
        {
          questionId: "test-question-id",
          answerId: "test-answer-id"
        }
      ]
    };

    await SUT.handle(SUTRequest);

    const expectedCall = {
      id: "test-id"
    };

    expect(findOneSpy).toHaveBeenCalledWith(expectedCall);
  });

  it("should pass body to add user answer call", async () => {
    const { SUT, addUserAnswer } = getSUTEnvironment();

    const addSpy = jest.spyOn(addUserAnswer, "add");

    const SUTRequest = {
      authenticationData: {
        id: "test-account-id",
        type: "COMMON" as const
      },

      params: {
        id: "test-survey-id"
      },

      body: [
        {
          questionId: "test-question-id",
          answerId: "test-answer-id"
        }
      ]
    };

    await SUT.handle(SUTRequest);

    const expectedCall = {
      survey: {
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
      },
      accountId: "test-account-id",
      userAnswers: [
        {
          questionId: "test-question-id",
          answerId: "test-answer-id"
        }
      ]
    };

    expect(addSpy).toHaveBeenCalledWith(expectedCall);
  });

  it("should repass find one survey validator errors to upper level", async () => {
    const { SUT, findOneSurveyValidator } = getSUTEnvironment();

    jest.spyOn(findOneSurveyValidator, "validate").mockImplementationOnce(
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
      },

      body: [
        {
          questionId: "test-question-id",
          answerId: "test-answer-id"
        }
      ]
    };

    const SUTResponse = SUT.handle(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });

  it("should repass add user answer validator errors to upper level", async () => {
    const { SUT, addUserAnswerValidator } = getSUTEnvironment();

    jest.spyOn(addUserAnswerValidator, "validate").mockImplementationOnce(
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
      },

      body: [
        {
          questionId: "test-question-id",
          answerId: "test-answer-id"
        }
      ]
    };

    const SUTResponse = SUT.handle(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });

  it("should repass find one survey errors to upper level", async () => {
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
      },

      body: [
        {
          questionId: "test-question-id",
          answerId: "test-answer-id"
        }
      ]
    };

    const SUTResponse = SUT.handle(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });

  it("should repass add user answer errors to upper level", async () => {
    const { SUT, addUserAnswer } = getSUTEnvironment();

    jest.spyOn(addUserAnswer, "add").mockImplementationOnce(
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
      },

      body: [
        {
          questionId: "test-question-id",
          answerId: "test-answer-id"
        }
      ]
    };

    const SUTResponse = SUT.handle(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });
});
