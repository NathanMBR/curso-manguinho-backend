import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import { SignUpValidator } from "../protocols";
import { SignUpValidatorAdapter } from "./SignUpValidatorAdapter";
import { ValidationError } from "../../presentation/errors";

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

type SUTSuccessfulResponse = {
  isValid: true;
};

type SUTFailureResponse = {
  isValid: false;
  errorMessage: string;
};

describe("SignUpValidator Adapter", () => {
  it("should successfully validate a sign up payload", () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = "test";
    const SUTResponse = SUT.validate(SUTRequest) as SUTSuccessfulResponse;

    expect(SUTResponse.isValid).toBe(true);
  });

  it("should return an error if validator returns an error", () => {
    const { SUT, signUpValidator } = getSUTEnvironment();

    jest.spyOn(signUpValidator, "validate").mockReturnValueOnce(
      {
        isValid: false,
        errors: ["Test error"]
      }
    );

    const SUTRequest = "test";
    const SUTResponse = SUT.validate(SUTRequest) as SUTFailureResponse;

    expect(SUTResponse.isValid).toBe(false);
    expect(SUTResponse.errorMessage).toEqual("Test error");
  });

  it("should pass data to sign up validator call", () => {
    const { SUT, signUpValidator } = getSUTEnvironment();

    const validateSpy = jest.spyOn(signUpValidator, "validate");

    const SUTRequest = "test";
    SUT.validate(SUTRequest);

    expect(validateSpy).toHaveBeenCalledWith(SUTRequest);
  });
});