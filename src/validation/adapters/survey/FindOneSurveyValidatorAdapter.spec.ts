import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import { FindOneSurveyValidator } from "../../protocols";
import { FindOneSurveyValidatorAdapter } from "./FindOneSurveyValidatorAdapter";

interface GetSUTEnvironmentReturn {
  findOneSurveyValidator: FindOneSurveyValidator.Protocol;

  SUT: FindOneSurveyValidatorAdapter;
}

const getSUTEnvironment = (): GetSUTEnvironmentReturn => {
  class FindOneSurveyValidatorStub implements FindOneSurveyValidator.Protocol {
    validate(_data: FindOneSurveyValidator.Request): FindOneSurveyValidator.Response {
      return {
        isValid: true,
        errors: [],
        data: {
          id: "test-id"
        }
      }
    }
  }

  const findOneSurveyValidator = new FindOneSurveyValidatorStub();

  const findOneSurveyValidatorAdapter = new FindOneSurveyValidatorAdapter(
    findOneSurveyValidator
  );

  return {
    findOneSurveyValidator,

    SUT: findOneSurveyValidatorAdapter
  };
};

describe("FindOneSurveyValidator Adapter", () => {
  it("should successfully validate a find one survey payload", () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = "test";
    const SUTResponse = SUT.validate(SUTRequest);

    expect(SUTResponse.isValid).toBe(true);
  });

  it("should pass data to find one survey validator call", () => {
    const { SUT, findOneSurveyValidator } = getSUTEnvironment();

    const validateSpy = jest.spyOn(findOneSurveyValidator, "validate");

    const SUTRequest = "test";

    SUT.validate(SUTRequest);

    expect(validateSpy).toHaveBeenCalledWith(SUTRequest);
  });

  it("should repass find one survey validator errors to upper level", () => {
    const { SUT, findOneSurveyValidator } = getSUTEnvironment();

    jest.spyOn(findOneSurveyValidator, "validate").mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = "test";
    const getSUTResponse = () => SUT.validate(SUTRequest);

    expect(getSUTResponse).toThrow();
  });
});
