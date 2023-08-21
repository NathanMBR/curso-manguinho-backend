import {
  describe,
  beforeEach,
  it,
  expect,
  jest
} from "@jest/globals";
import { PrismaClient } from "@prisma/client";

import { PrismaUserAnswerRepository } from "./PrismaUserAnswerRepository";

const prisma = new PrismaClient();

interface GetSUTEnvironmentResponse {
  SUT: PrismaUserAnswerRepository;
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  const userAnswerRepository = new PrismaUserAnswerRepository(
    prisma
  );

  return {
    SUT: userAnswerRepository
  };
};

const createUserAnsweredSurveyStub: any = async () => Promise.resolve(null);
const createManyUserAnswersStub: any = async () => Promise.resolve(null);

const createUserAnsweredSurveyMock = jest.fn(createUserAnsweredSurveyStub);
const createManyUserAnswersMock = jest.fn(createManyUserAnswersStub);

const mockTransaction = {
  userAnsweredSurvey: {
    create: createUserAnsweredSurveyMock
  },

  userAnswer: {
    createMany: createManyUserAnswersMock
  }
} as any;



describe("Prisma AddUserAnswer Repository", () => {
  beforeEach(() => {
    jest.spyOn(prisma, "$transaction").mockImplementationOnce(
      async callback => {
        await callback(mockTransaction);

        return;
      }
    );
  });

  it("should successfully add an user answer", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      accountId: "test-account-id",
      surveyId: "test-survey-id",
      userAnswers: [
        {
          questionId: "test-question-id",
          answerId: "test-answer-id"
        }
      ]
    };

    const SUTResponse = await SUT.add(SUTRequest);

    const expectedResponse = undefined;

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should pass account and survey ids to prisma create user answered survey call", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      accountId: "test-account-id",
      surveyId: "test-survey-id",
      userAnswers: [
        {
          questionId: "test-question-id",
          answerId: "test-answer-id"
        }
      ]
    };

    await SUT.add(SUTRequest);

    const expectedCall = {
      data: {
        accountId: SUTRequest.accountId,
        surveyId: SUTRequest.surveyId
      }
    };

    expect(createUserAnsweredSurveyMock).toHaveBeenCalledWith(expectedCall);
  });

  it("should pass user answer data to prisma create many user answers call", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      accountId: "test-account-id",
      surveyId: "test-survey-id",
      userAnswers: [
        {
          questionId: "test-question-id",
          answerId: "test-answer-id"
        }
      ]
    };

    await SUT.add(SUTRequest);

    const expectedCall = {
      data: SUTRequest.userAnswers.map(
        userAnswer => (
          {
            accountId: SUTRequest.accountId,
            ...userAnswer
          }
        )
      )
    };

    expect(createManyUserAnswersMock).toHaveBeenCalledWith(expectedCall);
  });

  it("should repass user answer create many errors to upper level", async () => {
    const { SUT } = getSUTEnvironment();

    createManyUserAnswersMock.mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = {
      accountId: "test-account-id",
      surveyId: "test-survey-id",
      userAnswers: [
        {
          questionId: "test-question-id",
          answerId: "test-answer-id"
        }
      ]
    };

    const SUTResponse = SUT.add(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });

  it("should repass prisma user answered survey create errors to upper level", async () => {
    const { SUT } = getSUTEnvironment();

    createUserAnsweredSurveyMock.mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = {
      accountId: "test-account-id",
      surveyId: "test-survey-id",
      userAnswers: [
        {
          questionId: "test-question-id",
          answerId: "test-answer-id"
        }
      ]
    };

    const SUTResponse = SUT.add(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });

  it("should repass prisma transaction errors to upper level", async () => {
    const { SUT } = getSUTEnvironment();

    const transactionSpy = jest.spyOn(prisma, "$transaction");

    transactionSpy.mockReset();

    transactionSpy.mockImplementationOnce(
      async () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = {
      accountId: "test-account-id",
      surveyId: "test-survey-id",
      userAnswers: [
        {
          questionId: "test-question-id",
          answerId: "test-answer-id"
        }
      ]
    };

    const SUTResponse = SUT.add(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });
});
