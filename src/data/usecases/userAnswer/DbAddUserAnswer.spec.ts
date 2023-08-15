import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import { AddUserAnswerRepository } from "../../protocols";
import { DbAddUserAnswer } from "./DbAddUserAnswer";

interface GetSUTEnvironmentResponse {
  addUserAnswerRepository: AddUserAnswerRepository.Protocol;

  SUT: DbAddUserAnswer;
}

const globalDate = new Date();

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  class AddUserAnswerRepositoryStub implements AddUserAnswerRepository.Protocol {
    async add(_request: AddUserAnswerRepository.Request): AddUserAnswerRepository.Response {
      return Promise.resolve();
    }
  }

  const addUserAnswerRepository = new AddUserAnswerRepositoryStub();

  const dbAddUserAnswer = new DbAddUserAnswer(
    addUserAnswerRepository
  );

  return {
    addUserAnswerRepository,

    SUT: dbAddUserAnswer
  };
};

describe("DbAddUserAnswer UseCase", () => {
  it("should successfully add a survey", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      survey: {
        id: "test-survey-id",
        title: "Test Survey Title",
        description: "test survey description",
        accountId: "test-account-id",
        expiresAt: null,
        questions: [
          {
            id: "test-question-id",
            title: "Test Question Title",
            description: "test question description",
            surveyId: "test-survey-id",
            type: "SINGLE" as const,
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
          answerId: "test-answer-id-1"
        }
      ]
    };

    const SUTResponse = await SUT.add(SUTRequest);

    const expectedResponse = {
      success: true
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return error response if survey is expired", async () => {
    const { SUT } = getSUTEnvironment();

    const timeToSkipInMilliseconds = globalDate.getTime() + 10e3;
    jest.spyOn(Date, "now").mockReturnValueOnce(timeToSkipInMilliseconds);

    const SUTRequest = {
      survey: {
        id: "test-survey-id",
        title: "Test Survey Title",
        description: "test survey description",
        accountId: "test-account-id",
        expiresAt: globalDate,
        questions: [
          {
            id: "test-question-id",
            title: "Test Question Title",
            description: "test question description",
            surveyId: "test-survey-id",
            type: "SINGLE" as const,
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
          questionId: "test-question-id-7",
          answerId: "test-answer-id-1"
        }
      ]
    };

    const SUTResponse = await SUT.add(SUTRequest);

    const expectedResponse = {
      success: false,
      error: {
        type: "EXPIRED_SURVEY",
        message: `Survey with ID "${SUTRequest.survey.id}" is expired`
      }
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return error response if some user answer has a question id not present in survey", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      survey: {
        id: "test-survey-id",
        title: "Test Survey Title",
        description: "test survey description",
        accountId: "test-account-id",
        expiresAt: null,
        questions: [
          {
            id: "test-question-id",
            title: "Test Question Title",
            description: "test question description",
            surveyId: "test-survey-id",
            type: "SINGLE" as const,
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
          questionId: "test-question-id-7",
          answerId: "test-answer-id-1"
        }
      ]
    };

    const SUTResponse = await SUT.add(SUTRequest);

    const expectedResponse = {
      success: false,
      error: {
        type: "INVALID_PAYLOAD",
        message: "Some of the questions don't belong to the survey"
      }
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return error response if some user answer has an answer id not present in its survey question", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      survey: {
        id: "test-survey-id",
        title: "Test Survey Title",
        description: "test survey description",
        accountId: "test-account-id",
        expiresAt: null,
        questions: [
          {
            id: "test-question-id-1",
            title: "Test Question Title",
            description: "test question description",
            surveyId: "test-survey-id",
            type: "SINGLE" as const,
            answers: [
              {
                id: "test-answer-id-1",
                body: "test answer body 1",
                questionId: "test-question-id-1"
              },

              {
                id: "test-answer-id-2",
                body: "test answer body 2",
                questionId: "test-question-id-1"
              }
            ]
          },

          {
            id: "test-question-id-2",
            title: "Test Question Title",
            description: "test question description",
            surveyId: "test-survey-id",
            type: "SINGLE" as const,
            answers: [
              {
                id: "test-answer-id-3",
                body: "test answer body 1",
                questionId: "test-question-id-2"
              },

              {
                id: "test-answer-id-4",
                body: "test answer body 2",
                questionId: "test-question-id-2"
              }
            ]
          }
        ]
      },
      accountId: "test-account-id",
      userAnswers: [
        {
          questionId: "test-question-id-1",
          answerId: "test-answer-id-4"
        },

        {
          questionId: "test-question-id-2",
          answerId: "test-answer-id-3"
        }
      ]
    };

    const SUTResponse = await SUT.add(SUTRequest);

    const expectedResponse = {
      success: false,
      error: {
        type: "INVALID_PAYLOAD",
        message: "Some of the answers don't belong to its question"
      }
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return error response if at least one question doesn't have at least one user answer", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      survey: {
        id: "test-survey-id",
        title: "Test Survey Title",
        description: "test survey description",
        accountId: "test-account-id",
        expiresAt: null,
        questions: [
          {
            id: "test-question-id-1",
            title: "Test Question Title",
            description: "test question description",
            surveyId: "test-survey-id",
            type: "SINGLE" as const,
            answers: [
              {
                id: "test-answer-id-1",
                body: "test answer body 1",
                questionId: "test-question-id-1"
              },

              {
                id: "test-answer-id-2",
                body: "test answer body 2",
                questionId: "test-question-id-1"
              }
            ]
          },

          {
            id: "test-question-id-2",
            title: "Test Question Title",
            description: "test question description",
            surveyId: "test-survey-id",
            type: "SINGLE" as const,
            answers: [
              {
                id: "test-answer-id-3",
                body: "test answer body 1",
                questionId: "test-question-id-2"
              },

              {
                id: "test-answer-id-4",
                body: "test answer body 2",
                questionId: "test-question-id-2"
              }
            ]
          }
        ]
      },
      accountId: "test-account-id",
      userAnswers: [
        {
          questionId: "test-question-id-2",
          answerId: "test-answer-id-3"
        }
      ]
    };

    const SUTResponse = await SUT.add(SUTRequest);

    const expectedResponse = {
      success: false,
      error: {
        type: "INVALID_PAYLOAD",
        message: "Some of the questions doesn't have at least one user answer"
      }
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return error response if some single type question has more than two user answers", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      survey: {
        id: "test-survey-id",
        title: "Test Survey Title",
        description: "test survey description",
        accountId: "test-account-id",
        expiresAt: null,
        questions: [
          {
            id: "test-question-id",
            title: "Test Question Title",
            description: "test question description",
            surveyId: "test-survey-id",
            type: "SINGLE" as const,
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
          answerId: "test-answer-id-1"
        },

        {
          questionId: "test-question-id",
          answerId: "test-answer-id-2"
        }
      ]
    };

    const SUTResponse = await SUT.add(SUTRequest);

    const expectedResponse = {
      success: false,
      error: {
        type: "INVALID_PAYLOAD",
        message: "Some of the single type questions has more than one user answer"
      }
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return error response if some user answer is duplicated", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      survey: {
        id: "test-survey-id",
        title: "Test Survey Title",
        description: "test survey description",
        accountId: "test-account-id",
        expiresAt: null,
        questions: [
          {
            id: "test-question-id",
            title: "Test Question Title",
            description: "test question description",
            surveyId: "test-survey-id",
            type: "MULTIPLE" as const,
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
          answerId: "test-answer-id-1"
        },

        {
          questionId: "test-question-id",
          answerId: "test-answer-id-1"
        }
      ]
    };

    const SUTResponse = await SUT.add(SUTRequest);

    const expectedResponse = {
      success: false,
      error: {
        type: "INVALID_PAYLOAD",
        message: "Duplicated user answer"
      }
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should pass user answer data to add user answer repository call", async () => {
    const { SUT, addUserAnswerRepository } = getSUTEnvironment();

    const addSpy = jest.spyOn(addUserAnswerRepository, "add");

    const SUTRequest = {
      survey: {
        id: "test-survey-id",
        title: "Test Survey Title",
        description: "test survey description",
        accountId: "test-account-id",
        expiresAt: null,
        questions: [
          {
            id: "test-question-id",
            title: "Test Question Title",
            description: "test question description",
            surveyId: "test-survey-id",
            type: "SINGLE" as const,
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
          answerId: "test-answer-id-1"
        }
      ]
    };

    await SUT.add(SUTRequest);

    const expectedCall = {
      accountId: SUTRequest.accountId,
      surveyId: SUTRequest.survey.id,
      userAnswers: SUTRequest.userAnswers
    };

    expect(addSpy).toHaveBeenCalledWith(expectedCall);
  });

  it("should repass add user answer repository errors to upper level", async () => {
    const { SUT, addUserAnswerRepository } = getSUTEnvironment();

    jest.spyOn(addUserAnswerRepository, "add").mockImplementationOnce(
      async () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = {
      survey: {
        id: "test-survey-id",
        title: "Test Survey Title",
        description: "test survey description",
        accountId: "test-account-id",
        expiresAt: null,
        questions: [
          {
            id: "test-question-id",
            title: "Test Question Title",
            description: "test question description",
            surveyId: "test-survey-id",
            type: "SINGLE" as const,
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
          answerId: "test-answer-id-1"
        }
      ]
    };

    const SUTResponse = SUT.add(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });
});
