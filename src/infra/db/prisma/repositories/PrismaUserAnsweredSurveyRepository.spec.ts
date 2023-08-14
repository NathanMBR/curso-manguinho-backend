import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import { prisma } from "../prisma";
import { PrismaUserAnsweredSurveyRepository } from "./PrismaUserAnsweredSurveyRepository";

interface GetSUTEnvironmentResponse {
  SUT: PrismaUserAnsweredSurveyRepository;
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  const userAnsweredSurveyRepository = new PrismaUserAnsweredSurveyRepository();

  return {
    SUT: userAnsweredSurveyRepository
  };
}

const findOneUserAnsweredSurveyMock: any = async () => Promise.resolve(
  {
    id: "test-user-answered-survey-id",
    accountId: "test-account-id",
    surveyId: "test-survey-id"
  }
);

jest.spyOn(prisma.userAnsweredSurvey, "findFirst").mockImplementation(findOneUserAnsweredSurveyMock);

describe("Prisma FindOneUserAnsweredSurvey Repository", () => {
  it("should successfully find one user answered survey", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      accountId: "test-account-id",
      surveyId: "test-survey-id"
    };

    const SUTResponse = await SUT.findOne(SUTRequest);

    const expectedResponse = {
      id: "test-user-answered-survey-id",
      accountId: "test-account-id",
      surveyId: "test-survey-id"
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should pass find one user answered survey request data to prisma", async () => {
    const { SUT } = getSUTEnvironment();

    const findFirstSpy = jest.spyOn(prisma.userAnsweredSurvey, "findFirst");

    const SUTRequest = {
      accountId: "test-account-id",
      surveyId: "test-survey-id"
    };

    await SUT.findOne(SUTRequest);

    const expectedCall = {
      where: {
        accountId: SUTRequest.accountId,
        surveyId: SUTRequest.surveyId
      }
    };

    expect(findFirstSpy).toHaveBeenCalledWith(expectedCall);
  });

  it("should repass prisma errors to upper level", async () => {
    const { SUT } = getSUTEnvironment();

    jest.spyOn(prisma.userAnsweredSurvey, "findFirst").mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = {
      accountId: "test-account-id",
      surveyId: "test-survey-id"
    };

    const SUTResponse = SUT.findOne(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });
});
