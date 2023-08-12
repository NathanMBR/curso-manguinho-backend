import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import { AddUserAnswerValidator } from "../../protocols";
import { AddUserAnswerValidatorAdapter } from "./AddUserAnswerValidatorAdapter";

interface GetSUTEnvironmentReturn {
  addUserAnswerValidator: AddUserAnswerValidator.Protocol;

  SUT: AddUserAnswerValidatorAdapter;
}

const getSUTEnvironment = (): GetSUTEnvironmentReturn => {
  class AddUserAnswerValidatorStub implements AddUserAnswerValidator.Protocol {
    validate(_data: AddUserAnswerValidator.Request): AddUserAnswerValidator.Response {
      return {
        isValid: true,
        errors: [],
        data: [
          {
            questionId: "test-question-id",
            answerId: "test-question-id"
          }
        ]
      };
    }
  }

  const addUserAnswerValidator = new AddUserAnswerValidatorStub();
  const addUserAnswerValidatorAdapter = new AddUserAnswerValidatorAdapter(
    addUserAnswerValidator
  );

  return {
    addUserAnswerValidator,

    SUT: addUserAnswerValidatorAdapter
  };
};

describe("AddUserAnswerValidator Adapter", () => {
  it("should successfully validate an add user answer payload", () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = "test";
    const SUTResponse = SUT.validate(SUTRequest);

    expect(SUTResponse.isValid).toBe(true);
  });

  it("should return error if add user answer validator call returns error", () => {
    const { SUT, addUserAnswerValidator } = getSUTEnvironment();

    jest.spyOn(addUserAnswerValidator, "validate").mockReturnValueOnce(
      {
        isValid: false,
        errors: [
          "Test error"
        ]
      }
    );

    const SUTRequest = "test";
    const SUTResponse = SUT.validate(SUTRequest);

    expect(SUTResponse.isValid).toBe(false);
    expect(SUTResponse).toHaveProperty("errorMessage", "Test error");
  });

  it("should pass data to add user answer validator call", () => {
    const { SUT, addUserAnswerValidator } = getSUTEnvironment();

    const validateSpy = jest.spyOn(addUserAnswerValidator, "validate");

    const SUTRequest = "test";
    SUT.validate(SUTRequest);

    expect(validateSpy).toHaveBeenCalledWith(SUTRequest);
  });

  it("should repass add user answer validator errors to upper level", () => {
    const { SUT, addUserAnswerValidator } = getSUTEnvironment();

    jest.spyOn(addUserAnswerValidator, "validate").mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = "test";
    const getSUTResponse = () => SUT.validate(SUTRequest);

    expect(getSUTResponse).toThrow();
  });
});
