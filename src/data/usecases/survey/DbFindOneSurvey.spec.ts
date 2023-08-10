import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import { FindOneSurveyRepository } from "../../protocols";
import { DbFindOneSurvey } from "./DbFindOneSurvey";

interface GetSUTEnvironmentResponse {
  findOneSurveyRepository: FindOneSurveyRepository.Protocol;

  SUT: DbFindOneSurvey;
}

const globalDate = new Date();

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  class FindOneSurveyRepositoryStub implements FindOneSurveyRepository.Protocol {
    async findOne(_request: FindOneSurveyRepository.Request): FindOneSurveyRepository.Response {
      const survey = {
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
            type: "SINGLE" as const,
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
      };

      return Promise.resolve(survey);
    }
  }

  const findOneSurveyRepository = new FindOneSurveyRepositoryStub();

  const dbFindOneSurvey = new DbFindOneSurvey(
    findOneSurveyRepository
  );

  return {
    findOneSurveyRepository,

    SUT: dbFindOneSurvey
  };
};

describe("DbFindOneSurvey UseCase", () => {
  it("should successfully find a survey", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      id: "test-survey-id"
    };

    const SUTResponse = await SUT.findOne(SUTRequest);

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
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return null if survey isn't found", async () => {
    const { SUT, findOneSurveyRepository } = getSUTEnvironment();

    jest.spyOn(findOneSurveyRepository, "findOne").mockReturnValueOnce(
      Promise.resolve(null)
    );

    const SUTRequest = {
      id: "test-survey-id"
    };

    const SUTResponse = await SUT.findOne(SUTRequest);

    expect(SUTResponse).toBeNull();
  });

  it("should pass id to find one survey repository call", async () => {
    const { SUT, findOneSurveyRepository } = getSUTEnvironment();

    const findOneSpy = jest.spyOn(findOneSurveyRepository, "findOne");

    const SUTRequest = {
      id: "test-survey-id"
    };

    await SUT.findOne(SUTRequest);

    const expectedCall = {
      id: "test-survey-id"
    };

    expect(findOneSpy).toHaveBeenCalledWith(expectedCall);
  });

  it("should repass find one survey repository errors to upper level", async () => {
    const { SUT, findOneSurveyRepository } = getSUTEnvironment();

    jest.spyOn(findOneSurveyRepository, "findOne").mockImplementationOnce(
      async () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = {
      id: "test-survey-id"
    };

    const SUTResponse = SUT.findOne(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });
});
