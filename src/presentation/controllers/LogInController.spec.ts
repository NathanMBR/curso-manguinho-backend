import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import {
  ValidationError,
  NotFoundError,
  InvalidPasswordError
} from "../errors";
import { Validator } from "../protocols";
import {
  FindOneAccountByEmail,
  CompareAccountPassword,
  AuthenticateAccount
} from "../../domain/usecases";

import { LogInController } from "./LogInController";

interface GetSUTEnvironmentReturn {
  validator: Validator.Protocol;

  findOneAccountByEmail: FindOneAccountByEmail.Protocol;
  compareAccountPassword: CompareAccountPassword.Protocol;
  authenticateAccount: AuthenticateAccount.Protocol;

  SUT: LogInController;
}

const getSUTEnvironment = (): GetSUTEnvironmentReturn => {
  class ValidatorStub implements Validator.Protocol {
    validate(_data: Validator.Request): Validator.Response {
      return {
        isValid: true
      };
    }
  }

  class FindOneAccountByEmailStub implements FindOneAccountByEmail.Protocol {
    async findOneByEmail(_account: FindOneAccountByEmail.Request): FindOneAccountByEmail.Response {
      return Promise.resolve(
        {
          id: "test-id",
          name: "Test Name",
          email: "test@email.com",
          password: "test-password-hash"
        }
      );
    }
  }

  class CompareAccountPasswordStub implements CompareAccountPassword.Protocol {
    async comparePassword(_request: CompareAccountPassword.Request): CompareAccountPassword.Response {
      return Promise.resolve(true);
    }
  }

  class AuthenticateAccountStub implements AuthenticateAccount.Protocol {
    authenticate(_request: AuthenticateAccount.Request): AuthenticateAccount.Response {
      return "test-token";
    }
  }

  const validator = new ValidatorStub();
  const findOneAccountByEmail = new FindOneAccountByEmailStub();
  const compareAccountPassword = new CompareAccountPasswordStub();
  const authenticateAccount = new AuthenticateAccountStub();

  const logInController = new LogInController(
    validator,
    findOneAccountByEmail,
    compareAccountPassword,
    authenticateAccount
  );

  return {
    validator,

    findOneAccountByEmail,
    compareAccountPassword,
    authenticateAccount,
    
    SUT: logInController
  };
};

