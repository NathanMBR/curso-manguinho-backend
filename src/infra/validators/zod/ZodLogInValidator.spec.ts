import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";
import { ZodError } from "zod";

import { zodLogInSchema } from "./schemas";
import { ZodLogInValidator } from "./ZodLogInValidator";

interface GetSUTEnvironmentResponse {
  SUT: ZodLogInValidator;
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  const logInValidator = new ZodLogInValidator();

  return {
    SUT: logInValidator
  };
};

jest.spyOn(zodLogInSchema, "safeParse").mockReturnValue(
  {
    success: true,
    data: {
      email: "test@email.com",
      password: "test1234"
    }
  }
);

jest.spyOn(zodLogInSchema, "parse").mockReturnValue(
  {
    email: "test@email.com",
    password: "test1234"
  }
);

describe("Zod LogIn Validator", () => {
  it("should successfully validate log in payload", () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      email: "test@email.com",
      password: "test1234"
    };

    const SUTResponse = SUT.validate(SUTRequest);
    const expectedResponse = {
      isValid: true,
      errors: []
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return error response if zod validator returns error", () => {
    const { SUT } = getSUTEnvironment();

    jest.spyOn(zodLogInSchema, "safeParse").mockReturnValueOnce(
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
    const expectedResponse = {
      isValid: false,
      errors: [
        "Test error"
      ]
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should pass log in payload to zod validator", () => {
    const { SUT } = getSUTEnvironment();
    const safeParseSpy = jest.spyOn(zodLogInSchema, "safeParse");

    const SUTRequest = {
      email: "test@email.com",
      password: "test1234"
    };

    SUT.validate(SUTRequest);

    expect(safeParseSpy).toHaveBeenCalledWith(SUTRequest);
  });

  it("should not use error throwing zod method", () => {
    const { SUT } = getSUTEnvironment();

    const parseSpy = jest.spyOn(zodLogInSchema, "parse");

    const SUTRequest = {
      email: "test@email.com",
      password: "test1234"
    };

    SUT.validate(SUTRequest);

    expect(parseSpy).not.toHaveBeenCalled();
  });

  it("should repass zod errors to upper level", () => {
    const { SUT } = getSUTEnvironment();

    jest.spyOn(zodLogInSchema, "safeParse").mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = {
      name: "Test name",
      email: "test@email.com",
      password: "test1234"
    };

    const getSUTResponse = () => SUT.validate(SUTRequest);
    expect(getSUTResponse).toThrow();
  });
});