import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import { prisma } from "../prisma";
import { PrismaUserAnswerRepository } from "./PrismaUserAnswerRepository";

interface GetSUTEnvironmentResponse {
  SUT: PrismaUserAnswerRepository;
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  const userAnswerRepository = new PrismaUserAnswerRepository();

  return {
    SUT: userAnswerRepository
  };
};

const returnUserAnswerFunction = (): any => Promise.resolve(
  {
    id: "test-user-answer-id",
    accountId: "test-account-id",
    questionId: "test-question-id",
    answerId: "test-answer-id"
  }
);

jest.spyOn(prisma.userAnswer, "create").mockImplementation(returnUserAnswerFunction);

describe("Prisma AddUserAnswer Repository", () => {
  it("should successfully add an user answer", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      accountId: "test-account-id",
      questionId: "test-question-id",
      answerId: "test-answer-id"
    };

    const SUTResponse = await SUT.add(SUTRequest);

    const expectedResponse = {
      id: "test-user-answer-id",
      accountId: "test-account-id",
      questionId: "test-question-id",
      answerId: "test-answer-id"
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should pass user answer data to prisma", async () => {
    const { SUT } = getSUTEnvironment();

    const createSpy = jest.spyOn(prisma.userAnswer, "create");

    const SUTRequest = {
      accountId: "test-account-id",
      questionId: "test-question-id",
      answerId: "test-answer-id"
    };

    await SUT.add(SUTRequest);

    const expectedCall = {
      data: {
        account: {
          connect: {
            id: SUTRequest.accountId
          }
        },

        question: {
          connect: {
            id: SUTRequest.questionId
          }
        },

        answer: {
          connect: {
            id: SUTRequest.answerId
          }
        }
      }
    };

    expect(createSpy).toHaveBeenCalledWith(expectedCall);
  });

  it("should repass prisma errors to upper level", async () => {
    const { SUT } = getSUTEnvironment();

    jest.spyOn(prisma.userAnswer, "create").mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = {
      accountId: "test-account-id",
      questionId: "test-question-id",
      answerId: "test-answer-id"
    };

    const SUTResponse = SUT.add(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });
});
