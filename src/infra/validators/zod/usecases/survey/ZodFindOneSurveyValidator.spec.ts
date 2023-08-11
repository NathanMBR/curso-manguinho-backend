import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";
import { ZodError } from "zod";

import { zodFindOneSurveySchema } from "../../schemas";
import { ZodFindOneSurveyValidator } from "./ZodFindOneSurveyValidator";

interface GetSUTEnvironmentResponse {
  SUT: ZodFindOneSurveyValidator;
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  const findOneSurveyValidator = new ZodFindOneSurveyValidator();

  return {
    SUT: findOneSurveyValidator
  };
}

jest.spyOn(zodFindOneSurveySchema, "safeParse").mockReturnValue(
  {
    success: true,
    data: {
      id: "test-uuid"
    }
  }
);

describe("Zod FindOneSurvey Validator", () => {
  it("should successfully validate find one survey payload", () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = "test";
    const SUTResponse = SUT.validate(SUTRequest);

    const expectedResponse = {
      isValid: true,
      errors: [],
      data: {
        id: "test-uuid"
      }
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return an error if zod validator returns error", () => {
    const { SUT } = getSUTEnvironment();

    jest.spyOn(zodFindOneSurveySchema, "safeParse").mockReturnValueOnce(
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

  it("should pass find one survey payload to zod validator", () => {
    const { SUT } = getSUTEnvironment();
    const safeParseSpy = jest.spyOn(zodFindOneSurveySchema, "safeParse");

    const SUTRequest = "test";

    SUT.validate(SUTRequest);

    expect(safeParseSpy).toHaveBeenCalledWith(SUTRequest);
  });

  it("should not use error throwing zod method", () => {
    const { SUT } = getSUTEnvironment();
    const parseSpy = jest.spyOn(zodFindOneSurveySchema, "parse");

    const SUTRequest = "test";
    SUT.validate(SUTRequest);

    expect(parseSpy).not.toHaveBeenCalled();
  });

  it("should repass zod errors to upper level", () => {
    const { SUT } = getSUTEnvironment();

    jest.spyOn(zodFindOneSurveySchema, "safeParse").mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = "test";

    const getSUTResponse = () => SUT.validate(SUTRequest);

    expect(getSUTResponse).toThrow();
  });
});
