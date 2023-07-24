import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";
import { ZodError } from "zod";

import { zodSignUpSchema } from "../../schemas";
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

jest.spyOn(zodSignUpSchema, "parse").mockReturnValue(
  {
    name: "Test Name",
    email: "test@email.com",
    password: "test1234"
  }
);

describe("Zod SignUp Validator", () => {
  it("should successfully validate sign up payload", () => {
    const { SUT } = getSUTEnvironment();

    const SUTResponse = SUT.validate("test");
    const expectedSUTResponse = {
      isValid: true,
      errors: [],
      data: {
        name: "Test Name",
        email: "test@email.com",
        password: "test1234"
      }
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
      name: "Test Name",
      email: "test@email.com",
      password: "test1234"
    };

    SUT.validate(SUTRequest);

    expect(safeParseSpy).toHaveBeenCalledWith(SUTRequest);
  });

  it("should not use error throwing zod method", () => {
    const { SUT } = getSUTEnvironment();

    const parseSpy = jest.spyOn(zodSignUpSchema, "parse");

    const SUTRequest = {
      name: "Test Name",
      email: "test@email.com",
      password: "test1234"
    };

    SUT.validate(SUTRequest);

    expect(parseSpy).not.toHaveBeenCalled();
  });

  it("should repass zod errors to upper level", () => {
    const { SUT } = getSUTEnvironment();

    jest.spyOn(zodSignUpSchema, "safeParse").mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = {
      name: "Test Name",
      email: "test@email.com",
      password: "test1234"
    };

    const getSUTResponse = () => SUT.validate(SUTRequest);
    expect(getSUTResponse).toThrow();
  });
});