import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import { prisma } from "../prisma";
import { PrismaSurveyRepository } from "./PrismaSurveyRepository";

interface GetSUTEnvironmentResponse {
  SUT: PrismaSurveyRepository
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  const surveyRepository = new PrismaSurveyRepository();

  return {
    SUT: surveyRepository
  };
};

const globalDate = new Date();

const getStubQuestion: () => Promise<any> = async () => Promise.resolve(
  {
    id: "test-question-id",
    title: "Test Question Title",
    description: "test question description",
    type: "SINGLE",
    answers: [
      {
        id: "test-answer-id",
        body: "test answer body"
      }
    ]
  }
);

const getStubSurvey: () => Promise<any> = async () => {
  const question = await getStubQuestion();

  return Promise.resolve(
    {
      id: "test-survey-id",
      title: "Test Survey Title",
      description: "test survey description",
      questions: [
        question
      ],
      expiresAt: globalDate
    }
  );
};

const createQuestionMock = jest.fn(getStubQuestion);
const createSurveyMock = jest.fn(getStubSurvey);
const findUniqueSurveyMock = jest.fn(getStubSurvey);

const mockTransaction = {
  question: {
    create: createQuestionMock
  },

  survey: {
    create: createSurveyMock,
    findUnique: findUniqueSurveyMock
  }
} as any;

// Mocking Prisma Transactions
jest.spyOn(prisma, "$transaction").mockImplementation(
  async callback => {
    await callback(mockTransaction);

    const stubSurvey = await getStubSurvey();

    return stubSurvey;
  }
);

describe("Prisma AddSurvey Repository", () => {
  it("should successfully add a survey", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      title: "Test Survey Title",
      description: "test survey description",
      expiresAt: globalDate,
      questions: [
        {
          title: "Test Question Title",
          description: "test question description",
          type: "SINGLE" as const,
          answers: [
            {
              body: "test answer body"
            }
          ]
        }
      ]
    };

    const expectedResponse = {
      id: "test-survey-id",
      title: "Test Survey Title",
      description: "test survey description",
      expiresAt: globalDate,
      questions: [
        {
          id: "test-question-id",
          title: "Test Question Title",
          description: "test question description",
          type: "SINGLE",
          answers: [
            {
              id: "test-answer-id",
              body: "test answer body"
            }
          ]
        }
      ],
    };

    const SUTResponse = await SUT.add(SUTRequest);

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should pass survey data to prisma survey create call", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      title: "Test Survey Title",
      description: "test survey description",
      expiresAt: globalDate,
      questions: [
        {
          title: "Test Question Title",
          description: "test question description",
          type: "SINGLE" as const,
          answers: [
            {
              body: "test answer body"
            }
          ]
        }
      ]
    };

    await SUT.add(SUTRequest);

    const expectedCall = {
      data: {
        title: "Test Survey Title",
        description: "test survey description",
        expiresAt: globalDate
      },

      select: {
        id: true
      }
    };

    expect(createSurveyMock).toHaveBeenCalledWith(expectedCall);
  });

  it("should pass question data to prisma question create call", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequestAnswer = {
      body: "test answer body"
    };

    const SUTRequest = {
      title: "Test Survey Title",
      description: "test survey description",
      expiresAt: globalDate,
      questions: [
        {
          title: "Test Question Title",
          description: "test question description",
          type: "SINGLE" as const,
          answers: [
            SUTRequestAnswer
          ]
        }
      ]
    };

    await SUT.add(SUTRequest);

    const expectedCall = {
      data: {
        title: "Test Question Title",
        description: "test question description",
        type: "SINGLE" as const,

        survey: {
          connect: {
            id: "test-survey-id"
          }
        },

        answers: {
          createMany: {
            data: [
              SUTRequestAnswer
            ]
          }
        }
      },

      select: {
        id: true
      }
    };

    expect(createQuestionMock).toHaveBeenCalledWith(expectedCall);
  });

  it("should pass survey id to prisma survey find unique call", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      title: "Test Survey Title",
      description: "test survey description",
      expiresAt: globalDate,
      questions: [
        {
          title: "Test Question Title",
          description: "test question description",
          type: "SINGLE" as const,
          answers: [
            {
              body: "test answer body"
            }
          ]
        }
      ]
    };

    await SUT.add(SUTRequest);

    const expectedCall = {
      where: {
        id: "test-survey-id"
      },

      include: {
        questions: {
          include: {
            answers: true
          }
        }
      }
    };

    expect(findUniqueSurveyMock).toHaveBeenCalledWith(expectedCall);
  });

  it("should repass prisma errors to upper level", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      title: "Test Survey Title",
      description: "test survey description",
      expiresAt: globalDate,
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

    jest.spyOn(prisma, "$transaction").mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTResponse = SUT.add(SUTRequest);
    await expect(SUTResponse).rejects.toThrow();
  });
});