import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";
import { ZodError } from "zod";

import { emailSchema } from "./schemas";
import { ZodEmailValidatorAdapter } from "./ZodEmailValidatorAdapter";

interface GetSUTEnvironmentResponse {
  SUT: ZodEmailValidatorAdapter
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  const emailValidatorAdapter = new ZodEmailValidatorAdapter();

  return {
    SUT: emailValidatorAdapter
  };
}

describe("ZodEmailValidator Adapter", () => {
  it("should return true when zod validator returns true", () => {
    const { SUT } = getSUTEnvironment();

    jest.spyOn(emailSchema, "safeParse").mockReturnValueOnce(
      {
        success: true,
        data: "invalid-email"
      }
    );

    /*
      The adapter test shouldn't care about the internal package logic. Because of the mock, this will return true even with an invalid email format
    */
    expect(SUT.isValid("invalid-email")).toBe(true);
  });

  it("should return false when zod validator returns false", () => {
    const { SUT } = getSUTEnvironment();

    jest.spyOn(emailSchema, "safeParse").mockReturnValueOnce(
      {
        success: false,
        error: new ZodError([])
      }
    );

    /*
      The adapter test shouldn't care about the internal package logic. Because of the mock, this will return false even with an valid email format
    */
    expect(SUT.isValid("valid@email.com")).toBe(false);
  });

  it("should pass email to zod validator", () => {
    const { SUT } = getSUTEnvironment();
    const safeParseSpy = jest.spyOn(emailSchema, "safeParse");

    const email = "test@email.com";
    SUT.isValid(email);

    expect(safeParseSpy).toHaveBeenCalledWith(email);
  });
});