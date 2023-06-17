import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import {
  MissingParamError,
  InvalidParamError
} from "../errors";
import { EmailValidator } from "../protocols";

import { SignUpController } from "./SignUpController";

interface GetSUTEnvironmentReturn {
  emailValidator: EmailValidator.Protocol;

  SUT: SignUpController;
}

const getSUTEnvironment = (): GetSUTEnvironmentReturn => {
  // "stub mock": a mock that returns a fixed/constant value
  class EmailValidatorStub implements EmailValidator.Protocol {
    isValid(email: string): boolean {
      return true;
    }
  }

  const emailValidator = new EmailValidatorStub();

  const signUpController = new SignUpController(emailValidator);
  return {
    emailValidator,
    SUT: signUpController
  };
};

describe("SignUp Controller", () => {
  it("should successfully handle request", () => {
    const { SUT } = getSUTEnvironment();
    const httpRequest = {
      body: {
        name: "Test Name",
        email: "test@email.com",
        password: "test1234"
      }
    };

    const httpResponse = SUT.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toBe("ok");
  });

  it("should return 400 if no name is provided", () => {
    const { SUT } = getSUTEnvironment();
    const httpRequest = {
      body: {
        // name: "Test Name",
        email: "test@email.com",
        password: "test1234"
      }
    };

    const httpResponse = SUT.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });

  it("should return 400 if no email is provided", () => {
    const { SUT } = getSUTEnvironment();
    const httpRequest = {
      body: {
        name: "Test Name",
        // email: "test@email.com",
        password: "test1234"
      }
    };

    const httpResponse = SUT.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  it("should return 400 if no password is provided", () => {
    const { SUT } = getSUTEnvironment();
    const httpRequest = {
      body: {
        name: "Test Name",
        email: "test@email.com",
        // password: "test1234"
      }
    };

    const httpResponse = SUT.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  it("should return 400 if email format is invalid", () => {
    const { SUT, emailValidator } = getSUTEnvironment();
    const httpRequest = {
      body: {
        name: "Test Name",
        email: "invalid-email",
        password: "test1234"
      }
    };

    // Injects a return value to a function
    jest.spyOn(emailValidator, "isValid").mockReturnValueOnce(false);

    const httpResponse = SUT.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });
});