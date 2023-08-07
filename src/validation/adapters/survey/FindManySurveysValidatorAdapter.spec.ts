import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import { FindManySurveysValidator } from "../../protocols";
import { FindManySurveysValidatorAdapter } from "./FindManySurveysValidatorAdapter";

interface GetSUTEnvironmentReturn {
  findManySurveysValidator: FindManySurveysValidator.Protocol;

  SUT: FindManySurveysValidatorAdapter;
}

const getSUTEnvironment = (): GetSUTEnvironmentReturn => {
  class FindManySurveysValidatorStub implements FindManySurveysValidator.Protocol {
    validate(_data: FindManySurveysValidator.Request): FindManySurveysValidator.Response {
      return {
        isValid: true,
        errors: [],
        data: {
          page: 1,
          quantity: 50
        }
      }
    }
  }

  const findManySurveysValidator = new FindManySurveysValidatorStub();
  const findManySurveysValidatorAdapter = new FindManySurveysValidatorAdapter(
    findManySurveysValidator
  );

  return {
    findManySurveysValidator,

    SUT: findManySurveysValidatorAdapter
  };
};

describe("FindManySurveysValidator Adapter", () => {
  it("should successfully validate a find many surveys payload", () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = "test";
    const SUTResponse = SUT.validate(SUTRequest);

    expect(SUTResponse.isValid).toBe(true);
  });

  it("should return default response if validation fails", () => {
    const { SUT, findManySurveysValidator } = getSUTEnvironment();

    jest.spyOn(findManySurveysValidator, "validate").mockReturnValueOnce(
      {
        isValid: false,
        errors: [
          "Test error"
        ]
      }
    );

    const SUTRequest = "test";
    const SUTResponse = SUT.validate(SUTRequest);

    const expectedResponse = {
      isValid: true,
      data: {
        page: 1,
        quantity: 50
      }
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should pass data to find many surveys validator call", () => {
    const { SUT, findManySurveysValidator } = getSUTEnvironment();

    const validateSpy = jest.spyOn(findManySurveysValidator, "validate");

    const SUTRequest = "test";

    SUT.validate(SUTRequest);

    const expectedCall = "test";

    expect(validateSpy).toHaveBeenCalledWith(expectedCall);
  });

  it("should repass find many surveys validator errors to upper level", () => {
    const { SUT, findManySurveysValidator } = getSUTEnvironment();

    jest.spyOn(findManySurveysValidator, "validate").mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = "test";
    const getSUTResponse = () => SUT.validate(SUTRequest);

    expect(getSUTResponse).toThrow();
  });
});