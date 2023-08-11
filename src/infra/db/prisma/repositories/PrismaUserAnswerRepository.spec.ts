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

const createManyUserAnswersMock: any = async () => Promise.resolve(undefined);

jest.spyOn(prisma.userAnswer, "createMany").mockImplementation(createManyUserAnswersMock);

describe("Prisma AddUserAnswer Repository", () => {
  it("should successfully add an user answer", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      accountId: "test-account-id",
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

  it("should pass user answer data to prisma", async () => {
    const { SUT } = getSUTEnvironment();

    const createSpy = jest.spyOn(prisma.userAnswer, "createMany");

    const SUTRequest = {
      accountId: "test-account-id",
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

    expect(createSpy).toHaveBeenCalledWith(expectedCall);
  });

  it("should repass prisma errors to upper level", async () => {
    const { SUT } = getSUTEnvironment();

    jest.spyOn(prisma.userAnswer, "createMany").mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = {
      accountId: "test-account-id",
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
