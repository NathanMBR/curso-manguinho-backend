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

  it("should pass user answer data to add user answer repository call", async () => {
    const { SUT, addUserAnswerRepository } = getSUTEnvironment();

    const addSpy = jest.spyOn(addUserAnswerRepository, "add");

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

    const expectedCall = SUTRequest;

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
