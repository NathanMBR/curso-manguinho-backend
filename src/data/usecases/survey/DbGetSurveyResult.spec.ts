import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import { FindOneSurveyWithResultRepository } from "../../protocols";
import { DbGetSurveyResult } from "./DbGetSurveyResult";

interface GetSUTEnvironmentResponse {
  findOneSurveyWithResultRepository: FindOneSurveyWithResultRepository.Protocol;

  SUT: DbGetSurveyResult;
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  class FindOneSurveyWithResultRepositoryStub implements FindOneSurveyWithResultRepository.Protocol {
    async findOneWithResult(_request: FindOneSurveyWithResultRepository.Request): FindOneSurveyWithResultRepository.Response {
      const surveyWithResult: Awaited<FindOneSurveyWithResultRepository.Response> = {
        id: "test-survey-id",
        title: "Test Survey Title",
        description: "test survey description",
        expiresAt: null,
        accountId: "test-account-id-1",
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
                questionId: "test-question-id",
                userAnswers: [
                  {
                    id: "test-user-answer-id-1",
                    accountId: "test-account-id-1",
                    questionId: "test-question-id",
                    answerId: "test-answer-id-1"
                  },

                  {
                    id: "test-user-answer-id-2",
                    accountId: "test-account-id-2",
                    questionId: "test-question-id",
                    answerId: "test-answer-id-1"
                  }
                ]
              },

              {
                id: "test-answer-id-2",
                body: "test answer body 2",
                questionId: "test-question-id",
                userAnswers: [
                  {
                    id: "test-user-answer-id-3",
                    accountId: "test-account-id-3",
                    questionId: "test-question-id",
                    answerId: "test-answer-id-2"
                  },

                  {
                    id: "test-user-answer-id-4",
                    accountId: "test-account-id-4",
                    questionId: "test-question-id",
                    answerId: "test-answer-id-2"
                  },

                  {
                    id: "test-user-answer-id-5",
                    accountId: "test-account-id-5",
                    questionId: "test-question-id",
                    answerId: "test-answer-id-2"
                  }
                ]
              }
            ]
          }
        ],
        userAnsweredSurveys: [
          {
            id: "test-user-answer-id-1"
          },

          {
            id: "test-user-answer-id-2"
          },

          {
            id: "test-user-answer-id-3"
          },

          {
            id: "test-user-answer-id-4"
          },

          {
            id: "test-user-answer-id-5"
          }
        ]
      };

      return Promise.resolve(surveyWithResult);
    }
  }

  const findOneSurveyWithResultRepository = new FindOneSurveyWithResultRepositoryStub();

  const dbGetSurveyResult = new DbGetSurveyResult(
    findOneSurveyWithResultRepository
  );

  return {
    findOneSurveyWithResultRepository,

    SUT: dbGetSurveyResult
  };
};

describe("DbGetSurveyResult UseCase", () => {
  it("should successfully get a survey result", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      surveyId: "test-survey-id"
    };

    const SUTResponse = await SUT.get(SUTRequest);

    const expectedResponse = {
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
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return null if survey with result isn't found", async () => {
    const { SUT, findOneSurveyWithResultRepository } = getSUTEnvironment();

    jest.spyOn(findOneSurveyWithResultRepository, "findOneWithResult").mockReturnValueOnce(
      Promise.resolve(null)
    );

    const SUTRequest = {
      surveyId: "test-survey-id"
    };

    const SUTResponse = await SUT.get(SUTRequest);

    expect(SUTResponse).toBeNull();
  });

  it("should pass survey id to find one survey with result repository call", async () => {
    const { SUT, findOneSurveyWithResultRepository } = getSUTEnvironment();

    const findOneWithResultSpy = jest.spyOn(findOneSurveyWithResultRepository, "findOneWithResult");

    const SUTRequest = {
      surveyId: "test-survey-id"
    };

    await SUT.get(SUTRequest);

    const expectedCall = {
      id: "test-survey-id"
    };

    expect(findOneWithResultSpy).toHaveBeenCalledWith(expectedCall);
  });

  it("should repass find one survey with result repository errors to upper level", async () => {
    const { SUT, findOneSurveyWithResultRepository } = getSUTEnvironment();

    jest.spyOn(findOneSurveyWithResultRepository, "findOneWithResult").mockImplementationOnce(
      async () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = {
      surveyId: "test-survey-id"
    };

    const SUTResponse = SUT.get(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });
});
