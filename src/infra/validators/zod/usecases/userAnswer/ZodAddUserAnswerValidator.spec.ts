import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";
import { ZodError } from "zod";

import { zodAddUserAnswerSchema } from "../../schemas";
import { ZodAddUserAnswerValidator } from "./ZodAddUserAnswerValidator";

interface GetSUTEnvironmentResponse {
  SUT: ZodAddUserAnswerValidator;
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  const addUserAnswerValidator = new ZodAddUserAnswerValidator();

  return {
    SUT: addUserAnswerValidator
  };
};

jest.spyOn(zodAddUserAnswerSchema, "safeParse").mockReturnValue(
  {
    success: true,
    data: [
      {
        answerId: "test-answer-id",
        questionId: "test-question-id"
      }
    ]
  }
);

describe("Zod AddUserAnswer Validator", () => {
  it("should successfully validate add user answer payload", () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = "test";
    const SUTResponse = SUT.validate(SUTRequest);

    const expectedResponse = {
      isValid: true,
      errors: [],
      data: [
        {
          answerId: "test-answer-id",
          questionId: "test-question-id"
        }
      ]
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return error response if zod validator returns error", () => {
    const { SUT } = getSUTEnvironment();

    jest.spyOn(zodAddUserAnswerSchema, "safeParse").mockReturnValueOnce(
      {
        success: false,
        error: new ZodError(
          [
            {
              code: "custom",
              path: ["test"],
              message: "Test error"
            }
          ]
        )
      }
    );

    const SUTRequest = "test";
    const SUTResponse = SUT.validate(SUTRequest);

    const expectedResponse = {
      isValid: false,
      errors: [
        "Test error"
      ]
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should pass add user answer payload to zod validator", () => {
    const { SUT } = getSUTEnvironment();

    const safeParseSpy = jest.spyOn(zodAddUserAnswerSchema, "safeParse");

    const SUTRequest = "test";
    SUT.validate(SUTRequest);

    expect(safeParseSpy).toHaveBeenCalledWith(SUTRequest);
  });

  it("should not use error throwing zod method", () => {
    const { SUT } = getSUTEnvironment();

    const parseSpy = jest.spyOn(zodAddUserAnswerSchema, "parse");

    const SUTRequest = "test";
    SUT.validate(SUTRequest);

    expect(parseSpy).not.toHaveBeenCalled();
  });

  it("should repass zod errors to upper level", () => {
    const { SUT } = getSUTEnvironment();

    jest.spyOn(zodAddUserAnswerSchema, "safeParse").mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = "test";
    const getSUTResponse = () => SUT.validate(SUTRequest);

    expect(getSUTResponse).toThrow();
  });
});
