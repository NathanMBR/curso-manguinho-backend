import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import {
  MissingParamError,
  InvalidParamError,
  InternalServerError
} from "../errors";
import { EmailValidator } from "../protocols";
import { AddAccount } from "../../domain/usecases";

import { SignUpController } from "./SignUpController";

interface GetSUTEnvironmentReturn {
  emailValidator: EmailValidator.Protocol;

  addAccount: AddAccount.Protocol;

  SUT: SignUpController;
}

const getSUTEnvironment = (): GetSUTEnvironmentReturn => {
  // "stub mock": a mock that returns a fixed/constant value
  class EmailValidatorStub implements EmailValidator.Protocol {
    isValid(_email: string): boolean {
      return true;
    }
  }

  class AddAccountSub implements AddAccount.Protocol {
    add(_account: AddAccount.Request): AddAccount.Response {
      const fakeAccount = {
        id: "test_id",
        name: "Test Name",
        email: "test@email.com",
        password: "test1234"
      };

      return fakeAccount;
    }
  }

  const emailValidator = new EmailValidatorStub();
  const addAccount = new AddAccountSub();

  const signUpController = new SignUpController(
    emailValidator,
    addAccount
  );

  return {
    emailValidator,
    addAccount,
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
    expect(httpResponse.body).toEqual(
      {
        id: "test_id",
        name: httpRequest.body.name,
        email: httpRequest.body.email
      }
    );
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

  it("should return 500 if email validator throws an unexpected error ", () => {
    const { SUT, emailValidator } = getSUTEnvironment();
    const httpRequest = {
      body: {
        name: "Test Name",
        email: "test@email.com",
        password: "test1234"
      }
    };

    jest.spyOn(emailValidator, "isValid").mockImplementationOnce(
      () => {
        throw new Error("Test Error");
      }
    );

    const httpResponse = SUT.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new InternalServerError());
  });

  it("should return 500 if add account throws an unexpected error", () => {
    const { SUT, addAccount } = getSUTEnvironment();
    const httpRequest = {
      body: {
        name: "Test Name",
        email: "test@email.com",
        password: "test1234"
      }
    };

    jest.spyOn(addAccount, "add").mockImplementationOnce(
      () => {
        throw new Error("Test Error")
      }
    );

    const httpResponse = SUT.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new InternalServerError());
  });

  it("should correctly call the email validator", () => {
    const { SUT, emailValidator } = getSUTEnvironment();
    const httpRequest = {
      body: {
        name: "Test Name",
        email: "test@email.com",
        password: "test1234"
      }
    };
    const isValidSpy = jest.spyOn(emailValidator, "isValid");

    SUT.handle(httpRequest);

    // ensure validator receives the correct parameters
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });

  it("should correctly call the add account use case", () => {
    const { SUT, addAccount } = getSUTEnvironment();
    const httpRequest = {
      body: {
        name: "Test",
        email: "test@email.com",
        password: "test"
      }
    };

    const addAccountSpy = jest.spyOn(addAccount, "add");

    SUT.handle(httpRequest);

    expect(addAccountSpy).toHaveBeenCalledWith(httpRequest.body)
  });
});