import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import { FindOneUserAnsweredSurveyRepository } from "../../protocols";
import { DbFindOneUserAnsweredSurvey } from "./DbFindOneUserAnsweredSurvey";

interface GetSUTEnvironmentResponse {
  findOneUserAnsweredSurveyRepository: FindOneUserAnsweredSurveyRepository.Protocol;

  SUT: DbFindOneUserAnsweredSurvey;
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  class FindOneUserAnsweredSurveyRepositoryStub implements FindOneUserAnsweredSurveyRepository.Protocol {
    async findOne(_request: FindOneUserAnsweredSurveyRepository.Request): FindOneUserAnsweredSurveyRepository.Response {
      return {
        id: "test-user-answered-survey-id",
        accountId: "test-account-id",
        surveyId: "test-survey-id"
      };
    }
  }

  const findOneUserAnsweredSurveyRepository = new FindOneUserAnsweredSurveyRepositoryStub();

  const dbFindOneUserAnsweredSurvey = new DbFindOneUserAnsweredSurvey(
    findOneUserAnsweredSurveyRepository
  );

  return {
    findOneUserAnsweredSurveyRepository,

    SUT: dbFindOneUserAnsweredSurvey
  };
};

describe("DbFindOneUserAnsweredSurvey UseCase", () => {
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

  it("should return null if user answered survey is not found", async () => {
    const { SUT, findOneUserAnsweredSurveyRepository } = getSUTEnvironment();

    jest.spyOn(findOneUserAnsweredSurveyRepository, "findOne").mockReturnValueOnce(
      Promise.resolve(null)
    );

    const SUTRequest = {
      accountId: "test-account-id",
      surveyId: "test-survey-id"
    };

    const SUTResponse = await SUT.findOne(SUTRequest);

    expect(SUTResponse).toBeNull();
  });

  it("should pass account and survey ids to find one user answered survey repository call", async () => {
    const { SUT, findOneUserAnsweredSurveyRepository } = getSUTEnvironment();

    const findOneSpy = jest.spyOn(findOneUserAnsweredSurveyRepository, "findOne");

    const SUTRequest = {
      accountId: "test-account-id",
      surveyId: "test-survey-id"
    };

    await SUT.findOne(SUTRequest);

    const expectedCall = {
      accountId: "test-account-id",
      surveyId: "test-survey-id"
    };

    expect(findOneSpy).toHaveBeenCalledWith(expectedCall);
  });

  it("should repass find one user answered survey repository errors to upper level", async () => {
    const { SUT, findOneUserAnsweredSurveyRepository } = getSUTEnvironment();

    jest.spyOn(findOneUserAnsweredSurveyRepository, "findOne").mockImplementationOnce(
      async () => {
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
