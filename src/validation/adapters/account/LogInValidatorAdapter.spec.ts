import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import { LogInValidator } from "../../protocols";
import { LogInValidatorAdapter } from "./LogInValidatorAdapter";

interface GetSUTEnvironmentReturn {
  logInValidator: LogInValidator.Protocol;

  SUT: LogInValidatorAdapter;
}

const getSUTEnvironment = (): GetSUTEnvironmentReturn => {
  class LogInValidatorStub implements LogInValidator.Protocol {
    validate(_data: LogInValidator.Request): LogInValidator.Response {
      return {
        isValid: true,
        errors: []
      };
    }
  }

  const logInValidator = new LogInValidatorStub();
  const logInValidatorAdapter = new LogInValidatorAdapter(
    logInValidator
  );

  return {
    logInValidator,
    SUT: logInValidatorAdapter
  };
};

describe("LogInValidator Adapter", () => {
  it("should successfully validate a log in payload", () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = "test";
    const SUTResponse = SUT.validate(SUTRequest);

    expect(SUTResponse.isValid).toBe(true);
  });

  it("should pass data to log in validator call", () => {
    const { SUT, logInValidator } = getSUTEnvironment();

    const validateSpy = jest.spyOn(logInValidator, "validate");

    const SUTRequest = "test";
    SUT.validate(SUTRequest);

    expect(validateSpy).toHaveBeenCalledWith(SUTRequest);
  });

  it("should repass log in validator errors to upper level", () => {
    const { SUT, logInValidator } = getSUTEnvironment();

    jest.spyOn(logInValidator, "validate").mockImplementationOnce(
      () => {
        throw new Error();
      }
    );

    const SUTRequest = "test";
    const getSUTResponse = () => SUT.validate(SUTRequest);

    expect(getSUTResponse).toThrow();
  });
});