describe("LogIn Controller", () => {
  it("should successfully handle request", async () => {
    const { SUT } = getSUTEnvironment();
    const SUTRequest = {
      body: {
        email: "test@email.com",
        password: "test1234" 
      }
    };

    const SUTResponse = await SUT.handle(SUTRequest);

    const expectedResponse = {
      token: "test-token",
      account: {
        id: "test-id",
        name: "Test Name",
        email: "test@email.com"
      }
    };

    expect(SUTResponse.statusCode).toBe(200);
    expect(SUTResponse.body).toEqual(expectedResponse);
  });

  it("should not return password in the response body", async () => {
    const { SUT } = getSUTEnvironment();
    const SUTRequest = {
      body: {
        email: "test@email.com",
        password: "test1234" 
      }
    };

    const SUTResponse = await SUT.handle(SUTRequest);

    expect(SUTResponse.body).not.toHaveProperty("password");
  });

  it("should return 400 if body is invalid", async () => {
    const { SUT, validator } = getSUTEnvironment();
    const SUTRequest = {
      body: {
        email: "test@email.com",
        password: "test1234" 
      }
    };

    jest.spyOn(validator, "validate").mockReturnValueOnce(
      {
        isValid: false,
        errorMessage: "Test error"
      }
    );

    const SUTResponse = await SUT.handle(SUTRequest);

    expect(SUTResponse.statusCode).toBe(400);
    expect(SUTResponse.body).toEqual(new ValidationError("Test error"));
  });

  it("should return 404 if account isn't found", async () => {
    const { SUT, findOneAccountByEmail } = getSUTEnvironment();
    const SUTRequest = {
      body: {
        email: "test@email.com",
        password: "test1234" 
      }
    };

    jest.spyOn(findOneAccountByEmail, "findOneByEmail").mockReturnValueOnce(
      Promise.resolve(null)
    );

    const SUTResponse = await SUT.handle(SUTRequest);

    expect(SUTResponse.statusCode).toBe(404);
    expect(SUTResponse.body).toEqual(new NotFoundError("Account e-mail not found"));
  });

  it("should return 401 if password doesn't match", async () => {
    const { SUT, compareAccountPassword } = getSUTEnvironment();
    const SUTRequest = {
      body: {
        email: "test@email.com",
        password: "test1234" 
      }
    };

    jest.spyOn(compareAccountPassword, "comparePassword").mockReturnValueOnce(
      Promise.resolve(false)
    );

    const SUTResponse = await SUT.handle(SUTRequest);

    expect(SUTResponse.statusCode).toBe(401);
    expect(SUTResponse.body).toEqual(new InvalidPasswordError());
  });

  it("should pass body to log in validator call", async () => {
    const { SUT, validator } = getSUTEnvironment();
    const SUTRequest = {
      body: {
        email: "test@email.com",
        password: "test1234" 
      }
    };

    const validateSpy = jest.spyOn(validator, "validate");

    await SUT.handle(SUTRequest);

    expect(validateSpy).toHaveBeenCalledWith(SUTRequest.body);
  });

  it("should pass email to find one account by email call", async () => {
    const { SUT, findOneAccountByEmail } = getSUTEnvironment();
    const SUTRequest = {
      body: {
        email: "test@email.com",
        password: "test1234" 
      }
    };

    const findOneByEmailSpy = jest.spyOn(findOneAccountByEmail, "findOneByEmail");

    await SUT.handle(SUTRequest);

    expect(findOneByEmailSpy).toHaveBeenCalledWith(
      {
        email: SUTRequest.body.email
      }
    );
  });

  it("should pass hash and password to compare account password call", async () => {
    const { SUT, compareAccountPassword } = getSUTEnvironment();
    const SUTRequest = {
      body: {
        email: "test@email.com",
        password: "test1234" 
      }
    };

    const comparePasswordSpy = jest.spyOn(compareAccountPassword, "comparePassword");

    await SUT.handle(SUTRequest);

    expect(comparePasswordSpy).toHaveBeenCalledWith(
      {
        password: SUTRequest.body.password,
        hash: "test-password-hash"
      }
    );
  });

  it("should pass account to authenticate account call", async () => {
    const { SUT, authenticateAccount } = getSUTEnvironment();
    const SUTRequest = {
      body: {
        email: "test@email.com",
        password: "test1234" 
      }
    };

    const authenticateSpy = jest.spyOn(authenticateAccount, "authenticate");

    await SUT.handle(SUTRequest);

    const expectedCall = {
      id: "test-id",
      name: "Test Name",
      email: "test@email.com",
      password: "test-password-hash"
    };

    expect(authenticateSpy).toHaveBeenCalledWith(expectedCall);
  });

  it("should repass log in validator errors to upper level", async () => {
    const { SUT, validator } = getSUTEnvironment();
    const SUTRequest = {
      body: {
        email: "test@email.com",
        password: "test1234" 
      }
    };

    jest.spyOn(validator, "validate").mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTResponse = SUT.handle(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });

  it("should repass find one account by email errors to upper level", async () => {
    const { SUT, findOneAccountByEmail } = getSUTEnvironment();
    const SUTRequest = {
      body: {
        email: "test@email.com",
        password: "test1234" 
      }
    };

    jest.spyOn(findOneAccountByEmail, "findOneByEmail").mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTResponse = SUT.handle(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });

  it("should repass compare account password errors to upper level", async () => {
    const { SUT, compareAccountPassword } = getSUTEnvironment();
    const SUTRequest = {
      body: {
        email: "test@email.com",
        password: "test1234" 
      }
    };

    jest.spyOn(compareAccountPassword, "comparePassword").mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTResponse = SUT.handle(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });

  it("should repass authenticate account errors to upper level", async () => {
    const { SUT, authenticateAccount } = getSUTEnvironment();
    const SUTRequest = {
      body: {
        email: "test@email.com",
        password: "test1234" 
      }
    };

    jest.spyOn(authenticateAccount, "authenticate").mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTResponse = SUT.handle(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });
});