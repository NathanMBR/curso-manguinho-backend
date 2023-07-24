import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import { SignUpValidator } from "../../protocols";
import { SignUpValidatorAdapter } from "./SignUpValidatorAdapter";

interface GetSUTEnvironmentReturn {
  signUpValidator: SignUpValidator.Protocol;

  SUT: SignUpValidatorAdapter;
}

const getSUTEnvironment = (): GetSUTEnvironmentReturn => {
  class SignUpValidatorStub implements SignUpValidator.Protocol {
    validate(_data: SignUpValidator.Request): SignUpValidator.Response {
      return {
        isValid: true,
        errors: []
      };
    }
  }

  const signUpValidator = new SignUpValidatorStub();
  const signUpValidatorAdapter = new SignUpValidatorAdapter(
    signUpValidator
  );

  return {
    signUpValidator,
    SUT: signUpValidatorAdapter
  };
};

describe("SignUpValidator Adapter", () => {
  it("should successfully validate a sign up payload", () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = "test";
    const SUTResponse = SUT.validate(SUTRequest);

    expect(SUTResponse.isValid).toBe(true);
  });

  it("should pass data to sign up validator call", () => {
    const { SUT, signUpValidator } = getSUTEnvironment();

    const validateSpy = jest.spyOn(signUpValidator, "validate");

    const SUTRequest = "test";
    SUT.validate(SUTRequest);

    expect(validateSpy).toHaveBeenCalledWith(SUTRequest);
  });
});