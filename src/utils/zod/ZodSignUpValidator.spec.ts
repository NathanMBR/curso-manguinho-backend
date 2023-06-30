import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";
import {
  ZodError,
  ZodIssue
} from "zod";

import { zodSignUpSchema } from "./schemas";
import { ZodSignUpValidator } from "./ZodSignUpValidator";

interface GetSUTEnvironmentResponse {
  SUT: ZodSignUpValidator
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  const signUpValidator = new ZodSignUpValidator();

  return {
    SUT: signUpValidator
  };
};

jest.spyOn(zodSignUpSchema, "safeParse").mockReturnValue(
  {
    success: true,
    data: {
      name: "Test Name",
      email: "test@email.com",
      password: "test1234"
    }
  }
);

describe("Zod SignUp Validator", () => {
  it("should successfully validate sign up payload", () => {
    const { SUT } = getSUTEnvironment();

    const SUTResponse = SUT.validate("test");
    const expectedSUTResponse = {
      isValid: true,
      errors: []
    };

    expect(SUTResponse).toEqual(expectedSUTResponse);
  });

  it("should return error response if zod validator returns error", () => {
    const { SUT } = getSUTEnvironment();

    jest.spyOn(zodSignUpSchema, "safeParse").mockReturnValueOnce(
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

    const SUTResponse = SUT.validate("test");
    const expectedSUTResponse = {
      isValid: false,
      errors: [
        "Test error"
      ]
    };

    expect(SUTResponse).toEqual(expectedSUTResponse);
  });

  it("should pass sign up payload to zod validator", () => {
    const { SUT } = getSUTEnvironment();
    const safeParseSpy = jest.spyOn(zodSignUpSchema, "safeParse");

    const SUTRequest = {
      name: "Test name",
      email: "test@email.com",
      password: "test1234"
    };

    SUT.validate(SUTRequest);

    expect(safeParseSpy).toHaveBeenCalledWith(SUTRequest);
  });

  it("should not use error throwing zod method", () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      name: "Test name",
      email: "test@email.com",
      password: "test1234"
    };

    const getSUTResponse = () => SUT.validate(SUTRequest);
    expect(getSUTResponse).not.toThrow();
  });
});