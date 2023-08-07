import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";
import { ZodError } from "zod";

import { zodFindManySurveysSchema } from "../../schemas";
import { ZodFindManySurveysValidator } from "./ZodFindManySurveysValidator";

interface GetSUTEnvironmentResponse {
  SUT: ZodFindManySurveysValidator;
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  const findManySurveysValidator = new ZodFindManySurveysValidator();

  return {
    SUT: findManySurveysValidator
  };
};

jest.spyOn(zodFindManySurveysSchema, "safeParse").mockReturnValue(
  {
    success: true,
    data: {
      page: 1,
      quantity: 10
    }
  }
);

describe("Zod FindManySurveys Validator", () => {
  it("should successfully validate find many surveys payload", () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = "test";

    const SUTResponse = SUT.validate(SUTRequest);

    const expectedResponse = {
      isValid: true,
      errors: [],
      data: {
        page: 1,
        quantity: 10
      }
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return an error if zod validator returns error", () => {
    const { SUT } = getSUTEnvironment();

    jest.spyOn(zodFindManySurveysSchema, "safeParse").mockReturnValueOnce(
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

  it("should pass find many surveys payload to zod validator", () => {
    const { SUT } = getSUTEnvironment();
    const safeParseSpy = jest.spyOn(zodFindManySurveysSchema, "safeParse");

    const SUTRequest = "test";

    SUT.validate(SUTRequest);

    expect(safeParseSpy).toHaveBeenCalledWith(SUTRequest);
  });

  it("should not use error throwing zod method", () => {
    const { SUT } = getSUTEnvironment();
    const parseSpy = jest.spyOn(zodFindManySurveysSchema, "parse");

    const SUTRequest = "test";

    SUT.validate(SUTRequest);

    expect(parseSpy).not.toHaveBeenCalled();
  });

  it("should repass zod errors to upper level", () => {
    const { SUT } = getSUTEnvironment();

    jest.spyOn(zodFindManySurveysSchema, "safeParse").mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = "test";

    const getSUTResponse = () => SUT.validate(SUTRequest);

    expect(getSUTResponse).toThrow();
  });
});