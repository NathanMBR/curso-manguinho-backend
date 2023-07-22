import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import { DbAddSurvey } from "./DbAddSurvey";
import { AddSurveyRepository } from "../../protocols";

interface GetSUTEnvironmentResponse {
  addSurveyRepository: AddSurveyRepository.Protocol;

  SUT: DbAddSurvey;
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  class AddSurveyRepositoryStub implements AddSurveyRepository.Protocol {
    async add(_request: AddSurveyRepository.Request) {
      const survey: Awaited<AddSurveyRepository.Response> = {
        id: "test-survey-id",
        title: "Test Survey Title",
        description: "test survey description",
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
                body: "test answer body",
                questionId: "test-question-id"
              }
            ]
          }
        ],
        expiresAt: new Date()
      };

      return Promise.resolve(survey);
    }
  }

  const addSurveyRepository = new AddSurveyRepositoryStub();
  const dbAddSurvey = new DbAddSurvey(
    addSurveyRepository
  );

  return {
    addSurveyRepository,

    SUT: dbAddSurvey
  };
};

describe("DbAddSurvey UseCase", () => {
  it("should successfully add a survey", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      title: "Test Survey Title",
      description: "test survey description",
      expiresAt: new Date(),
      questions: [
        {
          title: "Test Question Title",
          description: "test question description",
          type: "SINGLE" as const,
          surveyId: "test-survey-id",
          answers: [
            {
              body: "test answer body",
              questionId: "test-question-id"
            }
          ]
        }
      ]
    };

    const SUTResponse = await SUT.add(SUTRequest);

    const expectedResponse = {
      id: "test-survey-id",
      title: "Test Survey Title",
      description: "test survey description",
      expiresAt: new Date(),
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
              body: "test answer body",
              questionId: "test-question-id"
            }
          ]
        }
      ]
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should pass survey data to add survey repository call", async () => {
    const { SUT, addSurveyRepository } = getSUTEnvironment();

    const addSpy = jest.spyOn(addSurveyRepository, "add");

    const SUTRequest = {
      title: "Test Survey Title",
      description: "test survey description",
      expiresAt: new Date(),
      questions: [
        {
          title: "Test Question Title",
          description: "test question description",
          type: "SINGLE" as const,
          surveyId: "test-survey-id",
          answers: [
            {
              body: "test answer body",
              questionId: "test-question-id"
            }
          ]
        }
      ]
    };

    await SUT.add(SUTRequest);
    expect(addSpy).toHaveBeenCalledWith(SUTRequest);
  });

  it("should repass add survey repository errors to upper level", async () => {
    const { SUT, addSurveyRepository } = getSUTEnvironment();

    jest.spyOn(addSurveyRepository, "add").mockImplementationOnce(
      async () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = {
      title: "Test Survey Title",
      description: "test survey description",
      expiresAt: new Date(),
      questions: [
        {
          title: "Test Question Title",
          description: "test question description",
          type: "SINGLE" as const,
          surveyId: "test-survey-id",
          answers: [
            {
              body: "test answer body",
              questionId: "test-question-id"
            }
          ]
        }
      ]
    };

    const SUTResponse = SUT.add(SUTRequest);
    await expect(SUTResponse).rejects.toThrow();
  });
});