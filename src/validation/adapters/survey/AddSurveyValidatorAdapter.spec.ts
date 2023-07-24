import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import { AddSurveyValidator } from "../../protocols";
import { AddSurveyValidatorAdapter } from "./AddSurveyValidatorAdapter";

interface GetSUTEnvironmentReturn {
  addSurveyValidator: AddSurveyValidator.Protocol;

  SUT: AddSurveyValidatorAdapter;
}

const getSUTEnvironment = (): GetSUTEnvironmentReturn => {
  class AddSurveyValidatorStub implements AddSurveyValidator.Protocol {
    validate(_data: AddSurveyValidator.Request): AddSurveyValidator.Response {
      return {
        isValid: true,
        errors: []
      }
    }
  }

  const addSurveyValidator = new AddSurveyValidatorStub();
  const addSurveyValidatorAdapter = new AddSurveyValidatorAdapter(
    addSurveyValidator
  );

  return {
    addSurveyValidator,

    SUT: addSurveyValidatorAdapter
  };
};

describe("AddSurveyValidator Adapter", () => {
  it("should successfully validate an add survey payload", () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = "test";
    const SUTResponse = SUT.validate(SUTRequest);

    expect(SUTResponse.isValid).toBe(true);
  });

  it("should pass data to add survey validator call", () => {
    const { SUT, addSurveyValidator } = getSUTEnvironment();

    const validateSpy = jest.spyOn(addSurveyValidator, "validate");

    const SUTRequest = "test";
    SUT.validate(SUTRequest);

    expect(validateSpy).toHaveBeenCalledWith(SUTRequest);
  });

  it("should repass add survey validator errors to upper level", () => {
    const { SUT, addSurveyValidator } = getSUTEnvironment();

    jest.spyOn(addSurveyValidator, "validate").mockImplementationOnce(
      () => {
        throw new Error();
      }
    );

    const SUTRequest = "test";
    const getSUTResponse = () => SUT.validate(SUTRequest);

    expect(getSUTResponse).toThrow();
  });
});